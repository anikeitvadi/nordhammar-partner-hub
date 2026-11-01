// Synthetic hub seed for Nordhammar Industries, a fictional European manufacturer with five regions and two ERPs.
// Every name, ID and address is invented; the shapes are real. Fixture IDs match eval cases E01 to E12 so seed data,
// demo inputs and eval cases are one set. Run with: DATABASE_URL=... pnpm --filter web db:seed
import { neon } from '@neondatabase/serverless'

const url = process.env.DATABASE_URL
if (!url) throw new Error('DATABASE_URL is required')
const sql = neon(url)

type Region = 'BR' | 'EU' | 'US' | 'IN' | 'CN'
type Addr = { id: string; kind: 'bill_to' | 'ship_to' | 'remit_to'; street: string; number?: string; complement?: string; district?: string; city: string; rc?: string; pc?: string; country: string; def?: boolean }
type P = {
  id: string; domain: 'customer' | 'supplier'; name: string; local?: string; aliases?: string[]
  region: Region; country: string; scheme?: string; tax?: string; key?: string; ids?: { scheme: string; value: string }[]
  duns?: string; dunsRating?: string
  erp?: 'ERP-1' | 'ERP-2'; erpNo?: string; seg?: string; userRef?: string
  type?: string; industry?: string; status?: 'active' | 'hold' | 'inactive'; terms?: string; currency?: string; risk?: string
  inception?: string; lastActivity?: string; updatedBy?: string
  group?: string; parent?: string; ultimate?: string
  city: string; street?: string; number?: string
  addresses?: Addr[]
  sources?: { system: string; id: string; loadedAt: string }[]
}

const groups = [
  { id: 'GROUP-ORLA', name: 'Orla Group' },
  { id: 'GROUP-AURORA', name: 'Aurora Industrial Group' },
  { id: 'GROUP-VELA', name: 'Vela Holdings' },
  { id: 'GROUP-PETROVALE', name: 'Petro Vale' },
]

const seg: Record<Region, string> = { BR: 'NH-BR', US: 'NH-US', IN: 'NH-IN', CN: 'NH-CN', EU: 'NH-EU' }
const erpOf = (r: Region) => (r === 'EU' ? 'ERP-2' : 'ERP-1') as 'ERP-1' | 'ERP-2'
const src = (r: Region) => (r === 'CN' ? 'LAKE_CN' : r === 'EU' ? 'ERP2_EU' : `ERP1_${r}`)

