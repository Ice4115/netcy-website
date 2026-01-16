-- Migration: Ajouter une policy pour permettre aux nouveaux utilisateurs de créer leur profil

-- Permettre aux utilisateurs authentifiés de créer leur propre profil lors de l'inscription
create policy "Utilisateur peut créer son profil"
on clients
for insert
with check (auth.uid() = id);
