create function public.valid_profile_links(value jsonb)
returns boolean language sql immutable security invoker set search_path = '' as $$
 select case when jsonb_typeof(value) <> 'array' then false else
 jsonb_array_length(value) <= 30 and not exists (
 select 1 from jsonb_array_elements(value) item
 where jsonb_typeof(item) <> 'object'
 or jsonb_typeof(item->'label') is distinct from 'string'
 or jsonb_typeof(item->'url') is distinct from 'string'
 or length(item->>'label') not between 1 and 80
 or length(item->>'url') not between 9 and 2048
 or (item->>'url') !~ '^https://[^[:space:]]+$'
 ) end
$$;
revoke all on function public.valid_profile_links(jsonb) from public;
grant execute on function public.valid_profile_links(jsonb) to anon, authenticated;
create table public.profiles (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null unique references auth.users(id) on delete cascade,
 slug text not null unique check (slug ~ '^[a-z0-9][a-z0-9_-]{2,29}$' and slug not in ('admin','api','auth','login','signup','settings','dashboard','support','www')),
 display_name text not null check (length(display_name) between 1 and 80),
 bio text not null default '' check (length(bio) <= 500),
 theme text not null default 'violet' check (theme in ('violet','ocean','ink')),
 links jsonb not null default '[]'::jsonb check (public.valid_profile_links(links)),
 is_published boolean not null default false,
 created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
revoke all on table public.profiles from anon, authenticated;
grant select (id,slug,display_name,bio,theme,links,is_published) on public.profiles to anon;
grant select on public.profiles to authenticated;
grant insert (owner_id,slug,display_name,bio,theme,links,is_published) on public.profiles to authenticated;
grant update (slug,display_name,bio,theme,links,is_published) on public.profiles to authenticated;
grant delete on public.profiles to authenticated;
create policy public_profiles_read on public.profiles for select to anon, authenticated using (is_published);
create policy owner_profiles_read on public.profiles for select to authenticated using ((select auth.uid()) = owner_id);
create policy owner_profiles_insert on public.profiles for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy owner_profiles_update on public.profiles for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy owner_profiles_delete on public.profiles for delete to authenticated using ((select auth.uid()) = owner_id);