"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Grid,
  Divider,
  Button,
} from "@mui/material";

export interface Asset {
  id: string;
  name: string;
  description?: string;
  category: string;

  cover_url?: string;
  whitepaper_url?: string;

  price: number; // 单份价格
  min_raise: number;
  max_raise: number; // 募资目标
  total_raised: number; // 已募集金额
  progress_percent: number;

  apy?: number; // 年化收益
  duration_days: number; // 投资周期

  token_symbol?: string;

  status: string;
  created_at: string;
}

export function AssetsHeader() {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      mb={3}
    >
      <Typography variant="h2" fontWeight={600}>
        资产市场
      </Typography>

      <Button
        component={Link}
        href="/assets/create"
        variant="contained"
        color="primary"
      >
        创建资产
      </Button>
    </Stack>
  );
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    fetch("/api/assets")
      .then((res) => res.json())
      .then((data: Asset[]) => {
        // 计算进度百分比
        const assetsWithProgress = data.map((a) => ({
          ...a,
          progress_percent: a.max_raise
            ? (a.total_raised / a.max_raise) * 100
            : 0,
        }));
        setAssets(assetsWithProgress);
      });
  }, []);

  return (
    <Box sx={{ mt: 10 }}>
      <Button component={Link} href="/assets/review" variant="outlined">
        待审核资产
      </Button>
      <Grid container spacing={3} sx={{ mt: 10 }}>
        {assets.map((a) => (
          <Grid key={a.id} size={{ xs: 12, md: 6, lg: 4 }}>
            <Link href={`/assets/${a.id}`} style={{ textDecoration: "none" }}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  transition: "0.2s",
                  backgroundColor: "#def8b3",
                  "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
                }}
              >
                <CardContent>
                  <Stack spacing={1.5}>
                    {/* 资产名称 */}
                    <Typography variant="h6" fontWeight={600}>
                      {a.name}
                    </Typography>

                    <Divider />

                    {/* 类别 */}
                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">类别</Typography>
                      <Typography>{a.category}</Typography>
                    </Stack>

                    {/* 单份价格 */}
                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">单份价格</Typography>
                      <Typography>
                        ¥{Number(a.price).toLocaleString()}
                      </Typography>
                    </Stack>

                    {/* 募资目标 */}
                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">募资目标</Typography>
                      <Typography>
                        ¥{Number(a.max_raise).toLocaleString()}
                      </Typography>
                    </Stack>

                    {/* 已募集金额 */}
                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">已募集</Typography>
                      <Typography>
                        ¥{Number(a.total_raised).toLocaleString()}
                      </Typography>
                    </Stack>

                    {/* 进度百分比 */}
                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">进度</Typography>
                      <Typography>{a.progress_percent.toFixed(2)}%</Typography>
                    </Stack>

                    {/* 年化收益 */}
                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">
                        年化收益 (APY)
                      </Typography>
                      <Typography color="primary" fontWeight={600}>
                        {a.apy ?? "--"}%
                      </Typography>
                    </Stack>

                    {/* 投资周期 */}
                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">投资周期</Typography>
                      <Typography>{a.duration_days} 天</Typography>
                    </Stack>

                    {/* 代币符号 */}
                    {a.token_symbol && (
                      <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary">代币符号</Typography>
                        <Typography>{a.token_symbol}</Typography>
                      </Stack>
                    )}

                    {/* 状态 */}
                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">状态</Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        color={
                          a.status === "draft"
                            ? "warning"
                            : a.status === "approved"
                              ? "success"
                              : a.status === "rejected"
                                ? "error"
                                : "primary"
                        }
                      >
                        {a.status === "draft"
                          ? "待审核"
                          : a.status === "pending_review"
                            ? "审核中"
                            : a.status === "approved"
                              ? "已通过"
                              : a.status === "raising"
                                ? "募资中"
                                : a.status === "sold_out"
                                  ? "售罄"
                                  : a.status === "expired"
                                    ? "已过期"
                                    : a.status === "repaying"
                                      ? "回款中"
                                      : a.status === "finished"
                                        ? "已完成"
                                        : a.status === "rejected"
                                          ? "已拒绝"
                                          : a.status}
                      </Button>
                    </Stack>

                    {/* 创建时间 */}
                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">创建时间</Typography>
                      <Typography>
                        {new Date(a.created_at).toLocaleString()}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
