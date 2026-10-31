import { receive } from '@/features/erp/receive'

// POST /api/customers: the customer master. See features/erp/receive.ts.
export async function POST(req: Request) { return receive(req, 'customer') }
