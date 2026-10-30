import 'server-only'
import { transition, type CanonicalPayload, type Region, type RequestState } from '@intake/contracts'
import { sql } from '@/lib/db'
import type { Principal } from '@/features/auth/scope'

// Stands in for the nightly hub load: every request the ERP created since the last load becomes a golden record
// (matched to the request by tax ID, as the real load does), the request gains its golden id, and the identity
// reservation is released because the hub now holds the identity. Until this runs, search cannot see the customer
// and the request page says so. That limit is real and stated, not hidden behind a cache trick.
export async function runDailyLoad(principal: Principal): Promise<{ loaded: number; regions: Region[] }> {
  if (!(principal.globalIdentity && (principal.role === 'operator' || principal.role === 'reviewer'))) return { loaded: 0, regions: [] }
  const db = sql()
  const rows = await db`select r.request_id, r.region, r.state, v.payload from requests r join request_revisions v on v.request_id = r.request_id and v.revision = r.current_revision where r.state_kind = 'created' and (r.state->>'goldenId') is null`
  const regions = new Set<Region>()
  let loaded = 0
  for (const r of rows) {
    const state = r.state as RequestState
    if (state.kind !== 'created') continue
    const p = r.payload as CanonicalPayload
    const goldenId = `G-${state.erpCustomerNumber}`
    const t = transition(state, { type: 'golden_loaded', goldenId })
    if (!t.ok) continue
    const bill = p.addresses.find((a) => a.kind === 'bill_to')
    await db.transaction([
      db`insert into customers (golden_id, legal_name, city, street, street_number, region, country, tax_scheme, tax_canonical, tax_company_key, erp_system, erp_number)
        values (${goldenId}, ${p.legalName}, ${bill?.city ?? ''}, ${bill?.street ?? null}, ${bill?.number ?? null}, ${r.region as string}, ${p.identity.country}, ${p.identity.scheme}, ${p.identity.canonical}, ${companyKey(p.identity)}, ${p.destination.erp}, ${state.erpCustomerNumber})
        on conflict (golden_id) do nothing`,
      db`update requests set state = ${JSON.stringify(t.next)}::jsonb, updated_at = now() where request_id = ${r.request_id as string} and state_kind = 'created'`,
      db`delete from identity_reservations where tax_canonical = ${p.identity.canonical} and request_id = ${r.request_id as string}`,
      db`insert into request_events (request_id, kind, actor, detail) values (${r.request_id as string}, 'hub_loaded', 'hub load', ${JSON.stringify({ goldenId })}::jsonb)`,
    ])
    regions.add(r.region as Region); loaded++
  }
  return { loaded, regions: [...regions] }
}

function companyKey(id: CanonicalPayload['identity']): string {
  if (id.scheme === 'CNPJ') return id.canonical.slice(0, 8)
  if (id.scheme === 'GSTIN') return id.canonical.slice(2, 12)
  return id.canonical
}
