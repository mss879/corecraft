-- Add more fields to inquiries table for detailed Get Started form
alter table public.inquiries
  add column if not exists phone text,
  add column if not exists service_interest text,
  add column if not exists budget_range text;
