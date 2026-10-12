/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  NOS 8 ANS — fichier de contenu unique                               ║
 * ║  Route : /nos-8-ans                                                  ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * TOUT le texte et TOUTES les photos de la page se modifient ICI.
 * Aucun composant n'a besoin d'être touché.
 *
 * ┌─ AJOUTER / REMPLACER UNE PHOTO ─────────────────────────────────────┐
 * │ 1. Dépose le fichier dans  public/images/nos-8-ans/annee-N/         │
 * │ 2. Référence-le ci-dessous :  src: '/images/nos-8-ans/annee-N/x.jpg'│
 * │ 3. Renseigne `alt` (lu par les lecteurs d'écran) et, si tu veux,    │
 * │    `caption` (petite légende affichée sous la photo).               │
 * │ 4. `ratio` doit correspondre au format réel du fichier :            │
 * │    'portrait' (9/16) · 'tall' (3/4) · 'square' · 'landscape' (4/3)  │
 * │    · 'pano' (2/1)                                                   │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * ── À propos des textes ──
 * Les huit textes d'années sont TES mots, repris tels quels : seules
 * l'orthographe et la ponctuation ont été corrigées, sans rien reformuler.
 * Les citations entre deux années sont de courts échos de ces mêmes phrases,
 * pas des ajouts. Aucun souvenir n'a été inventé.
 *
 * Deux accords dépendent de qui écrit — vérifie-les :
 *   · année 1, « je suis tombé »   → « tombée » si tu écris au féminin
 *   · année 3, « je suis fier »    → « fière »  si tu écris au féminin
 *
 * Une année marquée `isPlaceholder: true` affiche un discret repère
 * « à personnaliser », en développement uniquement (jamais en production).
 * Aucune des huit années ne l'est aujourd'hui.
 */

/* ───────────────────────── Types ───────────────────────── */

/**
 * Format de la photo.
 *
 * · Un nom de gabarit : 'portrait' (9/16) · 'tall' (3/4) · 'square'
 *   · 'landscape' (4/3) · 'pano' (2/1). Pratique, mais la photo est recadrée
 *   si son format réel diffère.
 * · OU un nombre : largeur / hauteur. C'est ce qui est utilisé ci-dessous,
 *   avec les dimensions exactes de chaque fichier — ainsi AUCUNE de tes
 *   photos n'est rognée, pas même d'un pixel.
 *
 * Attention : certaines photos de téléphone portent une rotation EXIF. Le
 * navigateur les redresse, donc le format à indiquer est celui que tu VOIS,
 * pas celui des pixels stockés. (La photo de l'année 4 est dans ce cas.)
 */
export type PhotoRatio = 'portrait' | 'tall' | 'square' | 'landscape' | 'pano' | number;

export interface Photo {
  /** Chemin public de l'image (depuis /public). */
  src: string;
  /** Texte alternatif accessible — décris la scène simplement. */
  alt: string;
  /** Légende facultative affichée sous la photo. */
  caption?: string;
  /** Format réel du fichier : conditionne la mise en page. */
  ratio: PhotoRatio;
  /** Inclinaison décorative en degrés (-4 → 4). Laisse vide pour 0. */
  tilt?: number;
  /** Cadrage CSS (object-position) si le sujet n'est pas centré, ex. '50% 30%'. */
  focus?: string;
}

/** Mise en page de l'année. */
export type YearLayout = 'photo-left' | 'photo-right' | 'duo' | 'wide';

export interface Year {
  /** Numéro de l'année (1 → 8). */
  index: number;
  /** Date ou période, librement modifiable. */
  period: string;
  /** Titre court et évocateur. */
  title: string;
  /** Petit texte personnel (2 à 4 phrases maximum). */
  text: string;
  /** Photos de l'année. */
  photos: Photo[];
  /** Mise en page souhaitée. */
  layout?: YearLayout;
  /** Citation courte affichée APRÈS cette année (facultatif). */
  quoteAfter?: string;
  /** Repère de personnalisation affiché en dev uniquement. */
  isPlaceholder?: boolean;
}

/* ──────────────────── Textes d'ouverture ──────────────────── */

export const intro = {
  /** Petite phrase qui apparaît en premier, au-dessus du bouquet. */
  whisper: 'Pour toi, et pour nos huit années.',
  /** Grand titre. */
  title: 'Huit ans de nous.',
  /** Sous-titre. */
  subtitle:
    "Et si on prenait un instant pour revivre tout ce qui nous a menés jusqu'ici ?",
  /** Invitation à faire défiler. */
  scrollHint: 'Notre histoire commence ici',
};

/* ──────────────── Transition vers la chronologie ──────────────── */

export const chapter = {
  eyebrow: 'Chapitre premier',
  title: 'Huit années, mille souvenirs.',
  text: "Il y a des moments qu'on n'oublie pas, des petits riens qui deviennent immenses et des souvenirs qui continuent de nous faire sourire. Voici quelques morceaux de notre histoire.",
  /** Phrases révélées une à une, comme écrites au fil du temps. */
  lines: [
    "Huit ans, ce n'est pas seulement du temps.",
    "C'est tout ce qu'on a construit, tout ce qu'on a appris et tous ces instants qui n'appartiennent qu'à nous.",
    'Et au milieu de tous ces souvenirs, il y a toujours toi.',
  ],
};

/* ──────────────────────── Les 8 années ──────────────────────── */

export const years: Year[] = [
  {
    index: 1,
    period: 'Année 1',
    title: 'Le début de nous',
    layout: 'duo',
    text: "Dès le début, je suis tombé sous ton charme — et j'y suis encore. Dès le début, tu as été extraordinaire : tu m'as apporté du bonheur et de la stabilité, aussi bien émotionnellement que sentimentalement.",
    photos: [
      {
        src: '/images/nos-8-ans/annee-1/photo-1.jpg',
        alt: 'Souvenir de notre première année ensemble',
        ratio: 1908 / 4032,
        tilt: -2,
      },
      {
        src: '/images/nos-8-ans/annee-1/photo-2.jpg',
        alt: 'Deuxième souvenir de notre première année ensemble',
        ratio: 640 / 853,
        tilt: 2,
      },
    ],
    quoteAfter: "Dès le début, et j'y suis encore.",
  },
  {
    index: 2,
    period: 'Année 2',
    title: 'Nos petits rituels',
    layout: 'photo-left',
    text: "J'ai adoré nos petits rituels : prendre le bus avec toi, se retrouver au lycée pendant la récréation. Tous nos rituels, passés comme présents, je les adore.",
    photos: [
      {
        src: '/images/nos-8-ans/annee-2/photo-1.jpg',
        alt: 'Souvenir de notre deuxième année ensemble',
        ratio: 1776 / 1777,
        tilt: 2,
      },
    ],
  },
  {
    index: 3,
    period: 'Année 3',
    title: 'Grandir à deux',
    layout: 'photo-right',
    text: "Je t'ai vue grandir, seule comme à deux, et je suis fier de ce que nous sommes devenus.",
    photos: [
      {
        src: '/images/nos-8-ans/annee-3/photo-1.jpg',
        alt: 'Souvenir de notre troisième année ensemble',
        ratio: 1080 / 1440,
        tilt: -2,
      },
    ],
    quoteAfter: 'Fier de ce que nous sommes devenus.',
  },
  {
    index: 4,
    period: 'Année 4',
    title: 'Toujours choisir nous',
    layout: 'photo-left',
    text: "J'ai toujours choisi nous, et je choisirai toujours nous, contre tout. Parce que tous les deux, nous sommes plus forts.",
    photos: [
      {
        src: '/images/nos-8-ans/annee-4/photo-1.jpg',
        alt: 'Souvenir de notre quatrième année ensemble',
        // Fichier stocké en 4032 × 1960 avec une rotation EXIF : le navigateur
        // le redresse en 1960 × 4032. C'est ce format-là qu'il faut déclarer.
        ratio: 1960 / 4032,
        tilt: -2,
      },
    ],
  },
  {
    index: 5,
    period: 'Année 5',
    title: 'Gravés pour toujours',
    layout: 'wide',
    text: 'Tous nos souvenirs sont gravés dans ma mémoire, pour toujours et à jamais.',
    photos: [
      {
        src: '/images/nos-8-ans/annee-5/photo-1.jpg',
        alt: 'Souvenir de notre cinquième année ensemble',
        ratio: 3648 / 2736,
      },
    ],
    quoteAfter: 'Pour toujours et à jamais.',
  },
  {
    index: 6,
    period: 'Année 6',
    title: 'Une évidence',
    layout: 'photo-right',
    text: "Après ces six ans, tu restes une évidence pour moi, et je ne vois pas comment vivre sans toi.",
    photos: [
      {
        src: '/images/nos-8-ans/annee-6/photo-1.jpg',
        alt: 'Souvenir de notre sixième année ensemble',
        ratio: 900 / 1600,
        tilt: 2,
      },
    ],
  },
  {
    index: 7,
    period: 'Année 7',
    title: 'Unique, à chaque fois',
    layout: 'photo-left',
    text: "J'adore quand on planifie des petits voyages ou des sorties. Mais quoi que ce soit, chaque moment avec toi est unique et magique.",
    photos: [
      {
        src: '/images/nos-8-ans/annee-7/photo-1.jpg',
        alt: 'Souvenir de notre septième année ensemble',
        ratio: 720 / 960,
        tilt: -2,
      },
    ],
    quoteAfter: 'Chaque moment avec toi est unique.',
  },
  {
    index: 8,
    period: 'Année 8',
    title: 'Et la suite nous appartient',
    layout: 'photo-right',
    text: "Et voilà une année qui recommence. Je compte bien voir ces années défiler encore et encore, car il n'y a que toi dans ma vie. Pour toujours.",
    photos: [
      {
        src: '/images/nos-8-ans/annee-8/photo-1.jpg',
        alt: 'Souvenir de notre huitième année ensemble',
        ratio: 719 / 1152,
        tilt: 2,
      },
    ],
  },
];

/* ───────────────────────── Finale ───────────────────────── */

export const finale = {
  eyebrow: 'Dernière page',
  title: 'Et si le plus beau restait à venir ?',
  text: "Huit ans derrière nous, et encore tant de choses à découvrir ensemble. Merci pour tous ces souvenirs, pour les moments simples comme pour les grands, et pour tout ce qu'il nous reste à vivre.",
  signature: 'Joyeux huit ans, mon amour.',
};

/* ───────────────────── Musique (facultative) ───────────────────── */

/**
 * Musique de fond — DÉSACTIVÉE par défaut.
 *
 * Pour l'activer :
 *   1. Dépose un fichier dont tu possèdes les droits dans
 *      public/audio/nos-8-ans.mp3
 *   2. Remplace `null` par :  { src: '/audio/nos-8-ans.mp3', label: 'Notre musique' }
 *
 * Aucun son ne démarre jamais tout seul : il faut toujours appuyer sur le bouton.
 */
export const music: { src: string; label: string } | null = null;

/* ─────────────────── Métadonnées de la page ─────────────────── */

export const meta = {
  title: 'Huit ans de nous',
  description: 'Une page écrite pour elle, pour nos huit années.',
};
