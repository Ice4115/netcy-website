'use client';

/**
 * BouquetArt — le bouquet dessiné, en couches de profondeur réelles.
 *
 * Composition (d'après la description du bouquet de référence) :
 *   · une grande rose blanche au centre, soulignée d'une lumière douce
 *   · cinq roses rouges autour
 *   · quatre lys blancs
 *   · de petites fleurs blanches (gypsophile) et roses
 *   · de longues feuilles vertes élancées
 *   · un emballage papier en vert, beige et rose poudré, noué d'un ruban
 *
 * ── Profondeur ──
 * Chaque couche est un <div> absolu portant son propre <svg> (mêmes
 * coordonnées), décalé en `translateZ`. Le parent applique `preserve-3d` :
 * la rotation d'arrivée produit donc une vraie parallaxe entre les plans.
 * Il ne s'agit pas d'un modèle 3D — c'est une mise en scène de plans 2D,
 * ce qui suffit à rendre le geste crédible.
 *
 * ── Révélation ──
 * Chaque fleur est un seul <g> animé (classe `bq-bloom`), avec un délai
 * individuel : les fleurs s'ouvrent une à une. Voir `romance.css`.
 */

import { useId } from 'react';
import {
  buildGypsophila,
  buildLily,
  buildRose,
  buildSmallFlower,
  leafPath,
  noise,
} from './bouquet-geometry';

/* ───────────────────────── Palette ───────────────────────── */

const RED = ['#CB2840', '#B5122A', '#9C0F24', '#850D1E', '#6D0B18'] as const;
const IVORY = ['#FFFEFB', '#FFF9F2', '#F9EFE6', '#F0E0D7', '#E5D1CB'] as const;
const PINK = ['#F6E3E6', '#E8C8CD', '#DCB2BA', '#CC9BA6'] as const;
const GREEN_DEEP = '#183D32';
const GREEN_SAGE = '#7C927D';
const BEIGE = '#D8C4AD';

/* ─────────────────── Données de composition ─────────────────── */

type Vec = { x: number; y: number; a: number; len: number; w: number; bend: number };

/** Longues feuilles d'arrière-plan, en éventail depuis la base du bouquet. */
const BACK_LEAVES: Vec[] = [
  { x: 304, y: 476, a: -158, len: 270, w: 44, bend: -22 },
  { x: 306, y: 472, a: -135, len: 330, w: 48, bend: -30 },
  { x: 310, y: 470, a: -112, len: 400, w: 42, bend: -18 },
  { x: 312, y: 468, a: -95, len: 430, w: 38, bend: 14 },
  { x: 316, y: 468, a: -78, len: 420, w: 40, bend: -12 },
  { x: 318, y: 470, a: -58, len: 380, w: 46, bend: 26 },
  { x: 320, y: 472, a: -38, len: 330, w: 50, bend: 30 },
  { x: 322, y: 476, a: -20, len: 270, w: 44, bend: 24 },
  { x: 302, y: 478, a: -168, len: 230, w: 40, bend: -18 },
];

/** Feuilles courtes passant devant, pour fermer la composition. */
const FRONT_LEAVES: Vec[] = [
  { x: 300, y: 474, a: -142, len: 200, w: 34, bend: -16 },
  { x: 324, y: 474, a: -42, len: 205, w: 36, bend: 18 },
];

type Rose = { x: number; y: number; r: number; seed: number; delay: number };

const RED_ROSES_BACK: Rose[] = [{ x: 300, y: 184, r: 58, seed: 1, delay: 0.84 }];
const RED_ROSES_MID: Rose[] = [
  { x: 160, y: 288, r: 70, seed: 2, delay: 1.0 },
  { x: 466, y: 282, r: 68, seed: 3, delay: 1.12 },
];
const RED_ROSES_FRONT: Rose[] = [
  { x: 202, y: 452, r: 62, seed: 4, delay: 1.46 },
  { x: 424, y: 456, r: 60, seed: 5, delay: 1.58 },
];

