'use client';

/**
 * Les deux respirations du récit :
 *
 *  · `WhisperLines` — encore sur le fond sombre, juste après le bouquet :
 *    trois phrases qui se révèlent l'une après l'autre.
 *  · `ChapterHeader` — l'entrée dans l'album, sur fond ivoire, avec le fil
 *    graphique qui naît et descendra le long de la chronologie.
 */

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { chapter } from '@/data/nos-8-ans';
import { Reveal, RevealLines, RevealWords } from './RevealText';
import WhiteRoseMark from './WhiteRoseMark';
import { useMounted } from './useMounted';

/* ───────────────── Trois phrases, sur fond sombre ───────────────── */

export function WhisperLines() {
  return (
    <section
      data-tone="dark"
      className="relative px-6 py-[22svh] sm:py-[26svh]"
      aria-label="Huit ans, ce n'est pas seulement du temps"
    >
      <div className="mx-auto max-w-2xl">
        <RevealLines
          lines={chapter.lines}
          className="flex flex-col gap-7 sm:gap-9"
          lineClassName="r-serif text-balance text-[1.5rem] leading-[1.35] text-[color:var(--r-ivory)]/88 sm:text-[2rem] lg:text-[2.25rem]"
          step={0.75}
        />
        <Reveal y={10} delay={0.4} className="mt-12 flex justify-center sm:mt-16">
          <span aria-hidden="true" className="block h-px w-16 bg-[color:var(--r-blush)]/35" />
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────── Entrée dans l'album, sur ivoire ───────────────── */

export function ChapterHeader() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mounted = useMounted();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 85%', 'end 55%'],
  });
  // Le fil se tire vers le bas à mesure qu'on avance.
  const threadScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="chapitre"
      data-tone="ivory"
      ref={ref}
      className="relative scroll-mt-20 px-6 pb-10 pt-[18svh] sm:pt-[20svh]"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal y={14}>
          <p className="r-eyebrow flex items-center gap-3 text-[color:var(--r-sage)]">
            <span className="inline-block h-px w-10 bg-[color:var(--r-sage)]/50" />
            {chapter.eyebrow}
          </p>
        </Reveal>

        <RevealWords
          as="h2"
          text={chapter.title}
          className="r-serif mt-5 max-w-[20ch] text-balance text-[2.4rem] leading-[1.02] text-[color:var(--r-forest)] sm:text-[3.4rem] lg:text-[4.2rem]"
          stagger={0.07}
          amount={0.3}
        />

        <Reveal y={18} delay={0.15}>
          <p className="mt-8 max-w-[52ch] text-[1rem] leading-[1.9] text-[color:var(--r-ink-soft)] sm:text-[1.0625rem]">
            {chapter.text}
          </p>
        </Reveal>

        {/* Le fil graphique : il apparaît ici et guide tout l'album. */}
        <div className="mt-14 flex flex-col items-center sm:mt-20">
          <Reveal y={8} delay={0.1}>
            <WhiteRoseMark size={44} className="opacity-70" />
          </Reveal>
          <motion.span
            aria-hidden="true"
            className="mt-4 block h-[14svh] w-px origin-top bg-gradient-to-b from-[color:var(--r-sage)]/55 to-[color:var(--r-sage)]/15"
            style={!reduce && mounted ? { scaleY: threadScale } : undefined}
          />
        </div>
      </div>
    </section>
  );
}

/* ───────────────── Citation entre deux années ───────────────── */

export function Quote({ text }: { text: string }) {
  return (
    <div className="relative px-6 py-12 sm:py-16">
      <Reveal y={16} className="mx-auto max-w-2xl text-center">
        <span
          aria-hidden="true"
          className="mx-auto mb-6 block h-px w-10 bg-[color:var(--r-red)]/30"
        />
        <blockquote className="r-serif text-balance text-[1.25rem] italic leading-[1.5] text-[color:var(--r-forest)]/85 sm:text-[1.6rem]">
          «&nbsp;{text}&nbsp;»
        </blockquote>
        <span
          aria-hidden="true"
          className="mx-auto mt-6 block h-px w-10 bg-[color:var(--r-red)]/30"
        />
      </Reveal>
    </div>
  );
}
