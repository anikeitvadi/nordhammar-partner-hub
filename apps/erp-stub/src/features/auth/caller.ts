import { createRemoteJWKSet } from 'jose'
import { authenticate, type Caller } from './verify'

// Policy from the environment, built once per instance. The JWKS is fetched lazily and cached by jose.
//   ERP_OIDC_ISSUER            https://oidc.vercel.com/<team>   (team issuer mode)
//   ERP_OIDC_AUDIENCE          https://vercel.com/<team>
//   ERP_ALLOWED_SUBJECTS       comma-separated owner:<team>:project:<name>:environment:<env>
//   ERP_SERVICE_TOKEN          the shared secret; honoured only when ERP_ALLOW_SHARED_SECRET=true
let getKey: ReturnType<typeof createRemoteJWKSet> | undefined

export async function callerFromRequest(req: Request): Promise<Caller | null> {
  const issuer = process.env.ERP_OIDC_ISSUER
  const audience = process.env.ERP_OIDC_AUDIENCE
  const allowedSubjects = (process.env.ERP_ALLOWED_SUBJECTS ?? '').split(',').map((s) => s.trim()).filter(Boolean)
  const sharedSecret = process.env.ERP_ALLOW_SHARED_SECRET === 'true' ? (process.env.ERP_SERVICE_TOKEN ?? null) : null
  if (!issuer || !audience) {
    // OIDC not configured: only the shared secret can authenticate, and only if enabled.
    return authenticate(req.headers.get('authorization'), { getKey: () => { throw new Error('OIDC not configured') }, issuer: '', audience: '', allowedSubjects: [], sharedSecret })
  }
  getKey ??= createRemoteJWKSet(new URL(`${issuer.replace(/\/$/, '')}/.well-known/jwks`))
  return authenticate(req.headers.get('authorization'), { getKey, issuer, audience, allowedSubjects, sharedSecret })
}
