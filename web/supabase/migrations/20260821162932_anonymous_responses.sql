-- web/supabase/migrations/20260821162932_anonymous_responses.sql

create table public.anonymous_responses (
  id uuid primary key default gen_random_uuid(),
  pseudonym_id text not null references public.anonymous_tokens(pseudonym_id) on delete restrict,
  question_id text not null,
  answer jsonb not null,
  created_at timestamptz not null default now(),
  unique (pseudonym_id, question_id)
);

comment on table public.anonymous_responses is
  'Risposte della fase anonima. Nessuna colonna user_id: non collegabile a una persona nemmeno indirettamente. Immutabile: solo INSERT previsto, nessun UPDATE.';
