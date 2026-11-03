import 'server-only'
import type { Domain, Region } from '@intake/contracts'
import { sql } from '@/lib/db'
import type { Principal } from '@/features/auth/scope'
import type { CheckRecord } from './check-record'

const id = () => `C-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase()

// Best-effort, like the ERP attempt log: a failed write here must never stop the person from seeing the check result.
export async function recordCheck(principal: Principal, domain: Domain, region: Region, rec: CheckRecord): Promise<void> {
  const a = rec.ai
  try {
    await sql()`insert into hub_checks (check_id, requester_email, domain, region, tax_canonical, route, matched_golden_id, matched_name, matched_region,
        ai_verdict, ai_golden_id, ai_model, ai_input_tokens, ai_output_tokens, ai_cost, ai_generation_id, ai_unavailable)
      values (${id()}, ${principal.email}, ${domain}, ${region}, ${rec.taxCanonical}, ${rec.route}, ${rec.matchedGoldenId}, ${rec.matchedName}, ${rec.matchedRegion},
        ${a?.verdict ?? null}, ${a?.goldenId ?? null}, ${a?.model ?? null}, ${a?.inputTokens ?? null}, ${a?.outputTokens ?? null}, ${a?.cost ?? null}, ${a?.generationId ?? null}, ${a?.unavailable ?? null})`
  } catch (e) {
    console.error('hub check not recorded', e instanceof Error ? e.message : e)
  }
}

// On submit: the person's latest unlinked check for this identity in the last two hours becomes part of the request,
// and its summary goes on the timeline. Read server-side, so the model, tokens and cost are what the Gateway reported,
// not what the browser says. Best-effort: a request is never refused because its check record is missing.
export async function linkLatestCheck(principal: Principal, domain: Domain, taxCanonical: string, requestId: string): Promise<void> {
  try {
    const db = sql()
    const rows = await db`update hub_checks set request_id = ${requestId}
      where check_id = (select check_id from hub_checks where requester_email = ${principal.email} and domain = ${domain} and tax_canonical = ${taxCanonical}
        and request_id is null and at > now() - interval '2 hours' order by at desc limit 1)
      returning route, matched_name, matched_region, ai_verdict, ai_golden_id, ai_model, ai_input_tokens, ai_output_tokens, ai_cost, ai_unavailable`
    const r = rows[0]
    if (!r) return
    const ai = r.route === 'compare' ? { verdict: r.ai_verdict ?? null, goldenId: r.ai_golden_id ?? null, model: r.ai_model ?? null, inputTokens: r.ai_input_tokens ?? null, outputTokens: r.ai_output_tokens ?? null, cost: r.ai_cost == null ? null : Number(r.ai_cost), generationId: null, unavailable: r.ai_unavailable ?? null } : null
    await db`insert into request_events (request_id, kind, actor, detail) values (${requestId}, 'hub_checked', 'hub', ${JSON.stringify({ route: r.route, matchedName: r.matched_name, matchedRegion: r.matched_region, ai })}::jsonb)`
  } catch (e) {
    console.error('hub check not linked', e instanceof Error ? e.message : e)
  }
}
