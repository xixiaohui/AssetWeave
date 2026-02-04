import type { Metadata } from "next";
import "./globals.css";
import ThemeRegistry from "./ThemeRegistry";
import Header from "@/components/Header";
import Footer from "@/components/Footer";


export const metadata: Metadata = {
  title: "Assets Weave",
  description: "RWA Asset Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          {/* Header */}
          <Header />

          {/* Main Content */}
          <main style={{ minHeight: "calc(100vh - 64px - 120px)" }}>
            {children}
          </main>

          {/* Footer */}
          <Footer />
        </ThemeRegistry>
      </body>
    </html>
  );
}
