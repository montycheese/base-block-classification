import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Base Live Feed - Transaction Classifier",
  description: "Real-time classified transaction feed for Base blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100 antialiased">{children}</body>
    </html>
  );
}
