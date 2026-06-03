-- ╔══════════════════════════════════════════════════════════════════════╗
-- ║  NETCY — Migration SaaS Billing (Phase 1)                             ║
-- ║  Stripe : prestations one-shot + abonnements + devis + automatisation ║
-- ║  Idempotent : exécutable plusieurs fois sans risque (IF NOT EXISTS).  ║
-- ╚══════════════════════════════════════════════════════════════════════╝

-- ─────────────────────────────────────────────────────────────────────────
-- 1. CLIENTS : lien vers le client Stripe
-- ─────────────────────────────────────────────────────────────────────────
ALTER TABLE clients ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);
CREATE INDEX IF NOT EXISTS idx_clients_stripe_customer ON clients(stripe_customer_id);

-- ─────────────────────────────────────────────────────────────────────────
-- 2. INVOICES : colonnes Stripe + cycle de paiement / relances
-- ─────────────────────────────────────────────────────────────────────────
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS stripe_payment_intent_id VARCHAR(255);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS stripe_invoice_id        VARCHAR(255);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS stripe_checkout_id       VARCHAR(255);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS paid_at                  TIMESTAMPTZ;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS currency                 VARCHAR(3)  DEFAULT 'eur';
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS tva_rate                 NUMERIC(5,2) DEFAULT 0;     -- ex: 20.00 (auto-entrepreneur = 0)
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS type                     VARCHAR(20) DEFAULT 'prestation'; -- prestation | abonnement
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS quote_id                 UUID;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS subscription_id          UUID;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS reminder_count           INT  DEFAULT 0;             -- nb de relances envoyées
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS last_reminder_at         TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_invoices_statut       ON invoices(statut);
CREATE INDEX IF NOT EXISTS idx_invoices_client       ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_payment_intent ON invoices(stripe_payment_intent_id);

