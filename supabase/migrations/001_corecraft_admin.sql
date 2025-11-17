-- Enable pgcrypto for gen_random_uuid()
create extension if not exists "pgcrypto";

-- Inquiries table for website contact form submissions
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  company text,
  email text not null,
  message text not null
);

alter table public.inquiries enable row level security;

drop policy if exists "inquiries_insert_anon" on public.inquiries;
create policy "inquiries_insert_anon"
  on public.inquiries
  for insert
  to anon
  with check (true);

drop policy if exists "inquiries_select_authenticated" on public.inquiries;
create policy "inquiries_select_authenticated"
  on public.inquiries
  for select
  to authenticated
  using (true);

-- Leads table for the CRM pipeline
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  company text,
  email text,
  stage text not null check (stage in ('New','Qualified','Proposal','Won','Lost'))
);

alter table public.leads enable row level security;

drop policy if exists "leads_full_authenticated" on public.leads;
create policy "leads_full_authenticated"
  on public.leads
  for all
  to authenticated
  using (true)
  with check (true);
