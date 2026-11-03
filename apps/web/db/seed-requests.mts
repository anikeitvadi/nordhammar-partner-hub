// Demo request history for Nordhammar. Re-runnable, and a dry run unless --apply is passed.
//
//   pnpm --filter web db:seed-requests                    print the row plan, touch nothing
//   pnpm --filter web db:seed-requests --apply history    write the history rows (DATABASE_URL, ERP_DATABASE_URL)
//   pnpm --filter web db:seed-requests --apply recent     write the "created, waiting for the hub load" rows
//   pnpm --filter web db:seed-requests --reset            remove every seeded row, and the golden records the load made from them
//
// Order before a demo: --reset, --apply history, run the hub load once in the app, --apply recent, then raise the
// form-phase requests in the app (printed at the end of the plan). The form phase is not written here on purpose:
// a request waiting for review needs a real Workflow run behind it, or approving it on stage would stall. A script
// can only honestly write states whose run has already finished.
//
// Every seeded request id starts with R-SEED, so --reset can never touch a request someone raised in the app.
import { neon } from '@neondatabase/serverless'
import { operationKey, payloadHash, type Approval, type CanonicalPayload, type Domain, type Region, type RequestState } from '@intake/contracts'
import { normalizeTaxId } from '../src/features/intake/normalize.ts'
import { buildPayload } from '../src/features/requests/payload.ts'

type Phase = 'history' | 'recent'
type Outcome =
  | { kind: 'created'; erpNumber: string }
  | { kind: 'declined'; reason: string }
  | { kind: 'sent_back'; reason: string }
  | { kind: 'draft' }
  | { kind: 'stopped_unknown'; ledger: 'created' | 'none'; erpNumber?: string }
  | { kind: 'stopped_rejected'; reason: string }

type Row = {
  id: string; phase: Phase; daysAgo: number; region: Region; domain: Domain; requester: string
  country: string; tax: string; values: Record<string, string>; outcome: Outcome; dupChoice?: 'new' | 'new_in_group'
}

const PRIYA = 'priya.reviewer@example.com'
const REQ: Record<Region, string> = {
  BR: 'ana.requester@example.com', EU: 'jonas.requester@example.com',
  // No demo login exists for these three regions; the history still needs their requesters.
  US: 'dana.requester@example.com', IN: 'rahul.requester@example.com', CN: 'li.requester@example.com',
}

// CNPJ with valid check digits from an 8-digit root and a 4-digit establishment number.
function cnpj(root: string, branch: string): string {
  const d = (root + branch).split('').map(Number)
  const dv = (len: number) => {
    const w = len === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    const r = w.reduce((a, x, i) => a + d[i] * x, 0) % 11
    return r < 2 ? 0 : 11 - r
  }
  d.push(dv(12)); d.push(dv(13))
  return d.join('')
}

const addr = (street: string, number: string, city: string, extra: Record<string, string> = {}) =>
  ({ 'main.street': street, 'main.number': number, 'main.city': city, ...Object.fromEntries(Object.entries(extra).map(([k, v]) => [`main.${k}`, v])) })

