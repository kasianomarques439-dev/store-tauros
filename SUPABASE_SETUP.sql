
-- Supabase opcional para banco real
-- Crie um projeto em supabase.com e rode este SQL se quiser pedidos/usuários reais via backend.

create table if not exists orders (
  id text primary key,
  user_email text,
  product text,
  price text,
  status text,
  created_at timestamp with time zone default now()
);

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  created_at timestamp with time zone default now()
);
