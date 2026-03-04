/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Button, Typography, Stack, CircularProgress } from "@mui/material";
import { ethers } from "ethers";
import { useWallets } from "@privy-io/react-auth";
import { getXUSDT } from "@/lib/xusdtContract";

export default function XUSDTBalance() {
  const { wallets } = useWallets();
  const address = wallets?.[0]?.address;

  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    if (!address) {
      setError("钱包未连接");
      setBalance(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/xusdt/balance?wallet=${address}`);
      const data = await res.json();
      console.log("XUSDT balance:", data);

      setBalance(res.ok ? data.balance : null);
    } catch (err: any) {
      console.error("查询 XUSDT 余额失败", err);
      setError(err.message || "查询失败");
      setBalance(null);
    } finally {
      setLoading(false);
    }
  };

  // 钱包地址变化时自动查询
  useEffect(() => {
    fetchBalance();
  }, [address]);

  return (
    <Stack spacing={1} sx={{ mt: 2 }}>
      <Typography variant="h6" fontWeight={600}>
        XUSDT 余额
      </Typography>

      {loading ? (
        <CircularProgress size={24} />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Typography variant="body1">
          {balance !== null ? balance : "未连接钱包"}
        </Typography>
      )}

      <Button
        variant="outlined"
        size="small"
        onClick={fetchBalance}
        disabled={!address || loading}
        sx={{ mt: 1, width: 120 }}
      >
        刷新余额
      </Button>

      {/* <Typography variant="body2" color="text.secondary">
        当前钱包地址: {address ?? "未连接钱包"}
      </Typography> */}
    </Stack>
  );
}