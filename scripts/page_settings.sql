-- ════════════════════════════════════════════════════════════════════
--  Table de visibilité des pages — onglet "Pages" de l'espace admin.
--  À exécuter UNE FOIS dans l'éditeur SQL de Supabase.
--  Stocke uniquement l'état on/off : la liste des pages vit dans le code
--  (src/lib/site-pages.ts).
-- ════════════════════════════════════════════════════════════════════

create table if not exists public.page_settings (
  path        text primary key,
  is_active   boolean     not null default true,
  updated_at  timestamptz not null default now(),
  updated_by  uuid
);

-- ── Row Level Security ──────────────────────────────────────────────
alter table public.page_settings enable row level security;

-- Lecture publique : indispensable pour que le middleware (clé anon)
-- sache quelles pages sont masquées. Ne contient aucune donnée sensible.
drop policy if exists "page_settings_public_read" on public.page_settings;
create policy "page_settings_public_read"
  on public.page_settings
  for select
  to anon, authenticated
  using (true);

-- Écriture réservée aux administrateurs (rôle 'admin' dans la table clients).
drop policy if exists "page_settings_admin_write" on public.page_settings;
create policy "page_settings_admin_write"
  on public.page_settings
  for all
  to authenticated
  using (
    exists (
      select 1 from public.clients c
      where c.id = auth.uid() and c.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.clients c
      where c.id = auth.uid() and c.role = 'admin'
    )
  );