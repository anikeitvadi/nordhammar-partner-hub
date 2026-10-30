// Synthetic hub seed. Every name, ID and address is invented; the shapes are real.
// Fixture IDs match eval cases E01 to E12 so seed data, demo inputs and eval cases are one set.
// Run with: DATABASE_URL=... pnpm --filter web db:seed
import { neon } from '@neondatabase/serverless'

const url = process.env.DATABASE_URL
if (!url) throw new Error('DATABASE_URL is required')
const sql = neon(url)

type C = {
  id: string; name: string; aliases?: string[]; city: string; street?: string; number?: string
  region: 'BR' | 'EU' | 'US' | 'IN' | 'CN'; country: string; scheme?: string; tax?: string; key?: string
  erp?: 'MAPICS' | 'IFS'; erpNo?: string; duns?: string; group?: string
}

const groups = [
  { id: 'GROUP-ORLA', name: 'Orla Group' },
  { id: 'GROUP-AURORA', name: 'Aurora Industrial Group' },
  { id: 'GROUP-VELA', name: 'Vela Holdings' },
]

// CNPJ root = first 8 digits = the company; last 6 = establishment + check digits.
const customers: C[] = [
  // Eval fixtures
  { id: 'G-BR', name: 'Aurora Industrial Ltda', city: 'Cidade Exemplo', street: 'Rua Demo', number: '10', region: 'BR', country: 'BR', scheme: 'CNPJ', tax: '61000101000157', key: '61000101', erp: 'MAPICS', erpNo: '25002', group: 'GROUP-AURORA' },
  { id: 'G-LEGACY', name: 'Vela Processos', city: 'Cidade Exemplo', street: 'Rua Demo', number: '30', region: 'BR', country: 'BR', erp: 'MAPICS', erpNo: '25010', group: 'GROUP-VELA' },
  { id: 'G-ALIAS', name: 'Ponte Técnica Exportação Ltda', aliases: ['Ponte Tecnica Export'], city: 'Cidade Exemplo', street: 'Rua Demo', number: '50', region: 'BR', country: 'BR', erp: 'MAPICS', erpNo: '25021' },
  { id: 'G-FOREIGN', name: 'Nimbo Serviços Ltda', city: 'Lisboa', street: 'Rua Exemplo', number: '7', region: 'EU', country: 'PT', scheme: 'CNPJ', tax: '61000107000124', key: '61000107', erp: 'IFS', erpNo: 'EU-4471' },
  { id: 'G-IN', name: 'Arco Engineering Pvt Ltd', city: 'Mumbai', region: 'IN', country: 'IN', scheme: 'GSTIN', tax: '27AABCV1234F1ZO', key: 'AABCV1234F', erp: 'MAPICS', erpNo: '31007' },
  { id: 'G-ORLA-EU', name: 'Orla Europa GmbH', city: 'Hamburg', street: 'Musterstraße', number: '12', region: 'EU', country: 'DE', scheme: 'VAT', tax: 'DE123456789', key: 'DE123456789', erp: 'IFS', erpNo: 'EU-1020', group: 'GROUP-ORLA' },
  { id: 'G-ORLA-BR', name: 'Orla Brasil Equipamentos Ltda', city: 'Cidade Exemplo', street: 'Rua Demo', number: '80', region: 'BR', country: 'BR', scheme: 'CNPJ', tax: '61000109000113', key: '61000109', erp: 'MAPICS', erpNo: '25033', group: 'GROUP-ORLA' },
  // Filler, BR
  { id: 'G-BR-02', name: 'Rio Norte Metalurgia Ltda', city: 'Porto Alegre', region: 'BR', country: 'BR', scheme: 'CNPJ', tax: '61000110000148', key: '61000110', erp: 'MAPICS', erpNo: '25041' },
  { id: 'G-BR-03', name: 'Serra Azul Compressores Ltda', city: 'Curitiba', region: 'BR', country: 'BR', scheme: 'CNPJ', tax: '61000111000192', key: '61000111', erp: 'MAPICS', erpNo: '25042' },
  { id: 'G-BR-04', name: 'Petro Vale Energia S.A.', city: 'Rio de Janeiro', region: 'BR', country: 'BR', scheme: 'CNPJ', tax: '61000112000137', key: '61000112', erp: 'MAPICS', erpNo: '25043' },
  { id: 'G-BR-05', name: 'Petro Vale Distribuidora Ltda', city: 'Duque de Caxias', region: 'BR', country: 'BR', scheme: 'CNPJ', tax: '61000112000218', key: '61000112', erp: 'MAPICS', erpNo: '25044' },
  { id: 'G-BR-06', name: 'Mar Alto Refrigeração Ltda', city: 'Salvador', region: 'BR', country: 'BR', scheme: 'CNPJ', tax: '61000113000181', key: '61000113', erp: 'MAPICS', erpNo: '25045' },
  { id: 'G-BR-07', name: 'Horizonte Papel e Celulose S.A.', city: 'Belo Horizonte', region: 'BR', country: 'BR', scheme: 'CNPJ', tax: '61000114000126', key: '61000114', erp: 'MAPICS', erpNo: '25046' },
  { id: 'G-BR-08', name: 'Cedro Alimentos Ltda', city: 'Campinas', region: 'BR', country: 'BR', scheme: 'CNPJ', tax: '61000115000170', key: '61000115', erp: 'MAPICS', erpNo: '25047' },
  { id: 'G-BR-09', name: 'Aurora Industrial Filial Sul', city: 'Joinville', region: 'BR', country: 'BR', scheme: 'CNPJ', tax: '61000101000238', key: '61000101', erp: 'MAPICS', erpNo: '25048', group: 'GROUP-AURORA' },
  { id: 'G-BR-10', name: 'Lagoa Química Ltda', city: 'Manaus', region: 'BR', country: 'BR', scheme: 'CNPJ', tax: '61000116000115', key: '61000116', erp: 'MAPICS', erpNo: '25049' },
  // Filler, EU
  { id: 'G-EU-02', name: 'Nordwind Wärmetechnik GmbH', city: 'Bremen', region: 'EU', country: 'DE', scheme: 'VAT', tax: 'DE223456789', key: 'DE223456789', erp: 'IFS', erpNo: 'EU-1031' },
  { id: 'G-EU-03', name: 'Lumen Procédés SAS', city: 'Lyon', region: 'EU', country: 'FR', scheme: 'VAT', tax: 'FRAB123456789', key: 'FRAB123456789', erp: 'IFS', erpNo: 'EU-1032' },
  { id: 'G-EU-04', name: 'Vela Processen B.V.', city: 'Rotterdam', region: 'EU', country: 'NL', scheme: 'VAT', tax: 'NL123456789B01', key: 'NL123456789B01', erp: 'IFS', erpNo: 'EU-1033', group: 'GROUP-VELA' },
  { id: 'G-EU-05', name: 'Aurora Nordic AB', city: 'Göteborg', region: 'EU', country: 'SE', scheme: 'VAT', tax: 'SE123456789001', key: 'SE123456789001', erp: 'IFS', erpNo: 'EU-1034', group: 'GROUP-AURORA' },
  { id: 'G-EU-06', name: 'Brezza Impianti S.r.l.', city: 'Milano', region: 'EU', country: 'IT', scheme: 'VAT', tax: 'IT12345678901', key: 'IT12345678901', erp: 'IFS', erpNo: 'EU-1035' },
  { id: 'G-EU-07', name: 'Kelda Marine Systems AS', city: 'Bergen', region: 'EU', country: 'NO', scheme: 'VAT', tax: 'NO123456789MVA', key: 'NO123456789MVA', erp: 'IFS', erpNo: 'EU-1036' },
  { id: 'G-EU-08', name: 'Ponte Técnica Ibérica S.L.', city: 'Bilbao', region: 'EU', country: 'ES', scheme: 'VAT', tax: 'ESB12345678', key: 'ESB12345678', erp: 'IFS', erpNo: 'EU-1037' },
]

