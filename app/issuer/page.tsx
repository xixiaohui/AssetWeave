"use client";

import { useState } from "react";
import { Box, Stack, TextField, Typography, Button } from "@mui/material";

export default function IssuerPage() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [value, setValue] = useState(0);
  const [supply, setSupply] = useState(0);
  const [price, setPrice] = useState(0);

  const submit = async () => {
    // TODO: POST /api/assets
    console.log({ title, desc, value, supply, price });
  };

  return (
    <Box sx={{ p: 8, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h4" fontWeight={700} mb={4}>
        Issue New Asset
      </Typography>
      <Stack spacing={3}>
        <TextField label="Title" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextField label="Description" fullWidth multiline rows={4} value={desc} onChange={(e) => setDesc(e.target.value)} />
        <TextField label="Total Value" type="number" fullWidth value={value} onChange={(e) => setValue(Number(e.target.value))} />
        <TextField label="Total Shares" type="number" fullWidth value={supply} onChange={(e) => setSupply(Number(e.target.value))} />
        <TextField label="Price per Share" type="number" fullWidth value={price} onChange={(e) => setPrice(Number(e.target.value))} />
        <Button variant="contained" size="large" onClick={submit}>
          Issue Asset
        </Button>
      </Stack>
    </Box>
  );
}
