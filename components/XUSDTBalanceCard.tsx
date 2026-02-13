/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Box,
} from "@mui/material";

export default function XUSDTBalanceCard() {
  const [address, setAddress] = useState<string>(() => {
    return "0xd12478358C37f5E86996eB917558b0ebfCc8A0e1";
  });
  const [balance, setBalance] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("XUSDT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBalance = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`/api/xusdt/balance?address=${address}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Query failed");

      setBalance(data.balance);
      setSymbol(data.symbol);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  //   useEffect(() => {
  //     const saved = localStorage.getItem("wallet");
  //     if (saved) setAddress(saved);
  //   }, []);

  return (
    <Box
      sx={{
        p: 4,
        border: "1px solid #ccc",
        borderRadius: 2,
        mb: 10,
        maxWidth: "40vw",
      }}
    >
      <Card sx={{ maxWidth: "50vw", mx: "auto", mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            XUSDT 余额查询
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="钱包地址"
              fullWidth
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <Button
              variant="contained"
              onClick={fetchBalance}
              disabled={!address || loading}
            >
              查询余额
            </Button>

            {loading && <CircularProgress size={24} />}

            {error && <Typography color="error">{error}</Typography>}

            {balance && !loading && (
              <Typography variant="h5" fontWeight="bold">
                {symbol}：{balance}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