type Lily = { x: number; y: number; r: number; rot: number; seed: number; delay: number };

const LILIES_BACK: Lily[] = [
  { x: 402, y: 150, r: 58, rot: 40, seed: 6, delay: 0.72 },
  { x: 196, y: 166, r: 50, rot: -15, seed: 7, delay: 0.78 },
];
const LILIES_MID: Lily[] = [
  { x: 82, y: 400, r: 76, rot: 12, seed: 8, delay: 1.22 },
  { x: 540, y: 410, r: 74, rot: -24, seed: 9, delay: 1.3 },
];

type Small = { x: number; y: number; r: number; seed: number; delay: number };

const PINK_BACK: Small[] = [
  { x: 238, y: 230, r: 15, seed: 10, delay: 1.34 },
  { x: 384, y: 220, r: 14, seed: 11, delay: 1.4 },
];
const PINK_FRONT: Small[] = [
  { x: 120, y: 372, r: 16, seed: 12, delay: 1.64 },
  { x: 504, y: 358, r: 15, seed: 13, delay: 1.7 },
  { x: 306, y: 494, r: 17, seed: 14, delay: 1.78 },
  { x: 166, y: 472, r: 13, seed: 15, delay: 1.84 },
  { x: 462, y: 476, r: 14, seed: 16, delay: 1.9 },
];

type Cloud = { x: number; y: number; spread: number; n: number; seed: number; delay: number };

const GYPSO_BACK: Cloud[] = [
  { x: 300, y: 92, spread: 36, n: 8, seed: 20, delay: 0.5 },
  { x: 150, y: 212, spread: 46, n: 11, seed: 21, delay: 0.58 },
  { x: 248, y: 128, spread: 40, n: 9, seed: 22, delay: 0.64 },
  { x: 516, y: 236, spread: 44, n: 10, seed: 23, delay: 0.7 },
  { x: 96, y: 300, spread: 40, n: 9, seed: 24, delay: 0.76 },
];
const GYPSO_FRONT: Cloud[] = [
  { x: 448, y: 352, spread: 40, n: 9, seed: 25, delay: 1.96 },
  { x: 340, y: 452, spread: 38, n: 9, seed: 26, delay: 2.02 },
  { x: 216, y: 514, spread: 34, n: 8, seed: 27, delay: 2.08 },
  { x: 404, y: 518, spread: 34, n: 8, seed: 28, delay: 2.14 },
];

/* ───────────────────────── Primitives ───────────────────────── */

function Leaf({ v, i, delay, ns }: { v: Vec; i: number; delay: number; ns: string }) {
  // Le limbe ne part pas du cœur du bouquet : une tige le porte d'abord.
  // Sans cela, les feuilles rayonnent d'un même point et forment une étoile.
  const a = (v.a * Math.PI) / 180;
  const sx = v.x + Math.cos(a) * v.len * 0.18;
  const sy = v.y + Math.sin(a) * v.len * 0.18;
  const { blade, midrib } = leafPath(sx, sy, v.a, v.len * 0.82, v.w, v.bend);

  return (
    <g className="bq-bloom" style={{ animationDelay: `${delay}s` }}>
      <path
        d={`M${v.x},${v.y} L${sx.toFixed(1)},${sy.toFixed(1)}`}
        fill="none"
        stroke="#3F6B55"
        strokeWidth={2.6}
        strokeLinecap="round"
      />
      <path d={blade} fill={`url(#${ns}-leaf${i % 2})`} />
      <path d={midrib} fill="none" stroke={GREEN_DEEP} strokeOpacity={0.32} strokeWidth={1.1} />
    </g>
  );
}

function Stem({ d }: { d: string }) {
  return <path d={d} fill="none" stroke="#4A6B57" strokeWidth={3.4} strokeLinecap="round" opacity={0.85} />;
}

