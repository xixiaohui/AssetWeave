/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"; // 前端组件
import { useState } from "react";
import { Box, Grid, Card, CardContent, Typography, Pagination, Stack } from "@mui/material";
import Link from "next/link";
import { DevlogMeta } from "@/lib/devlog";

interface Props {
  posts: DevlogMeta[];
}

export default function DevlogList({ posts }: Props) {
  const POSTS_PER_PAGE = 10;
  const [page, setPage] = useState(1);

  const pageCount = Math.ceil(posts.length / POSTS_PER_PAGE);
  const displayedPosts = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box sx={{ p: 4, mt: 7 }}>
      <Typography variant="h2" sx={{ mb: 4 }}>
        开发记录
      </Typography>
      <Grid container spacing={3}>
        {displayedPosts.map((post) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.slug}>
            <Link
              href={`/devlog/${post.slug}`}
              style={{ textDecoration: "none" }}
            >
              <Card
                sx={{
                  height: "100%",
                  "&:hover": { boxShadow: 6, transform: "translateY(-6px)" },
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight={600}>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {post.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {post.date}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
      {pageCount > 1 && (
        <Stack spacing={2} alignItems="center" mt={4}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Stack>
      )}
    </Box>
  );
}