import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

import { cn } from "~/lib/utils";

import "./globals.css";

import { Toaster } from "~/components/ui/sonner";
import { Providers } from "./providers";

const font = Open_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "internect.info - Resolve a Bluesky handle",
  description:
    "Find technical information about a Bluesky account from its handle or DID.",
  metadataBase: new URL("https://internect.info"),
  other: { "google-adsense-account": "ca-pub-6921696462479931" },
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
          "bg-background min-h-screen font-sans antialiased",
          font.variable,
        )}
      >
        <Providers>{children}</Providers>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
