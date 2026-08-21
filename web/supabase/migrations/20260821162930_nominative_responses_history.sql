create table public.nominative_responses_history (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  question_id text not null,
  previous_answer jsonb not null,
  replaced_at timestamptz not null default now()
);

comment on table public.nominative_responses_history is
  'Storico append-only: una riga per ogni sovrascrittura di nominative_responses, con il valore PRECEDENTE alla modifica. Popolata solo dal trigger sotto, nessuna scrittura applicativa diretta prevista.';

create or replace function public.log_nominative_response_history()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.nominative_responses_history (submission_id, question_id, previous_answer, replaced_at)
  values (old.submission_id, old.question_id, old.answer, now());

  update public.submissions
  set last_edited_at = now()
  where id = old.submission_id;

  return new;
end;
$$;

comment on function public.log_nominative_response_history is
  'Trigger BEFORE UPDATE su nominative_responses: se answer cambia, salva il valore precedente in nominative_responses_history e aggiorna submissions.last_edited_at nella stessa transazione. Gira come SECURITY DEFINER in modo da poter scrivere in nominative_responses_history senza dover concedere il privilegio INSERT su quella tabella a nessun ruolo client (authenticated/anon).';

create trigger trg_log_nominative_response_history
before update on public.nominative_responses
for each row
when (old.answer is distinct from new.answer)
execute function public.log_nominative_response_history();
