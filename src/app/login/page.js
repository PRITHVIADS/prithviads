'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api, saveToken, saveUser } from '@/lib/api'
import { Spinner } from '@/components/ui'

const VERTICALS = ['Travel', 'Education', 'E-commerce', 'Automobile']

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState('login') // login | register
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

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--dark)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, position: 'relative', overflow: 'hidden',
    }}>
      {/* Background effects */}
      <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(255,107,43,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 460, animation: 'fadeIn 0.4s ease' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 56, height: 56, background: 'var(--brand)', borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 26, color: '#fff', margin: '0 auto 16px',
            boxShadow: '0 0 40px rgba(255,107,43,0.3)',
          }}>P</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 6 }}>PADS</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Smart Coupon Platform for Advertisers</p>
        </div>

        {/* Card */}
        <div className="card" style={{ borderRadius: 18 }}>
          {/* Mode toggle */}
          <div style={{ display: 'flex', background: 'var(--dark)', borderRadius: 10, padding: 4, marginBottom: 24 }}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError('') }} style={{
                flex: 1, padding: '9px 0', borderRadius: 7, border: 'none',
                background: mode === m ? 'var(--brand)' : 'transparent',
                color: mode === m ? '#fff' : 'var(--text-muted)',
                fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
                textTransform: 'capitalize',
              }}>{m === 'login' ? 'Sign In' : 'Register'}</button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ marginBottom: 14 }}>
                    <label style={labelStyle}>Full Name *</label>
                    <input className="input" value={form.name} onChange={f('name')} placeholder="Your name" required />
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={labelStyle}>Company Name *</label>
                    <input className="input" value={form.companyName} onChange={f('companyName')} placeholder="Brand / Agency name" required />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ marginBottom: 14 }}>
                    <label style={labelStyle}>Phone</label>
                    <input className="input" value={form.phone} onChange={f('phone')} placeholder="+91 98765 43210" />
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={labelStyle}>Vertical</label>
                    <select className="input" value={form.vertical} onChange={f('vertical')}>
                      <option value="">Select vertical</option>
                      {VERTICALS.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Website</label>
                  <input className="input" value={form.website} onChange={f('website')} placeholder="yourwebsite.com" />
                </div>
              </>
            )}

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Email Address *</label>
              <input className="input" type="email" value={form.email} onChange={f('email')} placeholder="you@company.com" required />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Password *</label>
              <input className="input" type="password" value={form.password} onChange={f('password')} placeholder={mode === 'register' ? 'Min. 6 characters' : 'Your password'} required minLength={mode === 'register' ? 6 : 1} />
            </div>

            {error && (
              <div style={{ background: '#450a0a', border: '1px solid var(--error)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#fca5a5', fontSize: 13 }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? <Spinner size={18} color="#fff" /> : mode === 'login' ? 'Sign In →' : 'Create Account →'}
            </button>
          </form>

          {mode === 'login' && (
            <div style={{ marginTop: 20, padding: 14, background: 'var(--dark)', borderRadius: 10, border: '1px solid var(--dark-border)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Demo Credentials</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--brand)', fontWeight: 700 }}>Admin:</span> admin@pads.com / admin123
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--info)', fontWeight: 700 }}>Client:</span> client@makemytrip.com / client123
                </div>
              </div>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, marginTop: 20 }}>
          © 2024 PADS · by PrithviAds
        </p>
      </div>
    </div>
  )
}

const labelStyle = {
  display: 'block', color: 'var(--text-secondary)', fontSize: 12,
  fontWeight: 700, marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase',
}
