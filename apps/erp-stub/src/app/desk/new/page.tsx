import { newTicketAction } from '@/features/desk/actions'

// Ticket first: a new partner raised in the desk. The desk cannot see the hub, so there is no duplicate check here;
// the hub runs every check when finance approves.
export default async function DeskNew({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams
  const f = (name: string, label: string, opts: { required?: boolean; placeholder?: string } = {}) => <div><label htmlFor={name}>{label}{opts.required ? ' *' : ''}</label><input id={name} name={name} required={opts.required} placeholder={opts.placeholder} /></div>
  return (
    <>
      <h1>New partner ticket</h1>
      {error ? <p className="err">Fill in every field marked with a star.</p> : null}
      <form action={newTicketAction} className="box">
        <div className="grid">
          {f('requesterEmail', 'Requester email', { required: true, placeholder: 'ana.requester@example.com' })}
          <div><label htmlFor="region">Region *</label><select id="region" name="region" required defaultValue="BR">{['BR', 'EU', 'US', 'IN', 'CN'].map((r) => <option key={r}>{r}</option>)}</select></div>
          <div><label htmlFor="domain">Customer or supplier *</label><select id="domain" name="domain" defaultValue="customer"><option value="customer">Customer</option><option value="supplier">Supplier</option></select></div>
          {f('country', 'Country code', { required: true, placeholder: 'BR' })}
          {f('legalName', 'Legal name', { required: true })}
          {f('localName', 'Name in the local script (China)')}
          {f('taxId', 'Tax ID', { required: true })}
          {f('typeCode', 'Type code', { placeholder: 'end_user, oem, distributor, contractor; or a supplier category' })}
          {f('industry', 'Industry')}
          {f('street', 'Street', { required: true })}
          {f('number', 'Number')}
          {f('district', 'District (Bairro)')}
          {f('city', 'City', { required: true })}
          {f('regionCode', 'State or UF')}
          {f('postalCode', 'Postal code')}
        </div>
        <label htmlFor="reason">Why is this partner needed? *</label><textarea id="reason" name="reason" rows={2} required />
        <p><button type="submit">Raise ticket</button></p>
      </form>
    </>
  )
}
