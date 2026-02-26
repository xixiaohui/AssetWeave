import type { MDXComponents } from 'mdx/types'
import Image, { ImageProps } from 'next/image'
import { Box, Typography, Link as MuiLink, Stack, Divider } from '@mui/material'

const components = {
  // ----------------- 标题 -----------------
  h1: ({ children }) => (
    <Box sx={{ mb: 3, textAlign: 'center' }}>
      <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        {children}
      </Typography>
      <Divider sx={{ mt: 1, borderColor: '#1976d2', width: '60%', mx: 'auto' }} />
    </Box>
  ),
  h2: ({ children }) => (
    <Typography variant="h3" component="h2" sx={{ color: '#1565c0', fontWeight: 'bold', mb: 2 }}>
      {children}
    </Typography>
  ),
  h3: ({ children }) => (
    <Typography variant="h4" component="h3" sx={{ color: '#0d47a1', fontWeight: 'medium', mb: 2 }}>
      {children}
    </Typography>
  ),
  h4: ({ children }) => (
    <Typography variant="h5" component="h4" sx={{ fontWeight: 'medium', mb: 1.5 }}>
      {children}
    </Typography>
  ),
  h5: ({ children }) => (
    <Typography variant="h6" component="h5" sx={{ fontWeight: 'medium', mb: 1 }}>
      {children}
    </Typography>
  ),
  h6: ({ children }) => (
    <Typography variant="subtitle1" component="h6" sx={{ fontWeight: 'medium', mb: 1 }}>
      {children}
    </Typography>
  ),

  // ----------------- 段落 -----------------
  p: ({ children }) => (
    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, fontSize: '1.1rem' }}>
      {children}
    </Typography>
  ),

  // ----------------- 列表 -----------------
  ul: ({ children }) => (
    <Stack component="ul" spacing={1} sx={{ pl: 4, mb: 2, listStyleType: 'disc' }}>
      {children}
    </Stack>
  ),
  ol: ({ children }) => (
    <Stack component="ol" spacing={1} sx={{ pl: 4, mb: 2, listStyleType: 'decimal' }}>
      {children}
    </Stack>
  ),
  li: ({ children }) => (
    <Typography component="li" sx={{ mb: 0.5, fontSize: '1rem' }}>
      {children}
    </Typography>
  ),

  // ----------------- 链接 -----------------
  a: ({ children, href }) => (
    <MuiLink
      href={href}
      target="_blank"
      rel="noopener"
      sx={{ color: '#1976d2', fontWeight: 500, '&:hover': { textDecoration: 'underline' } }}
    >
      {children}
    </MuiLink>
  ),

  // ----------------- 图片 -----------------
  img: (props) => (
    <Box sx={{ my: 3, textAlign: 'center' }}>
      <Image
        sizes="100vw"
        style={{ width: '100%', height: 'auto', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
        {...(props as ImageProps)}
      />
    </Box>
  ),

  // ----------------- 代码块 -----------------
  pre: ({ children }) => (
    <Box
      component="pre"
      sx={{
        bgcolor: '#f5f5f5',
        borderRadius: 2,
        px: 2,
        py: 1.5,
        my: 3,
        overflowX: 'auto',
        fontFamily: 'Source Code Pro, monospace',
        fontSize: '0.95rem',
      }}
    >
      {children}
    </Box>
  ),
  code: ({ children }) => (
    <Typography
      component="code"
      sx={{
        fontFamily: 'Source Code Pro, monospace',
        bgcolor: '#e0e0e0',
        px: 0.5,
        py: 0.2,
        borderRadius: 1,
        fontSize: '0.95rem',
      }}
    >
      {children}
    </Typography>
  ),

  // ----------------- 引用块 / 提示 -----------------
  blockquote: ({ children }) => (
    <Box sx={{ borderLeft: '4px solid #1976d2', pl: 2, my: 3, color: '#555', fontStyle: 'italic' }}>
      {children}
    </Box>
  ),
  
} satisfies MDXComponents

export function useMDXComponents(): MDXComponents {
  return components
}