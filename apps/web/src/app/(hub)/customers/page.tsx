import { HubPage, type HubSearchParams } from '@/features/customers/hub-page'
export default async function CustomersPage({ searchParams }: { searchParams: Promise<HubSearchParams> }) { return <HubPage domain="customer" searchParams={await searchParams} /> }
