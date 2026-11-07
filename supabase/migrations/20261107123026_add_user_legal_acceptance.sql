create table public.user_legal_acceptances (
 owner_id uuid not null references auth.users(id) on delete cascade,
 version text not null check (version = '2026-11-07'),
 age_14_confirmed boolean not null check (age_14_confirmed),
 accepted_at timestamptz not null default now(),
 primary key (owner_id,version)
);
alter table public.user_legal_acceptances enable row level security;
revoke all on public.user_legal_acceptances from anon,authenticated;
grant select on public.user_legal_acceptances to authenticated;
grant insert (owner_id,version,age_14_confirmed) on public.user_legal_acceptances to authenticated;
create policy owner_legal_read on public.user_legal_acceptances for select to authenticated using ((select auth.uid())=owner_id);
create policy owner_legal_insert on public.user_legal_acceptances for insert to authenticated with check ((select auth.uid())=owner_id);
