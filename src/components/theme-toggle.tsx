'use client';

import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { flushSync } from 'react-dom';

const noopSubscribe = () => () => {};

// Durée de la révélation circulaire du nouveau thème (la scène du bouton dure 1000ms).
const REVEAL_MS = 900;
const REVEAL_EASING = 'cubic-bezier(0.65, 0, 0.35, 1)';

const STARS = [
  { top: 9, left: 11, size: 2, delay: 0 },
  { top: 6, left: 30, size: 1.5, delay: 0.8 },
  { top: 15, left: 38, size: 2, delay: 1.4 },
  { top: 17, left: 7, size: 1.5, delay: 0.4 },
  { top: 21, left: 33, size: 1.5, delay: 1.9 },
];

function Cloud({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 12" className={className} aria-hidden="true">
      <circle cx="7" cy="8" r="4" />
      <circle cx="12" cy="5.5" r="5" />
      <circle cx="17.5" cy="8" r="3.5" />
      <rect x="7" y="8" width="10.5" height="4" />
    </svg>
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // false au SSR et à l'hydratation, true ensuite : évite le décalage de thème à l'hydratation.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  // Demi-tours de la roue soleil/lune : toujours dans le même sens (coucher à droite, lever à gauche).
  const [turns, setTurns] = useState(0);
  // Relance le passage des nuages et la lueur d'horizon à chaque bascule.
  const [pass, setPass] = useState(0);
  const busyRef = useRef(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const pathname = usePathname();

  const isDark = theme === 'dark';

  // Aligne la roue sur le thème (parité des demi-tours), y compris si le thème change ailleurs.
  if ((turns % 2 === 1) !== isDark) setTurns(turns + 1);

  // Ne masque pas les liens du pied de page : dès qu'un footer atteint le bouton,
  // celui-ci remonte au-dessus (translate composité, piloté par --toggle-lift).
  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;
    const visible = new Map<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target, entry.boundingClientRect.height);
          else visible.delete(entry.target);
        }
        const lift = Math.min(Math.max(0, ...visible.values()), window.innerHeight * 0.5);
        button.style.setProperty('--toggle-lift', `${lift}px`);
      },
      { rootMargin: '0px 0px -24px 0px' },
    );
    document.querySelectorAll('footer').forEach((footer) => observer.observe(footer));
    return () => {
      observer.disconnect();
      button.style.removeProperty('--toggle-lift');
    };
  }, [pathname, mounted]);

  if (!mounted) return null;

  function handleToggle() {
    if (busyRef.current) return;
    const next = isDark ? 'light' : 'dark';
    const root = document.documentElement;

    // Applique la classe nous-mêmes : next-themes ne la pose qu'au useEffect suivant,
    // or la View Transition doit voir le DOM final dès la fin du callback.
    const apply = () => {
      root.classList.remove('light', 'dark');
      root.classList.add(next);
      root.style.colorScheme = next;
      flushSync(() => {
        setTheme(next);
        setPass((p) => p + 1);
      });
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      apply();
      return;
    }

    // Repli pour les navigateurs sans View Transitions : fondu des couleurs.
    if (!document.startViewTransition) {
      busyRef.current = true;
      root.classList.add('color-theme-in-transition');
      apply();
      setTimeout(() => {
        root.classList.remove('color-theme-in-transition');
        busyRef.current = false;
      }, REVEAL_MS);
      return;
    }

    busyRef.current = true;
    const rect = buttonRef.current!.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    root.classList.add('theme-vt');
    const transition = document.startViewTransition(apply);
    transition.ready
      .then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: REVEAL_MS, easing: REVEAL_EASING, pseudoElement: '::view-transition-new(root)' },
        );
      })
      .catch(() => {});
    transition.finished.finally(() => {
      root.classList.remove('theme-vt');
      busyRef.current = false;
    });
  }

  const rotation = turns * 180;

  return (
    <button
      ref={buttonRef}
      onClick={handleToggle}
      data-site-chrome="theme-toggle"
      data-dark={isDark}
      aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
      title={isDark ? 'Mode clair' : 'Mode sombre'}
      className="sky-toggle fixed bottom-6 right-6 z-100 w-12 h-12 rounded-full shadow-lg border border-white/50 dark:border-white/10 hover:scale-110 active:scale-95 dark:shadow-[0_0_20px_rgba(208,188,255,0.15)]"
    >
      <span className="sky-layer sky-day" aria-hidden="true" />
      <span className="sky-layer sky-night" aria-hidden="true" />
      {pass > 0 && <span key={`dusk-${pass}`} className="sky-layer sky-dusk" aria-hidden="true" />}

      <span className="sky-stars" aria-hidden="true">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="sky-star"
            style={{ top: s.top, left: s.left, width: s.size, height: s.size, animationDelay: `${s.delay}s` }}
          />
        ))}
      </span>

      <span className="sky-wheel" style={{ transform: `rotate(${rotation}deg)` }} aria-hidden="true">
        <span className="sky-body sky-sun" style={{ transform: `rotate(${-rotation}deg)` }} />
        <span className="sky-body sky-moon" style={{ transform: `rotate(${-rotation}deg)` }} />
      </span>

      <svg viewBox="0 0 48 14" className="sky-hills" aria-hidden="true">
        <path className="sky-hill-back" d="M0 8 Q12 2 24 7 T48 6 V14 H0Z" />
        <path className="sky-hill-front" d="M0 11 Q16 5 30 10 T48 9 V14 H0Z" />
      </svg>

      {pass > 0 && (
        <span key={`clouds-${pass}`} className="sky-clouds" aria-hidden="true">
          <Cloud className="sky-cloud sky-cloud-a" />
          <Cloud className="sky-cloud sky-cloud-b" />
        </span>
      )}
    </button>
  );
}
