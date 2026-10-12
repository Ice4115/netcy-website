'use client';

/**
 * NosHuitAns — l'orchestration de la page.
 *
 * Déroulé : le bouquet (sombre) → trois phrases (sombre) → l'album s'ouvre
 * (ivoire) → les huit années → la lettre pour la suite (sombre).
 *
 * Le fond n'est pas peint par les sections mais par un calque fixe
 * (`.r-backdrop`) : chaque section déclare seulement sa teinte via
 * `data-tone`, et la section qui traverse le milieu de l'écran impose la
 * couleur. La transition de 900 ms donne l'impression que la page respire.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { years } from '@/data/nos-8-ans';
import { LightboxProvider } from './Lightbox';
import { ChapterHeader, Quote, WhisperLines } from './Chapter';
import Finale from './Finale';
import HeroBouquet from './HeroBouquet';
import MusicToggle from './MusicToggle';
import TimelineYear from './TimelineYear';
import { ReadingProgress, YearNav } from './YearNav';
import { useMounted } from './useMounted';

type Tone = 'dark' | 'ivory';

const BACKDROP: Record<Tone, string> = {
  dark: '#0d241d',
  ivory: '#fff9f2',
};

export default function NosHuitAns() {
  const [tone, setTone] = useState<Tone>('dark');

  /* Toutes les photos de la page, dans l'ordre de lecture : la visionneuse
     peut ainsi parcourir l'album entier au clavier. */
  const allPhotos = useMemo(() => years.flatMap((y) => y.photos), []);

  /* Le mobilier du site est masqué le temps de la visite (cf. romance.css). */
  useEffect(() => {
    const body = document.body;
    const previousBg = body.style.backgroundColor;
    body.dataset.romance = '1';
    // Évite un liseré clair en sur-défilement, aux deux extrémités sombres.
    body.style.backgroundColor = BACKDROP.dark;
    return () => {
      delete body.dataset.romance;
      body.style.backgroundColor = previousBg;
    };
  }, []);

  /* La section qui croise le milieu de l'écran décide de la teinte du fond. */
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-tone]'));
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const next = entry.target.getAttribute('data-tone');
          if (next === 'dark' || next === 'ivory') setTone(next);
        }
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <LightboxProvider photos={allPhotos}>
      {/* ── Le fond, unique et continu ── */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 transition-colors duration-[900ms] ease-out"
        style={{ backgroundColor: BACKDROP[tone] }}
      >
        <div
          className="absolute inset-0 transition-opacity duration-[1100ms] ease-out"
          style={{
            opacity: tone === 'dark' ? 1 : 0,
            background:
              'radial-gradient(120% 70% at 50% 0%, rgba(24,61,50,0.85) 0%, rgba(13,36,29,0) 60%)',
          }}
        />
      </div>

      <ReadingProgress />
      <YearNav years={years} />
      <MusicToggle />

      <div className="romance-root relative z-10">
        {/* ── Le bouquet ── */}
        <div data-tone="dark">
          <HeroBouquet />
        </div>

        {/* ── Trois phrases, encore dans le noir ── */}
        <WhisperLines />

        {/* ── L'album s'ouvre ── */}
        <ChapterHeader />

        <Timeline />

        {/* ── La lettre pour la suite ── */}
        <Finale />
      </div>
    </LightboxProvider>
  );
}

/* ─────────────────── La chronologie et son fil ─────────────────── */

function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mounted = useMounted();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 70%', 'end 85%'],
  });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      id="album"
      data-tone="ivory"
      ref={ref}
      className="r-grain relative mx-auto w-full max-w-6xl overflow-x-clip px-5 pb-10 sm:px-8 lg:px-0 lg:pl-24"
    >
      {/* Le fil vertical : discret, et qui se remplit à mesure qu'on lit. */}
      <span
        aria-hidden="true"
        className="r-thread absolute left-11 top-0 hidden h-full w-px lg:block"
      />
      <motion.span
        aria-hidden="true"
        className="absolute left-11 top-0 hidden h-full w-px origin-top bg-gradient-to-b from-[color:var(--r-red)]/45 to-[color:var(--r-red)]/10 lg:block"
        style={!reduce && mounted ? { scaleY: fill } : { scaleY: 1, opacity: 0.4 }}
      />

      {years.map((year) => (
        <div key={year.index}>
          <TimelineYear year={year} />
          {year.quoteAfter && <Quote text={year.quoteAfter} />}
        </div>
      ))}
    </div>
  );
}
