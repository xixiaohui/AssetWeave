"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AuthDialog({ open, onClose }: any) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");

  const requestCode = async () => {
    await fetch("/api/auth/request-code", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    setStep("code");
  };

  const verify = async () => {
    const res = await fetch("/api/auth/verify-code", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("wallet", data.wallet);

    onClose();
    location.reload();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Login / Register</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          {step === "email" && (
            <>
              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button variant="contained" onClick={requestCode}>
                Send Code
              </Button>
            </>
          )}

          {step === "code" && (
            <>
              <TextField
                label="Verification Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <Button variant="contained" onClick={verify}>
                Verify & Login
              </Button>
            </>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
