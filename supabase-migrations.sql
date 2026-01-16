-- ================================================
-- NETCY - Migrations Base de Données Supabase
-- ================================================
-- Date: 16 janvier 2026
-- Description: Ajout des colonnes manquantes et configuration RLS

-- ================================================
-- 1. MISE À JOUR DE LA TABLE CLIENTS
-- ================================================

-- Vérifier et ajouter les colonnes manquantes
DO $$
BEGIN
  -- Ajouter prenom si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clients' AND column_name = 'prenom'
  ) THEN
    ALTER TABLE clients ADD COLUMN prenom VARCHAR(100);
  END IF;

  -- Ajouter adresse si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clients' AND column_name = 'adresse'
  ) THEN
    ALTER TABLE clients ADD COLUMN adresse TEXT;
  END IF;

  -- Ajouter adresse_ligne2 si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clients' AND column_name = 'adresse_ligne2'
  ) THEN
    ALTER TABLE clients ADD COLUMN adresse_ligne2 TEXT;
  END IF;

  -- Ajouter code_postal si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clients' AND column_name = 'code_postal'
  ) THEN
    ALTER TABLE clients ADD COLUMN code_postal VARCHAR(10);
  END IF;

  -- Ajouter pays si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clients' AND column_name = 'pays'
  ) THEN
    ALTER TABLE clients ADD COLUMN pays VARCHAR(100) DEFAULT 'France';
  END IF;

  -- Ajouter telephone si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clients' AND column_name = 'telephone'
  ) THEN
    ALTER TABLE clients ADD COLUMN telephone VARCHAR(20);
  END IF;

  -- Ajouter nom_societe si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clients' AND column_name = 'nom_societe'
  ) THEN
    ALTER TABLE clients ADD COLUMN nom_societe VARCHAR(200);
  END IF;

  -- Ajouter siret si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clients' AND column_name = 'siret'
  ) THEN
    ALTER TABLE clients ADD COLUMN siret VARCHAR(14);
  END IF;

  -- Ajouter nom_association si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clients' AND column_name = 'nom_association'
  ) THEN
    ALTER TABLE clients ADD COLUMN nom_association VARCHAR(200);
  END IF;

  -- Ajouter entreprise si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clients' AND column_name = 'entreprise'
  ) THEN
    ALTER TABLE clients ADD COLUMN entreprise VARCHAR(200);
  END IF;

  -- Ajouter role si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clients' AND column_name = 'role'
  ) THEN
    ALTER TABLE clients ADD COLUMN role VARCHAR(20) DEFAULT 'client';
  END IF;

  -- Ajouter created_at si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clients' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE clients ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;

  -- Ajouter updated_at si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clients' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE clients ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- ================================================
-- 2. MISE À JOUR DE LA TABLE PROJECTS
-- ================================================

DO $$
BEGIN
  -- Ajouter updated_at si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE projects ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- ================================================
-- 3. MISE À JOUR DE LA TABLE INVOICES
-- ================================================

DO $$
BEGIN
  -- Ajouter due_date si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'invoices' AND column_name = 'due_date'
  ) THEN
    ALTER TABLE invoices ADD COLUMN due_date DATE;
  END IF;

  -- Ajouter project_id si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'invoices' AND column_name = 'project_id'
  ) THEN
    ALTER TABLE invoices ADD COLUMN project_id UUID REFERENCES projects(id);
  END IF;
END $$;

-- ================================================
-- 4. CRÉER UN TRIGGER POUR updated_at
-- ================================================

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Appliquer le trigger sur la table clients
DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Appliquer le trigger sur la table projects
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ================================================

-- Activer RLS sur la table clients
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Politique : Les clients authentifiés peuvent voir leurs propres données
DROP POLICY IF EXISTS "client_select_own" ON clients;
CREATE POLICY "client_select_own"
ON clients FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Politique : Les clients peuvent modifier leurs propres données
DROP POLICY IF EXISTS "client_update_own" ON clients;
CREATE POLICY "client_update_own"
ON clients FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Politique : Les admins peuvent tout voir
DROP POLICY IF EXISTS "admin_select_all" ON clients;
CREATE POLICY "admin_select_all"
ON clients FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM clients c
    WHERE c.id = auth.uid() AND c.role = 'admin'
  )
);

