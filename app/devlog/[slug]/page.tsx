import fs from 'fs'
import path from 'path'
import { Box, Typography } from '@mui/material'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { default: Post } = await import(`../../../content/devlog/${slug}.mdx`)
 
  return (
    <Box sx={{ p: 4, mt:7,maxWidth: '800px', mx: 'auto' }}>
      <Post />
    </Box>
  )
}
 
export async function generateStaticParams() {
  const devlogDir = path.join(process.cwd(), 'content/devlog')
  const files = await fs.promises.readdir(devlogDir)
  const slugs = files.filter(f => f.endsWith('.mdx')).map(f => f.replace(/\.mdx$/, ''))
  return slugs.map(slug => ({ slug }))
}
 
export const dynamicParams = false