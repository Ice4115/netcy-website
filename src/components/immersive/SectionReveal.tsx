'use client';

import { ReactNode, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'motion/react';

type Props = {
  children: ReactNode;
  className?: string;
  id?: string;
  intensity?: 'soft' | 'default' | 'strong';
};

export default function SectionReveal({ children, className = '', id, intensity = 'default' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  });

  const yMap = { soft: 40, default: 70, strong: 110 }[intensity];

  const rawY = useTransform(scrollYProgress, [0, 1], [yMap, 0]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.6, 1]);
  const rawScale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);

  const y = useSpring(rawY, { stiffness: 90, damping: 22, mass: 0.5 });
  const opacity = useSpring(rawOpacity, { stiffness: 120, damping: 26 });
  const scale = useSpring(rawScale, { stiffness: 90, damping: 22, mass: 0.5 });

  if (reduce) {
    return (
      <section id={id} ref={ref} className={className}>
        {children}
      </section>
    );
  }

  return (
    <motion.section id={id} ref={ref} className={className} style={{ y, opacity, scale }}>
      {children}
    </motion.section>
  );
}
