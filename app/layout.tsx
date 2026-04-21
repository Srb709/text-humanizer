import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Text Humanizer",
  description: "Rule-based text humanizer with casual, professional, and shorter rewrite modes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
