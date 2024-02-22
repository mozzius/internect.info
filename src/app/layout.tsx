import type { Metadata } from "next";
import { Bitter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

import { cn } from "~/lib/utils";
import "./globals.css";

const inter = Bitter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "internect.info - Resolve a Bluesky handle",
  description:
    "Find technical information about a Bluesky account from its handle or DID.",
  metadataBase: new URL("https://internect.info"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
