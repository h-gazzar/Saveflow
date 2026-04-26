create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  selected_currency text;
begin
  selected_currency := upper(coalesce(new.raw_user_meta_data ->> 'currency', 'USD'));

  insert into public.profiles (id, email, full_name, currency)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    case
      when selected_currency in ('USD', 'EUR', 'GBP', 'EGP') then selected_currency
      else 'USD'
    end
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = excluded.full_name,
      currency = excluded.currency;

  return new;
end;
$$;
