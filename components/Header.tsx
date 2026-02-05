"use client";

import Link from "next/link";
import { AppBar, Toolbar, Typography, Stack, Button } from "@mui/material";
import LoginButton from "./LoginButton";
import WalletSync from "./WalletSync";
import { useState } from "react";
import EmailLoginDialog from "./EmailLoginDialog";
import WalletSync2 from "./WalletSync2";

export default function Header() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email);
    // 可调用 WalletSync 或刷新页面
  };

  return (
    <AppBar position="fixed" color="default" elevation={1}>
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

        <LoginButton />
        <WalletSync />

        {userEmail ? (
            <Button color="inherit" onClick={() => setUserEmail(null)}>
              Logout ({userEmail})
            </Button>
          ) : (
            <Button color="inherit" onClick={() => setDialogOpen(true)}>
              Login
            </Button>
          )}
          {userEmail && <WalletSync2 email={userEmail} />}
      </Toolbar>

      <EmailLoginDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      
    </AppBar>
  );
}
