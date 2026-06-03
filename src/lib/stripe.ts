import Stripe from 'stripe';

/**
 * Client Stripe côté serveur uniquement.
 * Ne JAMAIS importer ce fichier dans un composant client ('use client').
 */
const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  // En dev sans clé, on laisse passer pour ne pas casser le build ;
  // les routes API qui l'utilisent renverront une erreur claire.
  console.warn('[stripe] STRIPE_SECRET_KEY manquante — les paiements sont désactivés.');
}

export const stripe = new Stripe(secretKey ?? 'sk_test_placeholder', {
  // apiVersion omise volontairement → utilise la version par défaut du compte.
  typescript: true,
  appInfo: { name: 'NETCY SaaS Billing', url: 'https://netcy.fr' },
});

export const isStripeConfigured = (): boolean => Boolean(secretKey);

/** URL de base du site, pour les redirections Checkout (success/cancel). */
export const getSiteUrl = (): string =>
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.netcy.fr';