// components/home/Compliance.tsx
import { Box, Typography, Stack, Chip } from "@mui/material";

export default function Compliance() {
  return (
    <Box sx={{ py: 12, bgcolor: "#0b1020", color: "#fff", textAlign: "center" }}>
      <Typography variant="h4" fontWeight={700} mb={4}>
        合规与安全保障
      </Typography>

      <Stack direction="row" spacing={3} justifyContent="center">
        <Chip label="KYC" color="success" />
        <Chip label="AML" color="success" />
        <Chip label="审计报告" color="success" />
        <Chip label="SPV 资产隔离" color="success" />
      </Stack>
    </Box>
  );
}
