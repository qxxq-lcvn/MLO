import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MLO — Rice Paddy Ecosystem Designer",
  description:
    "Interactive rice field map & plant layout designer with fauna-driven ecosystem simulation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen w-screen overflow-hidden text-slate-900">{children}</body>
    </html>
  );
}
