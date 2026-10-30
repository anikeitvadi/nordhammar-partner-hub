import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = { title: 'Customer Intake', description: 'Search the hub. Request a customer. One review. The ERP owns the number.' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="shell-header">
          <span className="shell-brand">Customer Intake</span>
          <span className="shell-region">Region: pending login</span>
        </header>
        <main className="shell-main">{children}</main>
      </body>
    </html>
  )
}
