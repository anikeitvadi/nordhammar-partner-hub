import { createPartner } from '@/features/integration/create'

// POST /integration/v1/partners. See features/integration/create.ts and docs/STAGE-SET-CONTRACT.md §3.
export async function POST(req: Request) { return createPartner(req) }
