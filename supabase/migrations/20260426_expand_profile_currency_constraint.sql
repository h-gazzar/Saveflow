alter table public.profiles
drop constraint if exists profiles_currency_check;

alter table public.profiles
add constraint profiles_currency_check
check (currency ~ '^[A-Z]{3}$');
