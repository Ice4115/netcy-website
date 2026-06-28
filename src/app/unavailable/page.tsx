import { notFound } from 'next/navigation';

/**
 * Cible de réécriture (rewrite) du middleware pour les pages désactivées.
 *
 * `notFound()` rend l'UI globale `not-found.tsx` AVEC un vrai statut HTTP 404,
 * de sorte qu'une page masquée par l'admin apparaisse comme inexistante.
 * Server Component volontairement (sans 'use client') pour que le 404 soit
 * appliqué côté serveur.
 */
export default function UnavailablePage() {
  notFound();
}