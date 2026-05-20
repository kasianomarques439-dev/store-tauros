-- Store Tauros - SQL melhorado para Supabase/PostgreSQL
-- Use este arquivo sem apagar suas tabelas antigas. Ele cria uma base mais organizada.

create table if not exists tauros_users (
  id bigint primary key,
  username text not null,
  email text unique not null,
  password text,
  role text not null default 'cliente' check (role in ('cliente','admin','fundador')),
  created_at timestamptz default now()
);

create table if not exists tauros_products (
  id bigserial primary key,
  category text not null,
  name text not null,
  description text,
  price numeric(10,2) not null default 0,
  image_path text,
  is_active boolean default true,
  is_best_seller boolean default false,
  created_at timestamptz default now()
);

create table if not exists tauros_orders (
  id bigint primary key,
  product text not null,
  quantity integer not null default 1,
  total numeric(10,2) not null default 0,
  client text not null,
  contact text not null,
  status text not null default 'Pendente' check (status in ('Pendente','Aprovado','Entregue','Cancelado')),
  payment_proof text,
  date text,
  created_at timestamptz default now()
);

create table if not exists tauros_payments (
  id bigserial primary key,
  order_id bigint references tauros_orders(id) on delete cascade,
  payment_method text default 'Pix',
  pix_key text,
  amount numeric(10,2) not null default 0,
  proof_url text,
  status text not null default 'Aguardando',
  created_at timestamptz default now()
);

create table if not exists tauros_admin_logs (
  id bigserial primary key,
  admin_email text,
  action text not null,
  target_table text,
  target_id text,
  created_at timestamptz default now()
);

create index if not exists idx_tauros_orders_status on tauros_orders(status);
create index if not exists idx_tauros_orders_contact on tauros_orders(contact);
create index if not exists idx_tauros_orders_created_at on tauros_orders(created_at);
create index if not exists idx_tauros_products_category on tauros_products(category);
create index if not exists idx_tauros_users_email on tauros_users(email);
create index if not exists idx_tauros_users_role on tauros_users(role);

-- Views para painel fundador/admin
create or replace view tauros_sales_daily as
select
  date_trunc('day', created_at) as day,
  count(*) as orders_count,
  coalesce(sum(total),0) as revenue,
  coalesce(sum(total),0) * 0.35 as estimated_profit
from tauros_orders
group by 1
order by 1 desc;

create or replace view tauros_sales_weekly as
select
  date_trunc('week', created_at) as week,
  count(*) as orders_count,
  coalesce(sum(total),0) as revenue,
  coalesce(sum(total),0) * 0.35 as estimated_profit
from tauros_orders
group by 1
order by 1 desc;

create or replace view tauros_sales_monthly as
select
  date_trunc('month', created_at) as month,
  count(*) as orders_count,
  coalesce(sum(total),0) as revenue,
  coalesce(sum(total),0) * 0.35 as estimated_profit
from tauros_orders
group by 1
order by 1 desc;

create or replace view tauros_best_products as
select
  product,
  sum(quantity) as total_quantity,
  count(*) as orders_count,
  coalesce(sum(total),0) as revenue
from tauros_orders
group by product
order by total_quantity desc, revenue desc;

-- Compatibilidade com seu código atual:
-- Seu index atual também usa a tabela tauros_clients.
create table if not exists tauros_clients (
  id bigint primary key,
  discord text,
  email text unique not null,
  password text,
  created_at text
);

create index if not exists idx_tauros_clients_email on tauros_clients(email);
