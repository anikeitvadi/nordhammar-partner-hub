import { receive } from '@/features/erp/receive'

// POST /api/suppliers: the vendor master. Same ledger, its own number range, the same replay and conflict rules.
export async function POST(req: Request) { return receive(req, 'supplier') }
