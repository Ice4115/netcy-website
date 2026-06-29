/**
 * Lecture SERVEUR des pages désactivées depuis Supabase (table `page_settings`).
 *
 * Sert à fournir l'état initial au `PageVisibilityProvider` afin d'éviter un
 * « flash » : sans cela les liens vers une page masquée s'afficheraient une
 * fraction de seconde avant de disparaître côté client.
 *
 * Lecture publique via la clé anon (policy `page_settings_public_read`).
 * Fail-open : toute erreur renvoie une liste vide — on n'altère jamais le site.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export async function getDisabledPaths(): Promise<string[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return [];

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/page_settings?select=path&is_active=eq.false`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        // Aligne le cache sur le TTL du middleware (15 s).
        next: { revalidate: 15 },
      }
    );
    if (!res.ok) return [];

    const rows: Array<{ path: string }> = await res.json();
    return rows.map((r) => r.path);
  } catch {
    return [];
  }
}
