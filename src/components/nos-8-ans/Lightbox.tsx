'use client';

/**
 * Visionneuse photo — élégante, discrète, et accessible au clavier.
 *
 * · Échap ferme · ← → naviguent · clic sur le fond ferme
 * · le focus part sur le bouton de fermeture et revient ensuite à la photo
 * · le défilement de la page est gelé pendant l'ouverture
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Photo } from '@/data/nos-8-ans';

/* ───────────────────────── Contexte ───────────────────────── */

interface LightboxValue {
  /** Ouvre la visionneuse sur une photo donnée (par son `src`). */
  open: (src: string) => void;
}

const LightboxContext = createContext<LightboxValue>({ open: () => {} });

export function useLightbox() {
  return useContext(LightboxContext);
}

/* ───────────────────────── Fournisseur ───────────────────────── */

export function LightboxProvider({
  photos,
  children,
}: {
  /** Toutes les photos de la page, dans l'ordre de lecture. */
  photos: Photo[];
  children: React.ReactNode;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  const open = useCallback(
    (src: string) => {
      const i = photos.findIndex((p) => p.src === src);
      if (i === -1) return;
      restoreRef.current = document.activeElement as HTMLElement | null;
      setIndex(i);
    },
    [photos]
  );

  const close = useCallback(() => {
    setIndex(null);
    // Rend le focus à la vignette d'où l'on vient.
    requestAnimationFrame(() => restoreRef.current?.focus?.());
  }, []);

  const step = useCallback(
    (dir: 1 | -1) => {
      setIndex((cur) => (cur === null ? cur : (cur + dir + photos.length) % photos.length));
    },
    [photos.length]
  );

  /* Clavier + verrou de défilement */
  useEffect(() => {
    if (index === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        step(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        step(-1);
      }
    };

    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 60);

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(t);
    };
  }, [index, close, step]);

  const value = useMemo<LightboxValue>(() => ({ open }), [open]);
  const photo = index === null ? null : photos[index];

  return (
    <LightboxContext.Provider value={value}>
      {children}

      <AnimatePresence>
        {photo && (
          <motion.div
            className="fixed inset-0 z-[120] flex flex-col items-center justify-center p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-label="Photo agrandie"
          >
            {/* Fond */}
            <button
              type="button"
              aria-label="Fermer la photo"
              onClick={close}
              className="absolute inset-0 cursor-default bg-[#0d241d]/92 backdrop-blur-xl"
              tabIndex={-1}
            />

            {/* Photo */}
            <motion.figure
              key={photo.src}
              className="relative z-10 flex max-h-full w-full max-w-5xl flex-col items-center gap-4"
              initial={reduce ? false : { opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative max-h-[76vh] w-full overflow-hidden rounded-[2px] bg-[#0d241d]">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={1600}
                  height={1600}
                  sizes="(max-width: 1024px) 94vw, 1024px"
                  className="max-h-[76vh] w-full object-contain"
                  priority
                />
              </div>
              <figcaption className="r-on-dark max-w-xl text-center text-[0.8125rem] leading-relaxed text-[#e8c8cd]/80">
                {photo.caption ?? photo.alt}
                <span className="mt-1 block text-[0.6875rem] tracking-[0.2em] text-[#d8c4ad]/50">
                  {index !== null ? `${index + 1} / ${photos.length}` : ''}
                </span>
              </figcaption>
            </motion.figure>

            {/* Commandes */}
            <button
              ref={closeBtnRef}
              type="button"
              onClick={close}
              aria-label="Fermer"
              className="r-on-dark absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full border border-[#e8c8cd]/25 bg-[#0d241d]/60 text-[#fff9f2] transition hover:border-[#e8c8cd]/60 hover:bg-[#0d241d]/90 sm:right-8 sm:top-8"
            >
              <X size={18} strokeWidth={1.5} />
            </button>

            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Photo précédente"
                  className="r-on-dark absolute left-2 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[#e8c8cd]/20 bg-[#0d241d]/50 text-[#fff9f2] transition hover:border-[#e8c8cd]/60 sm:left-6"
                >
                  <ChevronLeft size={20} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Photo suivante"
                  className="r-on-dark absolute right-2 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[#e8c8cd]/20 bg-[#0d241d]/50 text-[#fff9f2] transition hover:border-[#e8c8cd]/60 sm:right-6"
                >
                  <ChevronRight size={20} strokeWidth={1.5} />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </LightboxContext.Provider>
  );
}
