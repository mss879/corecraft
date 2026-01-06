-- Resume form questions (editable from admin)

-- 1) Store question definitions
create table if not exists public.resume_form_questions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  field_key text not null,
  label text not null,
  field_type text not null,
  required boolean not null default false,
  options jsonb,
  order_index integer not null default 0,
  active boolean not null default true
);

create unique index if not exists resume_form_questions_field_key_unique
  on public.resume_form_questions(field_key);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'resume_form_questions_field_type_check'
  ) then
    alter table public.resume_form_questions
      add constraint resume_form_questions_field_type_check
      check (field_type in ('text', 'email', 'textarea', 'checkbox_group', 'radio'));
  end if;
end $$;

-- 2) Keep updated_at in sync
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_resume_form_questions_updated_at on public.resume_form_questions;
create trigger set_resume_form_questions_updated_at
before update on public.resume_form_questions
for each row
execute function public.set_updated_at();

-- 3) Allow storing new/custom answers without altering career_inquiries columns
alter table public.career_inquiries
  add column if not exists extra_answers jsonb not null default '{}'::jsonb;

-- 4) RLS policies
alter table public.resume_form_questions enable row level security;

drop policy if exists "resume_form_questions_select_public" on public.resume_form_questions;
create policy "resume_form_questions_select_public"
  on public.resume_form_questions
  for select
  to public
  using (true);

drop policy if exists "resume_form_questions_insert_authenticated" on public.resume_form_questions;
create policy "resume_form_questions_insert_authenticated"
  on public.resume_form_questions
  for insert
  to authenticated
  with check (true);

drop policy if exists "resume_form_questions_update_authenticated" on public.resume_form_questions;
create policy "resume_form_questions_update_authenticated"
  on public.resume_form_questions
  for update
  to authenticated
  using (true);

drop policy if exists "resume_form_questions_delete_authenticated" on public.resume_form_questions;
create policy "resume_form_questions_delete_authenticated"
  on public.resume_form_questions
  for delete
  to authenticated
  using (true);

-- 5) Seed defaults matching the current resume/career form
insert into public.resume_form_questions (field_key, label, field_type, required, options, order_index, active)
values
  ('target_markets', 'Share us the target markets you would like your resume to be focused on. Explain your requirement briefly for our research.', 'textarea', true, null, 10, true),
  ('name', 'Name', 'text', true, null, 20, true),
  ('email', 'Email', 'email', true, null, 30, true),
  ('phone', 'Phone Number', 'text', true, null, 40, true),
  ('company', 'Company/Organization (if applicable)', 'text', false, null, 50, true),
  ('current_role', 'Current Job Title/Position', 'text', false, null, 60, true),
  ('current_industry', 'Industry/Sector', 'text', false, null, 70, true),
  ('target_roles', 'What job title(s) are you targeting?', 'text', false, null, 80, true),
  ('target_industries', 'Which industry or industries are you interested in?', 'text', false, null, 90, true),
  ('career_objectives', 'Can you provide a brief summary of your career objectives and key strengths?', 'textarea', false, null, 100, true),
  ('career_goals', 'What are your primary career goals for the next 3-5 years?', 'textarea', false, null, 110, true),
  ('skills', 'What hard skills (technical skills) and soft skills (interpersonal skills) do you possess relevant to your target job?', 'textarea', false, null, 120, true),
  ('education_certifications', 'List any certifications, licenses, professional training, and your educational background (degrees, institutions, and graduation dates). Include any relevant coursework or academic projects.', 'textarea', false, null, 130, true),
  ('additional_info', 'Do you have any additional information or specific requests for your resume, including preferences for the design or format, and any particular keywords or phrases you believe should be included?', 'textarea', false, null, 140, true),
  ('service_interest', 'What specific services are you interested in? (Check all that apply)', 'checkbox_group', false, '["ATS-Proof Resumes","Expert Career Development","LinkedIn Optimization","All of the above","Other"]'::jsonb, 150, true),
  ('linkedin_info_requested', 'Would you like more information about our LinkedIn optimization service?', 'radio', false, '["yes","no"]'::jsonb, 160, true),
  ('referral_source', 'How did you hear about Core Craft?', 'text', false, null, 170, true)
on conflict (field_key) do nothing;
