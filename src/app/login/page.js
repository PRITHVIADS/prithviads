'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api, saveToken, saveUser } from '@/lib/api'

const VERTICALS = ['Travel', 'Education', 'E-commerce', 'Automobile']

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '', companyName: '', phone: '', website: '', vertical: '' })
  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      let data
      if (mode === 'login') {
        data = await api.login({ email: form.email, password: form.password })
      } else {
        data = await api.register(form)
      }
      saveToken(data.token)
      saveUser(data.user)
      router.push(data.user.role === 'admin' ? '/admin' : '/client')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const S = {
    page: { minHeight: '100vh', display: 'flex', background: '#0A0A0A', fontFamily: 'DM Sans, sans-serif', overflow: 'hidden', position: 'relative' },
    grid: { position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(255,107,43,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,43,0.04) 1px, transparent 1px)', backgroundSize: '48px 48px', zIndex: 0 },
    orb1: { position: 'fixed', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,43,0.12), transparent 70%)', filter: 'blur(100px)', top: -200, left: -100, zIndex: 0 },
    orb2: { position: 'fixed', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,43,0.07), transparent 70%)', filter: 'blur(100px)', bottom: -100, right: '20%', zIndex: 0 },
    left: { position: 'relative', zIndex: 1, width: '52%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 52, borderRight: '1px solid #1A1A1A', overflow: 'hidden' },
    right: { position: 'relative', zIndex: 1, width: '48%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '52px 48px', background: '#111111' },
    logo: { width: 46, height: 46, background: '#FF6B2B', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, color: '#fff', boxShadow: '0 0 30px rgba(255,107,43,0.4)' },
    h1: { fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 56, lineHeight: 1.0, color: '#F0F0F0', letterSpacing: -2.5, marginBottom: 22 },
    pill: { display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,107,43,0.08)', border: '1px solid rgba(255,107,43,0.25)', borderRadius: 100, padding: '6px 14px', fontSize: 11, color: '#FF6B2B', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 28 },
    statCard: { flex: 1, padding: '18px 20px', border: '1px solid #1E1E1E', borderRadius: 12, marginRight: 10, background: '#161616', borderTop: '2px solid rgba(255,107,43,0.4)' },
    input: { width: '100%', background: '#161616', border: '1px solid #222', borderRadius: 10, padding: '13px 16px', fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#F0F0F0', outline: 'none' },
    btn: { width: '100%', padding: 14, background: '#FF6B2B', color: '#fff', border: 'none', borderRadius: 10, fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 6, boxShadow: '0 4px 24px rgba(255,107,43,0.3)' },
    tab: (on) => ({ flex: 1, padding: 9, border: 'none', borderRadius: 7, fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 500, cursor: 'pointer', background: on ? '#FF6B2B' : 'transparent', color: on ? '#fff' : '#999', boxShadow: on ? '0 2px 12px rgba(255,107,43,0.35)' : 'none' }),
    label: { display: 'block', fontSize: 10, fontWeight: 700, color: '#999', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 },
    demo: { marginTop: 20, background: 'rgba(255,107,43,0.06)', border: '1px solid rgba(255,107,43,0.18)', borderRadius: 10, padding: '14px 16px' },
  }

  return (
    <div style={S.page}>
      <style>{'@import url(https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap);'}</style>
      <div style={S.grid} />
      <div style={S.orb1} />
      <div style={S.orb2} />

      {/* LEFT PANEL */}
      <div style={S.left}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative', zIndex: 2 }}>
          <div style={S.logo}>P</div>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: -0.5 }}>PADS</div>
            <div style={{ fontSize: 10, color: '#FF6B2B', letterSpacing: '0.15em', textTransform: 'uppercase' }}>by PrithviAds</div>
          </div>
        </div>

        {/* Hero */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={S.pill}>
            <span style={{ width: 6, height: 6, background: '#FF6B2B', borderRadius: '50%', boxShadow: '0 0 8px #FF6B2B', display: 'inline-block' }} />
            Smart Coupon Platform
          </div>
          <div style={S.h1}>
            Ads that<br />actually<br /><span style={{ color: '#FF6B2B' }}>convert.</span>
          </div>
          <p style={{ fontSize: 15, color: '#999', lineHeight: 1.75, maxWidth: 400, fontWeight: 300 }}>
            Deploy coupon campaigns across India's top e-commerce platforms. Track every rupee. Measure every result.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', position: 'relative', zIndex: 2 }}>
          {[['12K+', 'Coupons'], ['98%', 'Uptime'], ['3x', 'Avg ROI']].map(([v, l]) => (
            <div key={l} style={S.statCard}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: -1 }}>
                {v.replace(/[K+%x]/g, '')}<span style={{ color: '#FF6B2B', fontSize: 18 }}>{v.match(/[K+%x]+/)?.[0]}</span>
              </div>
              <div style={{ fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={S.right}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <div style={{ fontSize: 10, color: '#FF6B2B', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>Admin & Client Portal</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: -1, marginBottom: 4 }}>Welcome<br />back.</div>
          <div style={{ fontSize: 13, color: '#999', marginBottom: 28, fontWeight: 300 }}>Sign in to your PADS account</div>

          <div style={{ display: 'flex', gap: 4, background: '#161616', border: '1px solid #222', borderRadius: 10, padding: 4, marginBottom: 22 }}>
            <button style={S.tab(mode==='login')} onClick={() => setMode('login')}>Sign In</button>
            <button style={S.tab(mode==='register')} onClick={() => setMode('register')}>Register</button>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <>
                <div style={{ marginBottom: 14 }}>
                  <label style={S.label}>Full Name</label>
                  <input style={S.input} placeholder="Your name" value={form.name} onChange={f('name')} required />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={S.label}>Company Name</label>
                  <input style={S.input} placeholder="Your company" value={form.companyName} onChange={f('companyName')} />
                </div>
              </>
            )}
            <div style={{ marginBottom: 14 }}>
              <label style={S.label}>Email Address</label>
              <input style={S.input} type="email" placeholder="you@company.com" value={form.email} onChange={f('email')} required />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={S.label}>Password</label>
              <input style={S.input} type="password" placeholder="••••••••" value={form.password} onChange={f('password')} required />
            </div>
            {mode === 'login' && (
              <div style={{ textAlign: 'right', marginTop: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: '#FF6B2B', cursor: 'pointer', fontWeight: 500 }}
                  onClick={() => alert('Contact support@prithviads.com to reset your password')}>
                  Forgot password?
                </span>
              </div>
            )}

            {error && <div style={{ color: '#FF6B2B', fontSize: 13, marginBottom: 12, padding: '10px 14px', background: 'rgba(255,107,43,0.08)', borderRadius: 8 }}>{error}</div>}

            <button style={S.btn} type="submit" disabled={loading}>
              {loading ? 'Signing in...' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
            </button>
          </form>

          <div style={S.demo}>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#FF6B2B', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 10 }}>Demo Credentials</div>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4, fontFamily: 'monospace' }}><span style={{ color: '#FF6B2B' }}>Admin:</span> admin@prithviads.com / admin123</div>
            <div style={{ fontSize: 12, color: '#888', fontFamily: 'monospace' }}><span style={{ color: '#FF6B2B' }}>Client:</span> client@makemytrip.com / client123</div>
          </div>

          <div style={{ marginTop: 24, fontSize: 11, color: '#444', textAlign: 'center', borderTop: '1px solid #1E1E1E', paddingTop: 18 }}>
            © 2026 PADS · by PrithviAds
          </div>
        </div>
      </div>
    </div>
  )
}
