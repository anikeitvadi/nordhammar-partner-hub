-- The "hub": golden customer records across regions. In the real engagement this is the MDH export; here it is Neon.
-- Idempotent. Run with: pnpm --filter web db:schema
create table if not exists groups (
  group_id text primary key,
  name text not null
);

create table if not exists customers (
  golden_id text primary key,
  legal_name text not null,
  aliases text[] not null default '{}',
  city text not null,
  street text,
  street_number text,
  region text not null check (region in ('BR','EU','US','IN','CN')),
  country text not null,
  tax_scheme text,
  tax_canonical text,
  tax_company_key text,
  erp_system text check (erp_system in ('MAPICS','IFS')),
  erp_number text,
  duns text,
  group_id text references groups(group_id),
  loaded_at timestamptz not null default now()
);
create index if not exists customers_region_name on customers (region, lower(legal_name));
create unique index if not exists customers_tax_canonical on customers (tax_canonical) where tax_canonical is not null;

-- Money is per region. It is never joined into a global view by this app.
create table if not exists regional_credit (
  golden_id text not null references customers(golden_id),
  region text not null,
  credit_limit numeric not null,
  currency text not null,
  terms text not null,
  primary key (golden_id, region)
);

-- Entitlements are the fresh, server-side source of role and regions. Identity comes from Supabase Auth; this table says what that identity may see.
create table if not exists entitlements (
  email text primary key,
  display_name text not null,
  role text not null check (role in ('requester','reviewer','steward','operator')),
  regions text[] not null default '{}',
  global_identity boolean not null default false,
  money_regions text[] not null default '{}'
);
