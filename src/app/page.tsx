import type { Metadata } from 'next';
import HomeClientWrapper from './HomeClientWrapper';
import StructuredData from '@/components/StructuredData';
import SiteLoader from '@/components/loader/SiteLoader';

// Images de la carte photo décodées sous l'écran de chargement (pas de freeze au scroll).
const PRELOAD_IMAGES = [
  '/images/profile-card.webp',
  '/images/profile-mini.webp',
  '/images/iconpattern-sm.png',
  '/images/grain.webp',
];

export const metadata: Metadata = {
  title: 'NETCY - Création de Sites Internet Sécurisés & Cybersécurité',
  description: 'NETCY conçoit des sites web modernes, rapides, et sécurisés à Montpellier. Diplômé BTS SIO, spécialisé en développement Next.js/React et infrastructure réseau.',
  openGraph: {
    title: 'NETCY - Création de Sites Internet & Cybersécurité à Montpellier',
    description: 'De la création de sites internet modernes à la protection de votre infrastructure (cybersécurité). Faites confiance à l\'expertise NETCY.',
    type: 'website',
    url: 'https://netcy.fr',
    images: [
      {
        url: '/images/logo_netcy.svg',
        width: 1200,
        height: 630,
        alt: 'NETCY Montpellier - Expert web et cybersécurité',
      },
    ],
  },
};

export default function Home() {
  return (
    <>
      <SiteLoader images={PRELOAD_IMAGES} />
      <StructuredData />
      <HomeClientWrapper />
    </>
  );
}
