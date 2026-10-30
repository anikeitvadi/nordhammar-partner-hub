import 'server-only'
import { neon } from '@neondatabase/serverless'

// The only module that knows the connection string. Feature *.server.ts modules own their SQL; nothing else imports this.
export function sql() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')
  return neon(url)
}
