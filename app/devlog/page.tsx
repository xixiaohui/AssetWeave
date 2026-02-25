// app/devlog/page.tsx
import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { Box, Typography, Card, CardContent, Stack } from '@mui/material'

const devlogDir = path.join(process.cwd(), 'content/devlog')

export default function DevlogList() {
  const files = fs.readdirSync(devlogDir).filter(f => f.endsWith('.mdx'))
  const slugs = files.map(f => f.replace(/\.mdx$/, ''))

  return (
    <Box sx={{ p: 4 ,mt:7}}>
      <Typography variant="h2" sx={{ mb: 4, textAlign: 'left' }}>
        开发记录
      </Typography>
      <Stack spacing={2}>
        {slugs.map(slug => (
          <Link key={slug} href={`/devlog/${slug}`} style={{ textDecoration: 'none' }}>
            <Card variant="outlined" sx={{
              '&:hover': { boxShadow: 3 },
              cursor: 'pointer'
            }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {slug}
                </Typography>
              </CardContent>
            </Card>
          </Link>
        ))}
      </Stack>
    </Box>
  )
}