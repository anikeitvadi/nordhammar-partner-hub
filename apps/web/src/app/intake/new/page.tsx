import type { Domain, Region } from '@intake/contracts'
import { requirePrincipal } from '@/features/auth/principal.server'
import { hasAnyRegion, visibleRegions } from '@/features/auth/scope'
import { IntakeForm } from '@/features/intake/intake-form.client'

export default async function NewIntakePage({ searchParams }: { searchParams: Promise<{ domain?: string; region?: string; name?: string; error?: string }> }) {
  const principal = await requirePrincipal()
  if (!hasAnyRegion(principal)) return <section><h1>Your account has no region yet</h1></section>
  const regions = visibleRegions(principal)
  const { domain: d, region: requested, name = '', error } = await searchParams
  const domain: Domain = d === 'supplier' ? 'supplier' : 'customer'
  const initialRegion: Region = regions.includes(requested as Region) ? (requested as Region) : regions[0]
  return (
    <section className="narrow-wide">
      <h1>Request a new {domain}</h1>
      <p>One form for every region; the region decides which tax and address fields appear. Nothing is created here: a reviewer approves, the ERP assigns the number.</p>
      <IntakeForm domain={domain} regions={regions} initialRegion={initialRegion} initial={{ legalName: name }} mode="new" error={error} />
    </section>
  )
}
