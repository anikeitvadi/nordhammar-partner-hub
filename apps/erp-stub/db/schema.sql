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
