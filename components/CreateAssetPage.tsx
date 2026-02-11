"use client";

import React, { useState } from "react";
import { Box, Typography, TextField, Button, Stack } from "@mui/material";
import axios from "axios";

export default function CreateAssetPage() {
  const [form, setForm] = useState({
    asset_id: "",
    name: "",
    description: "",
    doc_hash: "",
    total_raise: "",
    price: "",
    raise_days: "",
    duration_days: "",
  });

  const handleChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const handleSubmit = async () => {
    await axios.post("/api/admin/assets/create", form);
    alert("创建成功！");
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={3}>创建新资产</Typography>
      <Stack spacing={2} maxWidth={400}>
        <TextField label="Asset ID" value={form.asset_id} onChange={handleChange("asset_id")} />
        <TextField label="名称" value={form.name} onChange={handleChange("name")} />
        <TextField label="描述" value={form.description} onChange={handleChange("description")} />
        <TextField label="文档哈希" value={form.doc_hash} onChange={handleChange("doc_hash")} />
        <TextField label="募集总额 (USDT)" value={form.total_raise} onChange={handleChange("total_raise")} />
        <TextField label="单价 (USDT)" value={form.price} onChange={handleChange("price")} />
        <TextField label="募集天数" value={form.raise_days} onChange={handleChange("raise_days")} />
        <TextField label="运行天数" value={form.duration_days} onChange={handleChange("duration_days")} />
        <Button variant="contained" color="primary" onClick={handleSubmit}>创建</Button>
      </Stack>
    </Box>
  );
}