const rows: Row[] = [
  // Brazil: Ana
  { id: 'R-SEEDBR01', phase: 'history', daysAgo: 40, region: 'BR', domain: 'customer', requester: REQ.BR, country: 'BR', tax: cnpj('62110204', '0001'),
    values: { legalName: 'Ferroquímica Paulista Ltda', typeCode: 'end_user', industry: 'Chemicals', reasonText: 'New end user for dosing pumps; first order quoted.', ...addr('Avenida dos Químicos', '480', 'Cubatão', { district: 'Vila Parisi', regionCode: 'SP', postalCode: '11573-000' }) },
    outcome: { kind: 'created', erpNumber: '25510' } },
  { id: 'R-SEEDBR02', phase: 'history', daysAgo: 33, region: 'BR', domain: 'supplier', requester: REQ.BR, country: 'BR', tax: cnpj('62110318', '0001'),
    values: { legalName: 'Transportes Serra Azul Ltda', typeCode: 'logistics', industry: 'Logistics', reasonText: 'Road freight for the Joinville plant; replaces a carrier that closed.', ...addr('Rodovia BR-101', 'km 42', 'Joinville', { district: 'Distrito Industrial', regionCode: 'SC', postalCode: '89239-000' }) },
    outcome: { kind: 'created', erpNumber: '70010' } },
  { id: 'R-SEEDBR03', phase: 'history', daysAgo: 25, region: 'BR', domain: 'customer', requester: REQ.BR, country: 'BR', tax: cnpj('62110421', '0001'), dupChoice: 'new',
    values: { legalName: 'Usina Vale do Mogi S.A.', typeCode: 'end_user', industry: 'Biofuels', reasonText: 'Ethanol plant asking for a heat-exchanger retrofit quote.', ...addr('Estrada Municipal', 's/n', 'Mogi Guaçu', { district: 'Zona Rural', regionCode: 'SP' }) },
    outcome: { kind: 'declined', reason: 'Credit check failed upstream; finance will not open the account this quarter.' } },
  { id: 'R-SEEDBR04', phase: 'history', daysAgo: 9, region: 'BR', domain: 'customer', requester: REQ.BR, country: 'BR', tax: cnpj('62110535', '0001'),
    values: { legalName: 'Laticínios Serra Verde Ltda', typeCode: 'end_user', industry: 'Food & beverage processing', reasonText: 'Dairy expanding pasteurisation; tender closes this month.', ...addr('Rua do Laticínio', '77', 'Poços de Caldas', { district: 'Centro', regionCode: 'MG' }) },
    outcome: { kind: 'sent_back', reason: 'The bill-to is the warehouse. Use the registered address on the CNPJ card.' } },
  { id: 'R-SEEDBR05', phase: 'history', daysAgo: 3, region: 'BR', domain: 'customer', requester: REQ.BR, country: 'BR', tax: cnpj('62110649', '0001'),
    values: { legalName: 'Metalúrgica Itaúna Ltda', typeCode: 'oem', industry: 'Metals', reasonText: 'OEM building our skid frames under licence.', ...addr('Rua da Fundição', '1200', 'Itaúna', { district: 'Distrito Industrial', regionCode: 'MG' }) },
    outcome: { kind: 'stopped_unknown', ledger: 'created', erpNumber: '25511' } },
  { id: 'R-SEEDBR06', phase: 'history', daysAgo: 1, region: 'BR', domain: 'customer', requester: REQ.BR, country: 'BR', tax: cnpj('62110752', '0001'),
    values: { legalName: 'Granja Boa Vista Ltda', typeCode: 'end_user', industry: 'Food & beverage processing', reasonText: 'Draft: waiting for the CNPJ card from the customer.', ...addr('Estrada da Granja', '9', 'Chapecó', { district: 'Linha Bela Vista', regionCode: 'SC' }) },
    outcome: { kind: 'draft' } },

  // Europe: Jonas
  { id: 'R-SEEDEU01', phase: 'history', daysAgo: 38, region: 'EU', domain: 'customer', requester: REQ.EU, country: 'DE', tax: 'DE412345670',
    values: { legalName: 'Kestrel Marine GmbH', typeCode: 'oem', industry: 'Marine equipment', reasonText: 'Shipyard OEM; framework agreement signed.', ...addr('Am Kaiserkai', '12', 'Hamburg', { postalCode: '20457' }) },
    outcome: { kind: 'created', erpNumber: '25512' } },
  { id: 'R-SEEDEU02', phase: 'history', daysAgo: 30, region: 'EU', domain: 'supplier', requester: REQ.EU, country: 'NO', tax: 'NO918273645MVA',
    values: { legalName: 'Nordvik Logistikk AS', typeCode: 'logistics', industry: 'Logistics', reasonText: 'Sea freight Bergen to Göteborg.', ...addr('Strandkaien', '4', 'Bergen', { postalCode: '5013' }) },
    outcome: { kind: 'created', erpNumber: '70011' } },
  { id: 'R-SEEDEU03', phase: 'history', daysAgo: 18, region: 'EU', domain: 'customer', requester: REQ.EU, country: 'NL', tax: 'NL812345678B01',
    values: { legalName: 'Brabant Process BV', typeCode: 'distributor', industry: 'Industrial distribution', reasonText: 'Distributor for the Benelux; replaces direct sales.', ...addr('Industrieweg', '33', 'Eindhoven', { postalCode: '5651 BD' }) },
    outcome: { kind: 'created', erpNumber: '25513' } },
  { id: 'R-SEEDEU04', phase: 'history', daysAgo: 14, region: 'EU', domain: 'supplier', requester: REQ.EU, country: 'IT', tax: 'IT07123450961',
    values: { legalName: 'Lumen Coatings Srl', typeCode: 'raw_material', industry: 'Chemicals', reasonText: 'Second source for plate coatings.', ...addr('Via dell’Industria', '18', 'Bergamo', { postalCode: '24126' }) },
    outcome: { kind: 'declined', reason: 'Procurement has the supplier on audit hold; no new vendor accounts until it closes.' } },
  { id: 'R-SEEDEU05', phase: 'history', daysAgo: 6, region: 'EU', domain: 'supplier', requester: REQ.EU, country: 'NO', tax: 'NO927364518',
    values: { legalName: 'Halvorsen Teknikk AS', typeCode: 'services', industry: 'Engineering services', reasonText: 'Commissioning engineers for the Stavanger project.', ...addr('Forusbeen', '50', 'Stavanger', { postalCode: '4033' }) },
    outcome: { kind: 'stopped_rejected', reason: 'The ERP rejected the vendor: no bank details for a Norwegian payee.' } },
  { id: 'R-SEEDEU06', phase: 'history', daysAgo: 2, region: 'EU', domain: 'customer', requester: REQ.EU, country: 'FR', tax: 'FR42812345674',
    values: { legalName: 'Rhône Fluides SAS', typeCode: 'end_user', industry: 'Power generation', reasonText: 'Hydro plant cooling upgrade.', ...addr('Quai Perrache', '21', 'Lyon', { postalCode: '69002' }) },
    outcome: { kind: 'stopped_unknown', ledger: 'none' } },

  // United States
  { id: 'R-SEEDUS01', phase: 'history', daysAgo: 35, region: 'US', domain: 'customer', requester: REQ.US, country: 'US', tax: '361234508',
    values: { legalName: 'Great Lakes Fabrication Inc.', typeCode: 'contractor', industry: 'Machinery', reasonText: 'Contractor installing our skids in Ohio.', ...addr('W 150th St', '4100', 'Cleveland', { regionCode: 'OH', postalCode: '44135' }) },
    outcome: { kind: 'created', erpNumber: '25514' } },
  { id: 'R-SEEDUS02', phase: 'history', daysAgo: 21, region: 'US', domain: 'supplier', requester: REQ.US, country: 'US', tax: '471230986',
    values: { legalName: 'Prairie Freight LLC', typeCode: 'logistics', industry: 'Logistics', reasonText: 'Flatbed freight for the Midwest.', ...addr('Industrial Pkwy', '820', 'Omaha', { regionCode: 'NE', postalCode: '68110' }) },
    outcome: { kind: 'created', erpNumber: '70012' } },
  { id: 'R-SEEDUS03', phase: 'history', daysAgo: 7, region: 'US', domain: 'customer', requester: REQ.US, country: 'US', tax: '760998123',
    values: { legalName: 'Gulf Coast Biofuels LLC', typeCode: 'end_user', industry: 'Biofuels', reasonText: 'Renewable diesel plant, heat recovery.', ...addr('Refinery Rd', '15', 'Port Arthur', { regionCode: 'TX', postalCode: '77640' }) },
    outcome: { kind: 'sent_back', reason: 'Add the Texas state tax ID; the ERP needs it for a Texas ship-to.' } },

  // India
  { id: 'R-SEEDIN01', phase: 'history', daysAgo: 28, region: 'IN', domain: 'customer', requester: REQ.IN, country: 'IN', tax: '27AAKCS4821M1ZQ',
    values: { legalName: 'Shakti Process Engineering Pvt Ltd', typeCode: 'contractor', industry: 'Engineering services', reasonText: 'EPC contractor for a refinery in Maharashtra.', id_PAN: 'AAKCS4821M', ...addr('MIDC Road', 'Plot 14', 'Pune', { regionCode: 'MH', postalCode: '411019' }) },
    outcome: { kind: 'created', erpNumber: '25515' } },
  { id: 'R-SEEDIN02', phase: 'history', daysAgo: 16, region: 'IN', domain: 'supplier', requester: REQ.IN, country: 'IN', tax: '27AAFCK7310P1Z2',
    values: { legalName: 'Konkan Castings Pvt Ltd', typeCode: 'components', industry: 'Castings & forgings', reasonText: 'Local castings to cut lead time on frames.', id_PAN: 'AAFCK7310P', ...addr('Lote Parshuram MIDC', 'B-7', 'Khed', { regionCode: 'MH', postalCode: '415722' }) },
    outcome: { kind: 'created', erpNumber: '70013' } },
  { id: 'R-SEEDIN03', phase: 'history', daysAgo: 11, region: 'IN', domain: 'customer', requester: REQ.IN, country: 'IN', tax: '29AAGCM5512K1Z8',
    values: { legalName: 'Mysore Agro Foods Pvt Ltd', typeCode: 'end_user', industry: 'Food & beverage processing', reasonText: 'Juice concentrate line.', id_PAN: 'AAGCM5512K', ...addr('Hebbal Industrial Area', '22', 'Mysuru', { regionCode: 'KA', postalCode: '570016' }) },
    outcome: { kind: 'declined', reason: 'The customer is buying through our distributor; no direct account.' } },

  // China
  { id: 'R-SEEDCN01', phase: 'history', daysAgo: 26, region: 'CN', domain: 'customer', requester: REQ.CN, country: 'CN', tax: '91320594MA1PQ4R72K',
    values: { legalName: 'Suzhou Hengtai Valve Co., Ltd.', localName: '苏州恒泰阀门有限公司', typeCode: 'oem', industry: 'Machinery', reasonText: 'Valve OEM, packaged units for export.', ...addr('Xinghu Street', '218', 'Suzhou', { postalCode: '215123' }) },
    outcome: { kind: 'created', erpNumber: '25516' } },
  { id: 'R-SEEDCN02', phase: 'history', daysAgo: 12, region: 'CN', domain: 'supplier', requester: REQ.CN, country: 'CN', tax: '91440300MA5H7K2L9X',
    values: { legalName: 'Shenzhen Jiahe Electronics Co., Ltd.', localName: '深圳佳和电子有限公司', typeCode: 'components', industry: 'Machinery', reasonText: 'Control panels for the Asia skids.', ...addr('Keyuan Road', '9', 'Shenzhen', { postalCode: '518057' }) },
    outcome: { kind: 'created', erpNumber: '70014' } },

  // Recent: created, waiting for the next hub load (written after the load has run once)
  { id: 'R-SEEDBR07', phase: 'recent', daysAgo: 1, region: 'BR', domain: 'customer', requester: REQ.BR, country: 'BR', tax: cnpj('62110866', '0001'),
    values: { legalName: 'Cerâmica Rio Claro Ltda', typeCode: 'end_user', industry: 'Machinery', reasonText: 'Kiln heat recovery.', ...addr('Avenida Brasil', '3300', 'Rio Claro', { district: 'Jardim Paulista', regionCode: 'SP' }) },
    outcome: { kind: 'created', erpNumber: '25517' } },
  { id: 'R-SEEDEU07', phase: 'recent', daysAgo: 0.5, region: 'EU', domain: 'supplier', requester: REQ.EU, country: 'SE', tax: 'SE556123456701',
    values: { legalName: 'Vänern Stål AB', typeCode: 'raw_material', industry: 'Steel', reasonText: 'Stainless plate, second source.', ...addr('Hamngatan', '6', 'Karlstad', { postalCode: '652 24' }) },
    outcome: { kind: 'created', erpNumber: '70015' } },
  { id: 'R-SEEDIN04', phase: 'recent', daysAgo: 0.2, region: 'IN', domain: 'customer', requester: REQ.IN, country: 'IN', tax: '32AAHCM9034R1Z5',
    values: { legalName: 'Malabar Spice Processing Pvt Ltd', typeCode: 'end_user', industry: 'Food & beverage processing', reasonText: 'Oleoresin extraction line.', id_PAN: 'AAHCM9034R', ...addr('Kakkanad Industrial Area', '41', 'Kochi', { regionCode: 'KL', postalCode: '682030' }) },
    outcome: { kind: 'created', erpNumber: '25518' } },
]

