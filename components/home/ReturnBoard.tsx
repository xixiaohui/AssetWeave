// components/home/ReturnBoard.tsx
"use client";
import { Box, Typography, TextField, Stack } from "@mui/material";
import { useState } from "react";

export default function ReturnBoard() {
  const [amount, setAmount] = useState(1000);
  const profit = amount * 0.087;

  return (
    <Box sx={{ py: 12, textAlign: "center" }}>
      <Typography variant="h4" fontWeight={700} mb={4}>
        RWA 投资收益测算
        
      </Typography>

      <Stack spacing={3} alignItems="center">
        <TextField
          label="投资金额 (USDT)"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <Typography variant="h5">
          预期年收益：{profit.toFixed(2)} USDT
        </Typography>
      </Stack>
    </Box>
  );
}
