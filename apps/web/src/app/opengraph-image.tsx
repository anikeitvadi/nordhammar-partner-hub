import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// The link preview for the submission email: the product name and one line, in the app's own colors.
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Nordhammar Partner Hub: one record for every partner, in every region'

export default async function Image() {
  // the same generated grain as the sign-in page, faint, tiled over the ground
  const grain = `data:image/png;base64,${(await readFile(join(process.cwd(), 'public', 'grain.png'))).toString('base64')}`
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, background: '#f5f5f4', backgroundImage: `url(${grain})`, backgroundRepeat: 'repeat', backgroundSize: '160px 160px', color: '#1a1a1c', fontFamily: 'Georgia, serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 26, color: '#6f737a', fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: 2, textTransform: 'uppercase' }}>Nordhammar Industries · master data</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 76, lineHeight: 1.08, letterSpacing: -1 }}>One record for every partner, in every region.</div>
          <div style={{ fontSize: 30, color: '#4f5258', fontFamily: 'Helvetica, Arial, sans-serif' }}>Search before you request. A reviewer approves, the ERP assigns the number.</div>
        </div>
        <div style={{ display: 'flex', gap: 12, fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 22 }}>
          {['BR', 'US', 'IN', 'CN', 'EU'].map((r) => <div key={r} style={{ display: 'flex', padding: '8px 18px', borderRadius: 999, background: 'rgba(34,86,217,.10)', color: '#1d49b8' }}>{r}</div>)}
          <div style={{ display: 'flex', padding: '8px 18px', borderRadius: 999, background: 'rgba(21,115,71,.10)', color: '#157347' }}>Partner Hub</div>
        </div>
      </div>
    ),
    { ...size },
  )
}
