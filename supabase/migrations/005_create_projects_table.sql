create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  image_url text not null,
  logo_url text,
  image_position text,
  achievements jsonb default '[]'::jsonb,
  services text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table projects enable row level security;

-- Policies
create policy "Projects are viewable by everyone" on projects
  for select using (true);

create policy "Projects are insertable by admins" on projects
  for insert with check (auth.role() = 'authenticated');

create policy "Projects are updatable by admins" on projects
  for update using (auth.role() = 'authenticated');

create policy "Projects are deletable by admins" on projects
  for delete using (auth.role() = 'authenticated');

-- Seed data
insert into projects (title, slug, image_url, logo_url, image_position, achievements, services) values
(
  'Nuvé''s rebrand driving 70% sales growth in just 2 years',
  'premium-rebrand-elevates-nuvé-s-luxury-appeal-driving-70-sales-growth',
  'https://framerusercontent.com/images/fj6vHdxwJmXxa3SWyxXCZlXjk.png',
  'https://framerusercontent.com/images/84YS9XgnmmKr38ktgvd84LULvQU.png',
  '47.7% 3.2%',
  '[{"value": "70%", "label": "Increase in Sales"}, {"value": "50+", "label": "Retail Partnerships"}, {"value": "5x", "label": "Instagram Followers"}]',
  ARRAY['Copywriting', 'Branding']
),
(
  'Bold rebrand propels Lumé to nationwide expansion',
  'bold-rebrand-propels-lumé-to-nationwide-expansion',
  'https://framerusercontent.com/images/nGratkgH0XMxhM3liASJzgWM.png',
  'https://framerusercontent.com/images/hmyQOOihiaPsEf3YIwcgMQspCc.png',
  '58.6% 29.1%',
  '[{"value": "$8M", "label": "Secured funding"}, {"value": "3x", "label": "Brand Awareness"}, {"value": "60%", "label": "Growth in DTC sales"}]',
  ARRAY['Copywriting', 'Pitch Deck']
),
(
  'Strategic brand revamp helps Canné secure Series A funding',
  'strategic-brand-revamp-helps-canné-secure-series-a-funding',
  'https://framerusercontent.com/images/XhizZ9F3sgdo3v5YK01pJGqNV4.jpg',
  'https://framerusercontent.com/images/MEZ9UwyZWQsHFVp14NdtVCNKnU.png',
  'center center',
  '[{"value": "$11.5M", "label": "Series A Raised"}, {"value": "50%", "label": "Increased ROI"}, {"value": "20%", "label": "Increased Conversion"}]',
  ARRAY['Copywriting', 'Pitch Deck', 'Branding']
),
(
  'Revitalized branding helps Növa lead in clean wellness',
  'revitalized-branding-helps-növa-lead-in-clean-wellness',
  'https://framerusercontent.com/images/KNTIAIUl3WmyGme8VhProLq0F4o.png',
  'https://framerusercontent.com/images/HEfUZCGDX1mPIA99Vw1UKHD2Yhk.png',
  'center center',
  '[{"value": "40%", "label": "Customer Retention"}, {"value": "80%", "label": "Online Sales"}, {"value": "2", "label": "Retail Partnerships"}]',
  ARRAY['Social Media', 'Branding', 'Pitch Deck', 'Copywriting']
),
(
  'Strategic refresh fuels Auro''s global expansion',
  'strategic-refresh-fuels-auro-s-global-expansion',
  'https://framerusercontent.com/images/2TIXd5xRqy9fxtiHqBQ0DF9VMh8.png',
  'https://framerusercontent.com/images/VChslkFrmJjtjf93Ao3JWpmBtE.png',
  'center center',
  '[{"value": "5x", "label": "Brand Visibility"}, {"value": "$15M", "label": "Series A Funding"}, {"value": "5", "label": "International Markets"}]',
  ARRAY['Social Media']
),
(
  'Luxe rebrand helps Véra Beauty triple its market share',
  'luxe-rebrand-helps-véra-beauty-triple-its-market-share',
  'https://framerusercontent.com/images/83ZEeWaaJ93iBcgsVVkIUl2QA.png',
  'https://framerusercontent.com/images/gZnNziNw5tScGjxf8SmNEwAw.png',
  'center center',
  '[{"value": "3x", "label": "Market Growth"}, {"value": "65%", "label": "Higher AOV"}, {"value": "20+", "label": "Retail Stores"}]',
  ARRAY['Pitch Deck', 'Branding']
);
