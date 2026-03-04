/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Button, Typography, Stack, Alert } from "@mui/material";
import { useWallets } from "@privy-io/react-auth";

export default function FaucetButton() {
  const { wallets } = useWallets();
  const address = wallets?.[0]?.address;

  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // 查询今天是否已领取
  useEffect(() => {
    if (!address) return;

    const checkClaimed = async () => {
      try {
        const res = await fetch(`/api/xusdt/mintsafe?wallet=${address}`);
        const data = await res.json();
        setClaimed(data.claimed);
      } catch (err) {
        console.error(err);
      }
    };

    checkClaimed();
  }, [address]);

  const handleClaim = async () => {
    if (!address) {
      setMessage("请先连接钱包");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/xusdt/mintsafe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: address }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data?.error || "领取失败");
        setClaimed(true);
        return;
      }

      setMessage(`领取成功！Tx: ${data.tx}`);
      setClaimed(true);
    } catch (err: any) {
      setMessage(err.message || "领取失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2}>
      {claimed ? (
        <Alert severity="info">今天已经领取过了，请明天再来</Alert>
      ) : (
        <Button
          variant="contained"
          size="large"
          onClick={handleClaim}
          disabled={loading || !address}
        >
          {loading ? "领取中..." : "领取 100 XUSDT"}
        </Button>
      )}

      {message && <Alert severity={claimed ? "success" : "error"}>{message}</Alert>}
    </Stack>
  );
}