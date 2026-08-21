-- web/supabase/migrations/20260821162931_anonymous_tokens.sql

create table public.anonymous_tokens (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.survey_campaigns(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  pseudonym_id text not null unique,
  created_at timestamptz not null default now(),
  unique (user_id, campaign_id)
);

comment on table public.anonymous_tokens is
  'Collega user_id a pseudonym_id, SOLO per garantire una compilazione anonima per utente per campagna (UNIQUE su user_id+campaign_id). Accesso ristretto al service_role (vedi Task 7) — mai esposta a hr_admin o a qualunque client autenticato.';
