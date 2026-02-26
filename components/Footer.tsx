"use client";

import { Box, Stack, Typography, Link as MuiLink, IconButton, Link } from "@mui/material";

import FavoriteIcon from '@mui/icons-material/Favorite';
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
            width={240}
            height={80}
            priority
          />
          <Typography color="grey.500" variant="body2">
            技术级RWA对外公开融资模拟平台(金融)
          </Typography>
        </Stack>

        {/* Links */}
        <Stack direction="row" spacing={6}>
          <Stack spacing={1}>
            <Typography fontWeight={600}>平台管理</Typography>
            <MuiLink href="#" color="grey.500" underline="hover">
              资产市场
            </MuiLink>
            <MuiLink href="#" color="grey.500" underline="hover">
              资产管理
            </MuiLink>
            <MuiLink href="#" color="grey.500" underline="hover">
              投资人管理
            </MuiLink>
            <MuiLink href="#" color="grey.500" underline="hover">
              查看投资人
            </MuiLink>
            <MuiLink href="#" color="grey.500" underline="hover">
              分红管理
            </MuiLink>
            <MuiLink href="#" color="grey.500" underline="hover">
              财务面板
            </MuiLink>
            <MuiLink href="#" color="grey.500" underline="hover">
              风险控制
            </MuiLink>
            <MuiLink href="/portfolio" color="grey.500" underline="hover">
              持仓
            </MuiLink>
            <MuiLink href="/dashboard/eth" color="grey.500" underline="hover">
              ETH
            </MuiLink>
          </Stack>

          <Stack spacing={1}>
            <Typography fontWeight={600}>链上协议</Typography>
            <MuiLink href="#" color="grey.500" underline="hover">
              合约信息
            </MuiLink>
            <MuiLink href="#" color="grey.500" underline="hover">
              链上数据
            </MuiLink>
            <MuiLink href="#" color="grey.500" underline="hover">
              交易记录
            </MuiLink>
            <MuiLink href="#" color="grey.500" underline="hover">
              白名单
            </MuiLink>
            <MuiLink href="/investor" color="grey.500" underline="hover">
              投资人看板
            </MuiLink>
          </Stack>

          <Stack spacing={1}>
            <Typography fontWeight={600}>投资人</Typography>
            <MuiLink href="/my" color="grey.500" underline="hover">
              我的钱包
            </MuiLink>
            <MuiLink href="#" color="grey.500" underline="hover">
              KYC申请
            </MuiLink>
            <MuiLink href="#" color="grey.500" underline="hover">
              我的资产
            </MuiLink>
            <MuiLink href="#" color="grey.500" underline="hover">
              查看募资进度
            </MuiLink>
            <MuiLink href="#" color="grey.500" underline="hover">
              我的认购
            </MuiLink>
            <MuiLink href="#" color="grey.500" underline="hover">
              收益记录
            </MuiLink>
            <MuiLink href="#" color="grey.500" underline="hover">
              领取分红
            </MuiLink>
            <MuiLink href="#" color="grey.500" underline="hover">
              到期赎回
            </MuiLink>
          </Stack>

          <Stack spacing={1}>
            <Typography fontWeight={600}>AW公司</Typography>
            <MuiLink href="/devlog" color="grey.500" underline="hover">
              开发记录
            </MuiLink>
            <MuiLink href="#" color="grey.500" underline="hover">
              关于我们
            </MuiLink>
            <MuiLink href="#" color="grey.500" underline="hover">
              联系我们
            </MuiLink>
            <MuiLink href="#" color="grey.500" underline="hover">
              隐私政策
            </MuiLink>
            <MuiLink href="/investor" color="grey.500" underline="hover">
              投资人看板
            </MuiLink>

          </Stack>
        </Stack>

      </Stack>


      <Box sx={{ py: 5, textAlign: "center", bgcolor: "#111", color: "#fff" }}>
        <Typography color="grey.500">assetweave.shop © 2026</Typography>
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