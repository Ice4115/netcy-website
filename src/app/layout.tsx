import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NETCY",
  description: "NETCY - Création de Sites Internet Sécurisé et Sécurité Réseau",
  icons: {
    icon: [
      { url: "/images/logo_tab.svg", sizes: "any", type: "image/svg+xml" },
    ],
    apple: "/images/logo_tab.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
