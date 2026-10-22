// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScrolling from "@/components/SmoothScrolling";
import { AppProvider } from "@/context/AppContext"; // TAMBAHKAN INI

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard Operasional - REKA RUPA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AppProvider> {/* BUNGKUS DENGAN PROVIDER */}
          <SmoothScrolling>
            {children}
          </SmoothScrolling>
        </AppProvider>
      </body>
    </html>
  );
}