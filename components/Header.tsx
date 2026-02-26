"use client";

import Link from "next/link";
import { AppBar, Toolbar, Stack, Button, } from "@mui/material";
import LoginButton from "./LoginButton";
import WalletSync from "./WalletSync";

import Image from "next/image";

export default function Header() {
  return (
    <AppBar position="fixed" color="default" elevation={1}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* <Typography variant="h3" fontWeight={700}>
          资产织造
        </Typography> */}
        <Image
          src="/aw.png"
          alt="资产织造"
          width={240}
          height={80}
          priority
        />

        <Stack direction="row" spacing={2}>
          <Link href="/home" style={{ textDecoration: "none" }}>
            <Button variant="text">主页</Button>
          </Link>
          <Link href="/assets" style={{ textDecoration: "none" }}>
            <Button variant="text">资产市场</Button>
          </Link>
          <Link href="/assets" style={{ textDecoration: "none" }}>
            <Button variant="text">平台管理</Button>
          </Link>
          <Link href="/portfolio" style={{ textDecoration: "none" }}>
            <Button variant="text">链上协议</Button>
          </Link>
          <Link href="/yields" style={{ textDecoration: "none" }}>
            <Button variant="text">投资人</Button>
          </Link>
          <Link href="/devlog" style={{ textDecoration: "none" }}>
            <Button variant="text">开发记录</Button>
          </Link>
        </Stack>

        <LoginButton />
        <WalletSync />

        {/* {userEmail ? (
          <Button variant="outlined" onClick={() => setUserEmail(null)}>
            登出 ({userWallet?.slice(0,15)})
          </Button>
        ) : (
          <Button variant="contained" onClick={() => setDialogOpen(true)}>
            登陆/注册
          </Button>
        )}
        {userEmail && <WalletSync2 email={userEmail} />} */}
      </Toolbar>

      {/* <EmailLoginDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      /> */}


    </AppBar>
  );
}