function RedRose({ rose, ns }: { rose: Rose; ns: string }) {
  const petals = buildRose(rose.x, rose.y, rose.r, rose.seed);
  return (
    <g className="bq-bloom" style={{ animationDelay: `${rose.delay}s` }}>
      <ellipse
        cx={rose.x}
        cy={rose.y + rose.r * 0.22}
        rx={rose.r * 0.95}
        ry={rose.r * 0.8}
        fill={RED[4]}
        opacity={0.5}
      />
      {petals.map((p) => (
        <path
          key={p.key}
          d={p.d}
          fill={RED[p.shade]}
          stroke={RED[4]}
          strokeOpacity={0.55}
          strokeWidth={1}
        />
      ))}
      {/* Reflet satiné sur les pétales hauts */}
      <ellipse
        cx={rose.x - rose.r * 0.28}
        cy={rose.y - rose.r * 0.42}
        rx={rose.r * 0.34}
        ry={rose.r * 0.18}
        fill={`url(#${ns}-sheen)`}
        opacity={0.5}
        transform={`rotate(-24 ${rose.x - rose.r * 0.28} ${rose.y - rose.r * 0.42})`}
      />
    </g>
  );
}

function WhiteRose({ x, y, r, ns, delay }: { x: number; y: number; r: number; ns: string; delay: number }) {
  const petals = buildRose(x, y, r, 42);
  return (
    <g className="bq-bloom-soft" style={{ animationDelay: `${delay}s` }}>
      <ellipse cx={x} cy={y + r * 0.2} rx={r * 0.98} ry={r * 0.84} fill={IVORY[4]} opacity={0.55} />
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
      {/* Ombre portée douce dans le cœur, pour éviter l'effet « papier plat » */}
      <circle cx={x} cy={y} r={r * 0.26} fill={`url(#${ns}-coreShade)`} opacity={0.4} />
      <ellipse
        cx={x - r * 0.3}
        cy={y - r * 0.4}
        rx={r * 0.4}
        ry={r * 0.22}
        fill={`url(#${ns}-sheen)`}
        opacity={0.75}
        transform={`rotate(-22 ${x - r * 0.3} ${y - r * 0.4})`}
      />
    </g>
  );
}

function LilyFlower({ lily, ns }: { lily: Lily; ns: string }) {
  const { tepals, stamens } = buildLily(lily.x, lily.y, lily.r, lily.rot, lily.seed);
  return (
    <g className="bq-bloom" style={{ animationDelay: `${lily.delay}s` }}>
      {tepals.map((t) => (
        <g key={t.key}>
          <path d={t.d} fill={`url(#${ns}-lily)`} stroke="#E3D3CD" strokeOpacity={0.6} strokeWidth={0.7} />
          <path d={t.vein} fill="none" stroke={PINK[2]} strokeOpacity={0.35} strokeWidth={1} />
        </g>
      ))}
      <circle cx={lily.x} cy={lily.y} r={lily.r * 0.16} fill="#F6EADF" />
      {stamens.map((s) => (
        <g key={s.key}>
          <path d={s.line} fill="none" stroke="#C9B894" strokeWidth={1.3} strokeLinecap="round" />
          <ellipse
            cx={s.anther[0]}
            cy={s.anther[1]}
            rx={lily.r * 0.075}
            ry={lily.r * 0.045}
            fill="#B98F4A"
          />
        </g>
      ))}
    </g>
  );
}

function PinkFlower({ s }: { s: Small }) {
  const petals = buildSmallFlower(s.x, s.y, s.r, s.seed);
  return (
    <g className="bq-bloom" style={{ animationDelay: `${s.delay}s` }}>
      {petals.map((d, i) => (
        <path key={i} d={d} fill={i % 2 ? PINK[1] : PINK[0]} stroke={PINK[3]} strokeOpacity={0.4} strokeWidth={0.6} />
      ))}
      <circle cx={s.x} cy={s.y} r={s.r * 0.26} fill={BEIGE} />
    </g>
  );
}