// CNPJ root = first 8 digits = the company; last 6 = establishment + check digits. All check digits valid.
const customers: P[] = [
  // Eval fixtures (E01..E12 reference these)
  { id: 'G-BR', domain: 'customer', name: 'Aurora Industrial Ltda', city: 'Cidade Exemplo', street: 'Rua Demo', number: '10', region: 'BR', country: 'BR', scheme: 'CNPJ', tax: '61000101000157', key: '61000101', ids: [{ scheme: 'IE', value: '110042490114' }], duns: '884983974', dunsRating: '3A2', erpNo: '25002', userRef: 'AURORA', type: 'end_user', industry: 'Food & beverage processing', terms: 'N30', currency: 'BRL', risk: 'A', inception: '2014-03-11', lastActivity: '2026-10-20', group: 'GROUP-AURORA', parent: 'G-EU-05', ultimate: 'G-EU-05',
    addresses: [{ id: 'A-25002-1', kind: 'bill_to', street: 'Rua Demo', number: '10', district: 'Centro', city: 'Cidade Exemplo', rc: 'SP', pc: '01000-000', country: 'BR', def: true }, { id: 'A-25002-2', kind: 'ship_to', street: 'Rodovia Demo', number: 'km 14', district: 'Distrito Industrial', city: 'Cidade Exemplo', rc: 'SP', pc: '01100-000', country: 'BR' }] },
  { id: 'G-LEGACY', domain: 'customer', name: 'Vela Processos', city: 'Cidade Exemplo', street: 'Rua Demo', number: '30', region: 'BR', country: 'BR', erpNo: '25010', userRef: 'VELAPROC', type: 'end_user', industry: 'Chemicals', status: 'hold', terms: 'N30', currency: 'BRL', risk: 'C', inception: '2009-08-02', lastActivity: '2024-02-09', group: 'GROUP-VELA' },
  { id: 'G-ALIAS', domain: 'customer', name: 'Ponte Técnica Exportação Ltda', aliases: ['Ponte Tecnica Export'], city: 'Cidade Exemplo', street: 'Rua Demo', number: '50', region: 'BR', country: 'BR', erpNo: '25021', userRef: 'PONTE', type: 'distributor', industry: 'Industrial distribution', terms: 'N45', currency: 'BRL', risk: 'B', inception: '2017-01-20', lastActivity: '2026-09-30' },
  { id: 'G-FOREIGN', domain: 'customer', name: 'Nimbo Serviços Ltda', city: 'Lisboa', street: 'Rua Exemplo', number: '7', region: 'EU', country: 'PT', scheme: 'CNPJ', tax: '61000107000124', key: '61000107', erpNo: 'EU-4471', type: 'contractor', industry: 'Engineering services', terms: 'N30', currency: 'EUR', risk: 'B', inception: '2020-06-01', lastActivity: '2026-08-14' },
  { id: 'G-IN', domain: 'customer', name: 'Arco Engineering Pvt Ltd', city: 'Mumbai', street: 'Marine Drive', number: '12', region: 'IN', country: 'IN', scheme: 'GSTIN', tax: '27AABCV1234F1ZO', key: 'AABCV1234F', ids: [{ scheme: 'PAN', value: 'AABCV1234F' }], duns: '650221187', erpNo: '31007', userRef: 'ARCOENG', type: 'oem', industry: 'Power generation', terms: 'N60', currency: 'INR', risk: 'A', inception: '2015-09-10', lastActivity: '2026-10-02' },
  { id: 'G-ORLA-EU', domain: 'customer', name: 'Orla Europa GmbH', city: 'Hamburg', street: 'Musterstraße', number: '12', region: 'EU', country: 'DE', scheme: 'VAT', tax: 'DE123456789', key: 'DE123456789', duns: '315182413', dunsRating: '4A1', erpNo: 'EU-1020', userRef: 'ORLA-EU', type: 'oem', industry: 'Marine equipment', terms: 'N30', currency: 'EUR', risk: 'A', inception: '2008-02-18', lastActivity: '2026-10-28', group: 'GROUP-ORLA',
    addresses: [{ id: 'A-1020-1', kind: 'bill_to', street: 'Musterstraße', number: '12', city: 'Hamburg', pc: '20095', country: 'DE', def: true }, { id: 'A-1020-2', kind: 'ship_to', street: 'Hafenweg', number: '3', city: 'Hamburg', pc: '21107', country: 'DE' }] },
  { id: 'G-ORLA-BR', domain: 'customer', name: 'Orla Brasil Equipamentos Ltda', city: 'Cidade Exemplo', street: 'Rua Demo', number: '80', region: 'BR', country: 'BR', scheme: 'CNPJ', tax: '61000109000113', key: '61000109', duns: '315182421', erpNo: '25033', userRef: 'ORLA-BR', type: 'oem', industry: 'Marine equipment', terms: 'N45', currency: 'BRL', risk: 'B', inception: '2019-11-05', lastActivity: '2026-10-12', group: 'GROUP-ORLA', parent: 'G-ORLA-EU', ultimate: 'G-ORLA-EU' },
  // Brazil
  { id: 'G-BR-02', domain: 'customer', name: 'Rio Norte Metalurgia Ltda', city: 'Porto Alegre', street: 'Av. Industrial', number: '400', region: 'BR', country: 'BR', scheme: 'CNPJ', tax: '61000110000148', key: '61000110', erpNo: '25041', type: 'end_user', industry: 'Metals', terms: 'N30', currency: 'BRL', risk: 'B', inception: '2012-05-14', lastActivity: '2026-07-22' },
  { id: 'G-BR-03', domain: 'customer', name: 'Serra Azul Compressores Ltda', city: 'Curitiba', street: 'Rua das Oficinas', number: '88', region: 'BR', country: 'BR', scheme: 'CNPJ', tax: '61000111000192', key: '61000111', erpNo: '25042', type: 'oem', industry: 'Machinery', terms: 'N30', currency: 'BRL', risk: 'A', inception: '2016-02-29', lastActivity: '2026-10-05' },
  { id: 'G-BR-04', domain: 'customer', name: 'Petro Vale Energia S.A.', city: 'Rio de Janeiro', street: 'Av. Atlântica', number: '1500', region: 'BR', country: 'BR', scheme: 'CNPJ', tax: '61000112000137', key: '61000112', duns: '902211845', dunsRating: '5A1', erpNo: '25043', type: 'end_user', industry: 'Oil & gas', terms: 'N30', currency: 'BRL', risk: 'A', inception: '2010-10-10', lastActivity: '2026-10-29', group: 'GROUP-PETROVALE' },
  { id: 'G-BR-05', domain: 'customer', name: 'Petro Vale Distribuidora Ltda', city: 'Duque de Caxias', street: 'Rod. Washington Luís', number: 'km 110', region: 'BR', country: 'BR', scheme: 'CNPJ', tax: '61000112000218', key: '61000112', erpNo: '25044', type: 'distributor', industry: 'Oil & gas', terms: 'N30', currency: 'BRL', risk: 'B', inception: '2013-04-01', lastActivity: '2026-09-18', group: 'GROUP-PETROVALE', parent: 'G-BR-04', ultimate: 'G-BR-04' },
  { id: 'G-BR-06', domain: 'customer', name: 'Mar Alto Refrigeração Ltda', city: 'Salvador', street: 'Av. Tancredo Neves', number: '2200', region: 'BR', country: 'BR', scheme: 'CNPJ', tax: '61000113000181', key: '61000113', erpNo: '25045', type: 'contractor', industry: 'HVAC & refrigeration', terms: 'N30', currency: 'BRL', risk: 'C', inception: '2021-07-19', lastActivity: '2025-12-03' },
  { id: 'G-BR-07', domain: 'customer', name: 'Horizonte Papel e Celulose S.A.', city: 'Belo Horizonte', street: 'Av. Afonso Pena', number: '3000', region: 'BR', country: 'BR', scheme: 'CNPJ', tax: '61000114000126', key: '61000114', duns: '770013562', erpNo: '25046', type: 'end_user', industry: 'Pulp & paper', terms: 'N60', currency: 'BRL', risk: 'A', inception: '2011-01-25', lastActivity: '2026-10-15' },
  { id: 'G-BR-08', domain: 'customer', name: 'Cedro Alimentos Ltda', city: 'Campinas', street: 'Rua Barão de Jaguara', number: '500', region: 'BR', country: 'BR', scheme: 'CNPJ', tax: '61000115000170', key: '61000115', erpNo: '25047', type: 'end_user', industry: 'Food & beverage processing', terms: 'N30', currency: 'BRL', risk: 'B', inception: '2018-08-08', lastActivity: '2026-06-30' },
  { id: 'G-BR-09', domain: 'customer', name: 'Aurora Industrial Filial Sul', city: 'Joinville', street: 'Rua Blumenau', number: '1200', region: 'BR', country: 'BR', scheme: 'CNPJ', tax: '61000101000238', key: '61000101', erpNo: '25048', type: 'end_user', industry: 'Food & beverage processing', terms: 'N30', currency: 'BRL', risk: 'A', inception: '2022-03-01', lastActivity: '2026-10-19', group: 'GROUP-AURORA', parent: 'G-BR', ultimate: 'G-EU-05' },
  { id: 'G-BR-10', domain: 'customer', name: 'Lagoa Química Ltda', city: 'Manaus', street: 'Av. Torquato Tapajós', number: '7000', region: 'BR', country: 'BR', scheme: 'CNPJ', tax: '61000116000115', key: '61000116', erpNo: '25049', type: 'end_user', industry: 'Chemicals', status: 'hold', terms: 'N30', currency: 'BRL', risk: 'D', inception: '2015-05-05', lastActivity: '2026-03-11' },
  // Europe
  { id: 'G-EU-02', domain: 'customer', name: 'Nordwind Wärmetechnik GmbH', city: 'Bremen', street: 'Hansastraße', number: '21', region: 'EU', country: 'DE', scheme: 'VAT', tax: 'DE223456789', key: 'DE223456789', erpNo: 'EU-1031', type: 'oem', industry: 'HVAC & refrigeration', terms: 'N30', currency: 'EUR', risk: 'A', inception: '2009-09-09', lastActivity: '2026-10-21' },
  { id: 'G-EU-03', domain: 'customer', name: 'Lumen Procédés SAS', city: 'Lyon', street: 'Rue de la Part-Dieu', number: '45', region: 'EU', country: 'FR', scheme: 'VAT', tax: 'FRAB123456789', key: 'FRAB123456789', erpNo: 'EU-1032', type: 'end_user', industry: 'Chemicals', terms: 'N45', currency: 'EUR', risk: 'B', inception: '2014-11-30', lastActivity: '2026-08-27' },
  { id: 'G-EU-04', domain: 'customer', name: 'Vela Processen B.V.', city: 'Rotterdam', street: 'Maasboulevard', number: '100', region: 'EU', country: 'NL', scheme: 'VAT', tax: 'NL123456789B01', key: 'NL123456789B01', erpNo: 'EU-1033', type: 'end_user', industry: 'Chemicals', terms: 'N60', currency: 'EUR', risk: 'B', inception: '2011-06-15', lastActivity: '2026-10-01', group: 'GROUP-VELA' },
  { id: 'G-EU-05', domain: 'customer', name: 'Aurora Nordic AB', city: 'Göteborg', street: 'Lindholmsallén', number: '10', region: 'EU', country: 'SE', scheme: 'VAT', tax: 'SE123456789001', key: 'SE123456789001', duns: '884983001', dunsRating: '5A1', erpNo: 'EU-1034', type: 'end_user', industry: 'Food & beverage processing', terms: 'N30', currency: 'SEK', risk: 'A', inception: '2005-01-10', lastActivity: '2026-10-27', group: 'GROUP-AURORA' },
  { id: 'G-EU-06', domain: 'customer', name: 'Brezza Impianti S.r.l.', city: 'Milano', street: 'Via Monte Napoleone', number: '8', region: 'EU', country: 'IT', scheme: 'VAT', tax: 'IT12345678901', key: 'IT12345678901', erpNo: 'EU-1035', type: 'contractor', industry: 'Engineering services', terms: 'N30', currency: 'EUR', risk: 'B', inception: '2019-03-03', lastActivity: '2026-05-19' },
  { id: 'G-EU-07', domain: 'customer', name: 'Kelda Marine Systems AS', city: 'Bergen', street: 'Bryggen', number: '5', region: 'EU', country: 'NO', scheme: 'VAT', tax: 'NO123456789MVA', key: 'NO123456789MVA', erpNo: 'EU-1036', type: 'oem', industry: 'Marine equipment', terms: 'N30', currency: 'NOK', risk: 'A', inception: '2016-10-04', lastActivity: '2026-10-25' },
  { id: 'G-EU-08', domain: 'customer', name: 'Ponte Técnica Ibérica S.L.', city: 'Bilbao', street: 'Gran Vía', number: '30', region: 'EU', country: 'ES', scheme: 'VAT', tax: 'ESB12345678', key: 'ESB12345678', erpNo: 'EU-1037', type: 'distributor', industry: 'Industrial distribution', terms: 'N45', currency: 'EUR', risk: 'B', inception: '2018-12-12', lastActivity: '2026-09-09' },
  // United States
  { id: 'G-US-01', domain: 'customer', name: 'Great Plains Ethanol LLC', city: 'Sioux Falls', street: 'N Phillips Ave', number: '200', region: 'US', country: 'US', scheme: 'EIN', tax: '470912345', key: '470912345', duns: '117432981', dunsRating: '4A2', erpNo: '12044', userRef: 'GPETH', type: 'end_user', industry: 'Biofuels', terms: 'N30', currency: 'USD', risk: 'A', inception: '2013-02-02', lastActivity: '2026-10-24',
    addresses: [{ id: 'A-12044-1', kind: 'bill_to', street: 'N Phillips Ave', number: '200', city: 'Sioux Falls', rc: 'SD', pc: '57104', country: 'US', def: true }, { id: 'A-12044-2', kind: 'ship_to', street: 'Plant Rd', number: '1', city: 'Chancellor', rc: 'SD', pc: '57015', country: 'US' }] },
  { id: 'G-US-02', domain: 'customer', name: 'Harbor Point Refining Inc', city: 'Houston', street: 'Louisiana St', number: '1000', region: 'US', country: 'US', scheme: 'EIN', tax: '760234567', key: '760234567', duns: '008741122', erpNo: '12051', userRef: 'HARBOR', type: 'end_user', industry: 'Oil & gas', terms: 'N45', currency: 'USD', risk: 'A', inception: '2007-07-07', lastActivity: '2026-10-26' },
  { id: 'G-US-03', domain: 'customer', name: 'Midwest Dairy Cooperative', city: 'Madison', street: 'E Washington Ave', number: '350', region: 'US', country: 'US', scheme: 'EIN', tax: '391456789', key: '391456789', erpNo: '12060', type: 'end_user', industry: 'Food & beverage processing', status: 'hold', terms: 'N30', currency: 'USD', risk: 'C', inception: '2017-04-18', lastActivity: '2026-01-30' },
  // India
  { id: 'G-IN-02', domain: 'customer', name: 'Deccan Fabricators Pvt Ltd', aliases: ['Deccan Pune'], city: 'Pune', street: 'MG Road', number: '77', region: 'IN', country: 'IN', scheme: 'GSTIN', tax: '27AADCT5678G1ZK', key: 'AADCT5678G', ids: [{ scheme: 'PAN', value: 'AADCT5678G' }], erpNo: '31012', type: 'contractor', industry: 'Engineering services', terms: 'N30', currency: 'INR', risk: 'B', inception: '2019-06-21', lastActivity: '2026-09-29' },
  // China (cleansed copy from the lake; both names)
  { id: 'G-CN-01', domain: 'customer', name: 'Hengtai Precision Machinery Co Ltd', local: '恒泰精密机械有限公司', city: 'Shenzhen', street: 'Shennan Blvd', number: '2000', region: 'CN', country: 'CN', scheme: 'USCC', tax: '91440300MA5DC1234X', key: '91440300MA5DC1234X', erpNo: '41003', type: 'oem', industry: 'Machinery', terms: 'N30', currency: 'CNY', risk: 'B', inception: '2018-01-15', lastActivity: '2026-10-09' },
  { id: 'G-CN-02', domain: 'customer', name: 'Jiangnan Food Industries', local: '江南食品工业', city: 'Suzhou', street: 'Renmin Rd', number: '88', region: 'CN', country: 'CN', scheme: 'USCC', tax: '91320500MA1XYZ567K', key: '91320500MA1XYZ567K', erpNo: '41011', type: 'end_user', industry: 'Food & beverage processing', terms: 'N45', currency: 'CNY', risk: 'A', inception: '2020-09-01', lastActivity: '2026-10-18' },
]

