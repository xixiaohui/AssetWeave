"use client";

import { Box, Typography, Button, Grid, Card, CardContent, Stack, Link } from "@mui/material";

import { useWallets } from "@privy-io/react-auth";
import FaucetButton from "./FaucetButton";
import XUSDTBalance from "./XUSDTBalance";


export default function MyPage() {
  const { wallets } = useWallets();
  const address = wallets?.[0]?.address;
  return (
    <Box sx={{ p: 6, mt: 7, maxWidth: 1200, mx: "auto" }}>
      {/* 页面标题 */}
      <Typography variant="h4" fontWeight={700} mb={4}>
        我的主页
      </Typography>

      <Grid container spacing={4}>
        {/* 钱包信息卡片 */}
        <Grid size={{ xs:12,md:6}}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight={600}>
                  钱包信息
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  当前连接钱包
                </Typography>

                <Typography
                  sx={{
                    wordBreak: "break-all",
                    fontFamily: "monospace",
                    bgcolor: "#f5f5f5",
                    p: 1.5,
                    borderRadius: 2,
                  }}
                >
                  {address || "未连接钱包"}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* 操作区 */}
        <Grid size={{ xs:12,md:6}} >
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Stack spacing={3}>
                <Typography variant="h6" fontWeight={600}>
                  账户操作
                </Typography>

                <Button
                  component={Link}
                  href="/kyc/apply"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{ borderRadius: 3 }}
                >
                  KYC 认证申请
                </Button>

                <FaucetButton />

                <XUSDTBalance />

              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
