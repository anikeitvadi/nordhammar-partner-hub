'use client'
import { useActionState } from 'react'
import Link from 'next/link'
import type { Region } from '@intake/contracts'
import { checkMatches } from './actions'
import type { CheckResult } from './types'

// The one client island in the intake path. Form state is browser state (fine). The result is whatever the Server
// Action returned; nothing here mirrors server business state, and nothing here decides anything.
const TAX_LABEL: Record<string, string> = { BR: 'CNPJ', IN: 'GSTIN', US: 'EIN', CN: 'USCC', EU: 'VAT number' }
const COUNTRIES: Record<Region, { code: string; name: string }[]> = {
  BR: [{ code: 'BR', name: 'Brazil' }], US: [{ code: 'US', name: 'United States' }], IN: [{ code: 'IN', name: 'India' }], CN: [{ code: 'CN', name: 'China' }],
  EU: [{ code: 'DE', name: 'Germany' }, { code: 'FR', name: 'France' }, { code: 'NL', name: 'Netherlands' }, { code: 'SE', name: 'Sweden' }, { code: 'IT', name: 'Italy' }, { code: 'ES', name: 'Spain' }, { code: 'NO', name: 'Norway' }, { code: 'PT', name: 'Portugal' }],
}

export function IntakeForm({ regions, initialRegion, initialName }: { regions: Region[]; initialRegion: Region; initialName: string }) {
  const [result, action, pending] = useActionState<CheckResult | null, FormData>(checkMatches, null)
  return (
    <form action={action} className="stack">
      <label>Region
        <select name="region" defaultValue={initialRegion} disabled={regions.length === 1}>{regions.map((r) => <option key={r} value={r}>{r}</option>)}</select>
        {regions.length === 1 ? <input type="hidden" name="region" value={initialRegion} /> : null}
      </label>
      <label>Country
        <select name="country" defaultValue={COUNTRIES[initialRegion][0].code}>{regions.flatMap((r) => COUNTRIES[r]).map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}</select>
      </label>
      <label>Legal name <input name="legalName" defaultValue={initialName} required /></label>
      <label>Tax ID ({TAX_LABEL[initialRegion]}) <input name="taxId" required /></label>
      <label>Bill-to street <input name="street" placeholder="Rua Demo, 20" /></label>
      <label>City <input name="city" required /></label>
      <button type="submit" disabled={pending}>{pending ? 'Checking the hub…' : 'Check for matches'}</button>
      {result ? <Matches result={result} /> : null}
    </form>
  )
}

function Matches({ result }: { result: CheckResult }) {
  switch (result.kind) {
    case 'error': return <p role="alert" className="error">{result.message}</p>
    case 'invalid': return <p role="alert" className="error">{{ missing: 'A tax ID is required.', invalid_format: 'That tax ID is not in the right format for this country.', invalid_checksum: 'That tax ID fails its check digits. Nothing was searched.', unsupported_country: 'That country is not supported yet.' }[result.reason]}</p>
    case 'exact_visible': return <div className="panel"><strong>This customer already exists.</strong> <Link href={`/customers/${result.candidate.goldenId}`}>{result.candidate.legalName}, {result.candidate.city}</Link>. The request cannot continue; if the record is wrong, request a change instead.</div>
    case 'exact_foreign': return <div className="panel"><strong>A customer with this tax ID exists in {result.region}.</strong> Contact the {result.region} team. One legal entity is not created twice.</div>
    case 'related': return <div className="panel"><strong>Same company, different establishment.</strong> {result.candidate.legalName} ({result.candidate.city}) shares the company-level ID{result.candidate.groupName ? `, group ${result.candidate.groupName}` : ''}. Continue as a new company in this group. <em>Submission arrives in the next increment.</em></div>
    case 'clear': return <div className="panel"><strong>No match in {result.echo.region}.</strong> This looks new. <em>Submission arrives in the next increment.</em></div>
    case 'compare': return (
      <div className="panel">
        <strong>Possible matches, {result.candidates.length} found.</strong>
        <ul>{result.candidates.map((c) => <li key={c.goldenId}><Link href={`/customers/${c.goldenId}`}>{c.legalName}</Link>, {c.city}{c.hasTaxId ? '' : ' · no tax ID on file'}{c.groupName ? ` · ${c.groupName}` : ''}</li>)}</ul>
        {result.outcome.ai === 'available' ? (
          <div className="proposal">
            <p><strong>Assessment:</strong> {{ same: 'likely the same legal entity', different: 'likely a different legal entity', unsure: 'cannot be confirmed from the hub record' }[result.outcome.proposal.verdict]}{result.outcome.proposal.golden_id ? ` (${result.outcome.proposal.golden_id})` : ''}. A steward decides; nothing is merged automatically.</p>
            <ul className="reasons">{result.outcome.proposal.reasons.map((r, i) => <li key={i}>{r.field}: {r.observation}. {r.explanation}</li>)}</ul>
            <small>model: {result.outcome.model}</small>
          </div>
        ) : <p className="muted">Assessment unavailable ({result.outcome.reason}). The steward will compare these by hand.</p>}
        <p>Choose: use one of these customers (open it), continue as a new company in the same group, or continue as not related with a reason for the reviewer. <em>Choices arrive in the next increment.</em></p>
      </div>
    )
  }
}
