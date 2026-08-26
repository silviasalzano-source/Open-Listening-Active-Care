-- web/supabase/migrations/20260821162934_performance_indexes.sql

-- Indici sulle FK più interrogate: nominative_responses_history.submission_id
-- (query di storico + on delete cascade da submissions), e campaign_id su
-- submissions/anonymous_tokens (lookup e on delete restrict da
-- survey_campaigns). Le UNIQUE(user_id, campaign_id) esistenti hanno
-- user_id come colonna guida e non servono queste query.

create index if not exists nominative_responses_history_submission_id_idx
  on public.nominative_responses_history (submission_id);

create index if not exists submissions_campaign_id_idx
  on public.submissions (campaign_id);

create index if not exists anonymous_tokens_campaign_id_idx
  on public.anonymous_tokens (campaign_id);
