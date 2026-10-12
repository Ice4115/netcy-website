import type { Metadata, Viewport } from 'next';
import NosHuitAns from '@/components/nos-8-ans/NosHuitAns';
import { meta } from '@/data/nos-8-ans';

/**
 * /nos-8-ans — page statique, sans base de données, sans compte, sans
 * collecte de données. Tout le contenu vient de `src/data/nos-8-ans.ts`.
 */

export const metadata: Metadata = {
  // `absolute` évite le gabarit « … | NETCY » du layout racine.
  title: { absolute: meta.title },
  description: meta.description,
  robots: { index: false, follow: false, nocache: true },
  openGraph: {
    title: meta.title,
    description: meta.description,
    type: 'article',
  },
};

export const viewport: Viewport = {
  themeColor: '#0d241d',
};

export default function Page() {
  return (
    <main>
      <NosHuitAns />
    </main>
  );
}
