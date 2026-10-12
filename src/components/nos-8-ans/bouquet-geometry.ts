/**
 * Géométrie florale paramétrique — /nos-8-ans
 *
 * Fonctions pures qui fabriquent les tracés SVG du bouquet (pétales, feuilles,
 * rosaces). Tout est DÉTERMINISTE : aucun `Math.random`, afin que le rendu
 * serveur et le rendu client soient identiques (pas d'erreur d'hydratation).
 */

export type Pt = readonly [number, number];

const RAD = Math.PI / 180;

/** Formate un point pour un tracé SVG, en limitant les décimales. */
const f = (pt: Pt) => `${pt[0].toFixed(1)},${pt[1].toFixed(1)}`;

/**
 * Bruit pseudo-aléatoire déterministe dans [0,1).
 *
 * Volontairement construit sur des opérations ENTIÈRES (`Math.imul`, décalages
 * de bits), dont le résultat est bit-à-bit identique sur tous les moteurs JS.
 * Un `Math.sin` donnerait des derniers chiffres différents entre Node et le
 * navigateur — et donc une erreur d'hydratation sur les coordonnées SVG.
 */
export function noise(seed: number): number {
  let x = Math.imul(Math.round(seed * 1000) ^ 0x9e3779b9, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
}

/**
 * Arrondit une valeur destinée à un ATTRIBUT SVG (cx, cy, r…).
 * Les tracés passent déjà par `toFixed`, mais les attributs numériques bruts
 * doivent l'être aussi : les fonctions trigonométriques n'ont pas de précision
 * normalisée, et deux chiffres suffisent largement au rendu.
 */
const round2 = (n: number) => Math.round(n * 100) / 100;

/** Bruit déterministe centré dans [-amp, amp]. */
export function jitter(seed: number, amp: number): number {
  return (noise(seed) - 0.5) * 2 * amp;
}

/* ─────────────────────────── Pétale ─────────────────────────── */

export interface PetalOptions {
  /** Largeur relative de l'attache au centre (0 = pointe, 1 = pleine largeur). */
  base?: number;
  /** Galbe : position des poignées de courbe le long du pétale. */
  curl?: number;
  /** Largeur relative de la pointe (0 = pointue, 1 = arrondie). */
  tip?: number;
}

/**
 * Pétale orienté : attaché en (cx,cy), pointant vers `angleDeg`.
 * Deux courbes de Bézier cubiques symétriques → forme organique.
 */
export function petal(
  cx: number,
  cy: number,
  angleDeg: number,
  length: number,
  width: number,
  { base = 0.3, curl = 0.5, tip = 0.22 }: PetalOptions = {}
): string {
  const a = angleDeg * RAD;
  const ux = Math.cos(a);
  const uy = Math.sin(a);
  const nx = -uy;
  const ny = ux;
  const w = width / 2;

  const b1: Pt = [cx + nx * w * base, cy + ny * w * base];
  const b2: Pt = [cx - nx * w * base, cy - ny * w * base];
  const tx = cx + ux * length;
  const ty = cy + uy * length;
  const c1: Pt = [cx + nx * w + ux * length * curl, cy + ny * w + uy * length * curl];
  const c2: Pt = [cx - nx * w + ux * length * curl, cy - ny * w + uy * length * curl];
  const t1: Pt = [tx + nx * w * tip, ty + ny * w * tip];
  const t2: Pt = [tx - nx * w * tip, ty - ny * w * tip];

  return `M${f(b1)} C${f(c1)} ${f(t1)} ${tx.toFixed(1)},${ty.toFixed(1)} C${f(t2)} ${f(c2)} ${f(b2)} Z`;
}

/* ─────────────────────────── Feuille ─────────────────────────── */

/** Feuille lancéolée incurvée. `bend` courbe la nervure (en unités SVG). */
export function leafPath(
  cx: number,
  cy: number,
  angleDeg: number,
  length: number,
  width: number,
  bend = 0
): { blade: string; midrib: string; tip: Pt } {
  const a = angleDeg * RAD;
  const ux = Math.cos(a);
  const uy = Math.sin(a);
  const nx = -uy;
  const ny = ux;

  const tip: Pt = [cx + ux * length + nx * bend * 1.6, cy + uy * length + ny * bend * 1.6];
  const mid: Pt = [cx + ux * length * 0.48 + nx * bend, cy + uy * length * 0.48 + ny * bend];
  const s1: Pt = [mid[0] + nx * width * 0.5, mid[1] + ny * width * 0.5];
  const s2: Pt = [mid[0] - nx * width * 0.5, mid[1] - ny * width * 0.5];

  return {
    blade: `M${cx.toFixed(1)},${cy.toFixed(1)} Q${f(s1)} ${f(tip)} Q${f(s2)} ${cx.toFixed(1)},${cy.toFixed(1)} Z`,
    midrib: `M${cx.toFixed(1)},${cy.toFixed(1)} Q${f(mid)} ${f(tip)}`,
    tip,
  };
}

/* ───────────────────────── Rosace (rose) ───────────────────────── */

export interface RoseRing {
  /** Nombre de pétales sur l'anneau. */
  count: number;
  /** Longueur du pétale, relative au rayon de la rose. */
  len: number;
  /** Largeur du pétale, relative au rayon de la rose. */
  width: number;
  /** Décalage angulaire de l'anneau (degrés). */
  offset: number;
  /** Indice de teinte dans la palette (0 = extérieur clair). */
  shade: number;
  /** Galbe. */
  curl: number;
  /** Arrondi de la pointe. */
  tip: number;
}

/**
 * Anneaux d'une rose épanouie, du plus large (extérieur, derrière) au cœur
 * enroulé (devant). L'ordre de rendu suit l'ordre du tableau.
 *
 * Le point clé pour qu'une rose ressemble à une rose et non à une étoile :
 * des pétales aussi larges que longs (`width` ≈ `len`) et arrondis au bout
 * (`tip` ≈ 0,75). Ils se recouvrent assez pour faire une masse dense, mais
 * pas au point d'effacer le bord de chacun.
 *
 * Les teintes ne vont pas simplement du clair au foncé : le deuxième rang est
 * le plus lumineux (la lumière accroche là), le cœur est sombre, et la toute
 * dernière volute s'éclaircit à nouveau — sinon le centre devient un trou noir.
 */
export const ROSE_RINGS: readonly RoseRing[] = [
  { count: 9, len: 1.0, width: 1.02, offset: 0, shade: 1, curl: 0.46, tip: 0.78 },
  { count: 8, len: 0.85, width: 0.96, offset: 22, shade: 0, curl: 0.46, tip: 0.76 },
  { count: 7, len: 0.71, width: 0.9, offset: 46, shade: 2, curl: 0.45, tip: 0.74 },
  { count: 6, len: 0.57, width: 0.84, offset: 14, shade: 3, curl: 0.44, tip: 0.72 },
  { count: 5, len: 0.44, width: 0.78, offset: 38, shade: 4, curl: 0.42, tip: 0.68 },
  { count: 4, len: 0.32, width: 0.7, offset: 8, shade: 3, curl: 0.4, tip: 0.64 },
  { count: 3, len: 0.21, width: 0.6, offset: 30, shade: 2, curl: 0.38, tip: 0.58 },
];

/** Nombre de teintes disponibles dans une palette de rose. */
export const ROSE_SHADES = 5;

export interface BuiltPetal {
  d: string;
  shade: number;
  /** Clé stable pour React. */
  key: string;
}

/**
 * Construit tous les pétales d'une rose centrée sur (cx,cy).
 * `seed` fait varier légèrement chaque fleur (toujours de façon déterministe).
 */
export function buildRose(cx: number, cy: number, radius: number, seed: number): BuiltPetal[] {
  const out: BuiltPetal[] = [];

  ROSE_RINGS.forEach((ring, ri) => {
    const step = 360 / ring.count;
    for (let i = 0; i < ring.count; i += 1) {
      const s = seed * 17 + ri * 13 + i * 7;
      const angle = ring.offset + i * step + jitter(s, 7);
      const len = radius * ring.len * (1 + jitter(s + 1, 0.07));
      const wid = radius * ring.width * (1 + jitter(s + 2, 0.08));
      // Léger décentrage du cœur pour éviter l'effet « cible » parfaitement concentrique.
      const ox = jitter(seed * 3 + ri, radius * 0.035);
      const oy = jitter(seed * 5 + ri, radius * 0.035);
      // Deux pétales voisins n'ont jamais tout à fait le même ton : sans cela
      // les anneaux se lisent comme des cercles concentriques, pas des pétales.
      const shade =
        noise(s + 4) > 0.52 ? Math.min(ROSE_SHADES - 1, ring.shade + 1) : ring.shade;

      out.push({
        d: petal(cx + ox, cy + oy, angle, len, wid, {
          base: 0.26,
          curl: ring.curl,
          tip: ring.tip,
        }),
        shade,
        key: `r${ri}-${i}`,
      });
    }
  });

  return out;
}

/* ──────────────────────────── Lys ──────────────────────────── */

export interface BuiltLily {
  tepals: { d: string; vein: string; key: string }[];
  stamens: { line: string; anther: Pt; key: string }[];
}

/** Lys à six tépales effilés, étamines au centre. */
export function buildLily(
  cx: number,
  cy: number,
  radius: number,
  rotation: number,
  seed: number
): BuiltLily {
  const tepals: BuiltLily['tepals'] = [];
  const stamens: BuiltLily['stamens'] = [];

  for (let i = 0; i < 6; i += 1) {
    const s = seed * 23 + i * 11;
    const angle = rotation + i * 60 + jitter(s, 6);
    const len = radius * (i % 2 === 0 ? 1 : 0.9) * (1 + jitter(s + 1, 0.06));
    // Tépale lancéolé : large au milieu, effilé sans être une aiguille —
    // sinon le lys se lit comme une étoile.
    const wid = radius * 0.56 * (1 + jitter(s + 2, 0.1));
    tepals.push({
      d: petal(cx, cy, angle, len, wid, { base: 0.2, curl: 0.5, tip: 0.17 }),
      vein: `M${cx.toFixed(1)},${cy.toFixed(1)} L${(cx + Math.cos(angle * RAD) * len * 0.88).toFixed(1)},${(
        cy + Math.sin(angle * RAD) * len * 0.88
      ).toFixed(1)}`,
      key: `t${i}`,
    });
  }

  for (let i = 0; i < 6; i += 1) {
    const angle = rotation + 14 + i * 60;
    const a = angle * RAD;
    const l = radius * 0.46;
    const ex = cx + Math.cos(a) * l;
    const ey = cy + Math.sin(a) * l;
    stamens.push({
      line: `M${cx.toFixed(1)},${cy.toFixed(1)} Q${(cx + Math.cos(a) * l * 0.55).toFixed(1)},${(
        cy + Math.sin(a) * l * 0.55 - radius * 0.07
      ).toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}`,
      anther: [round2(ex), round2(ey)],
      key: `s${i}`,
    });
  }

  return { tepals, stamens };
}

/* ─────────────────── Petite fleur à cinq pétales ─────────────────── */

export function buildSmallFlower(
  cx: number,
  cy: number,
  radius: number,
  seed: number
): string[] {
  const out: string[] = [];
  for (let i = 0; i < 5; i += 1) {
    const s = seed * 31 + i * 9;
    const angle = i * 72 + jitter(s, 10);
    out.push(
      petal(cx, cy, angle, radius * (1 + jitter(s + 1, 0.12)), radius * 0.95, {
        base: 0.22,
        curl: 0.6,
        tip: 0.75,
      })
    );
  }
  return out;
}

/* ──────────────── Gypsophile (nuage de micro-fleurs) ──────────────── */

export interface Floret {
  cx: number;
  cy: number;
  r: number;
  stem: string;
  key: string;
}

/** Bouquet minuscule de fleurs blanches, en nuage autour de (cx,cy). */
export function buildGypsophila(
  cx: number,
  cy: number,
  spread: number,
  count: number,
  seed: number
): Floret[] {
  const out: Floret[] = [];
  for (let i = 0; i < count; i += 1) {
    const s = seed * 41 + i * 19;
    const angle = noise(s) * 360;
    const dist = (0.35 + noise(s + 1) * 0.65) * spread;
    const px = cx + Math.cos(angle * RAD) * dist;
    const py = cy + Math.sin(angle * RAD) * dist * 0.85;
    out.push({
      cx: round2(px),
      cy: round2(py),
      r: round2(2.2 + noise(s + 2) * 2.6),
      stem: `M${cx.toFixed(1)},${cy.toFixed(1)} Q${((cx + px) / 2 + jitter(s + 3, 6)).toFixed(1)},${(
        (cy + py) / 2
      ).toFixed(1)} ${px.toFixed(1)},${py.toFixed(1)}`,
      key: `g${i}`,
    });
  }
  return out;
}