// Suppliers. One legal entity (Orla Europa) is also a customer: same tax ID, different domain, two ERP masters.
const suppliers: P[] = [
  { id: 'S-BR-01', domain: 'supplier', name: 'Fundição Araguaia Ltda', city: 'Betim', street: 'Av. das Indústrias', number: '900', region: 'BR', country: 'BR', scheme: 'CNPJ', tax: '71505241000130', key: '71505241', duns: '661234509', erpNo: 'V-70012', userRef: 'ARAGUAIA', type: 'raw_material', industry: 'Castings & forgings', terms: 'N45', currency: 'BRL', risk: 'B', inception: '2016-04-04', lastActivity: '2026-10-22',
    addresses: [{ id: 'VA-70012-1', kind: 'remit_to', street: 'Av. das Indústrias', number: '900', district: 'Distrito Industrial', city: 'Betim', rc: 'MG', pc: '32600-000', country: 'BR', def: true }] },
  { id: 'S-BR-02', domain: 'supplier', name: 'Vale Verde Logística S.A.', city: 'Santos', street: 'Av. Portuária', number: '12', region: 'BR', country: 'BR', scheme: 'CNPJ', tax: '61000120000180', key: '61000120', erpNo: 'V-70020', type: 'services', industry: 'Logistics', terms: 'N30', currency: 'BRL', risk: 'A', inception: '2019-02-11', lastActivity: '2026-10-28' },
  { id: 'S-EU-ORLA', domain: 'supplier', name: 'Orla Europa GmbH', city: 'Hamburg', street: 'Musterstraße', number: '12', region: 'EU', country: 'DE', scheme: 'VAT', tax: 'DE123456789', key: 'DE123456789', duns: '315182413', erpNo: 'V-EU-5102', type: 'components', industry: 'Marine equipment', terms: 'N30', currency: 'EUR', risk: 'A', inception: '2021-05-20', lastActivity: '2026-10-14', group: 'GROUP-ORLA' },
  { id: 'S-EU-01', domain: 'supplier', name: 'Stahlwerk Lenz GmbH', city: 'Duisburg', street: 'Rheinstraße', number: '7', region: 'EU', country: 'DE', scheme: 'VAT', tax: 'DE323456789', key: 'DE323456789', duns: '552109876', dunsRating: '4A1', erpNo: 'V-EU-5001', type: 'raw_material', industry: 'Steel', terms: 'N60', currency: 'EUR', risk: 'A', inception: '2006-11-11', lastActivity: '2026-10-30' },
  { id: 'S-EU-02', domain: 'supplier', name: 'Kemitek Oy', city: 'Tampere', street: 'Hämeenkatu', number: '14', region: 'EU', country: 'FI', scheme: 'VAT', tax: 'FI12345678', key: 'FI12345678', erpNo: 'V-EU-5017', type: 'raw_material', industry: 'Chemicals', status: 'hold', terms: 'N30', currency: 'EUR', risk: 'C', inception: '2015-08-30', lastActivity: '2026-04-02' },
  { id: 'S-US-01', domain: 'supplier', name: 'Great Lakes Gasket Co', city: 'Cleveland', street: 'Euclid Ave', number: '4500', region: 'US', country: 'US', scheme: 'EIN', tax: '341234567', key: '341234567', duns: '049881230', erpNo: 'V-20031', type: 'components', industry: 'Sealing & gaskets', terms: 'N30', currency: 'USD', risk: 'A', inception: '2010-03-03', lastActivity: '2026-10-23' },
  { id: 'S-IN-01', domain: 'supplier', name: 'Bharat Fasteners Pvt Ltd', city: 'Ludhiana', street: 'Industrial Area A', number: '15', region: 'IN', country: 'IN', scheme: 'GSTIN', tax: '03AABCB9876H1Z5', key: 'AABCB9876H', ids: [{ scheme: 'PAN', value: 'AABCB9876H' }], erpNo: 'V-30044', type: 'components', industry: 'Fasteners', terms: 'N45', currency: 'INR', risk: 'B', inception: '2017-10-10', lastActivity: '2026-09-15' },
  { id: 'S-CN-01', domain: 'supplier', name: 'Shenzhen Hengtai Precision Co Ltd', local: '深圳恒泰精密有限公司', city: 'Shenzhen', street: 'Shennan Blvd', number: '2000', region: 'CN', country: 'CN', scheme: 'USCC', tax: '91440300MA5DC1234X', key: '91440300MA5DC1234X', erpNo: 'V-40007', type: 'components', industry: 'Machinery', terms: 'N30', currency: 'CNY', risk: 'B', inception: '2018-01-15', lastActivity: '2026-10-09' },
]

