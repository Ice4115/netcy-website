'use client';

/**
 * Petals — une poignée de pétales qui tombent, UNE SEULE FOIS, à un seul
 * moment : lorsque la lettre finale entre à l'écran.
 *
 * Ce n'est pas une pluie permanente : seize pétales, puis plus rien.
 * Valeurs déterministes (pas de `Math.random`) → pas d'écart serveur/client.
 * Désactivé si l'utilisatrice préfère un mouvement réduit (cf. romance.css).
 */

import { useEffect, useRef, useState } from 'react';
import { noise } from './bouquet-geometry';

const COLORS = ['#e8c8cd', '#f6e3e6', '#b5122a', '#d8c4ad', '#cb2840'];
const COUNT = 16;

const PETALS = Array.from({ length: COUNT }, (_, i) => ({
  left: 4 + noise(i * 1.7) * 92,
  dx: (noise(i * 2.3) - 0.5) * 220,
  spin: 160 + noise(i * 3.1) * 420,
  dur: 7.5 + noise(i * 4.7) * 6,
  delay: noise(i * 5.3) * 3.4,
  scale: 0.55 + noise(i * 6.1) * 0.85,
  color: COLORS[i % COLORS.length],
  opacity: 0.45 + noise(i * 7.9) * 0.45,
}));

export default function Petals() {
  const ref = useRef<HTMLDivElement>(null);
  const [fallen, setFallen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFallen(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {fallen &&
        PETALS.map((p, i) => (
          <span
            key={i}
            className="r-petal"
            style={
              {
                left: `${p.left}%`,
                background: p.color,
                opacity: p.opacity,
                '--dx': `${p.dx}px`,
                '--spin': `${p.spin}deg`,
                '--dur': `${p.dur}s`,
                '--delay': `${p.delay}s`,
                '--scale': p.scale,
              } as React.CSSProperties
            }
          />
        ))}
    </div>
  );
}
