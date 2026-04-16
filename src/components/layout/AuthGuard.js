'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api, getUser } from '@/lib/api'
import { Spinner } from '@/components/ui'

export default function AuthGuard({ children, requiredRole }) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    async function check() {
      try {
        const token = localStorage.getItem('prithviads_token')
        if (!token) { router.replace('/login'); return }
        const { user } = await api.me()
        if (requiredRole && user.role !== requiredRole) {
          router.replace(user.role === 'admin' ? '/admin' : '/client')
          return
        }
        setChecking(false)
      } catch {
        router.replace('/login')
      }
    }
    check()
  }, [router, requiredRole])

  if (checking) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dark)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 40, height: 40, background: 'var(--brand)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 20, color: '#fff' }}>P</div>
        <Spinner size={24} />
        <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading PrithviAds...</div>
      </div>
    </div>
  )

  return children
}
