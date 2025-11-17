alter table public.inquiries
  add column if not exists converted_to_lead boolean not null default false;

-- Backfill existing records as not yet converted
update public.inquiries
set converted_to_lead = coalesce(converted_to_lead, false)
where converted_to_lead is null;
