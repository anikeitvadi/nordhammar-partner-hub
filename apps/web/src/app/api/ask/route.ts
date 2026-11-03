import { handleAsk } from '@/features/ask/route.server'

// Thin caller; the handler checks the person and streams the answer (features/ask/route.server.ts).
export const POST = handleAsk
