
import { Box } from '@mui/material'
import fs from "fs/promises";
import matter from 'gray-matter';
import path from "path";


export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[]}>
}) {
  const { slug } = await params

  if (!slug || slug.length === 0) {
    throw new Error("Slug not found"); // 或者使用 notFound();
  }

  const slugPath = slug.join("/");
  const { default: Post } = await import(`../../../content/devlog/${slugPath}.mdx`)
 
  return (
    <Box sx={{ p: 4, mt:7,maxWidth: '60vw', mx: 'auto' }}>
      <Post />
    </Box>
  )
}


// 递归读取所有 mdx 文件路径
async function getAllMDXFiles(dir: string, base = ""): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  let files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(base, entry.name);

    if (entry.isDirectory()) {
      const nestedFiles = await getAllMDXFiles(fullPath, relativePath);
      files = files.concat(nestedFiles);
    } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
      files.push(relativePath.replace(/\.mdx$/, "")); // 去掉扩展名
    }
  }

  return files;
}

// 支持多级目录的 generateStaticParams
export async function generateStaticParams() {
  const devlogDir = path.join(process.cwd(), "content/devlog");
  const allFiles = await getAllMDXFiles(devlogDir);

  return allFiles.map((slug) => ({
    slug: slug.split(path.sep), // 转换成数组，用于 [...slug] 动态路由
  }));
}



// metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  if (!slug || slug.length === 0) return { title: "Devlog" };

  const slugPath = slug.join("/");
  const filePath = path.join(process.cwd(), "content/devlog", slugPath + ".mdx");

  try {
    const fileContent = await fs.readFile(filePath, "utf8");
    const { data } = matter(fileContent);

    return {
      title: data.title || "Devlog Article",
      description: data.description || "",
    };
  } catch {
    return {
      title: "RWA Article",
      description: "",
    };
  }
}

export const dynamicParams = false

