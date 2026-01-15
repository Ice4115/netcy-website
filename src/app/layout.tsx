import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import CookieBanner from "@/components/CookieBanner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://netcy.fr'),
  title: {
    default: "NETCY - Création de Sites Internet Sécurisé & Cybersécurité Réseau | Montpellier",
    template: "%s | NETCY"
  },
  description: "NETCY : Expert en création de sites web sécurisés et cybersécurité réseau à Montpellier. Développement web moderne (Next.js, React, TypeScript), maintenance, support technique et conseil en sécurité réseau pour PME. Jung Jean-Marie, étudiant BTS SIO SISR.",
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
      { url: "/images/logo_tab.svg", sizes: "any", type: "image/svg+xml" },
    ],
    apple: "/images/logo_tab.svg",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://netcy.fr",
    siteName: "NETCY",
    title: "NETCY - Création de Sites Internet Sécurisé & Cybersécurité Réseau",
    description: "Expert en création de sites web sécurisés et cybersécurité réseau à Montpellier. Développement Next.js, React, sécurité réseau pour PME.",
    images: [
      {
        url: "/images/logo_netcy.svg",
        width: 1200,
        height: 630,
        alt: "NETCY - Network Cybersecurity",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NETCY - Création de Sites Internet Sécurisé & Cybersécurité Réseau",
    description: "Expert en création de sites web sécurisés et cybersécurité réseau à Montpellier.",
    images: ["/images/logo_netcy.svg"],
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
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <CookieBanner />
        <SpeedInsights />
      </body>
    </html>
  );
}
