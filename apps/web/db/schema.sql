-- The "hub": golden business-partner records across regions. In the real engagement this is the MDH export; here it is Neon.
-- Idempotent. Run with: pnpm --filter web db:schema (add --reset to drop first)
create table if not exists groups (
  group_id text primary key,
  name text not null
);

-- One row per golden record. Customers and suppliers share the table and the identity rules; the domain is part of
-- the identity (the same legal entity can be both), and the ERP master it lives in differs.
-- Field set deliberately mirrors what the ERP customer master actually carries (number, user reference, type,
-- hold, dates, DUNS, tax registration, language, currency) plus the few fields that make the data answerable:
-- industry, payment terms, risk rating, last activity, parent and ultimate parent.
create table if not exists parties (
  golden_id text primary key,
  domain text not null check (domain in ('customer','supplier')),
  legal_name text not null,
  local_name text,                       -- name in the local script (China)
  aliases text[] not null default '{}',
  tax_scheme text,
  tax_canonical text,
  tax_company_key text,
  identifiers jsonb not null default '[]', -- [{scheme, value}]: state tax ID, PAN, VAT alongside a company number
  duns text,
  duns_rating text,
  region text not null check (region in ('BR','EU','US','IN','CN')),
  country text not null,
  erp_system text check (erp_system in ('ERP-1','ERP-2')),
  erp_number text,
  erp_segment text,                      -- the ERP segment / company the record sits in
  user_ref text,                         -- the number people type in the ERP every day
  type_code text,                        -- customer type or supplier category
  industry text,
  status text not null default 'active' check (status in ('active','hold','inactive')),
  payment_terms text,
  currency text,
  risk_rating text,                      -- A..D, from the ERP's review
  inception_at date,
  last_activity_at date,                 -- last order (customer) or last receipt (supplier)
  updated_by text,
  group_id text references groups(group_id),
  parent_golden_id text references parties(golden_id),
  ultimate_parent_golden_id text references parties(golden_id),
  -- bill-to / remit-to copy for search and lists; the full address list is party_addresses
  city text not null,
  street text,
  street_number text,
  loaded_at timestamptz not null default now()
);
create index if not exists parties_domain_region_name on parties (domain, region, lower(legal_name));
create index if not exists parties_city on parties (domain, region, lower(city));
create index if not exists parties_duns on parties (duns) where duns is not null;
create index if not exists parties_erp_number on parties (erp_number) where erp_number is not null;
create unique index if not exists parties_domain_tax on parties (domain, tax_canonical) where tax_canonical is not null;

-- Every address the sources hold, one row per source address. kind: bill_to, ship_to, remit_to.
create table if not exists party_addresses (
  golden_id text not null references parties(golden_id),
  source_address_id text not null,
  kind text not null check (kind in ('bill_to','ship_to','remit_to')),
  street text not null,
  street_number text,
  complement text,
  district text,
  city text not null,
  region_code text,
  postal_code text,
  country text not null,
  is_default boolean not null default false,
  primary key (golden_id, source_address_id)
);

-- Lineage: which source contributed to the golden record and when it was last loaded.
create table if not exists party_sources (
  golden_id text not null references parties(golden_id),
  source_system text not null,           -- ERP1_BR, ERP2_EU, LAKE_CN, HIERARCHY ...
  source_id text not null,
  loaded_at timestamptz not null default now(),
  primary key (golden_id, source_system)
);

-- Money is per region. It is never joined into a global view by this app.
-- Customers: credit limit and terms. Suppliers: spend year to date. Both gated by the money scope.
create table if not exists regional_credit (
  golden_id text not null references parties(golden_id),
  region text not null,
  credit_limit numeric not null,
  currency text not null,
  terms text not null,
  primary key (golden_id, region)
);
create table if not exists regional_spend (
  golden_id text not null references parties(golden_id),
  region text not null,
  spend_ytd numeric not null,
  currency text not null,
  open_invoices numeric not null default 0,
  primary key (golden_id, region)
);

-- Entitlements are the fresh, server-side source of role and regions. Identity comes from the identity provider; this table says what that identity may see.
create table if not exists entitlements (
  email text primary key,
  display_name text not null,
  role text not null check (role in ('requester','reviewer','steward','operator')),
  regions text[] not null default '{}',
  global_identity boolean not null default false,
  money_regions text[] not null default '{}'
);
