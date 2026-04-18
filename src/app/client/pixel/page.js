'use client'
import { useState, useEffect } from 'react'
import { getUser } from '@/lib/api'

export default function PixelSetupPage() {
  const [pixelId, setPixelId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState('')
  const [tab, setTab] = useState('html')
  const baseUrl = 'https://pads-zorz.vercel.app'

  useEffect(() => {
    const user = getUser()
    const userId = user && user.id
    if (!userId) { setLoading(false); return }
    fetch('/api/pixel?userId=' + userId)
      .then(function(r) { return r.json() })
      .then(function(d) { setPixelId(d.pixelId); setLoading(false) })
      .catch(function() { setLoading(false) })
  }, [])

  const copy = async (text, key) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  const id = pixelId || '...'
  const htmlCode = '<script>(function(w,d){w._pvq=w._pvq||[];w._pvq.push(["init","' + id + '"]);var j=d.createElement("script");j.async=true;j.src="' + baseUrl + '/pixel.js";d.head.appendChild(j);})(window,document);</script>'
  const shopifyCode = '{% comment %} PADS {% endcomment %}<script>window._pvq=window._pvq||[];window._pvq.push(["init","' + id + '"]);</script><script src="' + baseUrl + '/pixel.js" async></script>'
  const gtmCode = '<script>window._pvq=window._pvq||[];window._pvq.push(["init","' + id + '"]);window._pvq.push(["track","PageView"]);</script>'
  const codes = { html: htmlCode, shopify: shopifyCode, gtm: gtmCode }

  return (
    <div style={{ padding: 32, maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 4 }}>Pixel Setup</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32 }}>Install your tracking pixel to measure ad performance.</p>

      <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Your Pixel ID</div>
        {loading ? (
          <div style={{ color: 'var(--text-muted)', fontSize: 14, padding: '12px 0' }}>Fetching your Pixel ID...</div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <code style={{ flex: 1, background: 'var(--dark-card2)', padding: '12px 16px', borderRadius: 8, fontSize: 22, fontWeight: 900, color: 'var(--brand)', letterSpacing: '0.05em' }}>{pixelId}</code>
            <button onClick={() => copy(pixelId, 'id')} style={{ padding: '12px 20px', background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {copied === 'id' ? 'Copied!' : 'Copy ID'}
            </button>
          </div>
        )}
      </div>

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
          <pre style={{ background: 'var(--dark-card2)', padding: 20, borderRadius: 10, fontSize: 12, color: 'var(--text-secondary)', overflowX: 'auto', margin: 0, lineHeight: 1.7 }}>{codes[tab]}</pre>
          <button onClick={() => copy(codes[tab], 'code')} style={{ position: 'absolute', top: 12, right: 12, padding: '6px 14px', background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
            {copied === 'code' ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>Paste inside your site head tag, as high as possible.</p>
      </div>

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
              { name: 'PageView', status: 'inactive', hits: 0, last: 'Waiting for install' },
              { name: 'AddToCart', status: 'inactive', hits: 0, last: 'Never' },
              { name: 'Purchase', status: 'inactive', hits: 0, last: 'Never' },
              { name: 'Lead', status: 'inactive', hits: 0, last: 'Never' },
            ].map(ev => (
              <tr key={ev.name} style={{ borderBottom: '1px solid var(--dark-border)' }}>
                <td style={{ padding: '12px 12px' }}><code style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{ev.name}</code></td>
                <td style={{ padding: '12px 12px' }}><span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: 'rgba(100,100,100,0.15)', color: 'var(--text-muted)' }}>{ev.status}</span></td>
                <td style={{ padding: '12px 12px', color: 'var(--text-primary)', fontWeight: 700 }}>{ev.hits}</td>
                <td style={{ padding: '12px 12px', color: 'var(--text-muted)', fontSize: 13 }}>{ev.last}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
