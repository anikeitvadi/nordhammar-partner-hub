import 'server-only'
import { cleanCheck, type CanonicalPayload, type CleanFacts, type CleanResult, type Domain, type Region } from '@intake/contracts'
import { sql } from '@/lib/db'
import { normalizeTaxId } from './normalize'

// The facts the clean check needs, gathered when finance's approval arrives. Unlike the on-entry check, which shows a
// requester only what their regions allow, this runs for the system and looks at every region: a duplicate in a
// region the requester cannot see must still stop the automatic path. Nothing here is shown to the requester. It reads
// the hub uncached on purpose: a check that decides to create must not decide on a list that is minutes old.

export async function gatherCleanFacts(requestId: string): Promise<CleanFacts | null> {
  const db = sql()
  const rows = await db`select r.domain, r.region, r.dup_choice, v.payload from requests r join request_revisions v on v.request_id = r.request_id and v.revision = r.current_revision where r.request_id = ${requestId}`
  const r = rows[0]
  if (!r) return null
  const domain = r.domain as Domain
  const region = r.region as Region
  const p = r.payload as CanonicalPayload
  const tax = p.identity.canonical
  const n = normalizeTaxId(p.identity.country, tax)
  const key = n.ok ? n.taxId.companyKey ?? tax : tax
  const [exact, related, reservations, check, settings, names] = await Promise.all([
    db`select golden_id, legal_name, region from parties where domain = ${domain} and tax_canonical = ${tax}`,
    db`select golden_id, legal_name, region from parties where domain = ${domain} and tax_company_key = ${key} and tax_canonical <> ${tax}`,
    db`select request_id from identity_reservations where domain = ${domain} and tax_canonical = ${tax} and request_id <> ${requestId}`,
    db`select ai_verdict from hub_checks where request_id = ${requestId} and ai_verdict is not null order by at desc limit 1`,
    db`select auto_approve from hub_settings where id = 1`,
    nameCandidates(domain, region, p.legalName),
  ])
  return {
    taxValid: n.ok,
    exactMatches: exact.map((x) => ({ goldenId: x.golden_id as string, legalName: x.legal_name as string, region: x.region as Region })),
    openRequestsSameTax: reservations.map((x) => x.request_id as string),
    relatedMatches: related.map((x) => ({ goldenId: x.golden_id as string, legalName: x.legal_name as string, region: x.region as Region })),
    // A name candidate that carries a tax ID of the same country and still did not match is a different company.
    nameMatches: names.filter((c) => !c.taxCanonical || c.country !== p.identity.country).map((c) => ({ goldenId: c.goldenId, legalName: c.legalName })),
    aiReading: (check[0]?.ai_verdict as CleanFacts['aiReading']) ?? null,
    dupChoice: (r.dup_choice as CleanFacts['dupChoice']) ?? 'new',
    // The payload was built by the form's builder and refused if incomplete, so nothing required can be missing here.
    missingFields: [],
    autoApproveOn: (settings[0]?.auto_approve as boolean | undefined) ?? true,
  }
}

export async function runCleanCheck(requestId: string): Promise<CleanResult | null> {
  const f = await gatherCleanFacts(requestId)
  return f ? cleanCheck(f) : null
}

// The same name search the on-entry check runs (hub.server findNameCandidates): the first significant word against legal
// names and aliases, in the request's region.
async function nameCandidates(domain: Domain, region: Region, name: string): Promise<{ goldenId: string; legalName: string; taxCanonical: string | null; country: string }[]> {
  const words = name.toLowerCase().split(/\s+/).filter((w) => w.length >= 3).slice(0, 3)
  if (words.length === 0) return []
  const like = `%${words[0]}%`
  const rows = await sql()`select golden_id, legal_name, tax_canonical, country from parties
    where domain = ${domain} and region = ${region} and (lower(legal_name) like ${like} or exists (select 1 from unnest(aliases) a where lower(a) like ${like}))
    order by legal_name limit 10`
  return rows.map((x) => ({ goldenId: x.golden_id as string, legalName: x.legal_name as string, taxCanonical: (x.tax_canonical as string | null) ?? null, country: x.country as string }))
}
