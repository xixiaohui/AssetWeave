/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";

import { FormControl, Select, MenuItem } from "@mui/material";

import { Asset } from "../page";

const STATUS_OPTIONS = [
  { value: "draft", label: "草稿" },
  { value: "pending_review", label: "待审核" },
  { value: "approved", label: "审核通过" },
  { value: "rejected", label: "审核不通过" },
  { value: "raising", label: "募集中" },
  { value: "sold_out", label: "已售罄" },
  { value: "expired", label: "已到期" },
  { value: "repaying", label: "回款中" },
  { value: "finished", label: "已完成" },
];

export default function AssetReviewPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedStatus, setSelectedStatus] = useState<Record<string, string>>(
    {},
  );

  // 获取待审核资产
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/assets/review/?status=draft"); // 获取 draft 状态资产
        if (!res.ok) throw new Error("获取资产列表失败");
        const data: Asset[] = await res.json();
        setAssets(data);
      } catch (err: any) {
        setError(err.message || "未知错误");
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  // 提交上链操作
  const handleSubmitOnChain = async (assetId: string) => {
    try {
      const res = await fetch(`/api/assets/${assetId}/register`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("提交上链失败");
      alert("资产已提交上链！");
      // 可刷新列表
      setAssets((prev) => prev.filter((a) => a.id !== assetId));
    } catch (err: any) {
      alert(err.message || "操作失败");
    }
  };

  //提交修改数据库状态
  const handleSubmitStatus = async (id: string) => {
    const newStatus = selectedStatus[id];
    if (!newStatus) return;

    await fetch(`/api/assets/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    // 更新数据库状态到 assets
    setAssets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)),
    );

    // 清除临时状态
    setSelectedStatus((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  if (loading)
    return (
      <Box sx={{ mt: 10, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ mt: 10, textAlign: "center", color: "red" }}>{error}</Box>
    );

  if (!assets.length)
    return <Box sx={{ mt: 10, textAlign: "center" }}>暂无待审核资产</Box>;

  return (
    <Box sx={{ p: 6, mt: 10, maxWidth: 700, mx: "auto" }}>
      <Typography variant="h4" fontWeight={700} mb={4} align="center">
        待审核资产
      </Typography>

      <Stack spacing={3}>
        {assets.map((asset) => (
          <Card key={asset.id} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="h6" fontWeight={600}>
                  {asset.name}
                </Typography>
                <Divider />
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">类别</Typography>
                  <Typography>{asset.category}</Typography>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ width: "100%" }}
                >
                  <Typography color="text.secondary">单份价格</Typography>
                  <Typography>
                    ¥{Number(asset.price).toLocaleString()}
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ width: "100%" }}
                >
                  <Typography color="text.secondary">最小投资额</Typography>
                  <Typography>
                    ¥{Number(asset.min_raise).toLocaleString()}
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ width: "100%" }}
                >
                  <Typography color="text.secondary">募资目标</Typography>
                  <Typography>
                    ¥{Number(asset.max_raise).toLocaleString()}
                  </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
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

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ width: "100%" }}
                >
                  <Typography color="text.secondary">募资截止时间</Typography>
                  <Typography>{new Date(asset.start_time!).toLocaleDateString()}</Typography>
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

                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <FormControl size="small" sx={{ minWidth: 160 }}>
                    <Select
                      value={selectedStatus[asset.id] ?? asset.status}
                      onChange={(e) =>
                        setSelectedStatus((prev) => ({
                          ...prev,
                          [asset.id]: e.target.value as string,
                        }))
                      }
                      renderValue={(selected) => {
                        const found = STATUS_OPTIONS.find(
                          (s) => s.value === selected,
                        );
                        return found?.label ?? selected;
                      }}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <MenuItem key={s.value} value={s.value}>
                          {s.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleSubmitStatus(asset.id)}
                  >
                    提交
                  </Button>

                  <Button
                    variant="contained"
                    disabled={asset.status !== "approved"}
                    color="primary"
                    size="small"
                    onClick={() => handleSubmitOnChain(asset.id)}
                  >
                    提交上链
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
