'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface PageVisibilityValue {
  /** Chemins désactivés (normalisés, sans slash final). */
  disabledPaths: Set<string>;
  /** true si la page ciblée par `path` est visible / accessible. */
  isPathEnabled: (path: string) => boolean;
}

const PageVisibilityContext = createContext<PageVisibilityValue>({
  disabledPaths: new Set(),
  isPathEnabled: () => true,
});

/** Normalise un href interne : retire le hash, la query et un slash final. */
function normalizePath(href: string): string {
  const clean = href.split('#')[0].split('?')[0];
  if (clean.length > 1 && clean.endsWith('/')) return clean.slice(0, -1);
  return clean;
}

/**
 * Fournit à toute l'application la liste des pages désactivées depuis
 * l'espace admin. L'état initial vient du serveur (props `initialDisabled`)
 * puis est resynchronisé côté client (au montage + au retour de focus).
 */
export function PageVisibilityProvider({
  initialDisabled = [],
  children,
}: {
  initialDisabled?: string[];
  children: React.ReactNode;
}) {
  const [disabledPaths, setDisabledPaths] = useState<Set<string>>(
    () => new Set(initialDisabled)
  );

  useEffect(() => {
    let active = true;

    const refresh = async () => {
      const { data, error } = await supabase
        .from('page_settings')
        .select('path')
        .eq('is_active', false);
      if (!active || error || !data) return;
      setDisabledPaths(new Set(data.map((r: { path: string }) => r.path)));
    };

    refresh();
    // Re-synchronise quand l'onglet reprend le focus (l'admin a pu basculer une page).
    const onFocus = () => refresh();
    window.addEventListener('focus', onFocus);
    return () => {
      active = false;
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  const isPathEnabled = useCallback(
    (path: string) => {
      // Ancres (#...) et liens externes (http...) : jamais masqués.
      if (!path || !path.startsWith('/')) return true;
      return !disabledPaths.has(normalizePath(path));
    },
    [disabledPaths]
  );

  return (
    <PageVisibilityContext.Provider value={{ disabledPaths, isPathEnabled }}>
      {children}
    </PageVisibilityContext.Provider>
  );
}

export function usePageVisibility() {
  return useContext(PageVisibilityContext);
}
