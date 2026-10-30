import type { Region } from '@intake/contracts'
import { requirePrincipal } from '@/features/auth/principal.server'
import { hasAnyRegion, visibleRegions } from '@/features/auth/scope'
import { IntakeForm } from '@/features/intake/intake-form.client'

export default async function NewIntakePage({ searchParams }: { searchParams: Promise<{ region?: string; name?: string }> }) {
  const principal = await requirePrincipal()
  if (!hasAnyRegion(principal)) return <section><h1>Your account has no region yet</h1></section>
  const regions = visibleRegions(principal)
  const { region: requested, name = '' } = await searchParams
  const initialRegion: Region = regions.includes(requested as Region) ? (requested as Region) : regions[0]
  return (
    <section className="narrow">
      <h1>Request a new customer</h1>
      <p>The hub is checked the moment you enter a tax ID, before the rest of the form. Nothing is created here; a reviewer approves, the ERP assigns the number.</p>
      <IntakeForm regions={regions} initialRegion={initialRegion} initialName={name} />
    </section>
  )
}
