'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Badge, VerticalChip, ProgressBar, Spinner, SectionHeader, EmptyState } from '@/components/ui'
import { useToast } from '@/components/ui'
import Link from 'next/link'

export default function ClientDealsPage() {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [deleting, setDeleting] = useState(null)
  const { add, ToastContainer } = useToast()

  async function load() {
    setLoading(true)
    try {
      const { deals } = await api.getDeals()
      setDeals(deals)
    } catch (err) { add(err.message, 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function deleteDeal(id) {
    if (!confirm('Delete this deal?')) return
    setDeleting(id)
    try {
      await api.deleteDeal(id)
      setDeals(p => p.filter(d => d._id !== id))
      add('Deal deleted', 'success')
    } catch (err) { add(err.message, 'error') }
    finally { setDeleting(null) }
  }

  const filtered = filter === 'all' ? deals : deals.filter(d => d.status === filter)
  const counts = {
    all: deals.length,
    pending: deals.filter(d => d.status === 'pending').length,
    approved: deals.filter(d => d.status === 'approved').length,
    rejected: deals.filter(d => d.status === 'rejected').length,
  }

  return (
    <div style={{ padding: 32, maxWidth: 1000 }}>
      <ToastContainer />
      <SectionHeader title="My Deals" subtitle={`${deals.length} campaign${deals.length !== 1 ? 's' : ''} submitted`}
        action={<Link href="/client/deals/new" className="btn btn-primary" style={{ textDecoration: 'none' }}>+ New Deal</Link>} />

      {/* Filters */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
        {Object.entries(counts).map(([key, count]) => (
          <button key={key} onClick={() => setFilter(key)} className={`btn btn-sm ${filter === key ? 'btn-primary' : 'btn-secondary'}`} style={{ textTransform: 'capitalize' }}>
            {key} ({count})
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 40 }}><Spinner /><span style={{ color: 'var(--text-muted)' }}>Loading...</span></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="🏷️" title="No deals here" description="Submit your first deal to get started"
          action={<Link href="/client/deals/new" className="btn btn-primary" style={{ textDecoration: 'none' }}>+ Create Deal</Link>} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map(deal => (
            <div key={deal._id} className="card" style={{ padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, gap: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 28 }}>{{ Travel: '✈️', Education: '🎓', 'E-commerce': '🛒', Automobile: '🚗' }[deal.vertical]}</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 17 }}>{deal.brand}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{deal.targetUrl} · Submitted {deal.submittedAt?.slice(0, 10)}</div>
                    </div>
                  </div>
                  {deal.description && <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>{deal.description}</div>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <div style={{ background: 'var(--dark)', border: '1px solid var(--dark-border)', borderRadius: 8, padding: '5px 12px', fontSize: 14, fontWeight: 800, color: 'var(--brand)', letterSpacing: '0.12em' }}>{deal.couponCode}</div>
                  <VerticalChip vertical={deal.vertical} />
                  <Badge status={deal.status} />
                </div>
              </div>

              {deal.status === 'rejected' && deal.rejectionReason && (
                <div style={{ background: '#450a0a', border: '1px solid var(--error)', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#fca5a5' }}>
                  ❌ Rejection reason: {deal.rejectionReason}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                <ProgressBar value={deal.currentClicks} max={deal.targetClicks} color="var(--info)" label={`Clicks: ${deal.currentClicks?.toLocaleString()} / ${deal.targetClicks?.toLocaleString()}`} />
                <ProgressBar value={deal.currentRedemptions} max={deal.maxRedemptions} color="var(--success)" label={`Redemptions: ${deal.currentRedemptions?.toLocaleString()} / ${deal.maxRedemptions?.toLocaleString()}`} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid var(--dark-border)' }}>
                <div style={{ display: 'flex', gap: 20 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    💸 {deal.discountType === 'percent' ? `${deal.discountValue}%` : deal.discountType === 'flat' ? `₹${deal.discountValue}` : 'Free Shipping'} off
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>📅 {deal.validFrom?.slice(0, 10)} → {deal.validTo?.slice(0, 10)}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>🎯 On {deal.applyOn}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{deal.isAutoApply ? '⚡ Auto-apply' : '👆 Manual'}</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {deal.status === 'pending' && (
                    <button onClick={() => deleteDeal(deal._id)} disabled={deleting === deal._id}
                      className="btn btn-secondary btn-sm" style={{ color: 'var(--error)', borderColor: 'var(--error)' }}>
                      {deleting === deal._id ? '...' : 'Delete'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
