import { HubPage, type HubSearchParams } from '@/features/customers/hub-page'
export default async function SuppliersPage({ searchParams }: { searchParams: Promise<HubSearchParams> }) { return <HubPage domain="supplier" searchParams={await searchParams} /> }
