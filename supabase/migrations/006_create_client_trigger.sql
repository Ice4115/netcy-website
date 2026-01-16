-- Migration: Créer un trigger pour créer automatiquement le profil client

-- Fonction qui sera appelée par le trigger
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.clients (id, email, nom, role)
  VALUES (NEW.id, NEW.email, '', 'client');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger qui s'exécute après l'insertion d'un utilisateur
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Supprimer l'ancienne policy d'insertion car elle n'est plus nécessaire avec le trigger
DROP POLICY IF EXISTS "Utilisateur peut créer son profil" ON clients;

-- Ajouter une policy pour permettre la mise à jour du profil
CREATE POLICY "Utilisateur peut mettre à jour son profil"
ON clients
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
