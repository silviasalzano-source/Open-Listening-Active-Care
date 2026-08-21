-- Estensione per gen_random_uuid(); Supabase la abilita già di default,
-- dichiarata qui esplicitamente per idempotenza/portabilità.
create extension if not exists pgcrypto;

create table public.survey_campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  compilation_window_start timestamptz not null,
  compilation_window_end timestamptz not null,
  edit_window_start timestamptz,
  edit_window_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint compilation_window_valid
    check (compilation_window_end > compilation_window_start),
  constraint edit_window_valid check (
    (edit_window_start is null and edit_window_end is null)
    or (
      edit_window_start is not null
      and edit_window_end is not null
      and edit_window_end > edit_window_start
    )
  )
);

comment on table public.survey_campaigns is
  'Una edizione ricorrente del survey (es. "Open Listening 2026"). Ogni compilazione (nominativa e anonima) appartiene a una campagna.';
comment on column public.survey_campaigns.edit_window_start is
  'null = modifiche non attive; HR apre la finestra impostando entrambe le date insieme.';

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_survey_campaigns_updated_at
before update on public.survey_campaigns
for each row
execute function public.set_updated_at();
