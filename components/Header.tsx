"use client";

import Link from "next/link";
import { AppBar, Toolbar, Typography, Stack, Button } from "@mui/material";
import LoginButton from "./LoginButton";
import WalletSync from "./WalletSync";

export default function Header() {
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
      </Toolbar>
      
    </AppBar>
  );
}
