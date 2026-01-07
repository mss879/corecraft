-- Fix: public testimonial submission fails with "Invalid or expired testimonial request token"
-- Root cause: anon inserts are blocked by RLS on testimonial_requests, so triggers/policies cannot resolve/validate tokens.
-- Solution: use SECURITY DEFINER helper functions that can read/update testimonial_requests, and update RLS policy accordingly.

-- 1) Security-definer helper used by RLS policy
create or replace function public.testimonial_request_token_is_valid(p_token text)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.testimonial_requests r
    where r.token = p_token
      and r.status = 'open'
      and (r.expires_at is null or r.expires_at > now())
      and r.used_count < r.max_uses
  );
$$;

-- 2) Replace resolve trigger to bypass RLS when resolving token
create or replace function public.resolve_testimonial_request_from_token()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_request_id uuid;
begin
  -- If a token is provided (public flow), resolve it and ALWAYS set request_id.
  if new.request_token is not null then
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

-- 3) Replace bump usage trigger to bypass RLS when updating request usage
create or replace function public.bump_testimonial_request_usage()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
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

-- 4) Update the public insert policy on testimonials to validate tokens via the security-definer helper
alter table public.testimonials enable row level security;

drop policy if exists "testimonials_insert_public_via_request_token" on public.testimonials;
create policy "testimonials_insert_public_via_request_token"
  on public.testimonials
  for insert
  to public
  with check (
    request_token is not null
    and public.testimonial_request_token_is_valid(request_token)
    and variant = 'accent'
    and published = true
  );