// Raised in the app after the seed, as the signed-in requester, so each has a real Workflow run.
const formPhase = [
  { as: 'ana.requester@example.com', what: 'Vela Processos Industriais, CNPJ 61.000.103/0001-46', why: 'the undecidable name match: the model proposes, the reviewer decides' },
  { as: 'ana.requester@example.com', what: `A new Aurora establishment, CNPJ ${cnpj('61000101', '0007')}, choose "new, in this group"`, why: 'related by company key: pre-selects the Aurora group' },
  { as: 'ana.requester@example.com', what: `Fundição Sorocaba Ltda, CNPJ ${cnpj('62110970', '0001')}`, why: 'clean: left waiting for the live approve' },
  { as: 'jonas.requester@example.com', what: 'Ostsee Pumpen GmbH, VAT DE512345671', why: 'clean: left waiting for the live approve' },
  { as: 'jonas.requester@example.com', what: 'Atlantique Inox SAS, supplier, VAT FR53823456785', why: 'clean supplier: left waiting for the live approve' },
]

const iso = (daysAgo: number, plusMin = 0) => new Date(Date.now() - daysAgo * 86_400_000 + plusMin * 60_000).toISOString()

type Built = { row: Row; payload: CanonicalPayload; hash: string; state: RequestState; events: { at: string; kind: string; actor: string; detail: unknown }[]; decision: { id: string; decision: 'approve' | 'decline' | 'send_back'; reason: string | null; at: string } | null; reserve: boolean; ledger: { status: 'created' | 'rejected'; number: string | null; reason: string | null } | null }

