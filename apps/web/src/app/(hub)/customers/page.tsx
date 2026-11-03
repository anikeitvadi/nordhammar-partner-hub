import type { Metadata } from 'next'
import { HubPage, type HubSearchParams } from '@/features/customers/hub-page'

export const metadata: Metadata = { title: 'Customers' }
export default async function CustomersPage({ searchParams }: { searchParams: Promise<HubSearchParams> }) { return <HubPage domain="customer" searchParams={await searchParams} /> }
