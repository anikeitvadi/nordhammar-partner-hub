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
