"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
};

export default function EmailLoginDialog({
  open,
  onClose,
  onLoginSuccess,
}: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        isRegister ? "/api/auth/register2" : "/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "未知错误");
      } else {
        onLoginSuccess(email);
        onClose();
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.message || "请求失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isRegister ? "注册" : "登录"}</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 300 }}
      >
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {isRegister && (
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        )}
        {error && <Typography color="error">{error}</Typography>}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
        <Button onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "已有账号？登录" : "新用户？注册"}
        </Button>
        <Button variant="contained" onClick={submit} disabled={loading}>
          {isRegister ? "注册" : "登录"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
