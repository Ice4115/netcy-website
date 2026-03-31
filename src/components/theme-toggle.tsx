'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState, useRef } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [burst, setBurst] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  if (!mounted) return null;

  const isDark = theme === 'dark';

  function handleToggle() {
    setBurst(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setBurst(true)));
    document.documentElement.classList.add('color-theme-in-transition');
    requestAnimationFrame(() => {
      setTheme(isDark ? 'light' : 'dark');
    });
    timeoutRef.current = setTimeout(() => {
      document.documentElement.classList.remove('color-theme-in-transition');
    }, 900);
  }

  return (
    <button
      onClick={handleToggle}
      aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
      className={`fixed bottom-6 right-6 z-[100] w-12 h-12 rounded-full shadow-lg flex items-center justify-center bg-surface-container-highest border border-outline-variant hover:scale-110 active:scale-95 transition-transform duration-200 dark:shadow-[0_0_20px_rgba(208,188,255,0.15)] ${burst ? 'toggle-burst' : ''}`}
      onAnimationEnd={() => setBurst(false)}
      title={isDark ? 'Mode clair' : 'Mode sombre'}
    >
      {/* Sun — shown in dark mode, continuously spinning */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'opacity 350ms ease, transform 350ms ease',
          opacity: isDark ? 1 : 0,
          transform: isDark ? 'scale(1)' : 'rotate(90deg) scale(0.3)',
          pointerEvents: 'none',
        }}
      >
        <Sun
          size={20}
          color="#FCD34D"
          strokeWidth={1.75}
          style={{
            animation: 'rays-spin 6s linear infinite',
            filter: 'drop-shadow(0 0 5px rgba(252,211,77,0.6))',
          }}
        />
      </span>

      {/* Moon — shown in light mode, continuously pulsing */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'opacity 350ms ease, transform 350ms ease',
          opacity: isDark ? 0 : 1,
          transform: isDark ? 'rotate(-90deg) scale(0.3)' : 'scale(1)',
          pointerEvents: 'none',
        }}
      >
        <Moon
          size={18}
          color="#6366F1"
          strokeWidth={1.75}
          style={{ animation: 'moon-rock 3s ease-in-out infinite' }}
        />
      </span>
    </button>
  );
}