function GypsoCloud({ c }: { c: Cloud }) {
  const florets = buildGypsophila(c.x, c.y, c.spread, c.n, c.seed);
  return (
    <g className="bq-bloom" style={{ animationDelay: `${c.delay}s` }}>
      {florets.map((fl) => (
        <path key={`${fl.key}-s`} d={fl.stem} fill="none" stroke={GREEN_SAGE} strokeOpacity={0.28} strokeWidth={0.7} />
      ))}
      {florets.map((fl) => (
        <g key={fl.key}>
          <circle cx={fl.cx} cy={fl.cy} r={fl.r} fill="#FFFDF8" />
          <circle cx={fl.cx} cy={fl.cy} r={fl.r * 0.3} fill={BEIGE} opacity={0.7} />
        </g>
      ))}
    </g>
  );
}

/* ───────────────────────── Emballage ───────────────────────── */

function Wrapping({ ns }: { ns: string }) {
  /**
   * Cornet de papier. Les arêtes sont des courbes, jamais des segments :
   * du papier qui descend vers la main se galbe, il ne plie pas en origami.
   * Le bord supérieur « s'affaisse » au centre — c'est le bord le plus proche
   * du regard, les coins du papier remontent sur les côtés.
   */
  const panels = [
    { d: 'M64,430 Q118,476 175,512 C196,606 262,712 311,797 C258,676 150,520 64,430 Z', fill: `url(#${ns}-wrapBeige)` },
    { d: 'M175,512 Q242,536 310,548 C312,620 312,710 311,797 C262,712 196,606 175,512 Z', fill: `url(#${ns}-wrapSage)` },
    { d: 'M310,548 Q378,538 445,512 C426,606 362,712 311,797 C312,710 312,620 310,548 Z', fill: `url(#${ns}-wrapPink)` },
    { d: 'M445,512 Q502,478 556,438 C470,524 364,672 311,797 C362,712 426,606 445,512 Z', fill: `url(#${ns}-wrapGreen)` },
  ];

  return (
    <g className="bq-bloom" style={{ animationDelay: '0.14s' }}>
      {/* Doublure sombre : creuse le cornet et détache le papier du fond. */}
      <path
        d="M58,424 Q310,556 562,432 C500,540 384,696 317,801 L305,801 C238,696 120,540 58,424 Z"
        fill={GREEN_DEEP}
        opacity={0.5}
      />

      {panels.map((p, i) => (
        <path key={i} d={p.d} fill={p.fill} />
      ))}

      {/* Plis — ils suivent exactement les arêtes des panneaux. */}
      <path d="M175,512 C196,606 262,712 311,797" stroke={GREEN_DEEP} strokeOpacity={0.16} strokeWidth={1.1} fill="none" />
      <path d="M310,548 C312,620 312,710 311,797" stroke={GREEN_DEEP} strokeOpacity={0.12} strokeWidth={1.1} fill="none" />
      <path d="M445,512 C426,606 362,712 311,797" stroke={GREEN_DEEP} strokeOpacity={0.16} strokeWidth={1.1} fill="none" />

      {/* Ombre interne sous les fleurs. */}
      <path
        d="M64,430 Q175,512 310,548 Q445,512 556,438 C470,538 390,580 310,580 C230,580 150,538 64,430 Z"
        fill={GREEN_DEEP}
        opacity={0.14}
      />

      {/* Liseré lumineux sur le bord du papier. */}
      <path
        d="M64,430 Q118,476 175,512 Q242,536 310,548 Q378,538 445,512 Q502,478 556,438"
        fill="none"
        stroke="#FFF9F2"
        strokeOpacity={0.5}
        strokeWidth={2}
        strokeLinecap="round"
      />

      {/* Ruban de satin, noué bas. */}
      <g className="bq-bloom" style={{ animationDelay: '0.46s' }}>
        <path d="M268,692 Q290,734 276,792 Q266,738 252,706 Z" fill={PINK[2]} opacity={0.92} />
        <path d="M352,692 Q374,736 358,794 Q358,738 338,706 Z" fill={PINK[2]} opacity={0.92} />
        <path d="M232,634 Q312,676 392,638 L398,672 Q312,710 226,668 Z" fill={`url(#${ns}-ribbon)`} />
        <path
          d="M232,634 Q312,676 392,638"
          fill="none"
          stroke="#FFF9F2"
          strokeOpacity={0.55}
          strokeWidth={1.4}
        />
      </g>
    </g>
  );
}

