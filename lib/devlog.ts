import fs from "fs";
import path from "path";
import matter from "gray-matter";

const devlogDir = path.join(process.cwd(), "content/devlog");

export type DevlogMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags?: string[];
};

// 递归读取所有 mdx 文件
function getAllFiles(dir: string, base = ""): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.flatMap(entry => {
    const full = path.join(dir, entry.name);
    const relative = path.join(base, entry.name);

    if (entry.isDirectory()) {
      return getAllFiles(full, relative);
    }

    if (entry.name.endsWith(".mdx")) {
      return [relative.replace(/\.mdx$/, "")];
    }

    return [];
  });
}

// 读取所有文章 metadata
export function getAllDevlogs(): DevlogMeta[] {
  const slugs = getAllFiles(devlogDir);

  return slugs.map(slug => {
    const file = fs.readFileSync(path.join(devlogDir, slug + ".mdx"), "utf8");
    const { data } = matter(file);
   
    return {
      slug: slug.replace(/\\/g, "/"),
      title: data.title || slug,
      description: data.description || "",
      date: data.date || "1970-01-01",
      tags: data.tags || [],
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}