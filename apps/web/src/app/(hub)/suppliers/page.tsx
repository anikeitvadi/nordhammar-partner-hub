import type { Metadata } from 'next'
import { HubPage, type HubSearchParams } from '@/features/customers/hub-page'

export const metadata: Metadata = { title: 'Suppliers' }
export default async function SuppliersPage({ searchParams }: { searchParams: Promise<HubSearchParams> }) { return <HubPage domain="supplier" searchParams={await searchParams} /> }
