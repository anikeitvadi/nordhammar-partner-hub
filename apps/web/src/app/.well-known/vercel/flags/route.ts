import { createFlagsDiscoveryEndpoint, getProviderData } from 'flags/next'
import * as flags from '@/features/flags/flags'

// What the Vercel Toolbar reads to list the flags and offer overrides. Authenticated with FLAGS_SECRET by the SDK.
export const GET = createFlagsDiscoveryEndpoint(() => getProviderData(flags))
