/**
 * Registre central des pages publiques du site.
 *
 * La SOURCE DE VÉRITÉ des pages existantes vit ici (dans le code).
 * Supabase (table `page_settings`) ne stocke QUE l'état on/off de chaque page.
 *
 * Les pages `locked: true` ne peuvent jamais être désactivées :
 * cela évite de se verrouiller dehors (accueil, espaces protégés, etc.).
 */

export type SitePageCategory = 'Public' | 'Compte' | 'Légal';

export interface SitePage {
  /** Chemin exact de la route (sans slash final). */
  path: string;
  /** Libellé affiché dans l'admin. */
  label: string;
  /** Courte description affichée dans l'admin. */
  description: string;
  /** Regroupement dans l'admin. */
  category: SitePageCategory;
  /** Si true, la page est toujours visible et ne peut pas être masquée. */
  locked?: boolean;
}

export const SITE_PAGES: SitePage[] = [
  // ── Public ───────────────────────────────────────────────
  { path: '/',          label: 'Accueil',   description: "Page d'accueil du site",          category: 'Public', locked: true },
  { path: '/portfolio', label: 'Portfolio', description: 'Réalisations et projets',          category: 'Public' },
  { path: '/qr',        label: 'QR Code',   description: 'Page de redirection / carte QR',   category: 'Public' },

  // ── Compte ───────────────────────────────────────────────
  { path: '/inscription', label: 'Inscription', description: 'Création de compte client',     category: 'Compte' },
  { path: '/connexion',   label: 'Connexion',   description: 'Connexion à l’espace client',   category: 'Compte' },

  // ── Légal ────────────────────────────────────────────────
  { path: '/cgu',                        label: 'CGU',             description: "Conditions générales d'utilisation", category: 'Légal' },
  { path: '/cgv',                        label: 'CGV',             description: 'Conditions générales de vente',       category: 'Légal' },
  { path: '/cookies',                    label: 'Cookies',         description: 'Politique de cookies',                category: 'Légal' },
  { path: '/politique-confidentialite',  label: 'Confidentialité', description: 'Politique de confidentialité',        category: 'Légal' },
];

/** Ordre d'affichage des catégories dans l'admin. */
export const SITE_PAGE_CATEGORIES: SitePageCategory[] = ['Public', 'Compte', 'Légal'];

/** Chemins réellement désactivables (exclut les pages verrouillées). */
export const TOGGLEABLE_PATHS = SITE_PAGES.filter((p) => !p.locked).map((p) => p.path);

/** Vérifie qu'un chemin fait partie des pages désactivables (garde-fou serveur). */
export function isToggleablePath(path: string): boolean {
  return TOGGLEABLE_PATHS.includes(path);
}