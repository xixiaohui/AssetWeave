// components/home/Architecture.tsx
import { Box, Typography, Stack } from "@mui/material";

export default function Architecture() {
  return (
    <Box sx={{ py: 12, bgcolor: "#f7f8fa", textAlign: "center" }}>
      <Typography variant="h4" fontWeight={700} mb={6}>
        Web2 + Web3 技术架构
      </Typography>

      <Stack spacing={2}>
        <Typography>前端：Next.js + MUI v7</Typography>
        <Typography>后端：PostgreSQL + API</Typography>
        <Typography>链上：RWA 智能合约 + 钱包</Typography>
        <Typography>资金：USDT 托管 + 分红模型</Typography>
      </Stack>
    </Box>
  );
}
