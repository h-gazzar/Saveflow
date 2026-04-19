create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  currency text not null default 'USD' check (currency in ('USD', 'EUR', 'GBP', 'EGP')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.savings_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  target_amount numeric(12, 2) not null check (target_amount > 0),
  current_saved numeric(12, 2) not null default 0 check (current_saved >= 0),
  target_date date,
  category text not null,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('income', 'expense')),
  amount numeric(12, 2) not null check (amount > 0),
  category text not null,
  date date not null default current_date,
  note text,
  savings_goal_id uuid references public.savings_goals(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = excluded.full_name;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists savings_goals_set_updated_at on public.savings_goals;
create trigger savings_goals_set_updated_at
before update on public.savings_goals
for each row execute function public.set_updated_at();

drop trigger if exists transactions_set_updated_at on public.transactions;
create trigger transactions_set_updated_at
before update on public.transactions
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.savings_goals enable row level security;
alter table public.transactions enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select to authenticated
using ((select auth.uid()) = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists "goals_select_own" on public.savings_goals;
create policy "goals_select_own" on public.savings_goals for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "goals_insert_own" on public.savings_goals;
create policy "goals_insert_own" on public.savings_goals for insert to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "goals_update_own" on public.savings_goals;
create policy "goals_update_own" on public.savings_goals for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "goals_delete_own" on public.savings_goals;
create policy "goals_delete_own" on public.savings_goals for delete to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "transactions_select_own" on public.transactions;
create policy "transactions_select_own" on public.transactions for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "transactions_insert_own" on public.transactions;
create policy "transactions_insert_own" on public.transactions for insert to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "transactions_update_own" on public.transactions;
create policy "transactions_update_own" on public.transactions for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "transactions_delete_own" on public.transactions;
create policy "transactions_delete_own" on public.transactions for delete to authenticated
using ((select auth.uid()) = user_id);

create index if not exists savings_goals_user_id_idx on public.savings_goals(user_id);
create index if not exists transactions_user_id_idx on public.transactions(user_id);
create index if not exists transactions_date_idx on public.transactions(date desc);
