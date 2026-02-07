/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";

import {
  Card,
  CardContent,
  Typography,
  Stack,
  Alert,
  CircularProgress,
  Chip,
} from "@mui/material";

type Props = {
  addr: string;
  balance: string;
  loading: boolean;
  error: string | null;
};

export default function RWABalance({ addr }: { addr: string }) {
  const [balance, setBalance] = useState<string>("0");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 防止组件卸载后 setState 报错
  const abortRef = useRef<AbortController | null>(null);

  const fetchBalance = async () => {
    if (!addr) return;

    // 取消上一次请求
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `/api/rwa/balance?address=${addr}`,
        {
          method: "GET",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store", // 防止 Next 缓存
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setBalance(data.balance ?? "0");
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Fetch balance error:", err);
        setError("无法获取链上余额");
      }
    } finally {
      setLoading(false);
    }
  };

  // 首次 + 地址变化自动刷新
  useEffect(() => {
    fetchBalance();
  }, [addr]);

  // 每 10 秒自动刷新链上余额（非常关键，链上会变）
  useEffect(() => {
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [addr]);

  return (
    <div className="space-y-2">
      <RWABalanceCard
        addr={addr}
        balance={balance}
        loading={loading}
        error={error}
      />
    </div>
  );
}




function RWABalanceCard({
  addr,
  balance,
  loading,
  error,
}: Props) {
  return (
    <Card elevation={3} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack spacing={2}>
          {/* 标题 */}
          <Typography variant="h6" fontWeight={600}>
            RWA 链上资产
          </Typography>

          {/* 钱包地址 */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              钱包地址
            </Typography>
            <Chip
              label={`${addr.slice(0, 6)}...${addr.slice(-4)}`}
              size="small"
              variant="outlined"
            />
          </Stack>

          {/* 状态区 */}
          {loading && (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={18} />
              <Typography variant="body2" color="text.secondary">
                正在同步链上余额...
              </Typography>
            </Stack>
          )}

          {error && <Alert severity="error">{error}</Alert>}

          {/* 余额展示 */}
          {!loading && !error && (
            <Stack spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                当前余额
              </Typography>
              <Typography variant="h4" fontWeight={700}>
                {balance}
              </Typography>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}