-- ─────────────────────────────────────────────────────────────────────────
-- 3. QUOTES (devis) : envoyé → accepté/refusé → génère une facture
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quotes (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_devis  VARCHAR(50)  NOT NULL,
  client_id     UUID NOT NULL REFERENCES clients(id)  ON DELETE CASCADE,
  project_id    UUID          REFERENCES projects(id) ON DELETE SET NULL,
  titre         VARCHAR(255),
  description   TEXT,
  items         JSONB        DEFAULT '[]'::jsonb,   -- [{label, qty, unit_price}]
  montant       NUMERIC(10,2) NOT NULL DEFAULT 0,
  tva_rate      NUMERIC(5,2)  DEFAULT 0,
  statut        VARCHAR(20)   DEFAULT 'brouillon',  -- brouillon | envoye | accepte | refuse | expire
  valid_until   DATE,
  pdf_url       TEXT,
  sent_at       TIMESTAMPTZ,
  accepted_at   TIMESTAMPTZ,
  refused_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_quotes_client ON quotes(client_id);
CREATE INDEX IF NOT EXISTS idx_quotes_statut ON quotes(statut);

-- ─────────────────────────────────────────────────────────────────────────
-- 4. SUBSCRIPTIONS (abonnements) : miroir local de Stripe
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
  id                     UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id              UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_customer_id     VARCHAR(255),
  stripe_price_id        VARCHAR(255),
  plan_label             VARCHAR(255),               -- ex: "Maintenance Premium"
  montant                NUMERIC(10,2) NOT NULL DEFAULT 0,
  interval               VARCHAR(10)  DEFAULT 'month', -- month | year
  statut                 VARCHAR(30)  DEFAULT 'incomplete', -- active | past_due | canceled | incomplete | trialing
  current_period_start   TIMESTAMPTZ,
  current_period_end     TIMESTAMPTZ,
  cancel_at_period_end   BOOLEAN DEFAULT FALSE,
  canceled_at            TIMESTAMPTZ,
  created_at             TIMESTAMPTZ DEFAULT NOW(),
  updated_at             TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_subscriptions_client ON subscriptions(client_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);

-- Lien tardif invoices → subscriptions / quotes (les FK après création des tables)
DO $$ BEGIN
  ALTER TABLE invoices ADD CONSTRAINT fk_invoices_quote
    FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE invoices ADD CONSTRAINT fk_invoices_subscription
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─────────────────────────────────────────────────────────────────────────
-- 5. PAYMENTS (registre des paiements / reçus)
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id                       UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id               UUID          REFERENCES invoices(id)      ON DELETE SET NULL,
  subscription_id          UUID          REFERENCES subscriptions(id) ON DELETE SET NULL,
  client_id                UUID NOT NULL REFERENCES clients(id)       ON DELETE CASCADE,
  stripe_payment_intent_id VARCHAR(255),
  stripe_invoice_id        VARCHAR(255),
  montant                  NUMERIC(10,2) NOT NULL,
  currency                 VARCHAR(3) DEFAULT 'eur',
  statut                   VARCHAR(30) DEFAULT 'succeeded', -- succeeded | failed | refunded
  method                   VARCHAR(30),                     -- card | sepa_debit ...
  receipt_url              TEXT,
  created_at               TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_payments_client  ON payments(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice ON payments(invoice_id);

-- ─────────────────────────────────────────────────────────────────────────
-- 6. EMAIL_LOG (idempotence : ne jamais ré-envoyer 2× le même email auto)
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS email_log (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type        VARCHAR(50) NOT NULL,            -- receipt | dunning_7 | renewal | quote_sent ...
  ref_id      VARCHAR(255) NOT NULL,           -- id facture / abo / devis concerné
  recipient   VARCHAR(255),
  status      VARCHAR(20) DEFAULT 'sent',      -- sent | failed
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (type, ref_id)
);

-- ─────────────────────────────────────────────────────────────────────────
-- 7. Triggers updated_at (réutilise la fonction existante update_updated_at_column)
-- ─────────────────────────────────────────────────────────────────────────
DROP TRIGGER IF EXISTS update_quotes_updated_at ON quotes;
CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────────────────────────────────
-- 8. RLS (Row Level Security)
--    Le client voit SES données ; l'admin a tous les droits.
--    Les écritures Stripe passent par la SERVICE_ROLE (bypass RLS).
-- ─────────────────────────────────────────────────────────────────────────
ALTER TABLE quotes        ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments      ENABLE ROW LEVEL SECURITY;

-- QUOTES
DROP POLICY IF EXISTS "client_read_own_quotes" ON quotes;
CREATE POLICY "client_read_own_quotes" ON quotes FOR SELECT USING (auth.uid() = client_id);
DROP POLICY IF EXISTS "client_accept_own_quotes" ON quotes;
CREATE POLICY "client_accept_own_quotes" ON quotes FOR UPDATE USING (auth.uid() = client_id);
DROP POLICY IF EXISTS "admin_all_quotes" ON quotes;
CREATE POLICY "admin_all_quotes" ON quotes FOR ALL
  USING (EXISTS (SELECT 1 FROM clients WHERE clients.id = auth.uid() AND clients.role = 'admin'));

-- SUBSCRIPTIONS
DROP POLICY IF EXISTS "client_read_own_subs" ON subscriptions;
CREATE POLICY "client_read_own_subs" ON subscriptions FOR SELECT USING (auth.uid() = client_id);
DROP POLICY IF EXISTS "admin_all_subs" ON subscriptions;
CREATE POLICY "admin_all_subs" ON subscriptions FOR ALL
  USING (EXISTS (SELECT 1 FROM clients WHERE clients.id = auth.uid() AND clients.role = 'admin'));

-- PAYMENTS
DROP POLICY IF EXISTS "client_read_own_payments" ON payments;
CREATE POLICY "client_read_own_payments" ON payments FOR SELECT USING (auth.uid() = client_id);
DROP POLICY IF EXISTS "admin_all_payments" ON payments;
CREATE POLICY "admin_all_payments" ON payments FOR ALL
  USING (EXISTS (SELECT 1 FROM clients WHERE clients.id = auth.uid() AND clients.role = 'admin'));

-- ✅ Migration terminée.