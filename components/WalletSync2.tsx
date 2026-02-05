"use client";

import { useEffect } from "react";

type Props = {
  email: string | null;
};

export default function WalletSync2({ email }: Props) {
  useEffect(() => {
    if (!email) return;

    // 调用 API 同步钱包
    fetch("/api/auth/sync-wallet2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          console.log("WalletSync 成功，钱包地址::", data.wallet_address);
          // 可以把 wallet_address 存到 React Context / 状态
        } else {
          console.error("WalletSync 失败:", data.message);
        }
      })
      .catch(console.error);
  }, [email]);

  return null; // 只是同步，不渲染任何 UI
}