async function build(row: Row): Promise<Built> {
  const n = normalizeTaxId(row.country, row.tax)
  if (!n.ok) throw new Error(`${row.id}: tax ID ${row.tax} is ${n.reason}`)
  const b = buildPayload(row.domain, row.region, n.taxId, { country: row.country, ...row.values })
  if (!b.ok) throw new Error(`${row.id}: ${b.problems.map((p) => p.message).join(' ')}`)
  const payload = b.payload
  const hash = await payloadHash(payload)
  const o = row.outcome
  const submittedAt = iso(row.daysAgo)
  const events: Built['events'] = []
  const ev = (minutes: number, kind: string, actor: string, detail: unknown = null) => events.push({ at: iso(row.daysAgo, minutes), kind, actor, detail })

  if (o.kind === 'draft') {
    ev(0, 'draft_saved', row.requester)
    return { row, payload, hash, state: { kind: 'draft', revision: 0 }, events, decision: null, reserve: false, ledger: null }
  }
  ev(0, 'submitted', row.requester, { revision: 1, dupChoice: row.dupChoice ?? 'new' })
  ev(0, 'email_queued', 'system', { to: row.requester, template: 'submitted' })
  ev(0, 'email_queued', 'system', { to: 'approvers', template: 'new_request_waiting' })
  ev(95, 'opened_for_review', PRIYA)
  const decidedAt = iso(row.daysAgo, 240)
  const decisionId = `D-${row.id.slice(2)}`

  if (o.kind === 'declined' || o.kind === 'sent_back') {
    const decision = o.kind === 'declined' ? 'decline' : 'send_back'
    ev(240, decision, PRIYA, { revision: 1, decisionId, reason: o.reason })
    const state: RequestState = o.kind === 'declined' ? { kind: 'declined', revision: 1, decisionId, reason: o.reason } : { kind: 'draft', revision: 1, returnedReason: o.reason }
    return { row, payload, hash, state, events, decision: { id: decisionId, decision, reason: o.reason, at: decidedAt }, reserve: false, ledger: null }
  }

  const approval: Approval = { decisionId, reviewerId: PRIYA, reviewedAt: decidedAt, payloadHash: hash }
  const key = operationKey(row.domain, row.id, 1)
  ev(240, 'approve', PRIYA, { revision: 1, decisionId, reason: null })
  ev(241, 'creating', 'workflow', { operationKey: key, workflowRunId: null })

  if (o.kind === 'created') {
    ev(241, 'erp_attempt', 'workflow', { attempt: 1, phase: 'sent', credential: 'oidc', operationKey: key })
    ev(241, 'erp_attempt', 'workflow', { attempt: 1, phase: 'created', erpNumber: o.erpNumber, reason: null, operationKey: key })
    ev(241, 'created', 'workflow', { outcome: 'created', erpNumber: o.erpNumber })
    const state: RequestState = { kind: 'created', revision: 1, approval, operationKey: key, erpNumber: o.erpNumber, createdAt: iso(row.daysAgo, 241), goldenId: null }
    return { row, payload, hash, state, events, decision: { id: decisionId, decision: 'approve', reason: null, at: decidedAt }, reserve: true, ledger: { status: 'created', number: o.erpNumber, reason: null } }
  }
  if (o.kind === 'stopped_rejected') {
    ev(241, 'erp_attempt', 'workflow', { attempt: 1, phase: 'sent', credential: 'oidc', operationKey: key })
    ev(241, 'erp_attempt', 'workflow', { attempt: 1, phase: 'rejected', erpNumber: null, reason: o.reason, operationKey: key })
    ev(241, 'stopped', 'workflow', { outcome: 'rejected', category: 'business', reason: o.reason })
    const state: RequestState = { kind: 'stopped', revision: 1, approval, operationKey: key, category: 'business', effect: 'no_effect', reason: o.reason }
    return { row, payload, hash, state, events, decision: { id: decisionId, decision: 'approve', reason: null, at: decidedAt }, reserve: true, ledger: { status: 'rejected', number: null, reason: o.reason } }
  }
  // stopped_unknown: four attempts, no answer. Whether the ERP committed is what reconcile finds out.
  for (let a = 1; a <= 4; a++) {
    ev(241 + a, 'erp_attempt', 'workflow', { attempt: a, phase: 'sent', credential: 'oidc', operationKey: key })
    ev(241 + a, 'erp_attempt', 'workflow', { attempt: a, phase: 'transient', reason: 'ERP timed out', retryAfterMs: a <= 3 ? 1000 * 2 ** (a - 1) : null, operationKey: key })
  }
  ev(246, 'stopped', 'workflow', { outcome: 'transient', reason: 'ERP timed out' })
  const state: RequestState = { kind: 'stopped', revision: 1, approval, operationKey: key, category: 'transport', effect: 'unknown', reason: 'ERP timed out' }
  return { row, payload, hash, state, events, decision: { id: decisionId, decision: 'approve', reason: null, at: decidedAt }, reserve: true, ledger: o.ledger === 'created' ? { status: 'created', number: o.erpNumber ?? null, reason: null } : null }
}

