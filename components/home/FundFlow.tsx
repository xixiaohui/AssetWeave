// components/home/FundFlow.tsx
import { Box, Typography, Stack } from "@mui/material";

export default function FundFlow() {
  return (
    <Box sx={{ py: 12, textAlign: "center" }}>
      <Typography variant="h4" fontWeight={700} mb={6}>
        募资过程实时公开
        
      </Typography>

      <Stack direction="row" justifyContent="center" spacing={6}>
        <Typography>投资人 USDT</Typography>
        <Typography>→</Typography>
        <Typography>智能合约托管</Typography>
        <Typography>→</Typography>
        <Typography>真实资产运营</Typography>
        <Typography>→</Typography>
        <Typography>利润注入合约</Typography>
        <Typography>→</Typography>
        <Typography>投资人分红</Typography>
      </Stack>
    </Box>
  );
}
