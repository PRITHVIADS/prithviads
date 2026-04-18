'use client'
import { useState, useEffect } from 'react'
import { getUser } from '@/lib/api'

export default function PixelSetupPage() {
  const [user, setUser] = useState(null)
  const [copied, setCopied] = useState(false)
  const [tab, setTab] = useState('html')

  useEffect(() => { setUser(getUser()) }, [])

  const pixelId = user?.pixelId || 'PV-' + (user?.id || '000000').slice(-6).toUpperCase()
  const baseUrl = 'https://prithviads-zorz.vercel.app'

  const codes = {
    html: `<!-- PrithviAds Pixel -->\n<script>\n(function(w,d,s,id){\n  w._pvq=w._pvq||[];\n  w._pvq.push(['init','${pixelId}']);\n  var f=d.getElementsByTagName(s)[0],j=d.createElement(s);\n  j.async=true;j.src='${baseUrl}/pixel.js';\n  f.parentNode.insertBefore(j,f);\n})(window,document,'script','prithvi');\n</script>\n<!-- End PrithviAds Pixel -->`,
    shopify: `{% comment %} PrithviAds Pixel {% endcomment %}\n<script>\n(function(w,d,s,id){\n  w._pvq=w._pvq||[];\n  w._pvq.push(['init','${pixelId}']);\n  w._pvq.push(['track','PageView']);\n  var f=d.getElementsByTagName(s)[0],j=d.createElement(s);\n  j.async=true;j.src='${baseUrl}/pixel.js';\n  f.parentNode.insertBefore(j,f);\n})(window,document,'script','prithvi');\n</script>`,
    gtm: `<!-- In GTM: New Tag > Custom HTML -->\n<script>\n  window._pvq=window._pvq||[];\n  window._pvq.push(['init','${pixelId}']);
mkdir -p src/app/client/pixel && cat > src/app/client/pixel/page.js << 'ENDOFFILE'
'use client'
import { useState, useEffect } from 'react'
import { getUser } from '@/lib/api'

export default function PixelSetupPage() {
  const [user, setUser] = useState(null)
  const [copied, setCopied] = useState(false)
  const [tab, setTab] = useState('html')

  useEffect(() => { setUser(getUser()) }, [])

  const pixelId = user?.pixelId || 'PV-' + (user?.id || '000000').slice(-6).toUpperCase()
  const baseUrl = 'https://prithviads-zorz.vercel.app'

  const codes = {
    html: `<!-- PrithviAds Pixel -->\n<script>\n(function(w,d,s,id){\n  w._pvq=w._pvq||[];\n  w._pvq.push(['init','${pixelId}']);\n  var f=d.getElementsByTagName(s)[0],j=d.createElement(s);\n  j.async=true;j.src='${baseUrl}/pixel.js';\n  f.parentNode.insertBefore(j,f);\n})(window,document,'script','prithvi');\n</script>\n<!-- End PrithviAds Pixel -->`,
    shopify: `{% comment %} PrithviAds Pixel {% endcomment %}\n<script>\n(function(w,d,s,id){\n  w._pvq=w._pvq||[];\n  w._pvq.push(['init','${pixelId}']);\n  w._pvq.push(['track','PageView']);\n  var f=d.getElementsByTagName(s)[0],j=d.createElement(s);\n  j.async=true;j.src='${baseUrl}/pixel.js';\n  f.parentNode.insertBefore(j,f);\n})(window,document,'script','prithvi');\n</script>`,
    gtm: `<!-- In GTM: New Tag > Custom HTML -->\n<script>\n  window._pvq=window._pvq||[];\n  window._pvq.push(['init','${pixelId}']);\n  window._pvq.push(['track','PageView']);\n</script>`,
  }

  const copy = async (text) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ padding: '32px', maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 4 }}>Pixel Setup</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32 }}>Install your tracking pixel to measure ad performance.</p>

      {/* Pixel ID */}
      <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Your Pixel ID</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <code style={{ flex: 1, background: 'var(--dark-card2)', padding: '12px 16px', borderRadius: 8, fontSize: 20, fontWeight: 900, color: 'var(--brand)', letterSpacing: '0.05em' }}>{pixelId}</code>
          <button onClick={() => copy(pixelId)} style={{ padding: '12px 20px', background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {copied ? '✓ Copied' : 'Copy ID'}
          </button>
        </div>
      </div>

      {/* Install Code */}
      <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Installation Code</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {['html','shopify','gtm'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid', borderColor: tab === t ? 'var(--brand)' : 'var(--dark-border)', background: tab === t ? 'rgba(255,107,43,0.12)' : 'transparent', color: tab === t ? 'var(--brand)' : 'var(--text-muted)', fontWeight: 700, fontSize: 13, cursor: 'pointer', textTransform: 'uppercase' }}>
              {t === 'html' ? 'HTML' : t === 'shopify' ? 'Shopify' : 'GTM'}
            </button>
          ))}
        </div>
        <div style={{ position: 'relative' }}>
          <pre style={{ background: 'var(--dark-card2)', padding: 20, borderRadius: 10, fontSize: 12, color: 'var(--text-secondary)', overflowX: 'auto', margin: 0, lineHeight: 1.6 }}>{codes[tab]}</pre>
          <button onClick={() => copy(codes[tab])} style={{ position: 'absolute', top: 12, right: 12, padding: '6px 14px', background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
            {copied ? '✓' : 'Copy'}
          </button>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>
          Paste inside your site's <code style={{ color: 'var(--brand)' }}>&lt;head&gt;</code> tag, as high as possible.
        </p>
      </div>

      {/* Events */}
      <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 12, padding: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Tracked Events</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--dark-border)' }}>
              {['Event','Status','Hits','Last Seen'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'PageView', status: 'active', hits: 1482, last: '2 min ago' },
              { name: 'AddToCart', status: 'active', hits: 204, last: '14 min ago' },
              { name: 'Purchase', status: 'active', hits: 38, last: '1 hr ago' },
              { name: 'Lead', status: 'inactive', hits: 0, last: 'Never' },
            ].map(ev => (
              <tr key={ev.name} style={{ borderBottom: '1px solid var(--dark-border)' }}>
                <td style={{ padding: '12px 12px' }}><code style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{ev.name}</code></td>
                <td style={{ padding: '12px 12px' }}>
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: ev.status === 'active' ? 'rgba(34,197,94,0.15)' : 'rgba(100,100,100,0.15)', color: ev.status === 'active' ? '#22c55e' : 'var(--text-muted)' }}>{ev.status}</span>
                </td>
                <td style={{ padding: '12px 12px', color: 'var(--text-primary)', fontWeight: 700 }}>{ev.hits.toLocaleString()}</td>
                <td style={{ padding: '12px 12px', color: 'var(--text-muted)', fontSize: 13 }}>{ev.last}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
