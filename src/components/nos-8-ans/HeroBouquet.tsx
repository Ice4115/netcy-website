'use client';

/**
 * HeroBouquet — l'arrivée sur la page.
 *
 * Chorégraphie :
 *   0,0 s  fond sombre, lumière chaude qui se lève
 *   0,5 s  la petite phrase apparaît
 *   0,1 s→ le papier, puis les feuilles, puis les fleurs, une à une
 *   1,4 s  la grande rose blanche s'ouvre, plus lentement
 *   2,3 s  une lumière douce vient la souligner
 *   3,9 s  le bouquet se fixe, puis respire à peine
 *   ~2,6 s le titre se révèle mot par mot
 *
 * La rotation est une mise en scène de plans 2D (cf. BouquetArt) : aucune
 * géométrie 3D n'est simulée au-delà de la parallaxe entre les couches.
 */

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { intro } from '@/data/nos-8-ans';
import BouquetArt from './BouquetArt';
import { RevealWords } from './RevealText';
import { useMounted } from './useMounted';

export default function HeroBouquet() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mounted = useMounted();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Le bouquet se réduit et s'élève doucement : on « entre » dans l'album.
  const bouquetScale = useTransform(scrollYProgress, [0, 1], [1, 0.84]);
  const bouquetY = useTransform(scrollYProgress, [0, 1], [0, -52]);
  const bouquetOpacity = useTransform(scrollYProgress, [0, 0.75, 1], [1, 0.9, 0]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -90]);

  /* Les styles liés au défilement n'existent qu'après l'hydratation. */
  const scrollBound = !reduce && mounted;

  return (
    <div ref={ref} className="relative min-h-[100svh] overflow-hidden">
      {/* Lumière d'ambiance : un seul foyer chaud, pas de dégradé partout. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.4, ease: 'easeOut' }}
        style={{
          background:
            'radial-gradient(58% 48% at 50% 38%, rgba(255,233,206,0.17) 0%, rgba(255,233,206,0.06) 42%, rgba(13,36,29,0) 72%)',
        }}
      />

      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-5xl flex-col items-center justify-center gap-5 px-5 py-14 text-center sm:gap-7 sm:py-16">
        {/* ── La petite phrase ──
             Deux calques : l'extérieur suit le défilement, l'intérieur joue
             l'apparition. Un seul élément et `style` écraserait `animate`. */}
        <motion.div style={scrollBound ? { opacity: textOpacity } : undefined}>
          <motion.p
            className="r-eyebrow text-[color:var(--r-blush)]/75"
            initial={reduce ? false : { opacity: 0, y: 10, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {intro.whisper}
          </motion.p>
        </motion.div>

        {/* ── Le bouquet ── */}
        <motion.div
          className="bq-stage flex w-full items-center justify-center"
          style={
            scrollBound
              ? { scale: bouquetScale, y: bouquetY, opacity: bouquetOpacity }
              : undefined
          }
        >
          <div className="bq-rotor">
            <div className="bq-float">
              <BouquetArt className="aspect-[31/41] h-[min(44svh,400px)] max-w-[86vw] sm:h-[min(52svh,500px)] lg:h-[min(58svh,580px)]" />
            </div>
          </div>
        </motion.div>

        {/* ── Titre et invitation ── */}
        <motion.div
          className="flex flex-col items-center gap-4"
          style={scrollBound ? { opacity: textOpacity, y: textY } : undefined}
        >
          <RevealWords
            as="h1"
            text={intro.title}
            className="r-serif text-balance text-[2.6rem] leading-[0.98] text-[color:var(--r-ivory)] sm:text-[3.6rem] lg:text-[4.4rem]"
            delay={reduce ? 0 : 2.5}
            stagger={0.1}
            amount={0.1}
          />

          <motion.p
            className="max-w-[34ch] text-[0.9375rem] leading-relaxed text-[color:var(--r-ivory)]/60 sm:text-base"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: reduce ? 0 : 3.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {intro.subtitle}
          </motion.p>

          <motion.a
            href="#chapitre"
            className="group mt-2 flex flex-col items-center gap-2 text-[color:var(--r-blush)]/70 transition-colors hover:text-[color:var(--r-blush)]"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: reduce ? 0 : 3.9 }}
          >
            <span className="r-eyebrow">{intro.scrollHint}</span>
            <span aria-hidden="true" className="relative block h-9 w-px overflow-hidden">
              <span className="r-scroll-line absolute inset-0 block bg-gradient-to-b from-[color:var(--r-blush)]/80 to-transparent" />
            </span>
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}
