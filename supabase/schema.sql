create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  cover_image text,
  display_order integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  slug text unique not null,
  description text,
  event_date date,
  cover_image text,
  published boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  type text not null check (type in ('image','video')),
  file_url text not null,
  file_path text,
  alt_text text,
  display_order integer default 0,
  created_at timestamptz default now()
);

alter table public.categories enable row level security;
alter table public.events enable row level security;
alter table public.media enable row level security;

drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories for select using (true);

drop policy if exists "public read published events" on public.events;
create policy "public read published events" on public.events for select using (published = true);

drop policy if exists "public read published media" on public.media;
create policy "public read published media" on public.media for select using (
  exists (
    select 1 from public.events e
    where e.id = media.event_id and e.published = true
  )
);

-- Starter admin policies. For production, restrict write access to your studio admin user.
drop policy if exists "authenticated manage categories" on public.categories;
create policy "authenticated manage categories" on public.categories for all to authenticated using (true) with check (true);

drop policy if exists "authenticated manage events" on public.events;
create policy "authenticated manage events" on public.events for all to authenticated using (true) with check (true);

drop policy if exists "authenticated manage media" on public.media;
create policy "authenticated manage media" on public.media for all to authenticated using (true) with check (true);
