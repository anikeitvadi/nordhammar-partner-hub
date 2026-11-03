import { handleDeskWebhook } from '@/features/desk/webhook.server'

// POST /api/webhooks/service-desk. The raw body is read here, unparsed, because the signature is over the exact bytes.
// Everything else is in features/desk/webhook.server.ts.
export async function POST(req: Request) {
  return handleDeskWebhook(await req.text(), req.headers)
}
