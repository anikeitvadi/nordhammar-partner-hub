import { neon } from '@neondatabase/serverless'
import type { Domain, LedgerStore, Stored } from './ledger'

// Claim is one statement: INSERT ... ON CONFLICT DO NOTHING RETURNING, then a read on conflict. The primary key is the
// atomicity; two concurrent inserts for one key cannot both return a row.
export class NeonStore implements LedgerStore {
  private sql
  constructor(url: string) { this.sql = neon(url) }
  async nextNumber(domain: Domain) { const r = domain === 'customer' ? await this.sql`select nextval('customer_numbers') as n` : await this.sql`select nextval('supplier_numbers') as n`; return domain === 'customer' ? String(r[0].n) : `V-${r[0].n}` }
  async claim(row: Stored) {
    const ins = await this.sql`insert into operations (operation_key, domain, payload_hash, status, customer_number, reason) values (${row.operationKey}, ${row.domain}, ${row.payloadHash}, ${row.status}, ${row.customerNumber}, ${row.reason}) on conflict (operation_key) do nothing returning operation_key, domain, payload_hash, status, customer_number, reason`
    if (ins[0]) return { inserted: true, row: toStored(ins[0]) }
    const cur = await this.get(row.operationKey)
    if (!cur) throw new Error('claim: conflict but no row')
    return { inserted: false, row: cur }
  }
  async get(k: string) { const r = await this.sql`select operation_key, domain, payload_hash, status, customer_number, reason from operations where operation_key = ${k}`; return r[0] ? toStored(r[0]) : null }
}
function toStored(r: Record<string, unknown>): Stored { return { operationKey: r.operation_key as string, domain: (r.domain as Domain) ?? 'customer', payloadHash: r.payload_hash as string, status: r.status as Stored['status'], customerNumber: (r.customer_number as string | null) ?? null, reason: (r.reason as string | null) ?? null } }
