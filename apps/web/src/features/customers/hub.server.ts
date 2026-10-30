import 'server-only'
import type { Region } from '@intake/contracts'

// Boundary 1 of 3. Owns every authorized read of the customer hub.
// Receives a verified principal and a requested region, validates scope here, returns DTOs, never rows.
// Routes and client code call this; nothing calls the DB client directly.
export type Principal = { userId: string; regions: Region[]; global: boolean }

export type CustomerSummary = { goldenId: string; legalName: string; city: string; region: Region; erpNumber: string | null }

export async function searchCustomers(_principal: Principal, _region: Region, _query: string): Promise<CustomerSummary[]> {
  // Increment B. Scope check happens inside this module, before any SQL runs.
  return []
}