function label(b: Built): string {
  const s = b.state
  if (s.kind === 'created') return b.row.phase === 'recent' ? 'created, waiting for hub load' : 'created (loaded by the hub load)'
  if (s.kind === 'stopped') return s.effect === 'unknown' ? `stopped, effect unknown (ledger: ${b.ledger ? 'committed' : 'no row'})` : 'stopped, ERP rejected'
  if (s.kind === 'draft') return s.revision === 0 ? 'draft, parked' : 'sent back'
  return s.kind
}

async function main() {
  const args = process.argv.slice(2)
  const apply = args.includes('--apply') ? (args[args.indexOf('--apply') + 1] as Phase) : null
  const reset = args.includes('--reset')
  const built = await Promise.all(rows.map(build))

  console.log('Row plan (every tax ID passed the app\'s own normaliser; every payload passed the form\'s own builder)\n')
  const counts = new Map<string, Map<Region, number>>()
  for (const b of built) {
    const k = `${b.row.phase === 'recent' ? '2 recent ' : '1 history'} · ${label(b)}`
    const m = counts.get(k) ?? new Map(); m.set(b.row.region, (m.get(b.row.region) ?? 0) + 1); counts.set(k, m)
  }
  const regions: Region[] = ['BR', 'EU', 'US', 'IN', 'CN']
  console.log(['phase · state'.padEnd(58), ...regions.map((r) => r.padStart(3)), '  all'].join(' '))
  for (const [k, m] of [...counts].sort()) console.log([k.padEnd(58), ...regions.map((r) => String(m.get(r) ?? '').padStart(3)), String([...m.values()].reduce((a, x) => a + x, 0)).padStart(5)].join(' '))
  console.log(`\nWritten by the script: ${built.length}. Customers ${built.filter((b) => b.row.domain === 'customer').length}, suppliers ${built.filter((b) => b.row.domain === 'supplier').length}. Oldest ${Math.max(...rows.map((r) => r.daysAgo))} days ago.`)
  console.log(`\nRaised in the app afterwards (${formPhase.length}, real Workflow runs):`)
  for (const f of formPhase) console.log(`  as ${f.as}: ${f.what} (${f.why})`)
  console.log('\nRows:')
  for (const b of built) console.log(`  ${b.row.id}  ${b.row.region} ${b.row.domain.padEnd(8)} ${b.payload.legalName.padEnd(38)} ${label(b)}`)

  if (!apply && !reset) { console.log('\nDry run. Nothing was written.'); return }
  const url = process.env.DATABASE_URL
  const erpUrl = process.env.ERP_DATABASE_URL
  if (!url || !erpUrl) throw new Error('DATABASE_URL and ERP_DATABASE_URL are both required to write')
  const db = neon(url)
  const erp = neon(erpUrl)

  if (reset) {
    const golden = (await db`select state->>'goldenId' as g from requests where request_id like 'R-SEED%' and state->>'goldenId' is not null`).map((r) => r.g as string)
    await db.transaction([
      db`delete from party_sources where golden_id = any(${golden})`,
      db`delete from party_addresses where golden_id = any(${golden})`,
      db`delete from parties where golden_id = any(${golden})`,
      db`delete from deliveries where request_id like 'R-SEED%'`,
      db`delete from identity_reservations where request_id like 'R-SEED%'`,
      db`delete from review_decisions where request_id like 'R-SEED%'`,
      db`delete from request_events where request_id like 'R-SEED%'`,
      db`delete from request_revisions where request_id like 'R-SEED%'`,
      db`delete from requests where request_id like 'R-SEED%'`,
    ])
    await erp`delete from operations where operation_key like 'intake:%:R-SEED%'`
    console.log(`\nReset: seeded requests removed, ${golden.length} golden records from them removed, ledger rows removed.`)
    if (!apply) return
  }

  const todo = built.filter((b) => b.row.phase === apply)
  const clash = await db`select request_id from requests where request_id = any(${todo.map((b) => b.row.id)})`
  if (clash.length) throw new Error(`Already seeded: ${clash.map((r) => r.request_id).join(', ')}. Run --reset first.`)
  const taken = await db`select tax_canonical from parties where tax_canonical = any(${todo.map((b) => b.payload.identity.canonical)}) union select tax_canonical from identity_reservations where tax_canonical = any(${todo.map((b) => b.payload.identity.canonical)})`
  if (taken.length) throw new Error(`Tax IDs already in the hub: ${taken.map((r) => r.tax_canonical).join(', ')}`)

  for (const b of todo) {
    const r = b.row
    const created = iso(r.daysAgo)
    const q = [
      db`insert into requests (request_id, domain, region, requester_email, current_revision, state_kind, state, dup_choice, created_at, updated_at) values (${r.id}, ${r.domain}, ${r.region}, ${r.requester}, ${b.state.revision}, ${b.state.kind}, ${JSON.stringify(b.state)}::jsonb, ${b.state.revision ? (r.dupChoice ?? 'new') : null}, ${created}, ${b.events[b.events.length - 1].at})`,
      db`insert into request_revisions (request_id, revision, payload, payload_hash, submitted_at) values (${r.id}, ${b.state.revision ? 1 : 0}, ${JSON.stringify(b.payload)}::jsonb, ${b.hash}, ${created})`,
      ...b.events.map((e) => db`insert into request_events (request_id, at, kind, actor, detail) values (${r.id}, ${e.at}, ${e.kind}, ${e.actor}, ${e.detail === null ? null : JSON.stringify(e.detail)}::jsonb)`),
    ]
    if (b.decision) q.push(db`insert into review_decisions (decision_id, request_id, revision, reviewer_email, decision, reason, payload_hash, decided_at) values (${b.decision.id}, ${r.id}, 1, ${PRIYA}, ${b.decision.decision}, ${b.decision.reason}, ${b.hash}, ${b.decision.at})`)
    if (b.reserve) q.push(db`insert into identity_reservations (domain, tax_canonical, request_id, reserved_at) values (${r.domain}, ${b.payload.identity.canonical}, ${r.id}, ${created})`)
    await db.transaction(q)
    if (b.ledger) {
      const key = operationKey(r.domain, r.id, 1)
      await erp`insert into operations (operation_key, domain, payload_hash, status, customer_number, reason, received_at) values (${key}, ${r.domain}, ${b.hash}, ${b.ledger.status}, ${b.ledger.number}, ${b.ledger.reason}, ${iso(r.daysAgo, 241)}) on conflict (operation_key) do nothing`
    }
  }
  console.log(`\nWrote ${todo.length} ${apply} requests.${apply === 'history' ? ' Next: run the hub load once in the app, then --apply recent.' : ' Next: raise the form-phase requests in the app.'}`)
}

main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1) })
