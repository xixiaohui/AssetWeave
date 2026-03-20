import os
import requests
import base64
import logging
from PIL import Image, ImageOps
from io import BytesIO
from concurrent.futures import ThreadPoolExecutor, as_completed

# =============================
# 配置部分
# =============================
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

CONFIG = {
    "API_KEY": os.getenv("OPENROUTER_API_KEY"),
    "API_URL": "https://openrouter.ai/api/v1/chat/completions",
    "MODEL": "google/gemini-3.1-flash-image-preview",
    "OUTPUT_DIR": "./output",
    "GUTTER_SIZE": 20,  # 图片之间的白色间隙像素
    "BORDER_SIZE": 20,  # 外部边框像素
    "STYLE_PROMPT": "Uniform art style: Flat warm color cartoon, distinct outlines, Studio Ghibli inspired. " # 统一画风
}

if not CONFIG["API_KEY"]:
    raise ValueError("请先设置环境变量: export OPENROUTER_API_KEY=your_key")

os.makedirs(CONFIG["OUTPUT_DIR"], exist_ok=True)

# =============================
# 功能函数
# =============================

def generate_single_image(prompt, index, total_style=True):
    """
    生成单张图片的函数，用于并发调用
    """
    full_prompt = (CONFIG["STYLE_PROMPT"] + prompt) if total_style else prompt
    
    headers = {
        "Authorization": f"Bearer {CONFIG['API_KEY']}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": CONFIG["MODEL"],
        "messages": [{"role": "user", "content": full_prompt}],
        "modalities":["image","text"]
    }

    try:
        logging.info(f"[Panel {index+1}] 开始生成...")
        r = requests.post(CONFIG["API_URL"], headers=headers, json=payload, timeout=60)
        r.raise_for_status() # 检查 HTTP 错误

        result = r.json()
        
        # 针对 Gemini/OpenRouter 可能的多种返回结构做兼容
        if "error" in result:
            raise Exception(f"API Error: {result['error']}")

        choices = result.get("choices", [])
        if not choices:
            raise Exception("API 返回了空的选择列表")

        message = choices[0].get("message", {})
        
        # 处理图片数据（OpenRouter 标准格式）
        if "image_url" in message: 
             # 某些模型直接返回 image_url 结构
             data_url = message["image_url"]["url"]
        elif message.get("images"):
             # 此前代码使用的结构
             data_url = message["images"][0]["image_url"]["url"]
        else:
             # 有时候图片链接可能在 content 里以 markdown 形式存在，这里仅处理 base64 情况
             raise Exception(f"未在返回中找到图片数据: {message}")

        # 解析 Base64
        if "base64," in data_url:
            header, base64_data = data_url.split("base64,", 1)
        else:
            base64_data = data_url

        image_bytes = base64.b64decode(base64_data)
        img = Image.open(BytesIO(image_bytes)).convert("RGB") # 转换为 RGB 防止 RGBA 兼容性问题
        
        # 保存单张图用于调试
        save_path = os.path.join(CONFIG["OUTPUT_DIR"], f"panel_{index+1}.png")
        img.save(save_path)
        
        logging.info(f"[Panel {index+1}] 生成成功")
        return index, img

    except Exception as e:
        logging.error(f"[Panel {index+1}] 失败: {str(e)}")
        return index, None

def create_comic_grid(images_dict):
    """
    拼接图片，包含间距和边框
    """
    # 按索引排序，确保顺序正确 (0, 1, 2, 3)
    sorted_imgs = [images_dict[i] for i in sorted(images_dict.keys())]
    
    if any(img is None for img in sorted_imgs):
        raise Exception("由于部分图片生成失败，无法生成最终漫画。")

    count = len(sorted_imgs)
    if count != 4:
        raise Exception("当前仅支持拼接4张图片")

    # 1. 统一尺寸 (以第一张图为基准)
    base_w, base_h = sorted_imgs[0].size
    resized_imgs = []
    for img in sorted_imgs:
        if img.size != (base_w, base_h):
            resized_imgs.append(img.resize((base_w, base_h), Image.Resampling.LANCZOS))
        else:
            resized_imgs.append(img)
    
    gutter = CONFIG["GUTTER_SIZE"]
    border = CONFIG["BORDER_SIZE"]

    # 2. 计算画布总大小
    # 宽 = 左边框 + 图宽 + 中间间距 + 图宽 + 右边框
    # 高 = 上边框 + 图高 + 中间间距 + 图高 + 下边框
    
    # 公式：Canvas Width
    # $$ W_{canvas} = 2 \times W_{img} + Gutter + 2 \times Border $$
    total_width = (base_w * 2) + gutter + (border * 2)
    total_height = (base_h * 2) + gutter + (border * 2)

    canvas = Image.new("RGB", (total_width, total_height), "white")

    # 3. 粘贴坐标计算
    # Panel 1 (左上)
    canvas.paste(resized_imgs[0], (border, border))
    # Panel 2 (右上)
    canvas.paste(resized_imgs[1], (border + base_w + gutter, border))
    # Panel 3 (左下)
    canvas.paste(resized_imgs[2], (border, border + base_h + gutter))
    # Panel 4 (右下)
    canvas.paste(resized_imgs[3], (border + base_w + gutter, border + base_h + gutter))

    return canvas

def main(prompts):
    if len(prompts) != 4:
        logging.warning("警告：提示词数量不是4个，可能导致布局错误")

    images_dict = {}
    
    # 使用线程池并发生成
    logging.info("开始并发生成图片...")
    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = {executor.submit(generate_single_image, p, i): i for i, p in enumerate(prompts)}
        
        for future in as_completed(futures):
            index, img = future.result()
            images_dict[index] = img

    # 检查是否所有图片都成功
    if len(images_dict) == len(prompts) and all(images_dict.values()):
        logging.info("所有图片生成完毕，开始拼接...")
        comic_img = create_comic_grid(images_dict)
        
        output_path = os.path.join(CONFIG["OUTPUT_DIR"], "final_comic.png")
        comic_img.save(output_path)
        logging.info(f"漫画生成完成: {output_path}")
        
        # 尝试自动打开图片 (MacOS/Windows/Linux)
        try:
            if os.name == 'nt': os.startfile(output_path)
            elif os.name == 'posix': os.system(f"open '{output_path}'")
        except:
            pass
            
    else:
        logging.error("生成流程中有图片失败，终止拼接。")

# =============================
# 执行
# =============================
if __name__ == "__main__":
    prompts = [
        "Cute cartoon father sleeping in bed while daughter tries to wake him up, morning sunlight",
        "Little girl ringing alarm clock near sleepy father, funny expression",
        "Father suddenly wakes up shocked with eyes wide open",
        "Father and daughter laughing together at breakfast table with pancakes"
    ]

    main(prompts)