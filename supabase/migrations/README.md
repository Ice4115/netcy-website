# Migrations Supabase

## Installation des tables

Pour configurer la base de données Supabase, suivez ces étapes :

### 1. Accéder à l'éditeur SQL Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Connectez-vous à votre projet
3. Dans le menu latéral, cliquez sur **SQL Editor**

### 2. Exécuter les migrations

Exécutez les fichiers SQL dans l'ordre suivant :

#### Migration 1 : Schéma initial
Copiez et collez le contenu de `001_initial_schema.sql` dans l'éditeur SQL et cliquez sur **Run**.

Cela créera :
- Table `clients` (profils utilisateurs)
- Table `projects` (projets clients)
- Table `invoices` (factures)
- Table `project_messages` (messages et suivi)

#### Migration 2 : Politiques RLS
Copiez et collez le contenu de `002_rls_policies.sql` dans l'éditeur SQL et cliquez sur **Run**.

Cela configurera :
- Les politiques de sécurité RLS (Row Level Security)
- Les permissions pour clients et admin

### 3. Créer le compte admin

Après avoir exécuté les migrations, créez votre compte admin :

1. Allez sur [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Utilisez les identifiants fournis :
   - Email: `jeanmarie.jung@netcy.fr`
   - Mot de passe: `pAtHN7CGQ3J4tt5`

3. Après la première connexion, allez dans **Supabase Dashboard → Authentication → Users**
4. Trouvez votre utilisateur et copiez son UUID
5. Dans **SQL Editor**, exécutez :

```sql
-- Insérer le profil admin
insert into clients (id, nom, email, type, role)
values (
  'VOTRE_UUID_ICI',
  'Jean-Marie Jung',
  'jeanmarie.jung@netcy.fr',
  'entreprise',
  'admin'
);
```

### 4. Vérification

Pour vérifier que tout fonctionne :

```sql
-- Vérifier les tables
select * from clients;
select * from projects;
select * from invoices;
select * from project_messages;

-- Vérifier les politiques RLS
select tablename, policyname from pg_policies where schemaname = 'public';
```

## Structure de la base de données

### Table `clients`
- `id` : UUID (référence auth.users)
- `type` : particulier | entreprise | association
- `nom` : Nom du client
- `email` : Email
- `role` : client | admin
- `created_at` : Date de création

### Table `projects`
- `id` : UUID
- `client_id` : Référence vers clients
- `titre` : Titre du projet
- `description` : Description
- `status` : en_attente | en_cours | termine
- `progress` : Progression (0-100)
- `created_at` : Date de création
- `updated_at` : Date de mise à jour

### Table `invoices`
- `id` : UUID
- `client_id` : Référence vers clients
- `project_id` : Référence vers projects
- `montant` : Montant en €
- `statut` : en_attente | payee
- `pdf_url` : Lien vers le PDF
- `created_at` : Date de création

### Table `project_messages`
- `id` : UUID
- `project_id` : Référence vers projects
- `auteur` : admin | client
- `message` : Contenu du message
- `created_at` : Date de création

## Sécurité RLS

### Clients
- Peuvent voir uniquement leurs propres données
- Peuvent créer des messages sur leurs projets

### Admin
- Accès total en lecture/écriture
- Peuvent gérer tous les clients, projets, factures et messages
