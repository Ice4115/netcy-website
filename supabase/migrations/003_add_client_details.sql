-- Migration: Ajout des informations détaillées des clients

ALTER TABLE clients 
  ADD COLUMN IF NOT EXISTS prenom TEXT,
  ADD COLUMN IF NOT EXISTS adresse TEXT,
  ADD COLUMN IF NOT EXISTS adresse_ligne2 TEXT,
  ADD COLUMN IF NOT EXISTS code_postal TEXT,
  ADD COLUMN IF NOT EXISTS pays TEXT DEFAULT 'France',
  ADD COLUMN IF NOT EXISTS telephone TEXT,
  ADD COLUMN IF NOT EXISTS nom_societe TEXT,
  ADD COLUMN IF NOT EXISTS siret TEXT,
  ADD COLUMN IF NOT EXISTS nom_association TEXT;

-- Mise à jour de la colonne nom pour la renommer (le nom sera maintenant le nom de famille)
COMMENT ON COLUMN clients.nom IS 'Nom de famille pour particulier, ou nom complet pour legacy';
COMMENT ON COLUMN clients.prenom IS 'Prénom du client';
COMMENT ON COLUMN clients.nom_societe IS 'Nom de la société si type = entreprise';
COMMENT ON COLUMN clients.siret IS 'Numéro SIRET/SIREN si type = entreprise';
COMMENT ON COLUMN clients.nom_association IS 'Nom de l''association si type = association';
