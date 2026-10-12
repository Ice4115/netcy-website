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
 * ATTENTION : les textes livrés ci-dessous sont des EXEMPLES À REMPLACER.
 * Aucun souvenir réel n'a été inventé. Les années marquées
 * `isPlaceholder: true` affichent un discret repère « à personnaliser »
 * en développement uniquement (jamais en production).
 */

/* ───────────────────────── Types ───────────────────────── */

export type PhotoRatio = 'portrait' | 'tall' | 'square' | 'landscape' | 'pano';

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
    text: 'Exemple à remplacer : le tout début, quand tout était encore à écrire et que chaque moment comptait double.',
    isPlaceholder: true,
    layout: 'duo',
    photos: [
      {
        src: '/images/nos-8-ans/annee-1/photo-1.jpg',
        alt: 'Souvenir de notre première année ensemble',
        ratio: 'portrait',
        tilt: -2,
      },
      {
        src: '/images/nos-8-ans/annee-1/photo-2.jpg',
        alt: 'Deuxième souvenir de notre première année ensemble',
        ratio: 'tall',
        tilt: 3,
      },
    ],
    quoteAfter: "Tout a commencé par un oui, et on ne l'a jamais regretté.",
  },
  {
    index: 2,
    period: 'Année 2',
    title: 'Nos petits rituels',
    text: "Exemple à remplacer : les habitudes qui se sont installées sans qu'on les décide, et qui sont devenues les nôtres.",
    isPlaceholder: true,
    layout: 'photo-left',
    photos: [
      {
        src: '/images/nos-8-ans/annee-2/photo-1.jpg',
        alt: 'Souvenir de notre deuxième année ensemble',
        ratio: 'square',
        tilt: 2,
      },
    ],
  },
  {
    index: 3,
    period: 'Année 3',
    title: 'Grandir à deux',
    text: "Exemple à remplacer : une année où on a appris, changé un peu, et avancé côte à côte.",
    isPlaceholder: true,
    layout: 'photo-right',
    photos: [
      {
        src: '/images/nos-8-ans/annee-3/photo-1.jpg',
        alt: 'Souvenir de notre troisième année ensemble',
        ratio: 'tall',
        tilt: -3,
      },
    ],
    quoteAfter: 'Rien de spectaculaire. Juste nous, un peu plus forts.',
  },
  {
    index: 4,
    period: 'Année 4',
    title: 'Toujours choisir nous',
    text: "Exemple à remplacer : parce qu'aimer, c'est aussi choisir, encore et encore, la même personne.",
    isPlaceholder: true,
    layout: 'wide',
    photos: [
      {
        src: '/images/nos-8-ans/annee-4/photo-1.jpg',
        alt: 'Souvenir panoramique de notre quatrième année ensemble',
        ratio: 'pano',
      },
    ],
  },
  {
    index: 5,
    period: 'Année 5',
    title: 'Des souvenirs plein les poches',
    text: 'Exemple à remplacer : cinq ans de petites choses gardées précieusement, sans même y penser.',
    isPlaceholder: true,
    layout: 'photo-left',
    photos: [
      {
        src: '/images/nos-8-ans/annee-5/photo-1.jpg',
        alt: 'Souvenir de notre cinquième année ensemble',
        ratio: 'landscape',
        tilt: -2,
      },
    ],
    quoteAfter: "Le temps passe plus vite quand on est bien.",
  },
  {
    index: 6,
    period: 'Année 6',
    title: 'Une évidence',
    text: "Exemple à remplacer : plus besoin de se poser la question. C'était devenu simple, calme, évident.",
    isPlaceholder: true,
    layout: 'photo-right',
    photos: [
      {
        src: '/images/nos-8-ans/annee-6/photo-1.jpg',
        alt: 'Souvenir de notre sixième année ensemble',
        ratio: 'portrait',
        tilt: 3,
      },
    ],
  },
  {
    index: 7,
    period: 'Année 7',
    title: 'Encore et toujours',
    text: "Exemple à remplacer : sept ans, et toujours cette envie de raconter sa journée à la même personne.",
    isPlaceholder: true,
    layout: 'photo-left',
    photos: [
      {
        src: '/images/nos-8-ans/annee-7/photo-1.jpg',
        alt: 'Souvenir de notre septième année ensemble',
        ratio: 'tall',
        tilt: -2,
      },
    ],
    quoteAfter: "Sept ans plus tard, c'est encore toi que je regarde.",
  },
  {
    index: 8,
    period: 'Année 8',
    title: 'Et la suite nous appartient',
    text: "Exemple à remplacer : huit ans derrière nous, et surtout tout ce qu'il nous reste à écrire.",
    isPlaceholder: true,
    layout: 'photo-right',
    photos: [
      {
        src: '/images/nos-8-ans/annee-8/photo-1.jpg',
        alt: 'Souvenir de notre huitième année ensemble',
        ratio: 'tall',
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
