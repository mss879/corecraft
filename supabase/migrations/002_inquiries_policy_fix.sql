-- Ensure anon & authenticated roles can hit the table before RLS checks fire
grant usage on schema public to anon, authenticated;
grant select, insert on public.inquiries to anon, authenticated;

drop policy if exists "inquiries_insert_anon" on public.inquiries;
create policy "inquiries_insert_anon"
  on public.inquiries
  as permissive
  for insert
  to anon
  with check (true);

drop policy if exists "inquiries_insert_authenticated" on public.inquiries;
create policy "inquiries_insert_authenticated"
  on public.inquiries
  as permissive
  for insert
  to authenticated
  with check (true);

drop policy if exists "inquiries_select_authenticated" on public.inquiries;
create policy "inquiries_select_authenticated"
  on public.inquiries
  as permissive
  for select
  to authenticated
  using (true);