const credit: { id: string; region: string; limit: number; currency: string; terms: string }[] = [
  { id: 'G-BR', region: 'BR', limit: 500000, currency: 'BRL', terms: 'N30' },
  { id: 'G-ORLA-BR', region: 'BR', limit: 250000, currency: 'BRL', terms: 'N45' },
  { id: 'G-BR-04', region: 'BR', limit: 1200000, currency: 'BRL', terms: 'N30' },
  { id: 'G-ORLA-EU', region: 'EU', limit: 400000, currency: 'EUR', terms: 'N30' },
  { id: 'G-FOREIGN', region: 'EU', limit: 80000, currency: 'EUR', terms: 'N30' },
  { id: 'G-EU-04', region: 'EU', limit: 150000, currency: 'EUR', terms: 'N60' },
]

// Test users. Create these in Supabase Auth with the same emails; passwords are handed over privately.
const entitlements = [
  { email: 'ana.requester@example.com', name: 'Ana Silva', role: 'requester', regions: ['BR'], global: false, money: ['BR'] },
  { email: 'jonas.requester@example.com', name: 'Jonas Weber', role: 'requester', regions: ['EU'], global: false, money: ['EU'] },
  { email: 'priya.reviewer@example.com', name: 'Priya Nair', role: 'reviewer', regions: ['BR', 'EU', 'US', 'IN', 'CN'], global: true, money: [] },
  { email: 'sam.operator@example.com', name: 'Sam Okafor', role: 'operator', regions: ['BR', 'EU', 'US', 'IN', 'CN'], global: true, money: [] },
  { email: 'noregion@example.com', name: 'No Region Yet', role: 'requester', regions: [], global: false, money: [] },
]

