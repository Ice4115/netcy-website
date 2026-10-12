'use client';

/**
 * Navigation et repères de lecture.
 *
 *  · `ReadingProgress` — un filet de 2 px en haut de l'écran.
 *  · `YearNav` — huit points sur le bord droit : où l'on en est, et le moyen
 *    de revenir à n'importe quelle année. Il n'apparaît que pendant l'album
 *    et s'efface au bouquet comme à la lettre finale.
 */

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import type { Year } from '@/data/nos-8-ans';
import { useMounted } from './useMounted';

/* ─────────────────── Barre de progression ─────────────────── */

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const reduce = useReducedMotion();
  const mounted = useMounted();
  const smooth = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.0008 });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left bg-gradient-to-r from-[color:var(--r-red)] via-[color:var(--r-red)] to-[color:var(--r-blush)]"
      style={{ scaleX: !mounted ? 0 : reduce ? scrollYProgress : smooth }}
    />
  );
}

/* ─────────────────── Points des années ─────────────────── */

export function YearNav({ years }: { years: Year[] }) {
  const [active, setActive] = useState<number | null>(null);

  /* Repère l'année qui traverse le milieu de l'écran. */
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-year]'));
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const n = Number(entry.target.getAttribute('data-year'));
            if (!Number.isNaN(n)) setActive(n);
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    sections.forEach((s) => io.observe(s));

    /* Au-delà de l'album (bouquet ou lettre finale), on masque la navigation. */
    const album = document.getElementById('album');
    let albumIo: IntersectionObserver | null = null;
    if (album) {
      albumIo = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) setActive(null);
        },
        { rootMargin: '-20% 0px -20% 0px', threshold: 0 }
      );
      albumIo.observe(album);
    }

    return () => {
      io.disconnect();
      albumIo?.disconnect();
    };
  }, []);

  const go = (index: number) => {
    document
      .getElementById(`annee-${index}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <AnimatePresence>
      {active !== null && (
        <motion.nav
          aria-label="Naviguer entre les années"
          className="fixed right-0 top-1/2 z-[55] -translate-y-1/2"
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 8 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <ul className="flex flex-col items-end">
            {years.map((y) => {
              const isActive = y.index === active;
              return (
                <li key={y.index}>
                  <button
                    type="button"
                    onClick={() => go(y.index)}
                    aria-label={`Aller à l'année ${y.index} : ${y.title}`}
                    aria-current={isActive ? 'true' : undefined}
                    className="group flex h-7 w-8 items-center justify-end pr-2 sm:w-11 sm:pr-3"
                  >
                    {/* Numéro révélé au survol / au focus (grand écran). */}
                    <span
                      aria-hidden="true"
                      className={`mr-2 hidden font-[family-name:var(--r-serif)] text-[0.75rem] tabular-nums transition-all duration-300 sm:block ${
                        isActive
                          ? 'text-[color:var(--r-red)] opacity-100'
                          : 'text-[color:var(--r-sage)] opacity-0 group-hover:opacity-80 group-focus-visible:opacity-100'
                      }`}
                    >
                      {y.index}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`block rounded-full transition-all duration-500 ${
                        isActive
                          ? 'h-[14px] w-[3px] bg-[color:var(--r-red)]'
                          : 'h-[3px] w-[3px] bg-[color:var(--r-sage)]/55 group-hover:bg-[color:var(--r-sage)]'
                      }`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
