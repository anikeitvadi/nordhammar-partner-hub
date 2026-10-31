import { jwtVerify, type JWTVerifyGetKey } from 'jose'

// Who is calling the ERP boundary. Preferred: a Vercel OIDC token minted for the web app's deployment, verified
// against Vercel's published keys; the subject names team, project and environment, so only the intake app's own
// deployments are accepted. Fallback (flagged): the shared service secret, kept for local runs without a token and
// as the migration path a real ERP would start from.
export type Caller =
  | { kind: 'oidc'; subject: string; project: string; environment: string }
  | { kind: 'secret' }

export type Policy = {
  getKey: JWTVerifyGetKey
  issuer: string
  audience: string
  allowedSubjects: readonly string[]
  sharedSecret: string | null // null = shared secret disabled
}

const JWT = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/

export async function authenticate(authorization: string | null, policy: Policy): Promise<Caller | null> {
  const m = /^Bearer\s+(.+)$/i.exec(authorization ?? '')
  if (!m) return null
  const credential = m[1].trim()
  if (JWT.test(credential)) {
    try {
      const { payload } = await jwtVerify(credential, policy.getKey, { issuer: policy.issuer, audience: policy.audience, algorithms: ['RS256'] })
      const subject = payload.sub ?? ''
      if (!policy.allowedSubjects.includes(subject)) return null
      return { kind: 'oidc', subject, project: String(payload.project ?? ''), environment: String(payload.environment ?? '') }
    } catch {
      return null // a token that does not verify is not downgraded to the secret path
    }
  }
  if (policy.sharedSecret && timingSafeEqual(credential, policy.sharedSecret)) return { kind: 'secret' }
  return null
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}
