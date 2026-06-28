import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/** Durée de cache en mémoire des pages désactivées (ms). */
const CACHE_TTL = 15_000;

/**
 * Cache au niveau du module (persistant entre invocations d'un même isolate).
 * Évite d'interroger Supabase à chaque requête.
 */
let disabledCache: { paths: Set<string>; ts: number } | null = null;

async function getDisabledPaths(): Promise<Set<string>> {
  if (disabledCache && Date.now() - disabledCache.ts < CACHE_TTL) {
    return disabledCache.paths;
  }
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return new Set();

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/page_settings?select=path&is_active=eq.false`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        cache: 'no-store',
      }
    );
    if (!res.ok) return disabledCache?.paths ?? new Set();

    const rows: Array<{ path: string }> = await res.json();
    const paths = new Set(rows.map((r) => r.path));
    disabledCache = { paths, ts: Date.now() };
    return paths;
  } catch {
    // Fail-open : en cas d'erreur réseau, on n'interrompt pas le site.
    return disabledCache?.paths ?? new Set();
  }
}

/** Retire un éventuel slash final (sauf pour la racine). */
function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
  return pathname;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1) Protection de l'espace admin (inchangé)
  if (pathname.startsWith('/netcy-secure-access/dashboard')) {
    const adminCookie = req.cookies.get('netcy_admin_access');
    if (!adminCookie || adminCookie.value !== 'granted') {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/netcy-secure-access';
      loginUrl.searchParams.set('reason', 'unauthorized');
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 2) Contrôle de visibilité des pages publiques (activée / désactivée)
  const path = normalizePath(pathname);
  const disabled = await getDisabledPaths();
  if (disabled.has(path)) {
    const url = req.nextUrl.clone();
    url.pathname = '/unavailable';
    url.search = '';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  // Exécute le middleware sur toutes les routes SAUF l'API, les assets _next
  // et tout fichier statique (contenant un point, ex. .webp, .ico).
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};