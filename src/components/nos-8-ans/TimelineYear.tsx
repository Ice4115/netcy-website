'use client';

/**
 * TimelineYear — une étape de la chronologie.
 *
 * Quatre compositions alternées (`photo-left`, `photo-right`, `duo`, `wide`)
 * pour que la page reste riche sans jamais devenir chargée.
 *
 * Astuce de mise en page : sur grand écran, la grille place le titre et le
 * texte dans deux lignes d'une même colonne, la photo occupant la colonne
 * voisine sur les deux lignes. Sur mobile, le flux redevient naturel —
 * titre, puis photo, puis texte — sans aucun débordement horizontal.
 */

import type { Year, YearLayout } from '@/data/nos-8-ans';
import PhotoFrame from './PhotoFrame';
import { Reveal, RevealWords } from './RevealText';

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

/* Placement des trois blocs selon la composition. */
const SLOTS: Record<
  YearLayout,
  { header: string; photos: string; body: string }
> = {
  'photo-left': {
    header: 'lg:col-span-5 lg:col-start-8 lg:row-start-1',
    photos: 'lg:col-span-6 lg:col-start-1 lg:row-start-1 lg:row-span-2',
    body: 'lg:col-span-5 lg:col-start-8 lg:row-start-2',
  },
  'photo-right': {
    header: 'lg:col-span-5 lg:col-start-1 lg:row-start-1',
    photos: 'lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:row-span-2',
    body: 'lg:col-span-5 lg:col-start-1 lg:row-start-2',
  },
  duo: {
    header: 'lg:col-span-4 lg:col-start-1 lg:row-start-1',
    photos: 'lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:row-span-2',
    body: 'lg:col-span-4 lg:col-start-1 lg:row-start-2',
  },
  wide: {
    header: 'lg:col-span-7 lg:col-start-1 lg:row-start-1',
    photos: 'lg:col-span-12 lg:col-start-1 lg:row-start-2',
    body: 'lg:col-span-5 lg:col-start-8 lg:row-start-3',
  },
};

const SIZES: Record<YearLayout, string> = {
  'photo-left': '(max-width: 1024px) 92vw, 600px',
  'photo-right': '(max-width: 1024px) 92vw, 600px',
  duo: '(max-width: 640px) 88vw, (max-width: 1024px) 44vw, 340px',
  wide: '(max-width: 1024px) 94vw, 896px',
};

export default function TimelineYear({ year }: { year: Year }) {
  const layout: YearLayout = year.layout ?? 'photo-left';
  const slots = SLOTS[layout];
  const ghostRight = layout !== 'photo-left';

  return (
    <section
      id={`annee-${year.index}`}
      data-year={year.index}
      aria-label={`Année ${year.index} — ${year.title}`}
      className="relative scroll-mt-24 py-16 sm:py-20 lg:py-28"
    >
      {/* Chiffre en filigrane — repère visuel propre à chaque année. */}
      <span
        aria-hidden="true"
        className={`r-ghost-number pointer-events-none absolute -top-10 select-none text-[28vw] text-[color:var(--r-forest)] opacity-[0.055] lg:-top-24 lg:text-[13rem] ${
          ghostRight ? 'right-0' : 'left-0'
        }`}
      >
        {year.index}
      </span>

      {/* Repère sur le filet vertical (grand écran). */}
      <div
        aria-hidden="true"
        className="absolute left-[-3.25rem] top-[7.25rem] hidden items-center gap-3 lg:flex"
      >
        <span className="grid h-[11px] w-[11px] place-items-center rounded-full border border-[color:var(--r-sage)] bg-[color:var(--r-ivory)]">
          <span className="h-[3px] w-[3px] rounded-full bg-[color:var(--r-red)]" />
        </span>
      </div>

      {/* `auto_1fr` + `items-start` : sans cela, une photo qui occupe les deux
            lignes redistribue sa hauteur sur chacune, et le texte se retrouve
            décroché très bas sous le titre. */}
      <div className="relative grid grid-cols-1 items-start gap-y-8 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:gap-y-6">
        {/* ── Titre ── */}
        <header className={`order-1 lg:order-none ${slots.header}`}>
          <Reveal y={16}>
            <p className="r-eyebrow flex items-center gap-3 text-[color:var(--r-red)]">
              <span className="inline-block h-px w-7 bg-[color:var(--r-red)]/45" />
              {year.period}
              <span className="font-[family-name:var(--r-serif)] text-[0.9rem] tracking-normal text-[color:var(--r-sage)]">
                {ROMAN[year.index]}
              </span>
            </p>
          </Reveal>
          <RevealWords
            as="h2"
            text={year.title}
            className="r-serif mt-3 text-balance text-[2rem] leading-[1.08] text-[color:var(--r-forest)] sm:text-[2.6rem] lg:text-[3rem]"
            stagger={0.055}
            amount={0.35}
          />
        </header>

        {/* ── Photos ── */}
        <div className={`order-2 lg:order-none ${slots.photos}`}>
          <PhotoGroup year={year} layout={layout} />
        </div>

        {/* ── Texte ── */}
        <div className={`order-3 lg:order-none ${slots.body}`}>
          <Reveal y={18} delay={0.08}>
            <p
              className="max-w-[46ch] text-[0.975rem] leading-[1.85] text-[color:var(--r-ink-soft)] sm:text-[1.0625rem]"
            >
              {year.text}
            </p>
            {process.env.NODE_ENV !== 'production' && year.isPlaceholder && (
              <p className="mt-3 inline-block rounded-sm border border-dashed border-[color:var(--r-beige)] px-2 py-1 text-[0.6875rem] uppercase tracking-[0.18em] text-[color:var(--r-sage)]">
                texte d&apos;exemple — à personnaliser
              </p>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Groupe de photos ─────────────────── */

function PhotoGroup({ year, layout }: { year: Year; layout: YearLayout }) {
  const sizes = SIZES[layout];
  const priority = year.index === 1;

  if (layout === 'duo' && year.photos.length >= 2) {
    const [a, b, ...rest] = year.photos;
    return (
      <div className="grid grid-cols-2 items-start gap-4 sm:gap-6">
        <PhotoFrame photo={a} sizes={sizes} priority={priority} parallax={22} />
        {/* La seconde photo descend légèrement : l'album respire. */}
        <div className="mt-8 sm:mt-14 lg:mt-20">
          <PhotoFrame photo={b} sizes={sizes} parallax={34} />
        </div>
        {rest.map((p) => (
          <div key={p.src} className="col-span-2 mt-2">
            <PhotoFrame photo={p} sizes={sizes} parallax={18} />
          </div>
        ))}
      </div>
    );
  }

  if (year.photos.length > 1) {
    return (
      <div className="flex flex-col gap-6 sm:gap-8">
        {year.photos.map((p, i) => (
          <PhotoFrame
            key={p.src}
            photo={p}
            sizes={sizes}
            priority={priority && i === 0}
            parallax={20 + i * 10}
            className={i % 2 === 1 ? 'sm:ml-10 lg:ml-16' : ''}
          />
        ))}
      </div>
    );
  }

  const [only] = year.photos;
  if (!only) return null;

  return (
    <PhotoFrame
      photo={only}
      sizes={sizes}
      priority={priority}
      parallax={layout === 'wide' ? 16 : 26}
      className={layout === 'wide' ? 'mx-auto max-w-4xl' : ''}
    />
  );
}
