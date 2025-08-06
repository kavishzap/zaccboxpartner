import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Partner Management System",
  description: "Modern partner management application",
  generator: "v0.dev",
  icons: {
    icon: [
      { url: "/logo_zaccbox_white.png" },
      { url: "/logo_zaccbox_white.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/logo_zaccbox_white.png",
    shortcut: "/logo_zaccbox_white.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
