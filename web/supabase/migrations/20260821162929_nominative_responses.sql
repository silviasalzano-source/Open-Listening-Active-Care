create table public.nominative_responses (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  question_id text not null,
  answer jsonb not null,
  updated_at timestamptz not null default now(),
  unique (submission_id, question_id)
);

comment on table public.nominative_responses is
  'Valore CORRENTE di ogni risposta della fase nominativa, una riga per domanda per compilazione. Lo storico delle sovrascritture è in nominative_responses_history (Task 4).';

create trigger trg_nominative_responses_updated_at
before update on public.nominative_responses
for each row
execute function public.set_updated_at();
