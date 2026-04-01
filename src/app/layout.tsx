import type { Metadata, Viewport } from "next";
import { Manrope, Montserrat, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import CookieBanner from "@/components/CookieBanner";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://netcy.fr'),
  title: {
    default: "NETCY",
    template: "%s | NETCY"
  },
  description: "Création sites web sécurisés à Montpellier. NETCY : développement Next.js/React, cybersécurité réseau & maintenance PME. Devis gratuit !",
  keywords: [
    "NETCY",
    "Netcy",
    "netcy",
    "création site internet Montpellier",
    "développeur web Montpellier",
    "site web sécurisé",
    "cybersécurité réseau",
    "BTS SIO SISR Montpellier",
    "Jung Jean-Marie",
    "développement Next.js",
    "React TypeScript",
    "sécurité réseau PME",
    "maintenance site web",
    "RGPD conformité",
    "création site vitrine",
    "site e-commerce sécurisé",
    "développeur full stack",
    "infrastructure réseau",
    "audit sécurité",
    "hébergement sécurisé"
  ],
  authors: [{ name: "Jung Jean-Marie", url: "https://netcy.fr" }],
  creator: "NETCY - Jung Jean-Marie",
  publisher: "NETCY",
  applicationName: "NETCY",
  category: "Technology",
  classification: "Web Development & Cybersecurity",
  icons: {
    icon: [
      { url: "/images/logo_tab.png", sizes: "32x32", type: "image/png" },
      { url: "/images/logo_tab.svg", sizes: "any", type: "image/svg+xml" },
    ],
    apple: "/images/logo_tab.png",
    shortcut: "/images/logo_tab.png",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://netcy.fr",
    siteName: "NETCY",
    title: "NETCY - Création de Sites Internet Sécurisé & Cybersécurité Réseau",
    description: "Création sites web sécurisés à Montpellier. NETCY : développement Next.js/React, cybersécurité réseau & maintenance PME. Devis gratuit !",
    images: [
      {
        url: "/images/logo_netcy_b.png",
        width: 1200,
        height: 630,
        alt: "NETCY - Network Cybersecurity",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NETCY - Création de Sites Internet Sécurisé & Cybersécurité Réseau",
    description: "Création sites web sécurisés à Montpellier. NETCY : développement Next.js/React, cybersécurité réseau & maintenance PME. Devis gratuit !",
    images: ["/images/logo_netcy_b.png"],
    creator: "@netcy",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://netcy.fr",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8F9FA' },
    { media: '(prefers-color-scheme: dark)', color: '#131314' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${montserrat.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange={false}>
          {children}
          <ThemeToggle />
          <CookieBanner />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
