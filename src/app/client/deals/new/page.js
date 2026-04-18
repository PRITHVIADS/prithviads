'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useToast } from '@/components/ui'
import DealForm from '@/components/ui/DealForm'

export default function NewDealPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { add, ToastContainer } = useToast()

  async function handleSubmit(form) {
    setLoading(true)
    try {
      await api.createDeal(form)
      setSuccess(true)
      setTimeout(() => router.push('/client/deals'), 2000)
    } catch (err) {
      add(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 32, maxWidth: 720 }}>
      <ToastContainer />
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: 'var(--brand)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Client Portal</div>
        <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 6 }}>Create New Deal</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Fill in your campaign details. The PADS team will review and approve within 24–48 hours.
        </p>
      </div>

      {success ? (
        <div style={{ background: '#052e16', border: '1px solid var(--success)', borderRadius: 18, padding: '48px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--success)', marginBottom: 10 }}>Deal Submitted!</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            The PADS team will review your deal within <strong>24–48 hours</strong>.<br />
            You'll be able to track the status from your dashboard.
          </div>
          <div style={{ marginTop: 20, color: 'var(--text-muted)', fontSize: 13 }}>Redirecting to your deals...</div>
        </div>
      ) : (
        <div className="card">
          <DealForm onSubmit={handleSubmit} loading={loading} submitLabel="Submit Deal for Review →" />
        </div>
      )}
    </div>
  )
}
