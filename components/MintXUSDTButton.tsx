/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";

export default function MintXUSDTButton() {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleMint = async () => {
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const res = await fetch("/api/xusdt/mint", {
        method: "POST",
        body: JSON.stringify({ to, amount }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Mint failed");

      setSuccess(`成功发币 ${data.minted} XUSDT 给 ${data.to}，Tx: ${data.tx}`);
    } catch (err: any) {
      setError(err.message || "Mint error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, border: "1px solid #ccc", borderRadius: 2, mb:10,maxWidth: "40vw" }}>
      <Typography variant="h6" mb={2}>
        Owner 发币 (XUSDT)
      </Typography>

      <TextField
        fullWidth
        label="接收地址"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        type="number"
        label="金额"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        onClick={handleMint}
        disabled={loading || !to || amount <= 0}
      >
        {loading ? "发币中..." : "发币"}
      </Button>

      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
}
