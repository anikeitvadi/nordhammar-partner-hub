import { createPartner } from '@/features/integration/create'

// Old route, kept for the one deploy in which the hub still calls it. Removed once the hub calls /integration/v1/partners.
export async function POST(req: Request) { return createPartner(req, { legacyDomain: 'supplier' }) }
