-- ========================================
-- Policies pour les CLIENTS
-- ========================================

-- Client peut créer son propre profil lors de l'inscription
create policy "Client crée son profil"
on clients
for insert
with check (auth.uid() = id);

-- Client voit son propre profil
create policy "Client voit son profil"
on clients
for select
using (auth.uid() = id);

-- Admin voit tous les profils
create policy "Admin voit tous les profils"
on clients
for all
using (
  exists (
    select 1 from clients
    where id = auth.uid() and role = 'admin'
  )
);

-- ========================================
-- Policies pour les PROJETS
-- ========================================

-- Client voit ses projets
create policy "Client voit ses projets"
on projects
for select
using (auth.uid() = client_id);

-- Admin accès total aux projets
create policy "Admin accès total projets"
on projects
for all
using (
  exists (
    select 1 from clients
    where id = auth.uid() and role = 'admin'
  )
);

-- ========================================
-- Policies pour les FACTURES
-- ========================================

-- Client voit ses factures
create policy "Client voit ses factures"
on invoices
for select
using (auth.uid() = client_id);

-- Admin accès total aux factures
create policy "Admin accès total factures"
on invoices
for all
using (
  exists (
    select 1 from clients
    where id = auth.uid() and role = 'admin'
  )
);

-- ========================================
-- Policies pour les MESSAGES
-- ========================================

-- Client voit messages de ses projets
create policy "Client voit messages projet"
on project_messages
for select
using (
  project_id in (
    select id from projects where client_id = auth.uid()
  )
);

-- Client peut créer des messages sur ses projets
create policy "Client crée messages projet"
on project_messages
for insert
with check (
  project_id in (
    select id from projects where client_id = auth.uid()
  )
);

-- Admin accès total aux messages
create policy "Admin accès total messages"
on project_messages
for all
using (
  exists (
    select 1 from clients
    where id = auth.uid() and role = 'admin'
  )
);