async function main() {
  for (const g of groups) await sql`insert into groups (group_id, name) values (${g.id}, ${g.name}) on conflict (group_id) do update set name = excluded.name`
  for (const c of customers) {
    await sql`insert into customers (golden_id, legal_name, aliases, city, street, street_number, region, country, tax_scheme, tax_canonical, tax_company_key, erp_system, erp_number, duns, group_id)
      values (${c.id}, ${c.name}, ${c.aliases ?? []}, ${c.city}, ${c.street ?? null}, ${c.number ?? null}, ${c.region}, ${c.country}, ${c.scheme ?? null}, ${c.tax ?? null}, ${c.key ?? null}, ${c.erp ?? null}, ${c.erpNo ?? null}, ${c.duns ?? null}, ${c.group ?? null})
      on conflict (golden_id) do update set legal_name = excluded.legal_name, aliases = excluded.aliases, city = excluded.city, street = excluded.street, street_number = excluded.street_number, region = excluded.region, country = excluded.country, tax_scheme = excluded.tax_scheme, tax_canonical = excluded.tax_canonical, tax_company_key = excluded.tax_company_key, erp_system = excluded.erp_system, erp_number = excluded.erp_number, duns = excluded.duns, group_id = excluded.group_id`
  }
  for (const r of credit) await sql`insert into regional_credit (golden_id, region, credit_limit, currency, terms) values (${r.id}, ${r.region}, ${r.limit}, ${r.currency}, ${r.terms}) on conflict (golden_id, region) do update set credit_limit = excluded.credit_limit, currency = excluded.currency, terms = excluded.terms`
  for (const e of entitlements) await sql`insert into entitlements (email, display_name, role, regions, global_identity, money_regions) values (${e.email}, ${e.name}, ${e.role}, ${e.regions}, ${e.global}, ${e.money}) on conflict (email) do update set display_name = excluded.display_name, role = excluded.role, regions = excluded.regions, global_identity = excluded.global_identity, money_regions = excluded.money_regions`
  console.info(`seeded ${groups.length} groups, ${customers.length} customers, ${credit.length} credit rows, ${entitlements.length} entitlements`)
}
main().catch((e) => { console.error(e); process.exit(1) })
