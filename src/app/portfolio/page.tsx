import type { Metadata } from 'next';
import PortfolioClient from './PortfolioClient';

export const metadata: Metadata = {
  title: 'Portfolio | Jung Jean-Marie - Infrastructure & Cybersécurité',
  description: 'Découvrez le portfolio de Jung Jean-Marie, étudiant en BTS SIO SISR et fondateur de NETCY. Projets de cybersécurité, réseau, et développement web.',
  openGraph: {
    title: 'Portfolio | Jung Jean-Marie - Infrastructure & Cybersécurité',
    description: 'Découvrez le portfolio de Jung Jean-Marie, étudiant en BTS SIO SISR et fondateur de NETCY. Projets de cybersécurité, réseau, et développement web.',
    type: 'profile',
    url: 'https://netcy.fr/portfolio',
    images: [
      {
        url: '/images/logo_netcy.svg',
        width: 1200,
        height: 630,
        alt: 'Portfolio Jung Jean-Marie - NETCY',
      },
    ],
  },
};

export default function PortfolioPage() {
  return <PortfolioClient />;
}
