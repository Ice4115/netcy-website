-- Table des messages admin vers clients
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES clients(id),
  sujet VARCHAR(255) NOT NULL,
  contenu TEXT NOT NULL,
  lu BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_messages_client_id ON messages(client_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- RLS (Row Level Security)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Politique pour les clients : ils peuvent voir leurs propres messages
CREATE POLICY "Les clients peuvent voir leurs messages"
  ON messages FOR SELECT
  USING (auth.uid() = client_id);

-- Politique pour les admins : ils peuvent tout faire
CREATE POLICY "Les admins peuvent tout faire sur les messages"
  ON messages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = auth.uid()
      AND clients.role = 'admin'
    )
  );

-- Ajouter la colonne project_id à la table invoices si elle n'existe pas
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id) ON DELETE SET NULL;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS numero_facture VARCHAR(50);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS due_date DATE;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS pdf_url TEXT;

-- Ajouter des colonnes manquantes à la table projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS url VARCHAR(255);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS technologies TEXT[];
ALTER TABLE projects ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'site_internet';

-- Ajouter des colonnes utiles à la table clients
ALTER TABLE clients ADD COLUMN IF NOT EXISTS prenom VARCHAR(100);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS ville VARCHAR(100);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour la table messages
DROP TRIGGER IF EXISTS update_messages_updated_at ON messages;
CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour la table projects
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
