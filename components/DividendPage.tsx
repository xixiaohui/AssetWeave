"use client";

import React, { useState } from "react";
import { Box, Typography, TextField, Button, Stack } from "@mui/material";
import axios from "axios";

export default function DividendPage() {
  const [amount, setAmount] = useState("");

  const handleDistribute = async () => {
    await axios.post("/api/admin/dividend", { amountEth: amount });
    alert("分红已发放");
    setAmount("");
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={3}>分红管理</Typography>
      <Stack spacing={2} maxWidth={300}>
        <TextField label="ETH数量" value={amount} onChange={e => setAmount(e.target.value)} />
        <Button variant="contained" color="primary" onClick={handleDistribute}>分红发放</Button>
      </Stack>
    </Box>
  );
}
