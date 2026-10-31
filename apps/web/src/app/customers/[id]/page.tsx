import { notFound } from 'next/navigation'
import { requirePrincipal } from '@/features/auth/principal.server'
import { getParty } from '@/features/customers/hub.server'
import { PartyDetail } from '@/features/customers/party-detail'

// Standalone record page (links from forms and requests land here). The same component the split view renders.
export default async function PartyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const principal = await requirePrincipal()
  const p = await getParty(principal, id)
  if (!p) notFound()
  return <section className="narrow-wide"><PartyDetail party={p} /></section>
}
