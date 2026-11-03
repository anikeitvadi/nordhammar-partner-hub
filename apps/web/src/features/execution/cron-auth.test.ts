import { describe, expect, it } from 'vitest'
import { cronAuthorized } from './cron-auth'

describe('the nightly load route', () => {
  it('accepts only the configured secret as a bearer token', () => {
    expect(cronAuthorized('Bearer s3cret', 's3cret')).toBe(true)
    expect(cronAuthorized('Bearer wrong', 's3cret')).toBe(false)
    expect(cronAuthorized('s3cret', 's3cret')).toBe(false)
  })
  it('fails closed when no secret is configured, even for an empty bearer', () => {
    expect(cronAuthorized('Bearer ', undefined)).toBe(false)
    expect(cronAuthorized('Bearer ', '')).toBe(false)
    expect(cronAuthorized(null, undefined)).toBe(false)
  })
})
