'use server'
import type { Domain, Region } from '@intake/contracts'
import { requirePrincipal } from '@/features/auth/principal.server'
import { foreignHint } from './hub.server'

// Called by the table when narrowing finds nothing and the text looks like a tax ID: is it in a region you cannot see?
export async function foreignHintAction(domain: Domain, query: string): Promise<Region | null> {
  const principal = await requirePrincipal()
  if (domain !== 'customer' && domain !== 'supplier') return null
  return foreignHint(principal, domain, String(query).slice(0, 40))
}
