"use client";

import { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";

export default function WalletSync() {
  const { authenticated, user } = usePrivy();

  useEffect(() => {
    if (authenticated && user?.email && user?.wallet?.address) {
      fetch("/api/auth/sync-wallet", {
        method: "POST",
        body: JSON.stringify({
          email: user.email.address,
          wallet: user.wallet.address,
        }),
      });
    }
  }, [authenticated, user]);

  return null;
}
