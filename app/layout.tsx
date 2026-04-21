import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CopyFlow AI – Marketing Copy That Converts",
  description:
    "Generate high-converting email subjects, ad copy, social posts, product descriptions, and blog outlines with AI. Start free, no credit card required.",
  keywords:
    "AI copywriting, marketing copy generator, email subject lines, ad copy, social media posts",
  openGraph: {
    title: "CopyFlow AI – Marketing Copy That Converts",
    description: "AI-powered marketing copy in seconds. No writer needed.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.className} bg-[#080808] text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
