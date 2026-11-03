-- Intake requests. The database owns accepted business state and the timeline; the Workflow owns execution only.
create table if not exists requests (
  request_id text primary key,
  domain text not null default 'customer' check (domain in ('customer','supplier')),
  region text not null,
  requester_email text not null,
  current_revision int not null default 0,
  state_kind text not null,
  state jsonb not null,
  dup_choice text,                      -- 'new' | 'new_in_group' | 'not_related'
  dup_reason text,
  linked_golden_id text,                -- the candidate the requester linked as group/parent hint (proposal only)
  execution_generation int not null default 0,
  execution_token text,
  workflow_run_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists requests_queue on requests (state_kind, created_at);
create index if not exists requests_by_requester on requests (requester_email, created_at desc);

-- Immutable. A resubmission is a new row with revision + 1; the hash is what an approval binds to.
create table if not exists request_revisions (
  request_id text not null references requests(request_id),
  revision int not null,
  payload jsonb not null,
  payload_hash text not null,
  submitted_at timestamptz not null default now(),
  primary key (request_id, revision)
);

-- First decision wins: one row per request/revision, enforced by the key.
create table if not exists review_decisions (
  decision_id text primary key,
  request_id text not null references requests(request_id),
  revision int not null,
  reviewer_email text not null,
  decision text not null check (decision in ('approve','decline','send_back')),
  reason text,
  payload_hash text not null,
  decided_at timestamptz not null default now(),
  unique (request_id, revision)
);

-- Append-only timeline shown on the status page.
create table if not exists request_events (
  id bigserial primary key,
  request_id text not null references requests(request_id),
  at timestamptz not null default now(),
  kind text not null,
  actor text,
  detail jsonb
);
create index if not exists request_events_by_request on request_events (request_id, id);

-- One open request per comparable identity. Prevents two parallel requests for the same tax ID and holds the
-- identity between ERP creation and the next hub load, when golden search cannot see it yet.
create table if not exists identity_reservations (
  domain text not null check (domain in ('customer','supplier')),
  tax_canonical text not null,
  request_id text not null references requests(request_id),
  reserved_at timestamptz not null default now(),
  primary key (domain, tax_canonical)
);

-- Durable record of "the workflow needs to be told". The decision is accepted in the same transaction that writes this
-- row; delivery to the workflow is retried from here if the wake fails.
create table if not exists deliveries (
  request_id text not null references requests(request_id),
  revision int not null,
  kind text not null check (kind in ('start','wake')),
  status text not null default 'pending' check (status in ('pending','delivered','failed')),
  attempts int not null default 0,
  last_error text,
  payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (request_id, revision, kind)
);

-- Every on-entry check, whatever it found. "Duplicates stopped at entry" is counted from here: an exact tax-ID match
-- the form would not continue past. Written best-effort by the check (a failed write never blocks the form) and
-- linked to the request that follows, if one does. On the compare route it also holds what the model proposed and
-- what that cost, read from the Gateway's response, so the request carries its own AI record without trusting the browser.
create table if not exists hub_checks (
  check_id text primary key,
  at timestamptz not null default now(),
  requester_email text not null,
  domain text not null check (domain in ('customer','supplier')),
  region text not null,
  tax_canonical text not null,
  route text not null check (route in ('exact_visible','exact_foreign','related','compare','clear')),
  matched_golden_id text,               -- null on exact_foreign: the requester only ever saw the region
  matched_name text,
  matched_region text,
  ai_verdict text,
  ai_golden_id text,
  ai_model text,
  ai_input_tokens int,
  ai_output_tokens int,
  ai_cost numeric,
  ai_generation_id text,
  ai_unavailable text,
  request_id text references requests(request_id)
);
create index if not exists hub_checks_latest on hub_checks (requester_email, domain, tax_canonical, at desc);
create index if not exists hub_checks_by_month on hub_checks (at, route);
