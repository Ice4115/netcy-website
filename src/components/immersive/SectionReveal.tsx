'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

type Props = {
  children: ReactNode;
  className?: string;
  id?: string;
  intensity?: 'soft' | 'default' | 'strong';
};

const Y_MAP = { soft: 20, default: 32, strong: 48 } as const;

export default function SectionReveal({ children, className = '', id, intensity = 'default' }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (reduce) {
      setRevealed(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  const yOffset = Y_MAP[intensity];

  return (
    <motion.section
      id={id}
      ref={ref}
      className={className}
      style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 800px' } as React.CSSProperties}
      initial={reduce ? false : { opacity: 0, y: yOffset }}
      animate={revealed ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}
