"use client";

import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Stack,
  Grid,
  Card,
  CardContent,
} from "@mui/material";

import { useEffect } from "react";
import RWABalance from "@/components/RWABalance";


export default function Home() {

  useEffect(() => {
    fetch("/api/contract")
      .then(res => res.json())
      .then(data => console.log(data.address));
  }, []);

  


  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f7f8fa" }}>
      {/* Top AppBar */}
      {/* <AppBar position="fixed" color="default" elevation={1}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight={700}>
            Assets Weave
          </Typography>

          <Stack direction="row" spacing={2}>
            <Link href="/assets" style={{ textDecoration: "none" }}>
              <Button variant="text">Assets</Button>
            </Link>
            <Link href="/portfolio" style={{ textDecoration: "none" }}>
              <Button variant="text">Portfolio</Button>
            </Link>
            <Link href="/yields" style={{ textDecoration: "none" }}>
              <Button variant="text">Yields</Button>
            </Link>
            <Link href="/issuer" style={{ textDecoration: "none" }}>
              <Button variant="text">Issue Asset</Button>
            </Link>
          </Stack>
        </Toolbar>
      </AppBar> */}

      {/* Main Content */}
      <Box
        sx={{
          pt: 27, // 给 AppBar 留空间
          px: 6,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Stack spacing={8} width="100%" maxWidth={1100} alignItems="center">
          {/* Hero */}
          {/* <Stack spacing={2} alignItems="center">
            <Typography variant="h2" fontWeight={800} letterSpacing={-1}>
              资产织造
            </Typography>
            <Typography color="text.secondary" textAlign="center">
              将现实世界资产代币化、交易并分配收益
              Tokenize · Trade · Distribute Yield for Real-World Assets
            </Typography>
          </Stack> */}

          {/* Navigation Cards */}
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <NavCard
                title="资产市场"
                desc="浏览资产并购买代币化股份"
                href="/assets"
                button="了解更多"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <NavCard
                title="我的持仓"
                desc="查看您的持仓和当前市场价值"
                href="/portfolio"
                button="了解更多"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <NavCard
                title="我的分红"
                desc="查看您的分红记录和总收益"
                href="/yields"
                button="了解更多"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <NavCard
                title="发行资产"
                desc="创建并代币化一种新的现实世界资产"
                href="/issuer"
                button="了解更多"
              />
            </Grid>
          </Grid>
        </Stack>
      </Box>

      {/* <TestRWA></TestRWA> */}

      

    </Box>
  );
}

function NavCard({
  title,
  desc,
  href,
  button,
}: {
  title: string;
  desc: string;
  href: string;
  button: string;
}) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        height: "100%",
        transition: "0.25s",
        "&:hover": {
          boxShadow: 8,
          transform: "translateY(-6px)",
        },
      }}
    >
      <CardContent>
        <Stack spacing={3}>
          <Typography variant="h5" fontWeight={700}>
            {title}
          </Typography>

          <Typography color="text.secondary">{desc}</Typography>

          <Box>
            <Link href={href} style={{ textDecoration: "none" }}>
              <Button variant="contained" size="large">
                {button}
              </Button>
            </Link>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function TestRWA(){

  const mint = async () => {
    await fetch("/api/rwa/mint", {
      method: "POST",
      body: JSON.stringify({
        to: "0xd12478358C37f5E86996eB917558b0ebfCc8A0e1",
        amount: 100,
      }),
    });
  };

  return <Button variant="contained" onClick={mint}>Mint RWA</Button>;
}
