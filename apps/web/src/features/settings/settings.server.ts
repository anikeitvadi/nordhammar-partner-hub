import 'server-only'
import { sql } from '@/lib/db'
import { isCentral, type Principal } from '@/features/auth/scope'

// The central team's switch for automatic approval. A stored setting, not a Toolbar flag: a finance approval reaches the
// hub as a server-to-server webhook, which carries no one's override cookie, so only a value in the hub can govern it.
// Off means every finance-approved request becomes an exception for a person. It routes work; it never grants anything.
export async function autoApproveSetting(): Promise<{ on: boolean; updatedBy: string | null; updatedAt: string | null }> {
  const r = (await sql()`select auto_approve, updated_by, updated_at from hub_settings where id = 1`)[0]
  return { on: (r?.auto_approve as boolean | undefined) ?? true, updatedBy: (r?.updated_by as string | null) ?? null, updatedAt: r?.updated_at ? new Date(r.updated_at as string).toISOString() : null }
}

export async function setAutoApprove(principal: Principal, on: boolean): Promise<boolean> {
  if (!isCentral(principal)) return false
  await sql()`insert into hub_settings (id, auto_approve, updated_by, updated_at) values (1, ${on}, ${principal.email}, now()) on conflict (id) do update set auto_approve = excluded.auto_approve, updated_by = excluded.updated_by, updated_at = excluded.updated_at`
  return true
}
