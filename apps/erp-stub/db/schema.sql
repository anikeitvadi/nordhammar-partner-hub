-- The stub's ledger. One row per operation key. The key is claimed in the same transaction that assigns the number.
-- Two ERP masters, one ledger: the domain says which master the number came from.
create table if not exists operations (
  operation_key text primary key,
  domain text not null default 'customer' check (domain in ('customer','supplier')),
  payload_hash text not null,
  status text not null check (status in ('created','rejected')),
  customer_number text,
  reason text,
  received_at timestamptz not null default now()
);
alter table operations add column if not exists domain text not null default 'customer';
create sequence if not exists customer_numbers start 26000;
create sequence if not exists supplier_numbers start 70100;
-- Demo fault switch (DEMO_CONTROLS_ENABLED=true only). One shot: armed by the operator, consumed by the next successful create.
create table if not exists demo_faults (
  id int primary key default 1 check (id = 1),
  lost_response_armed boolean not null default false,
  armed_at timestamptz
);
insert into demo_faults (id) values (1) on conflict (id) do nothing;

-- Three ERP instances behind one integration layer (docs/STAGE-SET-CONTRACT.md). The ledger above stays the one
-- record of every create; it now names the ERP that assigned the number. Old rows from before the split have none.
alter table operations add column if not exists erp text;
create sequence if not exists erp1_customer_numbers start 110201;
create sequence if not exists erp1_supplier_numbers start 150201;
create sequence if not exists erp2_customer_numbers start 210201;
create sequence if not exists erp2_supplier_numbers start 250201;
create sequence if not exists erp3_customer_numbers start 310201;
create sequence if not exists erp3_supplier_numbers start 350201;

-- Each ERP's own master, in its own shape: what the integration layer wrote, as that ERP stores it. The console
-- reads this; the hub never does.
create table if not exists erp_records (
  erp text not null check (erp in ('ERP-1','ERP-2','ERP-3')),
  domain text not null check (domain in ('customer','supplier')),
  number text not null,
  native jsonb not null,
  operation_key text,
  created_at timestamptz not null default now(),
  primary key (erp, domain, number)
);

-- The golden records the customer's pipeline publishes, already cleansed on their side. The hub's load reads them
-- through GET /integration/v1/golden-records; (updated_at, golden_id) is the cursor.
create table if not exists golden_records (
  golden_id text primary key,
  doc jsonb not null,
  updated_at timestamptz not null default now()
);
create index if not exists golden_records_cursor on golden_records (updated_at, golden_id);

-- The customer's service desk (docs/SERVICE-DESK-CONTRACT.md §7). Finance approves new partners here; a decision is
-- written with its webhook event in one transaction (the outbox), then delivered to the hub, at least once.
create sequence if not exists desk_ticket_numbers start 10421;
create table if not exists desk_tickets (
  ticket_id text primary key,
  source text not null check (source in ('hub','desk')),
  hub_request_id text,
  hub_revision int,
  requester_email text not null,
  region text not null,
  domain text not null check (domain in ('customer','supplier')),
  summary jsonb not null,
  partner jsonb,
  status text not null default 'open' check (status in ('open','finance_approved','finance_rejected','done')),
  decided_by text,
  decision_reason text,
  decided_at timestamptz,
  created_at timestamptz not null default now()
);
create unique index if not exists desk_tickets_hub_request on desk_tickets (hub_request_id, hub_revision) where hub_request_id is not null;
create table if not exists desk_comments (
  id bigserial primary key,
  ticket_id text not null references desk_tickets(ticket_id),
  at timestamptz not null default now(),
  author text not null,
  body text not null,
  dedupe_key text unique
);
create table if not exists desk_outbox (
  event_id text primary key,
  ticket_id text not null references desk_tickets(ticket_id),
  type text not null,
  body text not null,
  attempts int not null default 0,
  last_error text,
  delivered_at timestamptz,
  created_at timestamptz not null default now()
);
