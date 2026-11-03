import type { Erp } from '@intake/contracts'

// Pure ledger policy over a tiny store interface, so the replay rules are tested without a database.
// Same key + same hash → the stored result (replay). Same key + different hash → conflict, no mutation.
// A business rejection is stored as definitive (no effect), so a retry with the same key returns the same rejection.
// One ledger serves the three ERPs: the key is global, the number comes from the ERP the region routed to.
export type Domain = 'customer' | 'supplier'
export type Stored = { operationKey: string; erp: Erp | null; domain: Domain; payloadHash: string; status: 'created' | 'rejected'; number: string | null; reason: string | null }
export interface LedgerStore {
  // Atomically: insert if absent and return {inserted: true, row}; if present return {inserted: false, row}.
  claim(row: Stored): Promise<{ inserted: boolean; row: Stored }>
  nextNumber(erp: Erp, domain: Domain): Promise<string>
  get(operationKey: string): Promise<Stored | null>
}
export type LedgerResult =
  | { status: 201 | 200; erp: Erp; number: string }
  | { status: 409; reason: string }
  | { status: 422; reason: string }

export async function apply(store: LedgerStore, command: { operationKey: string; erp: Erp; domain: Domain; payloadHash: string; legalName: string }): Promise<LedgerResult> {
  const rejectReason = businessRejection(command.legalName)
  const candidate: Stored = rejectReason
    ? { operationKey: command.operationKey, erp: command.erp, domain: command.domain, payloadHash: command.payloadHash, status: 'rejected', number: null, reason: rejectReason }
    : { operationKey: command.operationKey, erp: command.erp, domain: command.domain, payloadHash: command.payloadHash, status: 'created', number: await store.nextNumber(command.erp, command.domain), reason: null }
  const { inserted, row } = await store.claim(candidate)
  if (row.payloadHash !== command.payloadHash) return { status: 409, reason: 'operation key already used with a different payload' }
  if (row.status === 'rejected') return { status: 422, reason: row.reason ?? 'rejected' }
  return { status: inserted ? 201 : 200, erp: row.erp ?? command.erp, number: row.number! }
}

// The known-bad payload: a legal name the ERP refuses. Deterministic, so the demo can show a business rejection on purpose.
export function businessRejection(legalName: string): string | null {
  if (/\[REJECT\]/i.test(legalName)) return 'partner type not allowed for this segment'
  if (legalName.trim().length < 3) return 'legal name too short'
  return null
}

// Six digits: the first is the ERP, the second the domain (1 customer, 5 supplier). Golden records hold x10001 to
// x10100 and x50001 to x50100, the demo seed x10101 to x10200; live creates start above both.
export const SERIES_START: Record<Erp, Record<Domain, number>> = {
  'ERP-1': { customer: 110201, supplier: 150201 },
  'ERP-2': { customer: 210201, supplier: 250201 },
  'ERP-3': { customer: 310201, supplier: 350201 },
}

export class MemoryStore implements LedgerStore {
  rows = new Map<string, Stored>()
  n: Record<string, number> = Object.fromEntries(Object.entries(SERIES_START).flatMap(([e, d]) => Object.entries(d).map(([k, v]) => [`${e}:${k}`, v])))
  async claim(row: Stored) { const cur = this.rows.get(row.operationKey); if (cur) return { inserted: false, row: cur }; this.rows.set(row.operationKey, row); return { inserted: true, row } }
  async nextNumber(erp: Erp, domain: Domain) { return String(this.n[`${erp}:${domain}`]++) }
  async get(k: string) { return this.rows.get(k) ?? null }
}
