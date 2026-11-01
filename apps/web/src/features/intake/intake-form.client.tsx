'use client'
import { useRef, useState } from 'react'
import Link from 'next/link'
import type { Domain, Region } from '@intake/contracts'
import { checkMatches } from './actions'
import { resubmitRequestAction, saveDraftAction, submitRequestAction } from '@/features/requests/actions'
import { CUSTOMER_TYPES, INDUSTRIES, PAYMENT_TERMS, SECONDARY_IDS, SUPPLIER_TYPES, type FormValues } from '@/features/requests/payload'
import type { CheckResult } from './types'
import { SubmitButton } from '@/features/ui/submit-button.client'

// WF-04 + WF-05 as one island. Step 1 is identity: as soon as the legal name and the tax ID are there, the hub is
// checked (on blur, before the rest of the form exists). Step 2 opens only when the check allows it. Form state is
// browser state; every decision is the Server Action's, which re-derives the principal and re-validates everything.
// The check re-runs only when the identity actually changed since the last check; a re-run that lands on the same
// kind of outcome keeps the user's choice, so step 2 is never silently re-locked after it was filled in.

const TAX_LABEL: Record<string, string> = { BR: 'CNPJ', IN: 'GSTIN', US: 'EIN', CN: 'USCC', DE: 'VAT number', FR: 'VAT number', NL: 'VAT number', SE: 'VAT number', IT: 'VAT number', ES: 'VAT number', NO: 'VAT number', PT: 'VAT number', AT: 'VAT number', BE: 'VAT number', DK: 'VAT number', FI: 'VAT number', PL: 'VAT number', IE: 'VAT number' }
const COUNTRIES: Record<Region, { code: string; name: string }[]> = {
  BR: [{ code: 'BR', name: 'Brazil' }], US: [{ code: 'US', name: 'United States' }], IN: [{ code: 'IN', name: 'India' }], CN: [{ code: 'CN', name: 'China' }],
  EU: [{ code: 'DE', name: 'Germany' }, { code: 'FR', name: 'France' }, { code: 'NL', name: 'Netherlands' }, { code: 'SE', name: 'Sweden' }, { code: 'IT', name: 'Italy' }, { code: 'ES', name: 'Spain' }, { code: 'NO', name: 'Norway' }, { code: 'PT', name: 'Portugal' }, { code: 'FI', name: 'Finland' }, { code: 'DK', name: 'Denmark' }],
}
// Address fields per region, in the order people write them locally.
const ADDRESS: Record<Region, { key: string; label: string; required?: boolean; width?: 'short' }[]> = {
  BR: [{ key: 'postalCode', label: 'CEP', width: 'short' }, { key: 'street', label: 'Street', required: true }, { key: 'number', label: 'Number', width: 'short' }, { key: 'complement', label: 'Complemento' }, { key: 'district', label: 'Bairro', required: true }, { key: 'city', label: 'City', required: true }, { key: 'regionCode', label: 'UF', required: true, width: 'short' }],
  US: [{ key: 'street', label: 'Street', required: true }, { key: 'number', label: 'Suite / unit', width: 'short' }, { key: 'city', label: 'City', required: true }, { key: 'regionCode', label: 'State', required: true, width: 'short' }, { key: 'postalCode', label: 'ZIP', width: 'short' }],
  IN: [{ key: 'street', label: 'Street', required: true }, { key: 'number', label: 'Building', width: 'short' }, { key: 'district', label: 'Area' }, { key: 'city', label: 'City', required: true }, { key: 'regionCode', label: 'State', required: true, width: 'short' }, { key: 'postalCode', label: 'PIN', width: 'short' }],
  CN: [{ key: 'regionCode', label: 'Province', width: 'short' }, { key: 'city', label: 'City', required: true }, { key: 'district', label: 'District' }, { key: 'street', label: 'Street', required: true }, { key: 'number', label: 'Number', width: 'short' }, { key: 'postalCode', label: 'Postal code', width: 'short' }],
  EU: [{ key: 'street', label: 'Street', required: true }, { key: 'number', label: 'Number', width: 'short' }, { key: 'postalCode', label: 'Postal code', width: 'short' }, { key: 'city', label: 'City', required: true }],
}

type Props = { domain: Domain; regions: Region[]; initialRegion: Region; initial: FormValues; mode: 'new' | 'resubmit'; requestId?: string; error?: string }

