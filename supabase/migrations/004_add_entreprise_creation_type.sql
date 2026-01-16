-- Migration: Ajouter le type "entreprise_creation" à la table clients

-- Supprimer l'ancienne contrainte
ALTER TABLE clients DROP CONSTRAINT IF EXISTS clients_type_check;

-- Ajouter la nouvelle contrainte avec "entreprise_creation"
ALTER TABLE clients ADD CONSTRAINT clients_type_check 
  CHECK (type IN ('particulier', 'entreprise', 'entreprise_creation', 'association'));
