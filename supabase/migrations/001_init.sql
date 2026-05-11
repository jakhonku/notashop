-- NotaShop — initial schema
-- Tables: notes, profiles, purchases
-- Storage buckets: covers (public), pdfs (private)

create extension if not exists pgcrypto;

-- Notes
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  composer text,
  description text,
  category text not null,
  instrument text not null,
  difficulty text not null check (difficulty in ('Boshlang''ich','O''rta','Yuqori')),
  price_uzs integer not null,
  cover_url text,
  pdf_path text not null,
  preview_url text,
  created_at timestamptz default now()
);

-- Profiles (mirrors auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  full_name text,
  role text default 'user' check (role in ('user','admin')),
  created_at timestamptz default now()
);

-- Purchases
create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  note_id uuid references notes on delete cascade,
  stripe_session_id text unique,
  amount_uzs integer,
  created_at timestamptz default now(),
  unique(user_id, note_id)
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into profiles(id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      null
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- RLS
alter table notes enable row level security;
alter table profiles enable row level security;
alter table purchases enable row level security;

-- notes: everyone can read, only admins can write
drop policy if exists "notes_read_all" on notes;
create policy "notes_read_all" on notes for select using (true);

drop policy if exists "notes_admin_write" on notes;
create policy "notes_admin_write" on notes for all
  using (
    exists(select 1 from profiles where id = auth.uid() and role = 'admin')
  )
  with check (
    exists(select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- profiles: each user can read & update their own
drop policy if exists "profile_self" on profiles;
create policy "profile_self" on profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- purchases: users can read only their own; writes happen via service role (webhook)
drop policy if exists "purchases_self_read" on purchases;
create policy "purchases_self_read" on purchases for select using (auth.uid() = user_id);

-- Storage buckets
insert into storage.buckets (id, name, public)
values ('covers', 'covers', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('pdfs', 'pdfs', false)
on conflict (id) do nothing;

-- Storage policies
-- covers: public read, admin write
drop policy if exists "covers_public_read" on storage.objects;
create policy "covers_public_read" on storage.objects for select
  using (bucket_id = 'covers');

drop policy if exists "covers_admin_write" on storage.objects;
create policy "covers_admin_write" on storage.objects for insert
  with check (
    bucket_id = 'covers'
    and exists(select 1 from profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "covers_admin_update" on storage.objects;
create policy "covers_admin_update" on storage.objects for update
  using (
    bucket_id = 'covers'
    and exists(select 1 from profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "covers_admin_delete" on storage.objects;
create policy "covers_admin_delete" on storage.objects for delete
  using (
    bucket_id = 'covers'
    and exists(select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- pdfs: admins can write; reads happen via signed URLs only (no public select policy)
drop policy if exists "pdfs_admin_write" on storage.objects;
create policy "pdfs_admin_write" on storage.objects for insert
  with check (
    bucket_id = 'pdfs'
    and exists(select 1 from profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "pdfs_admin_update" on storage.objects;
create policy "pdfs_admin_update" on storage.objects for update
  using (
    bucket_id = 'pdfs'
    and exists(select 1 from profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "pdfs_admin_delete" on storage.objects;
create policy "pdfs_admin_delete" on storage.objects for delete
  using (
    bucket_id = 'pdfs'
    and exists(select 1 from profiles where id = auth.uid() and role = 'admin')
  );
