"use client";

import { createContext, useContext, useState } from "react";

interface WalletState {
  userId: string | null;
  wallet: string | null;
  ready: boolean;
}

function readWallet(): WalletState {
  if (typeof window === "undefined") {
    return { userId: null, wallet: null, ready: false };
  }

  return {
    userId: localStorage.getItem("userId"),
    wallet: localStorage.getItem("wallet"),
    ready: true,
  };
}

const WalletContext = createContext<WalletState>({
  userId: null,
  wallet: null,
  ready: false,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function WalletProvider({ children }: any) {
  const [state] = useState<WalletState>(readWallet);

  return (
    <WalletContext.Provider value={state}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
