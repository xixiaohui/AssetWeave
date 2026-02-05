"use client";

import { usePrivy } from "@privy-io/react-auth";
import Button from "@mui/material/Button";

export default function LoginButton() {
  const { login, authenticated, user, logout } = usePrivy();

  if (!authenticated) {
    return (
      <Button variant="contained" onClick={login}>
        登陆 / 注册
      </Button>
    );
  }

  return (
    <Button variant="outlined" onClick={logout}>
      Logout ({user?.email?.address})
    </Button>
  );
}
