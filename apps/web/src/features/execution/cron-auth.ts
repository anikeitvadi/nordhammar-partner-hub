// Pure. Vercel Cron sends the project's CRON_SECRET as a bearer token. No secret configured means no call is accepted:
// the route fails closed instead of letting anyone start a load.
export function cronAuthorized(authorization: string | null, secret: string | undefined): boolean {
  return !!secret && authorization === `Bearer ${secret}`
}
