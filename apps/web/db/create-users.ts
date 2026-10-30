// Creates the five test users in Supabase Auth, confirmed, with passwords. Server-side only, run once by the owner:
//   SUPABASE_URL=... SUPABASE_SECRET_KEY=sb_secret_... TEST_USER_PASSWORD=... pnpm --filter web db:users
// The secret key never goes in a deployed environment or in the repo. Public signup stays disabled in the dashboard.
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
const secret = process.env.SUPABASE_SECRET_KEY
const password = process.env.TEST_USER_PASSWORD
if (!url || !secret || !password) throw new Error('SUPABASE_URL, SUPABASE_SECRET_KEY and TEST_USER_PASSWORD are required')
const admin = createClient(url, secret, { auth: { autoRefreshToken: false, persistSession: false } })

const emails = ['ana.requester@example.com', 'jonas.requester@example.com', 'priya.reviewer@example.com', 'sam.operator@example.com', 'noregion@example.com']
for (const email of emails) {
  const { error } = await admin.auth.admin.createUser({ email, password, email_confirm: true })
  console.info(email, error ? `skipped: ${error.message}` : 'created')
}
