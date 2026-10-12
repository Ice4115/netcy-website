'use client';

/**
 * Révélation de texte, mot par mot ou ligne par ligne.
 *
 * Principe : on anime des GROUPES (mots ou lignes), jamais les caractères, et
 * une seule fois — le texte reste ensuite parfaitement stable à la lecture.
 * `prefers-reduced-motion` affiche tout immédiatement.
 */

import { motion, useReducedMotion, type Variants } from 'motion/react';
import type { ReactNode } from 'react';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Balises autorisées — table statique : `motion.create` ne doit jamais être
 *  appelé pendant le rendu (il créerait un composant neuf à chaque passe). */
const TAGS = {
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  span: motion.span,
  div: motion.div,
  blockquote: motion.blockquote,
} as const;

export type RevealTag = keyof typeof TAGS;

const PLAIN: Record<RevealTag, (p: { className?: string; children: ReactNode }) => ReactNode> = {
  p: ({ className, children }) => <p className={className}>{children}</p>,
  h1: ({ className, children }) => <h1 className={className}>{children}</h1>,
  h2: ({ className, children }) => <h2 className={className}>{children}</h2>,
  h3: ({ className, children }) => <h3 className={className}>{children}</h3>,
  span: ({ className, children }) => <span className={className}>{children}</span>,
  div: ({ className, children }) => <div className={className}>{children}</div>,
  blockquote: ({ className, children }) => <blockquote className={className}>{children}</blockquote>,
};

/* ─────────────── Mot par mot ─────────────── */

const container = (stagger: number, delay: number): Variants => ({
  hidden: {},
  shown: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

const wordVariants: Variants = {
  hidden: { opacity: 0, y: '0.42em' },
  shown: { opacity: 1, y: 0, transition: { duration: 0.72, ease: EASE } },
};

export function RevealWords({
  text,
  as = 'p',
  className = '',
  delay = 0,
  stagger = 0.045,
  amount = 0.5,
}: {
  text: string;
  as?: RevealTag;
  className?: string;
  delay?: number;
  stagger?: number;
  /** Part de l'élément visible nécessaire pour déclencher. */
  amount?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(' ');

  if (reduce) {
    const Plain = PLAIN[as];
    return <Plain className={className}>{text}</Plain>;
  }

  const MotionTag = TAGS[as];

  return (
    <MotionTag
      className={className}
      variants={container(stagger, delay)}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount }}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          // `clip` masque la montée du mot sans rogner les jambages.
          style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}
        >
          <motion.span variants={wordVariants} style={{ display: 'inline-block' }}>
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

/* ─────────────── Fondu simple ─────────────── */

export function Reveal({
  children,
  className = '',
  delay = 0,
  y = 22,
  amount = 0.4,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
  once?: boolean;
}) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.85, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────── Lignes successives ─────────────── */

/**
 * Plusieurs phrases qui se révèlent l'une après l'autre, comme écrites au fil
 * du temps. Chaque ligne attend que la précédente soit posée.
 */
export function RevealLines({
  lines,
  className = '',
  lineClassName = '',
  step = 0.9,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  /** Intervalle entre deux lignes, en secondes. */
  step?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <div className={className}>
      {lines.map((line, i) => (
        <RevealWords
          key={i}
          text={line}
          className={lineClassName}
          delay={reduce ? 0 : i * step}
          stagger={0.05}
          amount={0.35}
        />
      ))}
    </div>
  );
}
