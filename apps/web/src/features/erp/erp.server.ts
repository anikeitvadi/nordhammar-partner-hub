import 'server-only'
import type { ErpCreateCommand } from '@intake/contracts'

// Boundary 3 of 3. Owns the only network path to the ERP stub: authenticated create, payload hash verification,
// response parsing and error classification. createCustomer is importable only by the Workflow ERP step (lint + graph test).
export type ErpResult =
  | { outcome: 'created' | 'replayed'; erpCustomerNumber: string }
  | { outcome: 'rejected'; category: 'business' | 'auth' | 'conflict'; reason: string }

export async function createCustomer(_command: ErpCreateCommand): Promise<ErpResult> {
  // Increment F.
  throw new Error('not implemented')
}

// Read-only reconciliation for the operator path. Never creates.
export async function lookupOperation(_operationKey: string): Promise<ErpResult | null> {
  return null
}
