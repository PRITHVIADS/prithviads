'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Spinner } from '@/components/ui'

export default function AdminExtensionPage() {
  const [url, setUrl] = useState('myntra.com')
  const [customUrl, setCustomUrl] = useState('')
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeDeal, setActiveDeal] = useState(null)
  const [page, setPage] = useState('product')
  const [applied, setApplied] = useState(false)

  const presets = ['myntra.com', 'makemytrip.com', 'unacademy.com', 'cleartrip.com', 'cars24.com']

  async function fetchDeals(targetUrl) {
    setLoading(true)
    setApplied(false)
    try {
      const res = await api.getDealsForUrl(targetUrl)
      setDeals(res.deals || [])
      setActiveDeal(res.deals?.[0] || null)
    } catch { setDeals([]); setActiveDeal(null) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchDeals(url) }, [url])

  function handleCustomUrl(e) {
    e.preventDefault()
    if (customUrl) { setUrl(customUrl); setCustomUrl('') }
  }

  return (
    <div style={{ padding: 32, maxWidth: 1100 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>🔌 Browser Extension Preview</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Simulate what users see when browsing websites with active deals</p>
      </div>

      {/* URL selector */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Simulate browsing to:</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          {presets.map(site => (
            <button key={site} onClick={() => setUrl(site)} className={`btn btn-sm ${url === site ? 'btn-primary' : 'btn-secondary'}`}>{site}</button>
          ))}
        </div>
        <form onSubmit={handleCustomUrl} style={{ display: 'flex', gap: 10 }}>
          <input className="input" value={customUrl} onChange={e => setCustomUrl(e.target.value)} placeholder="Enter any domain, e.g. amazon.in" style={{ maxWidth: 320 }} />
          <button type="submit" className="btn btn-secondary btn-sm">Go →</button>
        </form>
      </div>

      {/* Browser simulation */}
      <div style={{ background: '#1a1a2e', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--dark-border)' }}>
        {/* Browser chrome */}
        <div style={{ background: '#0d0d1a', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--dark-border)' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {['#ff5f57', '#febc2e', '#28c840'].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
          </div>
          <div style={{ flex: 1, background: '#111', border: '1px solid var(--dark-border)', borderRadius: 8, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--success)', fontSize: 12 }}>🔒</span>
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>https://www.{url}</span>
            {activeDeal && <span style={{ marginLeft: 'auto', color: 'var(--brand)', fontSize: 11, fontWeight: 700, background: 'rgba(255,107,43,0.1)', padding: '2px 8px', borderRadius: 20 }}>● PrithviAds Active</span>}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['product', 'cart', 'checkout'].map(p => (
              <button key={p} onClick={() => { setPage(p); setApplied(false) }} style={{
                background: page === p ? 'rgba(255,107,43,0.2)' : 'transparent',
                border: `1px solid ${page === p ? 'var(--brand)' : 'var(--dark-border)'}`,
                color: page === p ? 'var(--brand)' : 'var(--text-muted)',
                padding: '4px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 600,
              }}>/{p}</button>
            ))}
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: 28, position: 'relative', minHeight: 400 }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 40 }}><Spinner /><span style={{ color: 'var(--text-muted)' }}>Loading page...</span></div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 28 }}>
              <div style={{ background: 'var(--dark-muted)', borderRadius: 12, aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52 }}>
                {{ 'myntra.com': '👗', 'makemytrip.com': '✈️', 'unacademy.com': '📚', 'cleartrip.com': '🏨', 'cars24.com': '🚗' }[url] || '📦'}
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{url}</div>
                <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>
                  {{ 'myntra.com': 'Libas Women Ethnic Kurta Set', 'makemytrip.com': 'Delhi → Mumbai · Non-stop', 'unacademy.com': 'UPSC CSE Foundation Batch 2025', 'cleartrip.com': 'Taj Hotel Mumbai · Deluxe Room', 'cars24.com': '2021 Hyundai Creta SX · 28,000 km' }[url] || 'Sample Product'}
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ fontSize: 28, fontWeight: 900 }}>₹{activeDeal ? (activeDeal.discountType === 'percent' ? Math.round(2999 * (1 - activeDeal.discountValue / 100)) : 2999 - activeDeal.discountValue).toLocaleString() : '2,999'}</div>
                  <div style={{ fontSize: 16, color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹2,999</div>
                  {activeDeal && <div style={{ background: '#052e16', color: 'var(--success)', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                    {activeDeal.discountType === 'percent' ? `${activeDeal.discountValue}% OFF` : `₹${activeDeal.discountValue} OFF`}
                  </div>}
                </div>

                {page === 'checkout' && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>Apply Coupon Code</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input readOnly value={applied && activeDeal ? activeDeal.couponCode : ''} placeholder="Enter coupon code" className="input" style={{
                        maxWidth: 240, fontWeight: applied ? 800 : 400, letterSpacing: applied ? '0.12em' : 0,
                        borderColor: applied ? 'var(--success)' : undefined, color: applied ? 'var(--success)' : undefined,
                        background: applied ? '#052e16' : undefined,
                      }} />
                      <button className="btn btn-secondary">Apply</button>
                    </div>
                    {applied && <div style={{ marginTop: 8, color: 'var(--success)', fontSize: 13, fontWeight: 600 }}>✅ Coupon applied! You saved {activeDeal.discountType === 'percent' ? `${activeDeal.discountValue}%` : `₹${activeDeal.discountValue}`}</div>}
                  </div>
                )}

                <button className="btn btn-primary">{page === 'checkout' ? 'Place Order →' : 'Add to Cart'}</button>
              </div>
            </div>
          )}

          {/* Extension popup */}
          {activeDeal && !loading && (
            <div style={{
              position: 'absolute', bottom: 20, right: 20, width: 300,
              background: 'var(--dark-card)', border: '2px solid var(--brand)',
              borderRadius: 16, overflow: 'hidden',
              boxShadow: '0 0 40px rgba(255,107,43,0.25), 0 16px 48px rgba(0,0,0,0.6)',
              animation: 'slideUp 0.3s ease',
            }}>
              <div style={{ background: 'var(--brand)', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>🏷️</span>
                  <span style={{ fontWeight: 800, fontSize: 13, color: '#fff' }}>PrithviAds Deal!</span>
                </div>
                <div style={{ fontSize: 11, background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: 20, color: '#fff', fontWeight: 700 }}>LIVE</div>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{activeDeal.brand}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{activeDeal.description || `${activeDeal.discountType === 'percent' ? `${activeDeal.discountValue}%` : `₹${activeDeal.discountValue}`} off on your order`}</div>
                </div>
                <div style={{ background: 'var(--dark)', border: '1px dashed var(--brand)', borderRadius: 10, padding: '10px 14px', textAlign: 'center', marginBottom: 12 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Coupon Code</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--brand)', letterSpacing: '0.15em' }}>{activeDeal.couponCode}</div>
                  <div style={{ fontSize: 12, color: 'var(--success)', marginTop: 4, fontWeight: 600 }}>
                    Save {activeDeal.discountType === 'percent' ? `${activeDeal.discountValue}%` : `₹${activeDeal.discountValue}`}!
                  </div>
                </div>
                {page === 'checkout' ? (
                  <button onClick={() => setApplied(true)} className="btn btn-primary btn-full" style={{ fontSize: 13 }}>
                    {applied ? '✅ Applied!' : '⚡ Auto-Apply Coupon'}
                  </button>
                ) : (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '6px 0' }}>
                    💡 Go to checkout to auto-apply
                  </div>
                )}
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>Valid till {activeDeal.validTo?.slice(0, 10)} · Powered by PrithviAds</div>
              </div>
            </div>
          )}

          {!activeDeal && !loading && (
            <div style={{ position: 'absolute', bottom: 20, right: 20, background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 12, padding: '10px 16px', fontSize: 13, color: 'var(--text-muted)' }}>
              🏷️ No active deals for this site
            </div>
          )}
        </div>
      </div>

      {/* Available deals for this URL */}
      {deals.length > 1 && (
        <div className="card" style={{ marginTop: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Other available deals for {url}</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {deals.map(d => (
              <button key={d._id} onClick={() => setActiveDeal(d)} style={{
                background: activeDeal?._id === d._id ? 'rgba(255,107,43,0.1)' : 'var(--dark)',
                border: `1px solid ${activeDeal?._id === d._id ? 'var(--brand)' : 'var(--dark-border)'}`,
                color: activeDeal?._id === d._id ? 'var(--brand)' : 'var(--text-secondary)',
                padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700,
              }}>{d.couponCode} — {d.discountType === 'percent' ? `${d.discountValue}%` : `₹${d.discountValue}`} off</button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
