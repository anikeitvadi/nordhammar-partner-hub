import type { Domain, Region } from '@intake/contracts'

// One row of the customers or suppliers table. Plain data, shared by the server read and the client table.
export type BrowseRow = {
  goldenId: string; domain: Domain; legalName: string; localName: string | null; city: string; region: Region
  erpSystem: string | null; erpNumber: string | null; typeCode: string | null; status: string; industry: string | null
  groupName: string | null; taxCanonical: string | null; duns: string | null; aliases: string[]
}