export function IntakeForm({ domain, regions, initialRegion, initial, mode, requestId, error }: Props) {
  const [region, setRegion] = useState<Region>(initialRegion)
  const [country, setCountry] = useState(initial.country || COUNTRIES[initialRegion][0].code)
  const [legalName, setLegalName] = useState(initial.legalName ?? '')
  const [taxId, setTaxId] = useState(initial.taxId ?? '')
  // The check is a plain call to the Server Action from the event handler (not a form submission), so the island owns
  // the pending flag and any failure is shown, never swallowed.
  const [result, setResult] = useState<CheckResult | null>(null)
  const [checking, setChecking] = useState(false)
  const [choice, setChoice] = useState<{ dupChoice: 'new' | 'new_in_group' | 'not_related'; linkedGoldenId: string | null } | null>(mode === 'resubmit' ? { dupChoice: 'new', linkedGoldenId: null } : null)
  const [shipTo, setShipTo] = useState(Boolean(initial['ship.street']))
  const [relocked, setRelocked] = useState(false)
  const lastKey = useRef<string | null>(null)
  const stepTwo = useRef<HTMLDivElement>(null)
  const w = domain === 'customer' ? 'customer' : 'supplier'

  const identityKey = () => [region, country, legalName.trim().toLowerCase(), taxId.replace(/[^0-9a-z]/gi, '').toLowerCase()].join('|')
  const sameOutcome = (a: CheckResult | null, b: CheckResult) => a !== null && a.kind === b.kind && (b.kind !== 'compare' || a.kind !== 'compare' || a.candidates[0]?.goldenId === b.candidates[0]?.goldenId) && (b.kind !== 'related' || a.kind !== 'related' || a.candidate.goldenId === b.candidate.goldenId)
  const runCheck = async (force = false) => {
    if (!legalName.trim() || !taxId.trim() || checking) return
    const key = identityKey()
    if (!force && key === lastKey.current && result) return
    const fd = new FormData()
    fd.set('domain', domain); fd.set('region', region); fd.set('country', country); fd.set('legalName', legalName); fd.set('taxId', taxId)
    setChecking(true)
    try {
      const next = await checkMatches(null, fd)
      lastKey.current = key
      const keep = choice !== null && sameOutcome(result, next)
      if (!keep) { setRelocked(choice !== null); setChoice(null) }
      setResult(next)
    } catch (e) { setChoice(null); setResult({ kind: 'error', message: `The hub check failed: ${e instanceof Error ? e.message : 'unknown error'}. Try again.` }) }
    finally { setChecking(false) }
  }
  const choose = (c: Choice) => { setChoice(c); setRelocked(false); setTimeout(() => stepTwo.current?.focus(), 0) }
  const onRegion = (r: Region) => { setRegion(r); setCountry(COUNTRIES[r][0].code); setChoice(null); setResult(null); lastKey.current = null }
  const stepTwoOpen = mode === 'resubmit' || (choice !== null && result !== null && (result.kind === 'clear' || result.kind === 'related' || result.kind === 'compare'))
  const action = mode === 'resubmit' ? resubmitRequestAction : submitRequestAction

  return (
    <form action={action} className="intake">
      <input type="hidden" name="domain" value={domain} />
      <input type="hidden" name="region" value={region} />
      {requestId ? <input type="hidden" name="requestId" value={requestId} /> : null}
      {choice ? <><input type="hidden" name="dupChoice" value={choice.dupChoice} />{choice.linkedGoldenId ? <input type="hidden" name="linkedGoldenId" value={choice.linkedGoldenId} /> : null}</> : null}
      {error ? <p role="alert" className="panel error">{error === 'taxid' ? 'That tax ID is not valid for the country.' : error === 'reason' ? 'Say why this is not a duplicate.' : error}</p> : null}

      <fieldset className="card step">
        <div className="step-title">1 · Who</div>
        <div className="grid2">
          <label>Region
            <select value={region} onChange={(e) => onRegion(e.target.value as Region)} disabled={regions.length === 1}>{regions.map((r) => <option key={r} value={r}>{r}</option>)}</select>
          </label>
          <label>Country
            <select name="country" value={country} onChange={(e) => { setCountry(e.target.value); setChoice(null); setResult(null); lastKey.current = null }}>{COUNTRIES[region].map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}</select>
          </label>
        </div>
        <label>Legal name <span className="req">*</span><input name="legalName" value={legalName} onChange={(e) => setLegalName(e.target.value)} onBlur={() => void runCheck()} required autoFocus={mode === 'new'} /></label>
        {region === 'CN' ? <label>Legal name in Chinese <span className="req">*</span><input name="localName" defaultValue={initial.localName} lang="zh" required /></label> : null}
        <div className="grid2">
          <label>{TAX_LABEL[country] ?? 'Tax ID'} <span className="req">*</span><input name="taxId" value={taxId} onChange={(e) => setTaxId(e.target.value)} onBlur={() => void runCheck()} required inputMode="text" /></label>
          {(SECONDARY_IDS[region] ?? []).map((sec) => <label key={sec.scheme}>{sec.label}{sec.required ? <span className="req"> *</span> : null}<input name={`id_${sec.scheme}`} defaultValue={initial[`id_${sec.scheme}`]} /></label>)}
          <label>DUNS <span className="muted">optional</span><input name="duns" defaultValue={initial.duns} placeholder="9 digits" maxLength={11} /></label>
        </div>
        <p className="muted small">The hub is checked as soon as the legal name and the tax ID are filled in, before anything else.</p>
        {mode === 'new' ? <button type="button" className="secondary" onClick={() => void runCheck(true)} disabled={checking || !legalName.trim() || !taxId.trim()}>{checking ? 'Checking…' : 'Check the hub'}</button> : null}
        <div aria-live="polite">
          {checking ? <p className="muted small" role="status">Checking the hub…</p> : null}
          {relocked ? <p className="locked-note" role="status">Step 2 is locked again: the name or tax ID changed and the hub check came back different. Choose again below.</p> : null}
          {result && !checking ? <Matches result={result} domain={domain} choose={choose} chosen={choice} /> : null}
        </div>
      </fieldset>

      {!stepTwoOpen ? <p className="locked-note">{result === null ? 'Fill in the legal name and the tax ID above first. The hub is checked for duplicates before the rest of the form opens.' : result.kind === 'exact_visible' || result.kind === 'exact_foreign' ? 'This request cannot continue: the entity already exists.' : result.kind === 'invalid' || result.kind === 'error' ? 'Fix the tax ID above, then check the hub again.' : 'Pick one of the options above to open the rest of the form.'}</p> : null}
      <fieldset className={`card step ${stepTwoOpen ? '' : 'locked'}`} disabled={!stepTwoOpen}>
        <div className="step-title" ref={stepTwo} tabIndex={-1}>2 · Details</div>
        <div className="grid3">
          <label>{domain === 'customer' ? 'Customer type' : 'Supplier category'}<select name="typeCode" defaultValue={initial.typeCode ?? ''}><option value="">—</option>{(domain === 'customer' ? CUSTOMER_TYPES : SUPPLIER_TYPES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
          <label>Industry<select name="industry" defaultValue={initial.industry ?? ''}><option value="">—</option>{INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}</select></label>
          <label>Payment terms <span className="muted">if known</span><select name="paymentTerms" defaultValue={initial.paymentTerms ?? ''}><option value="">finance decides</option>{PAYMENT_TERMS.map((t) => <option key={t} value={t}>{t}</option>)}</select></label>
        </div>
        <h3>{domain === 'customer' ? 'Bill-to address' : 'Remit-to address'} <span className="req">*</span></h3>
        <AddressFields prefix="main" region={region} country={country} initial={initial} />
        {domain === 'customer' ? (
          shipTo ? <><h3>Ship-to address <button type="button" className="link" onClick={() => setShipTo(false)}>remove</button></h3><AddressFields prefix="ship" region={region} country={country} initial={initial} /></>
          : <p><button type="button" className="link" onClick={() => setShipTo(true)}>+ Add a ship-to address</button></p>
        ) : null}
        <h3>Contact and reason</h3>
        <div className="grid2">
          <label>Contact name<input name="contactName" defaultValue={initial.contactName} /></label>
          <label>Contact email<input name="contactEmail" type="email" defaultValue={initial.contactEmail} /></label>
        </div>
        <div className="grid2 reason">
          <label>Why is this {w} needed? <span className="req">*</span><input name="reasonText" defaultValue={initial.reasonText} placeholder={domain === 'customer' ? 'New quote, new project, new site…' : 'New part, second source, new service…'} required={stepTwoOpen} /></label>
          <label>Quote / PO reference <span className="muted">optional</span><input name="reasonReference" defaultValue={initial.reasonReference} placeholder="Q-2291" /></label>
        </div>
        {choice?.dupChoice === 'not_related' ? <label>Why is this not a duplicate? <span className="req">*</span> <span className="muted">the reviewer sees this next to the match</span><input name="dupReason" required /></label> : null}
        <div className="row">
          <SubmitButton pendingLabel="Submitting…">{mode === 'resubmit' ? 'Submit Again' : 'Submit Request'}</SubmitButton>
          {mode === 'new' ? <SubmitButton pendingLabel="Saving…" formAction={saveDraftAction} className="secondary">Save Draft</SubmitButton> : null}
          <span className="muted">Goes to the review queue. Nothing is created until a reviewer approves.</span>
        </div>
      </fieldset>
    </form>
  )
}

function AddressFields({ prefix, region, country, initial }: { prefix: string; region: Region; country: string; initial: FormValues }) {
  return (
    <div className="addr-grid">
      <input type="hidden" name={`${prefix}.country`} value={country} />
      {ADDRESS[region].map((f) => (
        <label key={f.key} className={f.width === 'short' ? 'short' : undefined}>{f.label}{f.required ? <span className="req"> *</span> : null}<input name={`${prefix}.${f.key}`} defaultValue={initial[`${prefix}.${f.key}`]} required={f.required && prefix === 'main'} /></label>
      ))}
    </div>
  )
}

type Choice = { dupChoice: 'new' | 'new_in_group' | 'not_related'; linkedGoldenId: string | null }

// The reason codes from the agent, in words. The raw reason stays in the server log.
function unavailable(reason: string): string {
  if (reason === 'disabled') return 'The suggested reading is switched off here.'
  if (reason.startsWith('rejected')) return 'The suggested reading did not pass its own check, so it is not shown.'
  if (reason.startsWith('no candidates')) return 'Nothing to compare.'
  return 'The suggested reading is not available right now.'
}

function Matches({ result, domain, choose, chosen }: { result: CheckResult; domain: Domain; choose: (c: Choice) => void; chosen: Choice | null }) {
  const path = domain === 'customer' ? '/customers' : '/suppliers'
  const pick = (c: Choice) => <button type="button" className={chosen?.dupChoice === c.dupChoice ? 'chosen' : 'secondary'} onClick={() => choose(c)}>{c.dupChoice === 'new' ? 'Continue: this is new' : c.dupChoice === 'new_in_group' ? 'Continue as a new company in this group' : 'Not related, continue'}</button>
  switch (result.kind) {
    case 'error': return <p role="alert" className="error">{result.message}</p>
    case 'invalid': return <p role="alert" className="error">{{ missing: 'A tax ID is required.', invalid_format: 'That tax ID is not in the right format for this country.', invalid_checksum: 'That tax ID fails its check digits. Nothing was searched.', unsupported_country: 'That country is not supported yet.' }[result.reason]}</p>
    case 'exact_visible': return <div className="panel stop"><strong>This {domain} already exists.</strong> <Link href={`${path}?id=${result.candidate.goldenId}`}>{result.candidate.legalName}, {result.candidate.city}</Link>. The request cannot continue; if the record is wrong, request a change instead.</div>
    case 'exact_foreign': return <div className="panel stop"><strong>A {domain} with this tax ID exists in {result.region}.</strong> Contact the {result.region} team. One legal entity is not created twice.</div>
    case 'related': return <div className="panel"><strong>Same company, different establishment.</strong> {result.candidate.legalName} ({result.candidate.city}) shares the company-level ID{result.candidate.groupName ? `, group ${result.candidate.groupName}` : ''}. <div className="row">{pick({ dupChoice: 'new_in_group', linkedGoldenId: result.candidate.goldenId })}</div></div>
    case 'clear': return <div className="panel ok"><strong>No match in {result.echo.region}.</strong> This looks new. <div className="row">{pick({ dupChoice: 'new', linkedGoldenId: null })}</div></div>
    case 'compare': {
      const linked = result.outcome.ai === 'available' && result.outcome.proposal.golden_id ? result.outcome.proposal.golden_id : result.candidates[0].goldenId
      return (
        <div className="panel">
          <strong>Possible matches, {result.candidates.length} found.</strong>
          <ul>{result.candidates.map((c) => <li key={c.goldenId}><Link href={`${path}?id=${c.goldenId}`}>{c.legalName}</Link>, {c.city}{c.hasTaxId ? '' : ' · no tax ID on file'}{c.groupName ? ` · ${c.groupName}` : ''}</li>)}</ul>
          {result.outcome.ai === 'available' ? (
            <div className="ai-card">
              <div className="ai-label">Suggested reading of the match · AI, a steward decides</div>
              <p className="ai-verdict">{{ same: 'Likely the same legal entity', different: 'Likely a different legal entity', unsure: 'Cannot be confirmed from the hub record' }[result.outcome.proposal.verdict]}{result.outcome.proposal.golden_id ? <span className="muted"> · {result.outcome.proposal.golden_id}</span> : null}</p>
              <ul className="reasons">{result.outcome.proposal.reasons.map((r, i) => <li key={i}>{r.field}: {r.observation}. {r.explanation}</li>)}</ul>
              <p className="muted small">Nothing is merged automatically. Your choice below is what the reviewer sees.</p>
            </div>
          ) : <p className="muted">{unavailable(result.outcome.reason)} The reviewer will compare these by hand.</p>}
          <p>Open one of these to use it (no request), or continue:</p>
          <div className="row">{pick({ dupChoice: 'new_in_group', linkedGoldenId: linked })}{pick({ dupChoice: 'not_related', linkedGoldenId: linked })}</div>
        </div>
      )
    }
  }
}
