// The customer's service desk, as a stand-in. Deliberately plain and unlike the hub, so on stage it reads as their
// system, not ours: finance works here, the hub only hears about it through a signed webhook.
export const metadata = { title: 'Service Desk' }
const css = `
.desk{font:14px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif;color:#222;background:#f3f4f6;min-height:100vh;margin:0}
.desk header{background:#3b4a5a;color:#fff;padding:10px 20px;display:flex;flex-wrap:wrap;gap:4px 16px;justify-content:space-between;align-items:center}
.desk header a{color:#dfe6ee;margin-left:16px;text-decoration:none}
.desk main{max-width:980px;margin:20px auto;padding:0 16px}
.desk h1{font-size:18px;margin:0 0 12px}
.desk table{width:100%;border-collapse:collapse;background:#fff;border:1px solid #cfd4da}
.desk th,.desk td{text-align:left;padding:7px 10px;border-bottom:1px solid #e3e6ea;vertical-align:top}
.desk th{background:#e9ecef;font-weight:600;font-size:12px;text-transform:uppercase;color:#555}
.desk .box{background:#fff;border:1px solid #cfd4da;padding:14px 16px;margin:0 0 14px}
.desk label{display:block;font-size:12px;color:#555;margin:8px 0 2px}
.desk input,.desk select,.desk textarea{font:inherit;padding:5px 7px;border:1px solid #b9c0c8;width:100%;box-sizing:border-box;background:#fff}
.desk button{font:inherit;padding:6px 14px;border:1px solid #2f5d8a;background:#2f6aa3;color:#fff;cursor:pointer}
.desk button.reject{background:#fff;color:#a3332f;border-color:#a3332f}
.desk .grid{display:grid;grid-template-columns:1fr 1fr;gap:0 16px}
.desk .tag{display:inline-block;padding:1px 6px;border:1px solid #9aa4ae;font-size:12px}
.desk .box.next{border-left:4px solid #2f6aa3;background:#f7fafc}
.desk .muted{color:#6b7280}.desk .err{color:#a3332f}
@media (max-width:640px){.desk .grid{grid-template-columns:1fr}}
.desk .scroll{overflow-x:auto}
`
export default function DeskLayout({ children }: { children: React.ReactNode }) {
  return <div className="desk"><style>{css}</style><header><strong>Nordhammar Service Desk</strong><nav><a href="/desk">Queue</a><a href="/desk/new">New partner ticket</a></nav></header><main>{children}</main></div>
}
