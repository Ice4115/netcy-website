import { createClient } from '@supabase/supabase-js';

/**
 * Client Supabase avec la clé SERVICE_ROLE — BYPASSE la RLS.
 * À utiliser EXCLUSIVEMENT côté serveur (routes API, webhooks, cron).
 * Ne JAMAIS l'importer dans un composant client : la clé serait exposée.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.warn('[supabase-admin] SUPABASE_SERVICE_ROLE_KEY manquante — les écritures serveur échoueront.');
}

export const supabaseAdmin = createClient(
  supabaseUrl ?? '',
  serviceRoleKey ?? '',
  {
    auth: { persistSession: false, autoRefreshToken: false },
  }
);

export const isSupabaseAdminConfigured = (): boolean =>
  Boolean(supabaseUrl && serviceRoleKey);