'use server'
import type { Domain, Region } from '@intake/contracts'
import { requirePrincipal } from '@/features/auth/principal.server'
import { visibleRegions } from '@/features/auth/scope'
import { exactTaxIdLookup, findNameCandidates } from '@/features/customers/hub.server'
import { normalizeTaxId } from './normalize'
import { preflight } from './match'
import { proposeMatch } from './agent.server'
import type { CheckResult } from './types'

const COUNTRY_BY_REGION: Record<Region, string[]> = { BR: ['BR'], EU: ['DE', 'FR', 'NL', 'SE', 'IT', 'ES', 'NO', 'PT', 'AT', 'BE', 'DK', 'FI', 'PL', 'IE'], US: ['US'], IN: ['IN'], CN: ['CN'] }

// Server Action: the only way the form reaches the hub. Re-derives the principal and the region on every call;
// nothing from the form is trusted for either. Returns a DTO the client island renders.
export async function checkMatches(_prev: CheckResult | null, formData: FormData): Promise<CheckResult> {
  const principal = await requirePrincipal()
  const domain: Domain = formData.get('domain') === 'supplier' ? 'supplier' : 'customer'
  const region = String(formData.get('region') ?? '') as Region
  if (!visibleRegions(principal).includes(region)) return { kind: 'error', message: 'You are not entitled to request in that region.' }
  const country = String(formData.get('country') ?? '').toUpperCase()
  if (!COUNTRY_BY_REGION[region].includes(country)) return { kind: 'error', message: `${country || 'That country'} is not in region ${region}.` }
  const legalName = String(formData.get('legalName') ?? '').trim()
  // The check runs as soon as name and tax ID are known; the address may not be typed yet. City and street are hints for the comparison only.
  const city = String(formData.get('main.city') ?? formData.get('city') ?? '').trim()
  const street = String(formData.get('main.street') ?? formData.get('street') ?? '').trim() || null
  if (!legalName) return { kind: 'error', message: 'Legal name is required.' }

  const n = normalizeTaxId(country, String(formData.get('taxId') ?? ''))
  if (!n.ok) return { kind: 'invalid', reason: n.reason }
  const [exact, candidates] = await Promise.all([exactTaxIdLookup(principal, domain, n.taxId.canonical), findNameCandidates(principal, domain, region, legalName)])
  const route = preflight({ taxId: n.taxId }, exact, candidates)
  const echo = { domain, region, country, legalName, city, street, taxCanonical: n.taxId.canonical }
  switch (route.route) {
    case 'invalid': return { kind: 'invalid', reason: route.reason }
    case 'exact_visible': return { kind: 'exact_visible', candidate: { goldenId: route.candidate.goldenId, legalName: route.candidate.legalName, city: route.candidate.city }, echo }
    case 'exact_foreign': return { kind: 'exact_foreign', region: route.region, echo }
    case 'related': return { kind: 'related', candidate: { goldenId: route.candidate.goldenId, legalName: route.candidate.legalName, city: route.candidate.city, groupName: route.candidate.groupName }, echo }
    case 'no_candidates': return { kind: 'clear', echo }
    case 'compare': {
      const outcome = await proposeMatch({ legalName, taxId: n.taxId, city, street }, route.candidates)
      return { kind: 'compare', candidates: route.candidates.map((c) => ({ goldenId: c.goldenId, legalName: c.legalName, city: c.city, hasTaxId: c.taxId !== null, groupName: c.groupName })), outcome, echo }
    }
  }
}