const credit: { id: string; region: Region; limit: number; currency: string; terms: string }[] = [
  { id: 'G-BR', region: 'BR', limit: 500000, currency: 'BRL', terms: 'N30' },
  { id: 'G-BR-09', region: 'BR', limit: 150000, currency: 'BRL', terms: 'N30' },
  { id: 'G-ORLA-BR', region: 'BR', limit: 250000, currency: 'BRL', terms: 'N45' },
  { id: 'G-BR-04', region: 'BR', limit: 1200000, currency: 'BRL', terms: 'N30' },
  { id: 'G-BR-05', region: 'BR', limit: 300000, currency: 'BRL', terms: 'N30' },
  { id: 'G-BR-07', region: 'BR', limit: 800000, currency: 'BRL', terms: 'N60' },
  { id: 'G-ORLA-EU', region: 'EU', limit: 400000, currency: 'EUR', terms: 'N30' },
  { id: 'G-FOREIGN', region: 'EU', limit: 80000, currency: 'EUR', terms: 'N30' },
  { id: 'G-EU-04', region: 'EU', limit: 150000, currency: 'EUR', terms: 'N60' },
  { id: 'G-EU-05', region: 'EU', limit: 900000, currency: 'SEK', terms: 'N30' },
  { id: 'G-EU-07', region: 'EU', limit: 2000000, currency: 'NOK', terms: 'N30' },
  { id: 'G-US-01', region: 'US', limit: 350000, currency: 'USD', terms: 'N30' },
  { id: 'G-US-02', region: 'US', limit: 1500000, currency: 'USD', terms: 'N45' },
  { id: 'G-IN', region: 'IN', limit: 25000000, currency: 'INR', terms: 'N60' },
  { id: 'G-CN-02', region: 'CN', limit: 1800000, currency: 'CNY', terms: 'N45' },
]
const spend: { id: string; region: Region; ytd: number; currency: string; open: number }[] = [
  { id: 'S-BR-01', region: 'BR', ytd: 2140000, currency: 'BRL', open: 310000 },
  { id: 'S-BR-02', region: 'BR', ytd: 640000, currency: 'BRL', open: 52000 },
  { id: 'S-EU-ORLA', region: 'EU', ytd: 120000, currency: 'EUR', open: 0 },
  { id: 'S-EU-01', region: 'EU', ytd: 5300000, currency: 'EUR', open: 410000 },
  { id: 'S-EU-02', region: 'EU', ytd: 410000, currency: 'EUR', open: 98000 },
  { id: 'S-US-01', region: 'US', ytd: 780000, currency: 'USD', open: 61000 },
  { id: 'S-IN-01', region: 'IN', ytd: 31000000, currency: 'INR', open: 2600000 },
  { id: 'S-CN-01', region: 'CN', ytd: 2900000, currency: 'CNY', open: 350000 },
]

