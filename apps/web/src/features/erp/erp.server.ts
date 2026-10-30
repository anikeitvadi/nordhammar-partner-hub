import 'server-only'
import type { ErpCreateCommand } from '@intake/contracts'

// Boundary 3 of 3. The only network path to the ERP stub. Classifies every outcome so the workflow step can decide
// what to retry and what to stop on. 'transient' is the only category the caller may retry with the SAME key and hash.
export type ErpResult =
  | { outcome: 'created' | 'replayed'; erpCustomerNumber: string }
  | { outcome: 'rejected'; category: 'business' | 'auth' | 'conflict'; reason: string }
  | { outcome: 'transient'; reason: string }

function config() {
  const base = process.env.ERP_BASE_URL; const token = process.env.ERP_SERVICE_TOKEN
  if (!base || !token) throw new Error('ERP_BASE_URL / ERP_SERVICE_TOKEN not set')
  return { base: base.replace(/\/$/, ''), token }
}

export async function createCustomer(command: ErpCreateCommand, opts: { timeoutMs?: number } = {}): Promise<ErpResult> {
  const { base, token } = config()
  const ctrl = new AbortController(); const timer = setTimeout(() => ctrl.abort(), opts.timeoutMs ?? 8000)
  try {
    const res = await fetch(`${base}/api/customers`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` }, body: JSON.stringify(command), signal: ctrl.signal, cache: 'no-store' })
    const body = (await res.json().catch(() => ({}))) as { customerNumber?: string; reason?: string }
    if (res.status === 201 && body.customerNumber) return { outcome: 'created', erpCustomerNumber: body.customerNumber }
    if (res.status === 200 && body.customerNumber) return { outcome: 'replayed', erpCustomerNumber: body.customerNumber }
    if (res.status === 409) return { outcome: 'rejected', category: 'conflict', reason: body.reason ?? 'same operation key with a different payload' }
    if (res.status === 422) return { outcome: 'rejected', category: 'business', reason: body.reason ?? 'rejected by the ERP' }
    if (res.status === 401 || res.status === 403) return { outcome: 'rejected', category: 'auth', reason: 'ERP rejected the service credential' }
    return { outcome: 'transient', reason: `ERP responded ${res.status}` }
  } catch (e) {
    return { outcome: 'transient', reason: e instanceof Error && e.name === 'AbortError' ? 'ERP timed out' : `ERP unreachable: ${e instanceof Error ? e.message : 'error'}` }
  } finally { clearTimeout(timer) }
}

// Read-only reconciliation: "did it happen?" without the workflow. 404 is not proof a timed-out call cannot still commit.
export async function lookupOperation(operationKey: string): Promise<{ found: true; customerNumber: string | null; status: string } | { found: false }> {
  const { base, token } = config()
  const res = await fetch(`${base}/api/operations/${encodeURIComponent(operationKey)}`, { headers: { authorization: `Bearer ${token}` }, cache: 'no-store' })
  if (res.status === 404) return { found: false }
  const body = (await res.json()) as { customerNumber: string | null; status: string }
  return { found: true, customerNumber: body.customerNumber, status: body.status }
}
