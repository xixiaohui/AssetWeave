// components/home/HeroScreen.tsx
"use client";
import { Box, Typography, Stack, Button } from "@mui/material";

export default function HeroScreen() {
  return (
    <Box
      sx={{
        height: "92vh",
        position: "relative",
        color: "#fff",
        background:
          "radial-gradient(circle at 30% 30%, #1a237e, #000 70%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      <Stack spacing={4} zIndex={2}>
        <Typography variant="h1" fontWeight={800}>
          Asset Weave
        </Typography>

        <Typography variant="h5" sx={{ opacity: 0.85 }}>
          真实资产 · 链上确权 · 自动分红 · 全程可验证
          <br />
          上链 · 流通 · 分红
        </Typography>
        <Typography variant="subtitle1" color="white" sx={{ mt: 1 }}>
         
          Web2 保证资产真实，Web3 保证分钱真实
          <br/>
          现实资产创造收益，区块链确保收益真实到你手里
          <br />
          资产在现实世界赚钱，收益自动打到你的钱包，所有记录你都可以自己在区块链上查到
        </Typography>

        <Stack direction="row" spacing={3} justifyContent="center">
          <Button variant="contained" size="large">
            立即认购
          </Button>
          <Button variant="outlined" size="large" color="inherit">
            查看资产
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
