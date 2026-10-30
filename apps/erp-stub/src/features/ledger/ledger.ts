// Pure ledger policy over a tiny store interface, so the replay rules are tested without a database.
// Same key + same hash → the stored result (replay). Same key + different hash → conflict, no mutation.
// A business rejection is stored as definitive (no effect), so a retry with the same key returns the same rejection.
export type Stored = { operationKey: string; payloadHash: string; status: 'created' | 'rejected'; customerNumber: string | null; reason: string | null }
export interface LedgerStore {
  // Atomically: insert if absent and return {inserted: true, row}; if present return {inserted: false, row}.
  claim(row: Stored): Promise<{ inserted: boolean; row: Stored }>
  nextCustomerNumber(): Promise<string>
  get(operationKey: string): Promise<Stored | null>
}
export type LedgerResult =
  | { status: 201; customerNumber: string }
  | { status: 200; customerNumber: string }
  | { status: 409; reason: string }
  | { status: 422; reason: string }

export async function apply(store: LedgerStore, command: { operationKey: string; payloadHash: string; legalName: string }): Promise<LedgerResult> {
  const rejectReason = businessRejection(command.legalName)
  const candidate: Stored = rejectReason
    ? { operationKey: command.operationKey, payloadHash: command.payloadHash, status: 'rejected', customerNumber: null, reason: rejectReason }
    : { operationKey: command.operationKey, payloadHash: command.payloadHash, status: 'created', customerNumber: await store.nextCustomerNumber(), reason: null }
  const { inserted, row } = await store.claim(candidate)
  if (row.payloadHash !== command.payloadHash) return { status: 409, reason: 'operation key already used with a different payload' }
  if (row.status === 'rejected') return { status: 422, reason: row.reason ?? 'rejected' }
  return inserted ? { status: 201, customerNumber: row.customerNumber! } : { status: 200, customerNumber: row.customerNumber! }
}

// The known-bad payload: a legal name the ERP refuses. Deterministic, so the demo can show a business rejection on purpose.
export function businessRejection(legalName: string): string | null {
  if (/\[REJECT\]/i.test(legalName)) return 'customer type not allowed for this segment'
  if (legalName.trim().length < 3) return 'legal name too short'
  return null
}

export class MemoryStore implements LedgerStore {
  rows = new Map<string, Stored>(); n = 26000
  async claim(row: Stored) { const cur = this.rows.get(row.operationKey); if (cur) return { inserted: false, row: cur }; this.rows.set(row.operationKey, row); return { inserted: true, row } }
  async nextCustomerNumber() { return String(this.n++) }
  async get(k: string) { return this.rows.get(k) ?? null }
}
