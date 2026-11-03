import 'server-only'
import { headers } from 'next/headers'
import { connection } from 'next/server'
import type { Region, Role } from '@intake/contracts'
import { sql } from '@/lib/db'
import { supabaseServer } from './supabase.server'
import type { Principal } from './scope'

// Identity is verified with Supabase on every call (getUser hits the auth server, it does not trust the cookie).
// Entitlements are read fresh from the hub database, never from the session, so a revoked role takes effect on the next request.
export async function getPrincipal(): Promise<Principal | null> {
  // Identity is per request. On a page load, connection() tells Next so; without it the session check reads the clock
  // during the prerender pass and every page logs an unstable-value error. On a Server Action request (and the render
  // that answers it) connection() trips a cookies invariant inside Next 16.4, and nothing is prerendered there anyway,
  // so it is skipped. Verified both ways on the dev server: Ask answers, and page loads log no clock error.
  if (!(await headers()).get('next-action')) await connection()
  const supabase = await supabaseServer()
  const { data } = await supabase.auth.getUser()
  const email = data.user?.email
  if (!email) return null
  const rows = await sql()`select email, display_name, role, regions, global_identity, money_regions from entitlements where email = ${email}`
  const row = rows[0]
  if (!row) return { email, displayName: email, role: 'requester', regions: [], globalIdentity: false, moneyRegions: [] }
  return {
    email: row.email as string,
    displayName: row.display_name as string,
    role: row.role as Role,
    regions: row.regions as Region[],
    globalIdentity: row.global_identity as boolean,
    moneyRegions: row.money_regions as Region[],
  }
}

export async function requirePrincipal(): Promise<Principal> {
  const p = await getPrincipal()
  if (!p) throw new Error('unauthenticated')
  return p
}
