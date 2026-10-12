import type { Metadata } from 'next';
import { Cormorant_Garamond } from 'next/font/google';
import './romance.css';

/**
 * Mise en page de /nos-8-ans.
 *
 * On charge ici — et nulle part ailleurs — la serif d'affichage, afin que le
 * reste du site NETCY n'hérite d'aucune police supplémentaire. La sans-serif
 * du corps de texte reste celle du site (Montserrat, via `--font-sans`).
 */

const cormorant = Cormorant_Garamond({
  variable: '--font-romance-serif',
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  // La page est personnelle : on la garde hors des moteurs de recherche.
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: '/nos-8-ans' },
};

export default function NosHuitAnsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className={cormorant.variable}>{children}</div>;
}
