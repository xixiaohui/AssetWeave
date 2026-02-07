"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  CircularProgress,
  Alert,
  Chip,
  Box,
} from "@mui/material";
import RWABalance from "@/components/RWABalance";

export default function EthBalanceDashboard() {
  const [eth, setEth] = useState<string>("0");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEth = async () => {
    try {
      setError(null);
      const res = await fetch("/api/wallet/eth", {
        cache: "no-store",
      });
      const data = await res.json();
      setEth(data.eth);
    } catch (e) {
      setError("无法获取钱包 ETH 余额");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEth();
    const timer = setInterval(fetchEth, 15000); // 每15秒刷新
    return () => clearInterval(timer);
  }, []);

  const lowBalance = parseFloat(eth) < 0.005;

  return (
    <Box
      sx={{
        pt: 12, // 给 AppBar 留空间
        px: 6,
        m:1,
        display: "flex",

        flexDirection:'column',
        justifyContent: "center",
      }}
    >
      <Card elevation={4} sx={{ borderRadius: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={600}>
              托管热钱包 ETH 监控
            </Typography>

            {loading && (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={18} />
                <Typography variant="body2">正在读取链上余额...</Typography>
              </Stack>
            )}

            {error && <Alert severity="error">{error}</Alert>}

            {!loading && !error && (
              <>
                <Typography variant="h3" fontWeight={700}>
                  {eth} ETH
                </Typography>

                <Stack direction="row" spacing={1}>
                  <Chip label="Sepolia" size="small" />
                  <Chip label="Hot Wallet" size="small" />
                  {lowBalance && (
                    <Chip label="余额过低 ⚠️" color="error" size="small" />
                  )}
                </Stack>

                {lowBalance && (
                  <Alert severity="warning">
                    ETH 余额过低，可能导致 Mint / Transfer 失败，请及时充值。
                  </Alert>
                )}
              </>
            )}
          </Stack>
        </CardContent>
      </Card>

      <RWABalance addr="0xd12478358C37f5E86996eB917558b0ebfCc8A0e1" />
    </Box>
  );
}