/* ───────────────────────── Dégradés ───────────────────────── */

function Defs({ ns }: { ns: string }) {
  return (
    <defs>
      <linearGradient id={`${ns}-leaf0`} x1="0" y1="1" x2="0.4" y2="0">
        <stop offset="0%" stopColor={GREEN_DEEP} />
        <stop offset="70%" stopColor="#3F6B55" />
        <stop offset="100%" stopColor={GREEN_SAGE} />
      </linearGradient>
      <linearGradient id={`${ns}-leaf1`} x1="0" y1="1" x2="0.4" y2="0">
        <stop offset="0%" stopColor="#123028" />
        <stop offset="65%" stopColor="#355C49" />
        <stop offset="100%" stopColor="#6E8871" />
      </linearGradient>
      <radialGradient id={`${ns}-lily`} cx="0.5" cy="0.5" r="0.6">
        <stop offset="0%" stopColor="#F7E9D9" />
        <stop offset="45%" stopColor={IVORY[1]} />
        <stop offset="100%" stopColor={IVORY[0]} />
      </radialGradient>
      <radialGradient id={`${ns}-sheen`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.85} />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
      </radialGradient>
      <radialGradient id={`${ns}-coreShade`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="#C9A9A0" stopOpacity={0.55} />
        <stop offset="100%" stopColor="#C9A9A0" stopOpacity={0} />
      </radialGradient>
      <radialGradient id={`${ns}-halo`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="#FFF4E2" stopOpacity={0.5} />
        <stop offset="42%" stopColor="#FFE9CE" stopOpacity={0.18} />
        <stop offset="100%" stopColor="#FFE9CE" stopOpacity={0} />
      </radialGradient>
      <linearGradient id={`${ns}-wrapBeige`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#EADCC8" />
        <stop offset="100%" stopColor="#9C8569" />
      </linearGradient>
      <linearGradient id={`${ns}-wrapSage`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#9DB09C" />
        <stop offset="100%" stopColor="#3C5748" />
      </linearGradient>
      <linearGradient id={`${ns}-wrapPink`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F0D7DB" />
        <stop offset="100%" stopColor="#9E7B80" />
      </linearGradient>
      <linearGradient id={`${ns}-wrapGreen`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#92A794" />
        <stop offset="100%" stopColor="#3E5E4D" />
      </linearGradient>
      <linearGradient id={`${ns}-ribbon`} x1="0" y1="0" x2="1" y2="0.4">
        <stop offset="0%" stopColor="#D8B3BA" />
        <stop offset="45%" stopColor="#F6E3E6" />
        <stop offset="100%" stopColor="#C89BA5" />
      </linearGradient>
    </defs>
  );
}

/* ─────────────────────── Couche de profondeur ─────────────────────── */

function Layer({
  z,
  children,
  ns,
}: {
  z: number;
  children: React.ReactNode;
  ns: string;
}) {
  return (
    <div
      className="absolute inset-0"
      style={{ transform: `translateZ(${z}px)`, transformStyle: 'preserve-3d' }}
    >
      <svg
        viewBox="0 0 620 820"
        className="h-full w-full overflow-visible"
        aria-hidden="true"
        focusable="false"
      >
        <Defs ns={ns} />
        {children}
      </svg>
    </div>
  );
}

/* ───────────────────────── Composant ───────────────────────── */

export default function BouquetArt({ className = '' }: { className?: string }) {
  const raw = useId();
  // useId produit des caractères (« : ») invalides dans une référence url(#…).
  const ns = `bq${raw.replace(/[^a-zA-Z0-9]/g, '')}`;

  /** Quelques tiges visibles entre les fleurs et le papier. */
  const stems = [0, 1, 2, 3, 4].map((i) => {
    const x = 240 + i * 36 + noise(i * 3) * 10;
    return `M${x.toFixed(1)},${(430 + noise(i) * 14).toFixed(1)} Q${(x + (noise(i + 9) - 0.5) * 24).toFixed(
      1
    )},${(470).toFixed(1)} ${(305 + (x - 305) * 0.35).toFixed(1)},${(500).toFixed(1)}`;
  });

  return (
    <div
      className={`relative ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
      role="img"
      aria-label="Bouquet de roses rouges, de lys et de fleurs blanches autour d'une grande rose blanche, dans un emballage vert et rose poudré"
    >
      {/* ── Halo lumineux, derrière tout ── */}
      <Layer z={-110} ns={ns}>
        <circle
          cx={310}
          cy={320}
          r={290}
          fill={`url(#${ns}-halo)`}
          className="bq-bloom-soft"
          style={{ animationDelay: '0.1s' }}
        />
      </Layer>

      {/* ── Feuillage arrière ── */}
      <Layer z={-88} ns={ns}>
        {BACK_LEAVES.map((v, i) => (
          <Leaf key={i} v={v} i={i} delay={0.18 + i * 0.085} ns={ns} />
        ))}
      </Layer>

      {/* ── Fleurs du fond ── */}
      <Layer z={-52} ns={ns}>
        {GYPSO_BACK.map((c) => (
          <GypsoCloud key={c.seed} c={c} />
        ))}
        {LILIES_BACK.map((l) => (
          <LilyFlower key={l.seed} lily={l} ns={ns} />
        ))}
        {RED_ROSES_BACK.map((r) => (
          <RedRose key={r.seed} rose={r} ns={ns} />
        ))}
        {PINK_BACK.map((s) => (
          <PinkFlower key={s.seed} s={s} />
        ))}
      </Layer>

      {/* ── Roses latérales et lys ── */}
      <Layer z={-18} ns={ns}>
        {RED_ROSES_MID.map((r) => (
          <RedRose key={r.seed} rose={r} ns={ns} />
        ))}
        {LILIES_MID.map((l) => (
          <LilyFlower key={l.seed} lily={l} ns={ns} />
        ))}
      </Layer>

      {/* ── Tiges + emballage ── */}
      <Layer z={0} ns={ns}>
        <g className="bq-bloom" style={{ animationDelay: '0.3s' }}>
          {stems.map((d, i) => (
            <Stem key={i} d={d} />
          ))}
        </g>
        <Wrapping ns={ns} />
      </Layer>

      {/* ── Rose blanche centrale, le point focal ── */}
      <Layer z={34} ns={ns}>
        <WhiteRose x={310} y={330} r={104} ns={ns} delay={1.42} />
      </Layer>

      {/* ── Lumière qui souligne la rose blanche ── */}
      <Layer z={46} ns={ns}>
        <g className="bq-glow" style={{ animationDelay: '2.3s' }}>
          <circle cx={310} cy={322} r={186} fill={`url(#${ns}-halo)`} />
          <circle cx={302} cy={300} r={96} fill={`url(#${ns}-sheen)`} opacity={0.3} />
        </g>
      </Layer>

      {/* ── Fleurs de premier plan ── */}
      <Layer z={62} ns={ns}>
        {RED_ROSES_FRONT.map((r) => (
          <RedRose key={r.seed} rose={r} ns={ns} />
        ))}
        {PINK_FRONT.map((s) => (
          <PinkFlower key={s.seed} s={s} />
        ))}
        {GYPSO_FRONT.map((c) => (
          <GypsoCloud key={c.seed} c={c} />
        ))}
      </Layer>

      {/* ── Feuilles traversant devant ── */}
      <Layer z={84} ns={ns}>
        {FRONT_LEAVES.map((v, i) => (
          <Leaf key={i} v={v} i={i + 1} delay={1.1 + i * 0.12} ns={ns} />
        ))}
      </Layer>
    </div>
  );
}
