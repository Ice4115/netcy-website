'use client';

import { useEffect } from 'react';
import { SITE_READY_EVENT } from '@/lib/site-ready';

declare global {
  interface Window {
    __nlFallback?: number;
  }
}

/** Durée minimale d'affichage (depuis le début de la navigation) pour que l'animation se lise. */
const MIN_FIRST_VISIT_MS = 1100;
const MIN_REPEAT_VISIT_MS = 250;
/** Au-delà, on lève le rideau quoi qu'il arrive. */
const MAX_WAIT_MS = 4000;

// Lu une seule fois par chargement de page (le double effet du StrictMode ne doit pas le fausser).
let seenCache: boolean | null = null;
function hasSeenLoader(): boolean {
  if (seenCache !== null) return seenCache;
  seenCache = false;
  try {
    seenCache = sessionStorage.getItem('nl-seen') === '1';
    sessionStorage.setItem('nl-seen', '1');
  } catch {
    /* stockage indisponible : durée par défaut */
  }
  return seenCache;
}

/**
 * Lève l'écran de chargement quand la page est réellement prête :
 * hydratation terminée + `load` (images, CSS) + polices + images lourdes décodées.
 * Tout est donc calculé sous le rideau : rien ne se charge pendant le scroll.
 */
export default function SiteLoaderController({ images = [] }: { images?: string[] }) {
  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains('nl-loading')) {
      window.__nlReady = true;
      return;
    }

    let cancelled = false;
    const seen = hasSeenLoader();

    const sinceNav = (ms: number) => Math.max(0, ms - performance.now());
    const pageLoaded =
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise<void>((r) => window.addEventListener('load', () => r(), { once: true }));
    const fontsReady = document.fonts?.ready.then(() => undefined) ?? Promise.resolve();
    // Décodage anticipé : évite le freeze quand la carte photo arrive à l'écran.
    const decoded = images.map((src) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
      return img.decode().catch(() => undefined);
    });
    const minDelay = new Promise<void>((r) =>
      setTimeout(r, sinceNav(seen ? MIN_REPEAT_VISIT_MS : MIN_FIRST_VISIT_MS))
    );
    const cap = new Promise<void>((r) => setTimeout(r, sinceNav(MAX_WAIT_MS)));

    const timers: number[] = [];
    const exit = () => {
      if (cancelled) return;
      window.clearTimeout(window.__nlFallback);
      html.classList.add('nl-exit');
      timers.push(
        window.setTimeout(() => {
          html.classList.add('nl-reveal');
          window.__nlReady = true;
          window.dispatchEvent(new Event(SITE_READY_EVENT));
        }, 380),
        window.setTimeout(() => html.classList.remove('nl-loading', 'nl-exit', 'nl-reveal'), 1600)
      );
    };

    Promise.race([Promise.all([pageLoaded, fontsReady, minDelay, ...decoded]), cap]).then(() => {
      // Deux frames : tout est peint sous le rideau avant qu'il ne se lève.
      requestAnimationFrame(() => requestAnimationFrame(exit));
    });

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [images]);

  return null;
}
