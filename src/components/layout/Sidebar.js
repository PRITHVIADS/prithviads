'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { logout, getUser } from '@/lib/api'
import { useState, useEffect } from 'react'

const adminNav = [
  { href: '/admin', icon: '\u25A6', label: 'Dashboard' },
  { href: '/admin/deals', icon: '\uD83C\uDFF7\uFE0F', label: 'Deal Approvals' },
  { href: '/admin/clients', icon: '\uD83C\uDFE2', label: 'Clients' },
  { href: '/admin/analytics', icon: '\uD83D\uDCCA', label: 'Analytics' },
  { href: '/admin/extension', icon: '\uD83D\uDD0C', label: 'Extension Preview' },
  { href: '/admin/pixel', icon: '\uD83D\uDFAF', label: 'Pixel' },
]

const clientNav = [
  { href: '/client', icon: '\u25A6', label: 'Dashboard' },
  { href: '/client/deals', icon: '\uD83C\uDFF7\uFE0F', label: 'My Deals' },
  { href: '/client/deals/new', icon: '+', label: 'New Deal' },
  { href: '/client/analytics', icon: '\uD83D\uDCCA', label: 'Analytics' },
  { href: '/client/pixel', icon: '\uD83C\uDFAF', label: 'Pixel Setup' },
]

export default function Sidebar({ role }) {
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  const nav = role === 'admin' ? adminNav : clientNav
  useEffect(() => { setUser(getUser()) }, [])
  return (
    <div className="sidebar">
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--dark-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, background: 'var(--brand)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: '#fff', flexShrink: 0 }}>P</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 14, color: 'var(--text-primary)' }}>PADS</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{role === 'admin' ? 'Admin Panel' : 'Client Portal'}</div>
          </div>
        </div>
      </div>
      <nav style={{ padding: '12px 12px', flex: 1 }}>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '8px 8px 4px' }}>Navigation</div>
        {nav.map(item => {
          const active = pathname === item.href || (item.href !== `/${role}` && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 9, marginBottom: 2, background: active ? 'rgba(255,107,43,0.12)' : 'transparent', border: `1px solid ${active ? 'rgba(255,107,43,0.3)' : 'transparent'}`, color: active ? 'var(--brand)' : 'var(--text-secondary)', fontWeight: active ? 700 : 500, fontSize: 14, transition: 'all 0.15s', textDecoration: 'none' }}>
              <span style={{ fontSize: item.icon === '+' ? 18 : 14, fontWeight: item.icon === '+' ? 900 : 'normal', width: 18, textAlign: 'center' }}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div style={{ padding: 16, borderTop: '1px solid var(--dark-border)' }}>
        {user && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--dark-card2)', borderRadius: 10 }}>
              <div style={{ width: 32, height: 32, background: 'var(--brand)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#fff', flexShrink: 0 }}>
                {(user.name || 'U')[0].toUpperCase()}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
              </div>
            </div>
          </div>
        )}
        <button onClick={logout} className="btn btn-secondary btn-full" style={{ fontSize: 13 }}>Sign Out</button>
      </div>
    </div>
  )
}
