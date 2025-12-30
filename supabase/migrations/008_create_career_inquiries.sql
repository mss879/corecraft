-- Create career_inquiries table for resume/career form submissions
create table if not exists public.career_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  company text,
  
  -- Career specific fields
  target_markets text,
  "current_role" text,
  "current_industry" text,
  target_roles text,
  target_industries text,
  career_objectives text,
  career_goals text,
  skills text,
  education_certifications text,
  message text, -- mapped from additional_info
  service_interest text,
  budget_range text,
  linkedin_info_requested boolean default false,
  referral_source text,
  
  converted_to_lead boolean not null default false
);

alter table public.career_inquiries enable row level security;

drop policy if exists "career_inquiries_insert_anon" on public.career_inquiries;
drop policy if exists "career_inquiries_insert_public" on public.career_inquiries;

create policy "career_inquiries_insert_public"
  on public.career_inquiries
  for insert
  to public
  with check (true);

drop policy if exists "career_inquiries_select_authenticated" on public.career_inquiries;
create policy "career_inquiries_select_authenticated"
  on public.career_inquiries
  for select
  to authenticated
  using (true);
  
drop policy if exists "career_inquiries_update_authenticated" on public.career_inquiries;
create policy "career_inquiries_update_authenticated"
  on public.career_inquiries
  for update
  to authenticated
  using (true);
