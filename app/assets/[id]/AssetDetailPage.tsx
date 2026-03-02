/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Box,
  Typography,
  Stack,
  Divider,
  Button,
} from "@mui/material";

export default function AssetDetailPage({ asset }: any) {
  return (
    <Box sx={{ p: 4, mt: 6, maxWidth: 700, mx: "auto" }}>
      {/* 资产名称 */}
      <Typography variant="h4" fontWeight={700} mb={2}>
        {asset.name}
      </Typography>

      {/* 资产描述 */}
      {asset.description && (
        <Typography
          variant="body1"
          fontWeight={500}
          mb={3}
          sx={{ whiteSpace: "pre-line" }}
        >
          {asset.description}
        </Typography>
      )}

      <Stack spacing={1.5} alignItems="center">
        {/* 类别 */}
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
          <Typography color="text.secondary">类别</Typography>
          <Typography>{asset.category}</Typography>
        </Stack>

        {/* 封面 */}
        {asset.cover_url && (
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ width: "100%" }}
          >
            <Typography color="text.secondary">封面</Typography>
            <Button
              variant="outlined"
              size="small"
              component="a"
              href={asset.cover_url}
              target="_blank"
              rel="noreferrer"
            >
              查看
            </Button>
          </Stack>
        )}

        {/* 白皮书 */}
        {asset.whitepaper_url && (
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ width: "100%" }}
          >
            <Typography color="text.secondary">白皮书</Typography>
            <Button
              variant="outlined"
              size="small"
              component="a"
              href={asset.whitepaper_url}
              target="_blank"
              rel="noreferrer"
            >
              下载
            </Button>
          </Stack>
        )}

        <Divider sx={{ width: "100%", my: 1 }} />

        {/* 金额字段 */}
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
          <Typography color="text.secondary">单份价格</Typography>
          <Typography>¥{Number(asset.price).toLocaleString()}</Typography>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
          <Typography color="text.secondary">最小投资额</Typography>
          <Typography>¥{Number(asset.min_raise).toLocaleString()}</Typography>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
          <Typography color="text.secondary">募资目标</Typography>
          <Typography>¥{Number(asset.max_raise).toLocaleString()}</Typography>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
          <Typography color="text.secondary">已募集</Typography>
          <Typography>
            ¥{Number(asset.total_raised).toLocaleString()}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
          <Typography color="text.secondary">进度</Typography>
          <Typography>{asset.progress_percent.toFixed(2)}%</Typography>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
          <Typography color="text.secondary">年化收益 (APY)</Typography>
          <Typography>{asset.apy ?? "--"}%</Typography>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
          <Typography color="text.secondary">投资周期</Typography>
          <Typography>{asset.duration_days} 天</Typography>
        </Stack>

        {asset.token_symbol && (
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ width: "100%" }}
          >
            <Typography color="text.secondary">代币符号</Typography>
            <Typography>{asset.token_symbol}</Typography>
          </Stack>
        )}

        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ width: "100%" }}
          alignItems="center"
        >
          <Typography color="text.secondary">状态</Typography>

          <Button
            variant="outlined"
            size="small"
            color={
              asset.status === "draft"
                ? "warning"
                : asset.status === "approved"
                  ? "success"
                  : asset.status === "rejected"
                    ? "error"
                    : "primary"
            }
          >
            {asset.status === "draft"
              ? "待审核"
              : asset.status === "pending_review"
                ? "审核中"
                : asset.status === "approved"
                  ? "已通过"
                  : asset.status === "raising"
                    ? "募资中"
                    : asset.status === "sold_out"
                      ? "售罄"
                      : asset.status === "expired"
                        ? "已过期"
                        : asset.status === "repaying"
                          ? "回款中"
                          : asset.status === "finished"
                            ? "已完成"
                            : asset.status === "rejected"
                              ? "已拒绝"
                              : asset.status}
          </Button>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
          <Typography color="text.secondary">创建时间</Typography>
          <Typography>{new Date(asset.created_at).toLocaleString()}</Typography>
        </Stack>
      </Stack>
    </Box>
  );
}