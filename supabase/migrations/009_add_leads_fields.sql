-- Add fields to leads table for the Get Started form (CRM)
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS message text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS service_interest text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS budget_range text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS target_markets text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS current_role text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS current_industry text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS target_roles text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS target_industries text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS career_objectives text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS career_goals text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS skills text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS education_certifications text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS linkedin_info_requested boolean default false;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS referral_source text;
