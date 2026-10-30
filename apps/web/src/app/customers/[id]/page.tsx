import { notFound } from 'next/navigation'
import { requirePrincipal } from '@/features/auth/principal.server'
import { getCustomer } from '@/features/customers/hub.server'

export default async function CustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const principal = await requirePrincipal()
  const c = await getCustomer(principal, id)
  if (!c) notFound()
  return (
    <section>
      <h1>{c.legalName}</h1>
      <p>{c.region} · {c.country} · {c.erpSystem ?? 'no ERP'} {c.erpNumber ?? ''}</p>
      <dl className="facts">
        <dt>Tax ID</dt><dd>{c.taxScheme ? `${c.taxScheme} ${c.taxCanonical}` : 'missing in source'}</dd>
        <dt>Bill-to</dt><dd>{[c.street, c.streetNumber].filter(Boolean).join(' ') || '—'}, {c.city}</dd>
        {c.aliases.length ? <><dt>Also known as</dt><dd>{c.aliases.join(', ')}</dd></> : null}
        <dt>Credit ({c.region})</dt>
        <dd>{c.credit === 'not_entitled' ? 'not shown for your role' : c.credit ? `${c.credit.currency} ${c.credit.limit.toLocaleString()} · ${c.credit.terms}` : 'none on file'}</dd>
        {c.group ? <><dt>Group</dt><dd>{c.group.name}{c.group.members.length ? ` · also in ${c.group.members.map((m) => `${m.region} (${m.legalName})`).join(', ')}` : ''}</dd></> : null}
        <dt>Source</dt><dd>hub load {new Date(c.loadedAt).toLocaleDateString()}</dd>
      </dl>
    </section>
  )
}
