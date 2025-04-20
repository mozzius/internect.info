import type { Metadata, Viewport } from "next";
import { Open_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

import { cn } from "~/lib/utils";

import "./globals.css";

import PlausibleProvider from "next-plausible";

import { Toaster } from "~/components/ui/sonner";
import { Providers } from "./providers";

const font = Open_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Explore the ATmosphere — internect.info",
  description:
    "Find technical information about a Bluesky account from its handle or DID.",
  metadataBase: new URL("https://internect.info"),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <PlausibleProvider
          domain="internect.info"
          customDomain="https://plausible.mozzius.dev"
          trackOutboundLinks
          selfHosted
        />
      </head>
      <body
        className={cn(
          "bg-background min-h-screen overflow-x-hidden font-sans antialiased",
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
