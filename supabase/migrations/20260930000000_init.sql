-- Privacy Week / Privacy Sprint: initial schema.
-- Public data is served exclusively through the Next.js server (service role).
-- RLS is enabled on every table with no policies for anon/authenticated, so a
-- leaked anon key can read nothing.

create extension if not exists pgcrypto;

create sequence submission_number_seq start 1;

create table submissions (
  id                uuid primary key default gen_random_uuid(),
  number            integer not null unique default nextval('submission_number_seq'), -- ticket "Nº 0007"
  slug              text not null unique,

  -- public
  project_name      text not null check (char_length(project_name) between 2 and 80),
  team_name         text check (char_length(team_name) <= 80),
  tagline           text not null check (char_length(tagline) between 10 and 140),
  category          text not null check (category in ('cloak', 'zcash', 'private_payments')),
  tech              text not null check (tech in ('cloak', 'zcash', 'both')),
  repo_url          text not null,
  sprint_changes    text not null check (char_length(sprint_changes) <= 300), -- branch, PR or commit range
  proof_type        text not null check (proof_type in ('solana_tx', 'zcash_tx', 'app_url')),
  proof_value       text not null,
  demo_video_url    text not null,
  writeup           text not null,  -- max 300 words, enforced in the app
  colosseum_url     text,           -- optional: the team's Colosseum project page
  website_url       text,
  members           jsonb not null default '[]', -- [{ name, x?, github? }], 1 to 6 people
  show_members      boolean not null default true,

  -- private (never leaves the server except to the admin)
  contact_name      text not null,
  contact_email     text not null,
  contact_telegram  text,
  contact_whatsapp  text,
  accepted_rules    boolean not null check (accepted_rules),

  -- moderation, judging, payout
  status            text not null default 'submitted' check (status in ('submitted', 'hidden', 'disqualified')),
  is_winner         boolean not null default false,
  prize_pool        text check (prize_pool in ('cloak', 'zcash')),
  payout_status     text not null default 'pending' check (payout_status in ('pending', 'link_sent', 'claimed')),
  admin_notes       text,

  -- security
  edit_token_hash   text not null unique,
  ip_hash           text,

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table judge_scores (
  id              uuid primary key default gen_random_uuid(),
  submission_id   uuid not null references submissions(id) on delete cascade,
  judge           text not null,
  privacy_impact  smallint not null check (privacy_impact between 0 and 10),
  execution       smallint not null check (execution between 0 and 10),
  project_fit     smallint not null check (project_fit between 0 and 10),
  ux_presentation smallint not null check (ux_presentation between 0 and 10),
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (submission_id, judge)
);

-- Keep updated_at fresh on every write.
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger submissions_set_updated_at
  before update on submissions
  for each row execute function set_updated_at();

create trigger judge_scores_set_updated_at
  before update on judge_scores
  for each row execute function set_updated_at();

create index submissions_status_created_at_idx on submissions (status, created_at desc);
create index submissions_category_idx on submissions (category);
create index submissions_tech_idx on submissions (tech);
create index submissions_ip_hash_created_at_idx on submissions (ip_hash, created_at desc);
create index judge_scores_submission_id_idx on judge_scores (submission_id);

alter table submissions  enable row level security;
alter table judge_scores enable row level security;
-- Intentionally no policies: only the service role (server) can read or write.

-- The service role bypasses RLS but still needs table/sequence privileges.
grant usage on schema public to service_role;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant execute on all functions in schema public to service_role;
