'use client';

/**
 * PhotoFrame — une photo de l'album.
 *
 * · cadre discret (fine marge ivoire + ombre portée douce)
 * · légère inclinaison décorative, configurable par photo
 * · parallaxe très discrète au défilement (désactivée si mouvement réduit)
 * · cliquable / focusable pour ouvrir la visionneuse
 * · placeholder élégant tant qu'aucun fichier n'est fourni
 */

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Expand } from 'lucide-react';
import type { Photo, PhotoRatio } from '@/data/nos-8-ans';
import { useLightbox } from './Lightbox';
import WhiteRoseMark from './WhiteRoseMark';
import { useMounted } from './useMounted';

/** Gabarits nommés. Un `ratio` numérique (largeur / hauteur) les court-circuite. */
const ASPECT: Record<Exclude<PhotoRatio, number>, string> = {
  portrait: 'aspect-[9/16]',
  tall: 'aspect-[3/4]',
  square: 'aspect-square',
  landscape: 'aspect-[4/3]',
  pano: 'aspect-[2/1]',
};

/**
 * Un `ratio` chiffré donne le format exact du fichier : la photo remplit alors
 * son cadre sans la moindre coupe. Les gabarits nommés restent pratiques pour
 * une nouvelle photo dont on ne connaît pas encore les dimensions.
 */
function aspectOf(ratio: PhotoRatio): { className: string; style?: React.CSSProperties } {
  if (typeof ratio === 'number' && Number.isFinite(ratio) && ratio > 0) {
    return { className: '', style: { aspectRatio: String(ratio) } };
  }
  return { className: ASPECT[ratio as Exclude<PhotoRatio, number>] ?? ASPECT.tall };
}

export default function PhotoFrame({
  photo,
  priority = false,
  sizes = '(max-width: 768px) 92vw, (max-width: 1280px) 46vw, 560px',
  /** Amplitude de la parallaxe, en pixels. 0 pour la désactiver. */
  parallax = 26,
  className = '',
}: {
  photo: Photo;
  priority?: boolean;
  sizes?: string;
  parallax?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mounted = useMounted();
  const { open } = useLightbox();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [parallax, -parallax]);

  const tilt = photo.tilt ?? 0;
  const isPlaceholder = !photo.src;
  const aspect = aspectOf(photo.ratio);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <figure
        className="group relative"
        style={{ transform: reduce ? undefined : `rotate(${tilt}deg)` }}
      >
        {/* Cadre : liseré ivoire, comme un tirage monté sur carton. */}
        <div className="r-frame relative overflow-hidden rounded-[3px] bg-[#fffdf9] p-[6px] sm:p-[9px]">
          <div
            className={`relative overflow-hidden rounded-[2px] bg-[#f0e6da] ${aspect.className}`}
            style={aspect.style}
          >
            {isPlaceholder ? (
              <PhotoPlaceholder />
            ) : (
              <button
                type="button"
                onClick={() => open(photo.src)}
                aria-label={`Agrandir la photo : ${photo.alt}`}
                className="absolute inset-0 block h-full w-full cursor-zoom-in"
              >
                <motion.div
                  className="absolute inset-0"
                  style={
                    !reduce && mounted
                      ? { y, scale: 1.07, willChange: 'transform' }
                      : undefined
                  }
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes={sizes}
                    priority={priority}
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                    style={{ objectPosition: photo.focus ?? '50% 50%' }}
                  />
                </motion.div>

                {/* Voile très léger, pour asseoir la photo dans la page. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#221a18]/12 via-transparent to-transparent"
                />

                {/* Indice d'agrandissement, discret, au survol/focus. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full border border-white/40 bg-[#221a18]/35 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
                >
                  <Expand size={13} strokeWidth={1.6} />
                </span>
              </button>
            )}
          </div>
        </div>

        {photo.caption && (
          <figcaption className="mt-3 pl-1 text-[0.75rem] italic leading-relaxed text-[color:var(--r-ink-soft)]">
            {photo.caption}
          </figcaption>
        )}
      </figure>
    </div>
  );
}

/* ─────────────── Emplacement réservé ─────────────── */

/**
 * Affiché quand `src` est vide : un espace qui s'intègre au design plutôt
 * qu'un rectangle gris. Aucune photo d'illustration n'est inventée ici.
 */
function PhotoPlaceholder() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,#f7efe4_0%,#efe2d4_50%,#e9dbd3_100%)]">
      <div className="flex flex-col items-center gap-3 px-6 text-center">
        <WhiteRoseMark size={54} className="opacity-45" />
        <p className="r-eyebrow text-[color:var(--r-sage)]">Photo à venir</p>
      </div>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[10px] rounded-[2px] border border-dashed border-[color:var(--r-beige)]"
      />
    </div>
  );
}
