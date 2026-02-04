/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Card,
  CardContent,
} from "@mui/material";

export default function AssetDetailClient({ asset }: any) {
  const [amount, setAmount] = useState(10);

  const buy = async () => {
    try {
      await fetch("/api/purchase", {
        method: "POST",
        body: JSON.stringify({
          tokenId: asset.token_id,
          buyerId: "填你的investor uuid",
          amount,
        }),
      });

      alert("购买成功");
    } catch (err) {
      console.error(err);
      alert("购买失败，请重试");
    }
  };

  return (
    <Box sx={{ p: 8, maxWidth: 700, mx: "auto" }}>
      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Stack spacing={3}>
            {/* Asset Title & Description */}
            <Typography variant="h4" fontWeight={700}>
              {asset.title}
            </Typography>
            <Typography color="text.secondary">{asset.description}</Typography>
            <Typography variant="h6">
              单价：¥{Number(asset.price_per_token).toLocaleString()}
            </Typography>

            {/* Purchase Amount */}
            <TextField
              label="购买份额"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              fullWidth
            />

            {/* Buy Button */}
            <Button variant="contained" size="large" onClick={buy}>
              一键购买
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

