'use client';

import { useEffect, useState } from 'react';

/**
 * Synchronisation avec l'écran de chargement (SiteLoader).
 * "ready" = le rideau commence à se lever : c'est le signal pour lancer
 * les animations d'entrée et les tâches non critiques (fond WebGL…).
 */
export const SITE_READY_EVENT = 'nl:ready';

declare global {
  interface Window {
    __nlReady?: boolean;
  }
}

export function isSiteReady(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.__nlReady) return true;
  // Pas de loader en cours (navigation interne, JS du loader absent…) : prêt.
  return !document.documentElement.classList.contains('nl-loading');
}

/** Appelle `cb` dès que le site est prêt (immédiatement s'il l'est déjà). Retourne un cleanup. */
export function onSiteReady(cb: () => void): () => void {
  if (isSiteReady()) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(SITE_READY_EVENT, handler, { once: true });
  return () => window.removeEventListener(SITE_READY_EVENT, handler);
}

export function useSiteReady(): boolean {
  // false au rendu serveur et à l'hydratation (pas de mismatch), puis synchronisé.
  const [ready, setReady] = useState(false);
  useEffect(() => onSiteReady(() => setReady(true)), []);
  return ready;
}

/** Exécute `cb` quand le navigateur est inactif (repli : setTimeout). */
export function whenIdle(cb: () => void, timeout = 1500): () => void {
  const w = window as Window & {
    requestIdleCallback?: (fn: () => void, opts?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };
  if (w.requestIdleCallback) {
    const id = w.requestIdleCallback(cb, { timeout });
    return () => w.cancelIdleCallback?.(id);
  }
  const id = window.setTimeout(cb, 200);
  return () => window.clearTimeout(id);
}
