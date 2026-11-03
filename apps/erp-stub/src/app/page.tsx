// The stage set's landing page. It stands in for the customer's integration platform: one authenticated API in front of
// three ERP instances and the golden-record feed. Nothing here is the product.
export default function Page() { return <main style={{ fontFamily: 'system-ui', padding: 24 }}><h1>Nordhammar integration platform (stand-in)</h1><p>Service-authenticated API only: POST /integration/v1/partners, GET /integration/v1/operations/:key, GET /integration/v1/golden-records. Behind it: ERP-1 (North America, Brazil, India), ERP-2 (Europe), ERP-3 (China).</p></main> }