-- Politique : Les admins peuvent tout modifier
DROP POLICY IF EXISTS "admin_update_all" ON clients;
CREATE POLICY "admin_update_all"
ON clients FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM clients c
    WHERE c.id = auth.uid() AND c.role = 'admin'
  )
);

-- Activer RLS sur la table projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Politique : Les clients voient leurs projets
DROP POLICY IF EXISTS "client_select_projects" ON projects;
CREATE POLICY "client_select_projects"
ON projects FOR SELECT
TO authenticated
USING (
  client_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM clients
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Politique : Les admins peuvent créer des projets
DROP POLICY IF EXISTS "admin_insert_projects" ON projects;
CREATE POLICY "admin_insert_projects"
ON projects FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM clients
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Politique : Les admins peuvent modifier des projets
DROP POLICY IF EXISTS "admin_update_projects" ON projects;
CREATE POLICY "admin_update_projects"
ON projects FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM clients
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Activer RLS sur la table invoices
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Politique : Les clients voient leurs factures
DROP POLICY IF EXISTS "client_select_invoices" ON invoices;
CREATE POLICY "client_select_invoices"
ON invoices FOR SELECT
TO authenticated
USING (
  client_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM clients
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Politique : Les admins peuvent créer des factures
DROP POLICY IF EXISTS "admin_insert_invoices" ON invoices;
CREATE POLICY "admin_insert_invoices"
ON invoices FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM clients
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Politique : Les admins peuvent modifier des factures
DROP POLICY IF EXISTS "admin_update_invoices" ON invoices;
CREATE POLICY "admin_update_invoices"
ON invoices FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM clients
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ================================================
-- 6. INDEX POUR PERFORMANCES
-- ================================================

-- Index sur email pour recherches rapides
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);

-- Index sur role pour filtrage admin
CREATE INDEX IF NOT EXISTS idx_clients_role ON clients(role);

-- Index sur client_id dans projects
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);

-- Index sur status dans projects
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- Index sur client_id dans invoices
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);

-- Index sur statut dans invoices
CREATE INDEX IF NOT EXISTS idx_invoices_statut ON invoices(statut);

-- ================================================
-- 7. CONTRAINTES DE VALIDATION
-- ================================================

-- Contrainte : Email valide
ALTER TABLE clients
DROP CONSTRAINT IF EXISTS clients_email_check;

ALTER TABLE clients
ADD CONSTRAINT clients_email_check
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Contrainte : Code postal français (5 chiffres)
ALTER TABLE clients
DROP CONSTRAINT IF EXISTS clients_code_postal_check;

ALTER TABLE clients
ADD CONSTRAINT clients_code_postal_check
CHECK (code_postal IS NULL OR code_postal ~ '^\d{5}$');

-- Contrainte : SIRET (14 chiffres)
ALTER TABLE clients
DROP CONSTRAINT IF EXISTS clients_siret_check;

ALTER TABLE clients
ADD CONSTRAINT clients_siret_check
CHECK (siret IS NULL OR siret ~ '^\d{14}$');

-- Contrainte : Role valide
ALTER TABLE clients
DROP CONSTRAINT IF EXISTS clients_role_check;

ALTER TABLE clients
ADD CONSTRAINT clients_role_check
CHECK (role IN ('client', 'admin'));

-- Contrainte : Type valide
ALTER TABLE clients
DROP CONSTRAINT IF EXISTS clients_type_check;

ALTER TABLE clients
ADD CONSTRAINT clients_type_check
CHECK (type IN ('particulier', 'entreprise', 'entreprise_creation', 'association'));

-- ================================================
-- FIN DE LA MIGRATION
-- ================================================

-- Afficher un message de confirmation
DO $$
BEGIN
  RAISE NOTICE 'Migration terminée avec succès!';
  RAISE NOTICE 'Toutes les colonnes ont été ajoutées.';
  RAISE NOTICE 'Les politiques RLS sont actives.';
  RAISE NOTICE 'Les index sont créés.';
  RAISE NOTICE 'Les contraintes sont appliquées.';
END $$;
