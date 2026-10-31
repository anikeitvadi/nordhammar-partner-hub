// Supabase Auth connection, injected by the Vercel Marketplace resource with the AUTH_ prefix (so its Postgres
// variables never collide with Neon's). The unprefixed NEXT_PUBLIC_ names remain accepted for a hand-made project.
// Only the URL and the publishable key are ever read by the app; the secret key is used by the owner's user script.
export function supabaseEnv(): { url: string; publishableKey: string } {
  const url = process.env.AUTH_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const publishableKey = process.env.AUTH_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !publishableKey) throw new Error('Supabase Auth is not configured (AUTH_SUPABASE_URL / AUTH_SUPABASE_PUBLISHABLE_KEY)')
  return { url, publishableKey }
}
