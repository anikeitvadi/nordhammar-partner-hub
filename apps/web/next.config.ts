import type { NextConfig } from 'next'
import { withWorkflow } from 'workflow/next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Pages that were folded into others (review log §11, §12). Real HTTP redirects, not page-level redirect(): a page
  // here is partially prerendered, so a redirect inside it would only happen in the browser after the shell is sent.
  // The query string carries through, so an old /operations?msg=... still shows its message.
  async redirects() {
    return [
      { source: '/operations', destination: '/reviews?tab=stopped', permanent: false },
      { source: '/reports', destination: '/', permanent: false },
    ]
  },
}

export default withWorkflow(nextConfig)
