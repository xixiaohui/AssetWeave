"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme";
import { PrivyProvider } from "@privy-io/react-auth";

import { WalletProvider } from "@/context/WalletContext";


export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ["email", "google"],

        appearance: {
          theme: "light",
          accentColor: "#3b82f6",
        },

        embeddedWallets: {
          ethereum: {
            createOnLogin: "all-users",
          },
        },
      }}
    >
      <WalletProvider>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </WalletProvider>
    </PrivyProvider>
  );
}
