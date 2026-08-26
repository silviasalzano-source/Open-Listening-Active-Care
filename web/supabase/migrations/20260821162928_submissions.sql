-- web/supabase/migrations/20260821162928_submissions.sql

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.survey_campaigns(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'in_progress' check (status in ('in_progress', 'submitted')),
  submitted_at timestamptz,
  last_edited_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, campaign_id)
);

comment on table public.submissions is
  'Una compilazione della fase nominativa per un utente in una campagna. id = GUID di riferimento mostrato al dipendente a fine survey. Una sola riga per (user_id, campaign_id): il vincolo UNIQUE garantisce "una compilazione per utente per campagna".';
