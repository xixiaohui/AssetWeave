"use client";

import { useEffect } from "react";

export default function WalletSync3() {
  useEffect(() => {
    const onStorage = () => {
      location.reload(); // 登录后自动刷新全站状态
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return null;
}
