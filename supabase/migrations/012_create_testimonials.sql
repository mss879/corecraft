-- Testimonials + shareable testimonial request links
-- This migration adds:
--   1) public.testimonials (admin CRUD + public read of published)
--   2) public.testimonial_requests (admin creates share links)
--   3) Public insert of testimonials ONLY when a valid request token is provided

-- Ensure pgcrypto exists for gen_random_uuid() / gen_random_bytes()
create extension if not exists "pgcrypto";

-- Reusable updated_at trigger function (created in 011, but safe to re-declare)
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 1) Table: testimonial_requests
create table if not exists public.testimonial_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Token used in the shareable URL. Default is a random 32-hex string.
  token text not null unique default encode(gen_random_bytes(16), 'hex'),

  status text not null default 'open',
  expires_at timestamptz,
  max_uses integer not null default 1,
  used_count integer not null default 0,

  -- Optional admin notes (e.g., which client it was requested from)
  note text
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'testimonial_requests_status_check'
  ) then
    alter table public.testimonial_requests
      add constraint testimonial_requests_status_check
      check (status in ('open','closed'));
  end if;
end $$;

create index if not exists testimonial_requests_token_idx
  on public.testimonial_requests(token);

-- Keep updated_at in sync

drop trigger if exists set_testimonial_requests_updated_at on public.testimonial_requests;
create trigger set_testimonial_requests_updated_at
before update on public.testimonial_requests
for each row
execute function public.set_updated_at();

-- 2) Table: testimonials
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Content
  name text,
  role text,
  quote text not null,
  avatar_url text,
  rating integer not null default 5,
  stats jsonb,
  variant text not null default 'accent',

  -- Publishing + ordering
  published boolean not null default true,
  order_index integer not null default 0,

  -- Link to a request (optional)
  request_id uuid references public.testimonial_requests(id) on delete set null,

  -- Token provided by public submitters. Stored for auditing.
  request_token text
);

-- Constraints

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'testimonials_rating_check'
  ) then
    alter table public.testimonials
      add constraint testimonials_rating_check
      check (rating between 1 and 5);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'testimonials_variant_check'
  ) then
    alter table public.testimonials
      add constraint testimonials_variant_check
      check (variant in ('accent','dark'));
  end if;
end $$;

create index if not exists testimonials_published_order_idx
  on public.testimonials(published, order_index, created_at);

create index if not exists testimonials_request_id_idx
  on public.testimonials(request_id);

-- Keep updated_at in sync

drop trigger if exists set_testimonials_updated_at on public.testimonials;
create trigger set_testimonials_updated_at
before update on public.testimonials
for each row
execute function public.set_updated_at();

-- 3) Resolve request_id from request_token and validate token on insert
create or replace function public.resolve_testimonial_request_from_token()
returns trigger
language plpgsql
as $$
declare
  v_request_id uuid;
begin
  -- If a token is provided (public flow), resolve it to request_id and validate.
  if new.request_token is not null and new.request_id is null then
    select id
      into v_request_id
    from public.testimonial_requests
    where token = new.request_token
      and status = 'open'
      and (expires_at is null or expires_at > now())
      and used_count < max_uses;

    if v_request_id is null then
      raise exception 'Invalid or expired testimonial request token';
    end if;

    new.request_id = v_request_id;
  end if;

  return new;
end;
$$;

drop trigger if exists resolve_testimonial_request_from_token on public.testimonials;
create trigger resolve_testimonial_request_from_token
before insert on public.testimonials
for each row
execute function public.resolve_testimonial_request_from_token();

-- 4) Increment used_count when a testimonial is inserted via request
create or replace function public.bump_testimonial_request_usage()
returns trigger
language plpgsql
as $$
begin
  if new.request_id is not null then
    update public.testimonial_requests
      set used_count = used_count + 1,
          status = case
            when (used_count + 1) >= max_uses then 'closed'
            else status
          end
      where id = new.request_id;
  end if;

  return new;
end;
$$;

drop trigger if exists bump_testimonial_request_usage on public.testimonials;
create trigger bump_testimonial_request_usage
after insert on public.testimonials
for each row
execute function public.bump_testimonial_request_usage();

-- 5) RLS policies

-- testimonial_requests: admin-only (authenticated)
alter table public.testimonial_requests enable row level security;

drop policy if exists "testimonial_requests_select_authenticated" on public.testimonial_requests;
create policy "testimonial_requests_select_authenticated"
  on public.testimonial_requests
  for select
  to authenticated
  using (true);

drop policy if exists "testimonial_requests_insert_authenticated" on public.testimonial_requests;
create policy "testimonial_requests_insert_authenticated"
  on public.testimonial_requests
  for insert
  to authenticated
  with check (true);

drop policy if exists "testimonial_requests_update_authenticated" on public.testimonial_requests;
create policy "testimonial_requests_update_authenticated"
  on public.testimonial_requests
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "testimonial_requests_delete_authenticated" on public.testimonial_requests;
create policy "testimonial_requests_delete_authenticated"
  on public.testimonial_requests
  for delete
  to authenticated
  using (true);

-- testimonials
alter table public.testimonials enable row level security;

-- Public can read only published testimonials

drop policy if exists "testimonials_select_public_published" on public.testimonials;
create policy "testimonials_select_public_published"
  on public.testimonials
  for select
  to public
  using (published = true);

-- Admin full CRUD

drop policy if exists "testimonials_all_authenticated" on public.testimonials;
create policy "testimonials_all_authenticated"
  on public.testimonials
  for all
  to authenticated
  using (true)
  with check (true);

-- Public insert only via a valid request token
-- Note: authenticated users can insert regardless via the policy above.

drop policy if exists "testimonials_insert_public_via_request_token" on public.testimonials;
create policy "testimonials_insert_public_via_request_token"
  on public.testimonials
  for insert
  to public
  with check (
    request_token is not null
    and exists (
      select 1
      from public.testimonial_requests r
      where r.token = request_token
        and r.status = 'open'
        and (r.expires_at is null or r.expires_at > now())
        and r.used_count < r.max_uses
    )
  );

-- 6) Seed the 3 current homepage testimonials into the backend
insert into public.testimonials (name, role, quote, avatar_url, variant, stats, published, order_index)
values
  (
    'Emma Collins',
    'CEO, Powersurge',
    'CoreCraft transformed our brand identity and website beyond what we imagined. Their team was professional, creative, and delivered on time. Our online presence has never looked better.',
    'https://framerusercontent.com/images/7dBgVlJGddtanMmE6mro8bfVO8.png?width=480&height=480',
    'dark',
    null,
    true,
    10
  ),
  (
    'Michael Brooks',
    'CTO, Warpspeed',
    'CoreCraft revamped our online store with a sleek design that resonates with customers. Since launch, engagement and user experience have greatly improved.',
    'https://framerusercontent.com/images/Qtiy6JZJ0E0ZUM1L1TfcKWvXjo.png?width=640&height=640',
    'accent',
    '[{"value":"+35%","label":"Average order value"},{"value":"+45%","label":"User engagement"}]'::jsonb,
    true,
    20
  ),
  (
    'Liam Torres',
    'COO, CloudWatch',
    'Our clean, intuitive website now showcases our SaaS platform perfectly, leading to increased sign-ups and higher customer satisfaction.',
    'https://framerusercontent.com/images/VQjluMNywKhZ8T1UbafuyggOpg.png?width=640&height=640',
    'accent',
    '[{"value":"+54%","label":"Sign-up rate"},{"value":"+25","label":"Client retention"}]'::jsonb,
    true,
    30
  )
on conflict do nothing;
