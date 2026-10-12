'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * `false` pendant le rendu serveur ET pendant l'hydratation, `true` ensuite.
 *
 * Sert à n'appliquer les styles pilotés par le défilement (`useScroll` /
 * `useTransform`) qu'APRÈS l'hydratation : avant que les éléments soient
 * mesurables, Motion ne peut pas connaître la progression réelle, et le HTML
 * produit côté serveur différerait de celui attendu côté client.
 *
 * `useSyncExternalStore` est la façon recommandée d'exprimer cela : React
 * utilise l'instantané serveur pour hydrater, puis bascule sans à-coup.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
