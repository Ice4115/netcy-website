-- Table clients (profil métier)
create table clients (
  id uuid primary key references auth.users(id) on delete cascade,
  type text check (type in ('particulier', 'entreprise', 'association')),
  nom text not null,
  email text not null,
  role text default 'client' check (role in ('client', 'admin')),
  created_at timestamp default now()
);

-- Table projects
create table projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  titre text not null,
  description text,
  status text check (status in ('en_attente', 'en_cours', 'termine')) default 'en_attente',
  progress integer check (progress between 0 and 100) default 0,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Table invoices
create table invoices (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  montant numeric(10,2) not null,
  statut text check (statut in ('en_attente', 'payee')) default 'en_attente',
  pdf_url text,
  created_at timestamp default now()
);

-- Table project_messages (suivi & avancement)
create table project_messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  auteur text check (auteur in ('admin', 'client')) not null,
  message text not null,
  created_at timestamp default now()
);

-- Activer RLS sur toutes les tables
alter table clients enable row level security;
alter table projects enable row level security;
alter table invoices enable row level security;
alter table project_messages enable row level security;
