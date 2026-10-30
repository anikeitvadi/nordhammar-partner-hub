-- The stub's ledger. One row per operation key. The key is claimed in the same transaction that assigns the number.
create table if not exists operations (
  operation_key text primary key,
  payload_hash text not null,
  status text not null check (status in ('created','rejected')),
  customer_number text,
  reason text,
  received_at timestamptz not null default now()
);
create sequence if not exists customer_numbers start 26000;
