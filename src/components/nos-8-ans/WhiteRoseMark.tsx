'use client';

/**
 * WhiteRoseMark — la rose blanche du bouquet, isolée.
 *
 * Reprend le motif central de l'ouverture pour le réutiliser comme signature
 * graphique : ornement entre les sections, et rappel dans la section finale.
 */

import { useId } from 'react';
import { buildRose } from './bouquet-geometry';

const IVORY = ['#FFFEFB', '#FFF9F2', '#F9EFE6', '#F0E0D7', '#E5D1CB'] as const;

export default function WhiteRoseMark({
  size = 120,
  withGlow = false,
  withLeaves = false,
  className = '',
}: {
  size?: number;
  /** Ajoute le halo lumineux (section finale). */
  withGlow?: boolean;
  /** Ajoute deux feuilles sous la fleur. */
  withLeaves?: boolean;
  className?: string;
}) {
  const raw = useId();
  const ns = `wr${raw.replace(/[^a-zA-Z0-9]/g, '')}`;
  const petals = buildRose(100, 100, 74, 42);

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`${ns}-sheen`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.85} />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${ns}-core`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#C9A9A0" stopOpacity={0.5} />
          <stop offset="100%" stopColor="#C9A9A0" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${ns}-halo`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#FFF4E2" stopOpacity={0.45} />
          <stop offset="100%" stopColor="#FFE9CE" stopOpacity={0} />
        </radialGradient>
      </defs>

      {withGlow && <circle cx={100} cy={100} r={98} fill={`url(#${ns}-halo)`} />}

      {withLeaves && (
        <g>
          <path
            d="M100,150 Q62,172 30,160 Q68,176 100,166 Z"
            fill="#355C49"
          />
          <path
            d="M100,150 Q138,172 170,160 Q132,176 100,166 Z"
            fill="#183D32"
          />
        </g>
      )}

      {petals.map((p) => (
        <path
          key={p.key}
          d={p.d}
          fill={IVORY[p.shade]}
          stroke="#CBAFA7"
          strokeOpacity={0.55}
          strokeWidth={1}
        />
      ))}
      <circle cx={100} cy={100} r={19} fill={`url(#${ns}-core)`} />
      <ellipse
        cx={78}
        cy={70}
        rx={30}
        ry={16}
        fill={`url(#${ns}-sheen)`}
        opacity={0.7}
        transform="rotate(-22 78 70)"
      />
    </svg>
  );
}
