"use client";

import { Box, Stack, Typography, Link as MuiLink, IconButton, Link } from "@mui/material";

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Image from "next/image";


export default function Footer() {
  const addr="0xd12478358C37f5E86996eB917558b0ebfCc8A0e1";

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
          <Image
            src="/aw2.png"
            alt="资产织造"
            width={360}
            height={120}
            priority
          />
          <Typography color="grey.500" variant="body2">
            真实资产上链，价值自由流通，收益自动分配(供学习使用)
          </Typography>
        </Stack>

        {/* Links */}
        <Stack direction="row" spacing={6}>
          <Stack spacing={1}>
            <Typography fontWeight={600}>平台</Typography>
            <MuiLink href="/assets" color="inherit" underline="hover">
              资产市场
            </MuiLink>
            <MuiLink href="/portfolio" color="inherit" underline="hover">
              我的持仓
            </MuiLink>
            <MuiLink href="/yields" color="inherit" underline="hover">
              我的分红
            </MuiLink>
            <MuiLink href="/issuer" color="inherit" underline="hover">
              发行资产
            </MuiLink>
          </Stack>

          <Stack spacing={1}>
            <Typography fontWeight={600}>公司</Typography>
            <MuiLink href="#" color="inherit" underline="hover">
              关于我们
            </MuiLink>
            <MuiLink href="#" color="inherit" underline="hover">
              联系我们
            </MuiLink>
            <MuiLink href="#" color="inherit" underline="hover">
              隐私政策
            </MuiLink>
          </Stack>

          <Stack spacing={1}>
            <Typography fontWeight={600}>帮助</Typography>
            <MuiLink href="/dashboard/eth" color="inherit" underline="hover">
              ETH
            </MuiLink>
            <MuiLink href="/investor" color="inherit" underline="hover">
              Investor
            </MuiLink>

          </Stack>
        </Stack>
      </Stack>


      <Box sx={{ py: 5, textAlign: "center", bgcolor: "#111", color: "#fff" }}>
        <Typography>assetweave.shop © 2026</Typography>
        <Disclaimer addr={addr}></Disclaimer>
      </Box>
    </Box>
  );
}

function Disclaimer({ addr }: { addr: string }) {
  return (
    <Box display="inline-flex" alignItems="center" gap={0.5}>
      {/* <Typography variant="body2" color="grey.500">
        所有记录公开透明、可验证、可追溯！
      </Typography> */}

      {/* 地址可点击 */}
      <Link
        href={`https://sepolia.etherscan.io/address/${addr}`}
        target="_blank"
        rel="noopener noreferrer"
        underline="hover"
        color="grey.500"
        sx={{ fontWeight: 500 }}
      >
        捐助:{addr.slice(0, 6)}...{addr.slice(-4)}
      </Link>

      {/* 心形图标 */}
      <IconButton size="small" sx={{ p: 0 }}>
        <FavoriteIcon color="error" fontSize="small" />
      </IconButton>
    </Box>
  );
}