import type { Metadata } from 'next'
import type { Domain, Region } from '@intake/contracts'
import { requirePrincipal } from '@/features/auth/principal.server'
import { hasAnyRegion, workRegions } from '@/features/auth/scope'
import { IntakeForm } from '@/features/intake/intake-form.client'

export const metadata: Metadata = { title: 'New request' }

export default async function NewIntakePage({ searchParams }: { searchParams: Promise<{ domain?: string; region?: string; name?: string; error?: string }> }) {
  const principal = await requirePrincipal()
  if (!hasAnyRegion(principal)) return <section><h1>Your account has no region yet</h1><p>Ask IT to add you to a region group. Nothing else loads until then.</p></section>
  const regions = workRegions(principal)
  const { domain: d, region: requested, name = '', error } = await searchParams
  const domain: Domain = d === 'supplier' ? 'supplier' : 'customer'
  const initialRegion: Region = regions.includes(requested as Region) ? (requested as Region) : regions[0]
  return (
    <section className="narrow-wide">
      <h1>Request a new {domain}</h1>
      <p>One form for every region; the region decides which tax and address fields appear. Finance approves it in the service desk; if every check then passes, the ERP assigns the number, and anything else goes to the central team.</p>
      <IntakeForm domain={domain} regions={regions} initialRegion={initialRegion} initial={{ legalName: name }} mode="new" error={error} />
    </section>
  )
}
