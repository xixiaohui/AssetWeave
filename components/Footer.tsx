"use client";

import { Box, Stack, Typography, Link as MuiLink } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#121212",
        color: "#fff",
        py: 6,
        px: 4,
        mt: "auto",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        spacing={4}
        maxWidth={1200}
        mx="auto"
      >
        {/* Brand / About */}
        <Stack spacing={1}>
          <Typography variant="h6" fontWeight={700}>
            Assets Weave
          </Typography>
          <Typography color="grey.500" variant="body2">
            Tokenize · Trade · Distribute Yield for Real-World Assets
          </Typography>
        </Stack>

        {/* Links */}
        <Stack direction="row" spacing={6}>
          <Stack spacing={1}>
            <Typography fontWeight={600}>Platform</Typography>
            <MuiLink href="/assets" color="inherit" underline="hover">
              Assets
            </MuiLink>
            <MuiLink href="/portfolio" color="inherit" underline="hover">
              Portfolio
            </MuiLink>
            <MuiLink href="/yields" color="inherit" underline="hover">
              Yields
            </MuiLink>
            <MuiLink href="/issuer" color="inherit" underline="hover">
              Issue
            </MuiLink>
          </Stack>

          <Stack spacing={1}>
            <Typography fontWeight={600}>Company</Typography>
            <MuiLink href="#" color="inherit" underline="hover">
              About
            </MuiLink>
            <MuiLink href="#" color="inherit" underline="hover">
              Contact
            </MuiLink>
            <MuiLink href="#" color="inherit" underline="hover">
              Privacy
            </MuiLink>
          </Stack>

          <Stack spacing={1}>
            <Typography fontWeight={600}>Doashboard</Typography>
            <MuiLink href="/dashboard/eth" color="inherit" underline="hover">
              ETH
            </MuiLink>

          </Stack>
        </Stack>
      </Stack>

      <Box mt={6} textAlign="center">
        <Typography variant="body2" color="grey.500">
          &copy; {new Date().getFullYear()} Assets Weave. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
