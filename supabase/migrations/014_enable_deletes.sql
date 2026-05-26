-- Grant delete operations to authenticated role
grant delete on public.inquiries to authenticated;
grant delete on public.career_inquiries to authenticated;

-- Allow authenticated users to delete inquiries
drop policy if exists "inquiries_delete_authenticated" on public.inquiries;
create policy "inquiries_delete_authenticated"
  on public.inquiries
  for delete
  to authenticated
  using (true);

-- Allow authenticated users to delete career inquiries
drop policy if exists "career_inquiries_delete_authenticated" on public.career_inquiries;
create policy "career_inquiries_delete_authenticated"
  on public.career_inquiries
  for delete
  to authenticated
  using (true);
