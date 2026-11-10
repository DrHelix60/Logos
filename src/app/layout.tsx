import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Logos | Knowledge Standardization Platform",
  description: "Peer-to-peer knowledge standardization network organizing validated databases and schools of thought.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#F7F1E5] text-[#1F2A1C] antialiased">
        {children}
      </body>
    </html>
  );
}
