import { describe, expect, it, beforeAll } from 'vitest'
import { SignJWT, createLocalJWKSet, exportJWK, generateKeyPair, type JWTVerifyGetKey } from 'jose'
import { authenticate, type Policy } from './verify'

// The verifier is tested against a key pair generated here, through the same JWKS code path the stub uses in
// production (a remote set there, a local set here). The claims mirror Vercel's documented token anatomy.
const ISS = 'https://oidc.vercel.com/anakeet'
const AUD = 'https://vercel.com/anakeet'
const SUB = 'owner:anakeet:project:customer-intake-web:environment:production'

let priv: CryptoKey
let getKey: JWTVerifyGetKey
let otherPriv: CryptoKey

beforeAll(async () => {
  const kp = await generateKeyPair('RS256')
  priv = kp.privateKey
  const jwk = await exportJWK(kp.publicKey)
  getKey = createLocalJWKSet({ keys: [{ ...jwk, kid: 'k1', alg: 'RS256', use: 'sig' }] })
  otherPriv = (await generateKeyPair('RS256')).privateKey
})

function policy(over: Partial<Policy> = {}): Policy {
  return { getKey, issuer: ISS, audience: AUD, allowedSubjects: [SUB], sharedSecret: 'shared-secret', ...over }
}

async function token(claims: Record<string, unknown>, key: CryptoKey = priv, exp = '2h') {
  return new SignJWT({ owner: 'anakeet', project: 'customer-intake-web', environment: 'production', ...claims })
    .setProtectedHeader({ alg: 'RS256', kid: 'k1', typ: 'JWT' }).setIssuer(ISS).setAudience(AUD).setSubject(SUB).setIssuedAt().setExpirationTime(exp).sign(key)
}

describe('ERP boundary authentication', () => {
  it('accepts a token from the intake app production deployment', async () => {
    expect(await authenticate(`Bearer ${await token({})}`, policy())).toEqual({ kind: 'oidc', subject: SUB, project: 'customer-intake-web', environment: 'production' })
  })
  it('refuses another project, another environment, another audience, an expired token, and a foreign key', async () => {
    const other = await new SignJWT({}).setProtectedHeader({ alg: 'RS256', kid: 'k1' }).setIssuer(ISS).setAudience(AUD).setSubject('owner:anakeet:project:someone-else:environment:production').setExpirationTime('2h').sign(priv)
    expect(await authenticate(`Bearer ${other}`, policy())).toBeNull()
    const preview = await new SignJWT({}).setProtectedHeader({ alg: 'RS256', kid: 'k1' }).setIssuer(ISS).setAudience(AUD).setSubject(SUB.replace('production', 'preview')).setExpirationTime('2h').sign(priv)
    expect(await authenticate(`Bearer ${preview}`, policy())).toBeNull()
    const wrongAud = await new SignJWT({}).setProtectedHeader({ alg: 'RS256', kid: 'k1' }).setIssuer(ISS).setAudience('https://vercel.com/other').setSubject(SUB).setExpirationTime('2h').sign(priv)
    expect(await authenticate(`Bearer ${wrongAud}`, policy())).toBeNull()
    expect(await authenticate(`Bearer ${await token({}, priv, '-1s')}`, policy())).toBeNull()
    expect(await authenticate(`Bearer ${await token({}, otherPriv)}`, policy())).toBeNull()
  })
  it('never downgrades a bad token to the secret path', async () => {
    expect(await authenticate(`Bearer ${await token({}, otherPriv)}`, policy({ sharedSecret: 'shared-secret' }))).toBeNull()
  })
  it('accepts the shared secret only while the fallback is enabled', async () => {
    expect(await authenticate('Bearer shared-secret', policy())).toEqual({ kind: 'secret' })
    expect(await authenticate('Bearer shared-secret', policy({ sharedSecret: null }))).toBeNull()
    expect(await authenticate('Bearer shared-secreT', policy())).toBeNull()
    expect(await authenticate(null, policy())).toBeNull()
  })
})
