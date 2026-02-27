import { Box, Typography, Stack } from "@mui/material";

export default async function YieldsPage() {
  return (
    <Box sx={{ p: 8, mt: 7 }}>
      <Stack spacing={6}>
        <Typography variant="h4" fontWeight={700}>
          分红
        </Typography>
      </Stack>
    </Box>
  );
}
