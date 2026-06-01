import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Earth Lens — Landsat 50年 ビフォーアフター",
  description:
    "Landsat の50年アーカイブで、同一地点の過去と現在を並べて地球の変化を見せる。",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
