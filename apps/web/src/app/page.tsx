import { redirect } from 'next/navigation'

// The front door is the customer search. Suppliers are one click away in the header.
export default function Home() { redirect('/customers') }