// Test users. Created in the identity provider with the same emails; passwords are handed over privately.
const entitlements = [
  { email: 'ana.requester@example.com', name: 'Ana Silva', role: 'requester', regions: ['BR'], global: false, money: ['BR'] },
  { email: 'jonas.requester@example.com', name: 'Jonas Weber', role: 'requester', regions: ['EU'], global: false, money: ['EU'] },
  { email: 'priya.reviewer@example.com', name: 'Priya Nair', role: 'reviewer', regions: ['BR', 'EU', 'US', 'IN', 'CN'], global: true, money: [] },
  { email: 'sam.operator@example.com', name: 'Sam Okafor', role: 'operator', regions: ['BR', 'EU', 'US', 'IN', 'CN'], global: true, money: [] },
  { email: 'noregion@example.com', name: 'No Region Yet', role: 'requester', regions: [], global: false, money: [] },
]

async function main() {
  const parties = [...customers, ...suppliers]
  for (const g of groups) await sql`insert into groups (group_id, name) values (${g.id}, ${g.name}) on conflict (group_id) do update set name = excluded.name`
  for (const p of parties) {
    const erp = p.erp ?? erpOf(p.region)
    await sql`insert into parties (golden_id, domain, legal_name, local_name, aliases, tax_scheme, tax_canonical, tax_company_key, identifiers, duns, duns_rating, region, country, erp_system, erp_number, erp_segment, user_ref, type_code, industry, status, payment_terms, currency, risk_rating, inception_at, last_activity_at, updated_by, group_id, city, street, street_number)
      values (${p.id}, ${p.domain}, ${p.name}, ${p.local ?? null}, ${p.aliases ?? []}, ${p.scheme ?? null}, ${p.tax ?? null}, ${p.key ?? null}, ${JSON.stringify(p.ids ?? [])}::jsonb, ${p.duns ?? null}, ${p.dunsRating ?? null}, ${p.region}, ${p.country}, ${erp}, ${p.erpNo ?? null}, ${p.seg ?? seg[p.region]}, ${p.userRef ?? null}, ${p.type ?? null}, ${p.industry ?? null}, ${p.status ?? 'active'}, ${p.terms ?? null}, ${p.currency ?? null}, ${p.risk ?? null}, ${p.inception ?? null}, ${p.lastActivity ?? null}, ${p.updatedBy ?? 'hub load'}, ${p.group ?? null}, ${p.city}, ${p.street ?? null}, ${p.number ?? null})
      on conflict (golden_id) do update set domain = excluded.domain, legal_name = excluded.legal_name, local_name = excluded.local_name, aliases = excluded.aliases, tax_scheme = excluded.tax_scheme, tax_canonical = excluded.tax_canonical, tax_company_key = excluded.tax_company_key, identifiers = excluded.identifiers, duns = excluded.duns, duns_rating = excluded.duns_rating, region = excluded.region, country = excluded.country, erp_system = excluded.erp_system, erp_number = excluded.erp_number, erp_segment = excluded.erp_segment, user_ref = excluded.user_ref, type_code = excluded.type_code, industry = excluded.industry, status = excluded.status, payment_terms = excluded.payment_terms, currency = excluded.currency, risk_rating = excluded.risk_rating, inception_at = excluded.inception_at, last_activity_at = excluded.last_activity_at, updated_by = excluded.updated_by, group_id = excluded.group_id, city = excluded.city, street = excluded.street, street_number = excluded.street_number`
  }
  // Parents after every row exists (self-referencing foreign keys).
  for (const p of parties) if (p.parent || p.ultimate) await sql`update parties set parent_golden_id = ${p.parent ?? null}, ultimate_parent_golden_id = ${p.ultimate ?? p.parent ?? null} where golden_id = ${p.id}`
  // Addresses: the explicit list when given, otherwise one default bill-to (customers) or remit-to (suppliers) from the row.
  for (const p of parties) {
    const list: Addr[] = p.addresses ?? [{ id: `${p.id}-A1`, kind: p.domain === 'customer' ? 'bill_to' : 'remit_to', street: p.street ?? '', number: p.number, city: p.city, country: p.country, def: true }]
    for (const a of list) await sql`insert into party_addresses (golden_id, source_address_id, kind, street, street_number, complement, district, city, region_code, postal_code, country, is_default)
      values (${p.id}, ${a.id}, ${a.kind}, ${a.street}, ${a.number ?? null}, ${a.complement ?? null}, ${a.district ?? null}, ${a.city}, ${a.rc ?? null}, ${a.pc ?? null}, ${a.country}, ${a.def ?? false})
      on conflict (golden_id, source_address_id) do update set kind = excluded.kind, street = excluded.street, street_number = excluded.street_number, complement = excluded.complement, district = excluded.district, city = excluded.city, region_code = excluded.region_code, postal_code = excluded.postal_code, country = excluded.country, is_default = excluded.is_default`
  }
  // Sources: the region's ERP load, plus the hierarchy feed for anything with a DUNS rating.
  for (const p of parties) {
    const list = p.sources ?? [{ system: src(p.region), id: p.erpNo ?? p.id, loadedAt: '2026-10-30T02:10:00Z' }, ...(p.dunsRating ? [{ system: 'HIERARCHY', id: p.duns!, loadedAt: '2026-10-24T03:00:00Z' }] : [])]
    for (const s of list) await sql`insert into party_sources (golden_id, source_system, source_id, loaded_at) values (${p.id}, ${s.system}, ${s.id}, ${s.loadedAt}) on conflict (golden_id, source_system) do update set source_id = excluded.source_id, loaded_at = excluded.loaded_at`
  }
  for (const r of credit) await sql`insert into regional_credit (golden_id, region, credit_limit, currency, terms) values (${r.id}, ${r.region}, ${r.limit}, ${r.currency}, ${r.terms}) on conflict (golden_id, region) do update set credit_limit = excluded.credit_limit, currency = excluded.currency, terms = excluded.terms`
  for (const r of spend) await sql`insert into regional_spend (golden_id, region, spend_ytd, currency, open_invoices) values (${r.id}, ${r.region}, ${r.ytd}, ${r.currency}, ${r.open}) on conflict (golden_id, region) do update set spend_ytd = excluded.spend_ytd, currency = excluded.currency, open_invoices = excluded.open_invoices`
  for (const e of entitlements) await sql`insert into entitlements (email, display_name, role, regions, global_identity, money_regions) values (${e.email}, ${e.name}, ${e.role}, ${e.regions}, ${e.global}, ${e.money}) on conflict (email) do update set display_name = excluded.display_name, role = excluded.role, regions = excluded.regions, global_identity = excluded.global_identity, money_regions = excluded.money_regions`
  console.info(`seeded ${groups.length} groups, ${customers.length} customers, ${suppliers.length} suppliers, ${credit.length} credit rows, ${spend.length} spend rows, ${entitlements.length} entitlements`)
}
main().catch((e) => { console.error(e); process.exit(1) })
