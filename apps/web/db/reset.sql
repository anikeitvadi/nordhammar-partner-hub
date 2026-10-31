-- Drops everything both schema files create. Demo data only; never run against anything you care about.
drop table if exists deliveries, request_events, review_decisions, identity_reservations, request_revisions, requests cascade;
drop table if exists regional_spend, regional_credit, party_sources, party_addresses, parties, groups, entitlements cascade;
drop table if exists customers cascade;
