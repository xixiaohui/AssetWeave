"use client";

import Link from "next/link";
import { AppBar, Toolbar, Typography, Stack, Button, CardMedia, Card } from "@mui/material";
import LoginButton from "./LoginButton";
import WalletSync from "./WalletSync";
import { useState } from "react";
import EmailLoginDialog from "./EmailLoginDialog";
import WalletSync2 from "./WalletSync2";
import Image from "next/image";

export default function Header() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [userWallet, setUserWallet] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLoginSuccess = (email: string,user:any) => {
    setUserEmail(email);
    // 可调用 WalletSync 或刷新页面
    
    setUserWallet(user.wallet_address);
  };

  return (
    <AppBar position="fixed" color="default" elevation={1}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* <Typography variant="h3" fontWeight={700}>
          资产织造
        </Typography> */}
       <Image
          src="/aw.png"
          alt="资产织造"
          width={360}
          height={120}
          priority
        />
        
        
        <Stack direction="row" spacing={2}>
          <Link href="/home" style={{ textDecoration: "none" }}>
            <Button variant="text">主页</Button>
          </Link>
          <Link href="/assets" style={{ textDecoration: "none" }}>
            <Button variant="text">资产市场</Button>
          </Link>
          <Link href="/portfolio" style={{ textDecoration: "none" }}>
            <Button variant="text">持仓</Button>
          </Link>
          <Link href="/yields" style={{ textDecoration: "none" }}>
            <Button variant="text">分红</Button>
          </Link>
          <Link href="/issuer" style={{ textDecoration: "none" }}>
            <Button variant="text">发行资产</Button>
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
