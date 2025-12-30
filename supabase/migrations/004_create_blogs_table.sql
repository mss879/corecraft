create table if not exists blogs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  slug text not null unique,
  content text not null,
  excerpt text,
  image_url text,
  published boolean default false,
  author text
);

-- Enable RLS
alter table blogs enable row level security;

-- Create policies
create policy "Enable read access for all users" on blogs
  for select using (true);

create policy "Enable insert for authenticated users only" on blogs
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update for authenticated users only" on blogs
  for update using (auth.role() = 'authenticated');

create policy "Enable delete for authenticated users only" on blogs
  for delete using (auth.role() = 'authenticated');

-- Create storage bucket for blog images
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Give public access to blog-images"
  on storage.objects for select
  using ( bucket_id = 'blog-images' );

create policy "Enable upload for authenticated users"
  on storage.objects for insert
  with check ( bucket_id = 'blog-images' and auth.role() = 'authenticated' );

create policy "Enable update for authenticated users"
  on storage.objects for update
  with check ( bucket_id = 'blog-images' and auth.role() = 'authenticated' );

create policy "Enable delete for authenticated users"
  on storage.objects for delete
  using ( bucket_id = 'blog-images' and auth.role() = 'authenticated' );
