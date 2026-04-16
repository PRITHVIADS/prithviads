'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Badge, VerticalChip, ProgressBar, Spinner, SectionHeader, Modal, EmptyState } from '@/components/ui'
import { useToast } from '@/components/ui'

export default function AdminDealsPage() {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const { add, ToastContainer } = useToast()

  async function load() {
    setLoading(true)
    try {
      const { deals } = await api.getDeals(filter !== 'all' ? { status: filter } : {})
      setDeals(deals)
    } catch (err) { add(err.message, 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [filter])

  async function updateStatus(id, status) {
    setActionLoading(true)
    try {
      await api.updateDeal(id, { status, rejectionReason: rejectReason || undefined })
      add(`Deal ${status} successfully`, 'success')
      setSelectedDeal(null)
      setRejectReason('')
      load()
    } catch (err) { add(err.message, 'error') }
    finally { setActionLoading(false) }
  }

  const counts = {
    all: deals.length,
    pending: deals.filter(d => d.status === 'pending').length,
    approved: deals.filter(d => d.status === 'approved').length,
    rejected: deals.filter(d => d.status === 'rejected').length,
    paused: deals.filter(d => d.status === 'paused').length,
  }

  const filtered = filter === 'all' ? deals : deals.filter(d => d.status === filter)

  return (
    <div style={{ padding: 32, maxWidth: 1100 }}>
      <ToastContainer />
      <SectionHeader title="Deal Approvals" subtitle={`${counts.pending} deal${counts.pending !== 1 ? 's' : ''} awaiting review`} />

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        {Object.entries(counts).map(([key, count]) => (
          <button key={key} onClick={() => setFilter(key)} className={`btn btn-sm ${filter === key ? 'btn-primary' : 'btn-secondary'}`} style={{ textTransform: 'capitalize' }}>
            {key} ({count})
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 40 }}>
          <Spinner /> <span style={{ color: 'var(--text-muted)' }}>Loading deals...</span>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="📭" title="No deals found" description={`No ${filter === 'all' ? '' : filter + ' '}deals at the moment`} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map(deal => (
            <DealCard key={deal._id} deal={deal} onSelect={() => setSelectedDeal(deal)} onQuickApprove={() => updateStatus(deal._id, 'approved')} onQuickPause={() => updateStatus(deal._id, 'paused')} />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <Modal isOpen={!!selectedDeal} onClose={() => { setSelectedDeal(null); setRejectReason('') }}
        title={`Deal: ${selectedDeal?.brand} — ${selectedDeal?.couponCode}`} width={600}>
        {selectedDeal && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              {[
                ['Client', selectedDeal.clientName],
                ['Vertical', selectedDeal.vertical],
                ['Target URL', selectedDeal.targetUrl],
                ['Apply On', selectedDeal.applyOn],
                ['Discount', selectedDeal.discountType === 'percent' ? `${selectedDeal.discountValue}%` : `₹${selectedDeal.discountValue}`],
                ['Min. Order', selectedDeal.minimumOrderValue > 0 ? `₹${selectedDeal.minimumOrderValue}` : 'None'],
                ['Valid From', selectedDeal.validFrom?.slice(0, 10)],
                ['Valid To', selectedDeal.validTo?.slice(0, 10)],
                ['Max Redeem', selectedDeal.maxRedemptions?.toLocaleString()],
                ['Target Clicks', selectedDeal.targetClicks?.toLocaleString()],
                ['Auto-Apply', selectedDeal.isAutoApply ? 'Yes' : 'No'],
                ['Submitted', selectedDeal.submittedAt?.slice(0, 10)],
              ].map(([label, val]) => (
                <div key={label} style={{ background: 'var(--dark)', borderRadius: 8, padding: '10px 14px' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{val}</div>
                </div>
              ))}
            </div>
            {selectedDeal.description && (
              <div style={{ background: 'var(--dark)', borderRadius: 8, padding: 14, marginBottom: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Description</strong><br />
                {selectedDeal.description}
              </div>
            )}
            {selectedDeal.termsAndConditions && (
              <div style={{ background: 'var(--dark)', borderRadius: 8, padding: 14, marginBottom: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Terms & Conditions</strong><br />
                {selectedDeal.termsAndConditions}
              </div>
            )}
            {selectedDeal.status === 'rejected' && selectedDeal.rejectionReason && (
              <div style={{ background: '#450a0a', border: '1px solid var(--error)', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 13, color: '#fca5a5' }}>
                ❌ Rejection reason: {selectedDeal.rejectionReason}
              </div>
            )}

            {selectedDeal.status === 'pending' && (
              <div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Rejection Reason (if rejecting)
                  </label>
                  <textarea className="input" rows={2} value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                    placeholder="Explain why this deal is being rejected..." style={{ resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => updateStatus(selectedDeal._id, 'approved')} className="btn btn-success" style={{ flex: 1 }} disabled={actionLoading}>
                    {actionLoading ? <Spinner size={16} color="#fff" /> : '✅ Approve Deal'}
                  </button>
                  <button onClick={() => updateStatus(selectedDeal._id, 'rejected')} className="btn btn-danger" style={{ flex: 1 }} disabled={actionLoading}>
                    ❌ Reject Deal
                  </button>
                </div>
              </div>
            )}
            {selectedDeal.status === 'approved' && (
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => updateStatus(selectedDeal._id, 'paused')} className="btn btn-secondary" disabled={actionLoading}>⏸ Pause Deal</button>
                <button onClick={() => updateStatus(selectedDeal._id, 'rejected')} className="btn btn-danger" disabled={actionLoading}>❌ Reject Deal</button>
              </div>
            )}
            {selectedDeal.status === 'paused' && (
              <button onClick={() => updateStatus(selectedDeal._id, 'approved')} className="btn btn-success" disabled={actionLoading}>▶ Resume Deal</button>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

function DealCard({ deal, onSelect, onQuickApprove, onQuickPause }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontSize: 32, flexShrink: 0 }}>
            {{ Travel: '✈️', Education: '🎓', 'E-commerce': '🛒', Automobile: '🚗' }[deal.vertical] || '🏷️'}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 3 }}>{deal.brand}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {deal.targetUrl} · {deal.clientName} · Submitted {deal.submittedAt?.slice(0, 10)}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ background: 'var(--dark)', border: '1px solid var(--dark-border)', borderRadius: 8, padding: '5px 12px', fontSize: 13, fontWeight: 800, color: 'var(--brand)', letterSpacing: '0.1em' }}>
            {deal.couponCode}
          </div>
          <VerticalChip vertical={deal.vertical} />
          <Badge status={deal.status} />
        </div>
      </div>

      {deal.description && <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14 }}>{deal.description}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
        <ProgressBar value={deal.currentClicks} max={deal.targetClicks} color="var(--info)" label={`Clicks: ${deal.currentClicks?.toLocaleString()} / ${deal.targetClicks?.toLocaleString()}`} />
        <ProgressBar value={deal.currentRedemptions} max={deal.maxRedemptions} color="var(--success)" label={`Redemptions: ${deal.currentRedemptions?.toLocaleString()} / ${deal.maxRedemptions?.toLocaleString()}`} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid var(--dark-border)' }}>
        <div style={{ display: 'flex', gap: 20 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>💸 {deal.discountType === 'percent' ? `${deal.discountValue}%` : deal.discountType === 'flat' ? `₹${deal.discountValue}` : 'Free Shipping'} off</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>📅 {deal.validFrom?.slice(0, 10)} → {deal.validTo?.slice(0, 10)}</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>🎯 On {deal.applyOn}</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {deal.status === 'pending' && <button onClick={onQuickApprove} className="btn btn-success btn-sm">✅ Approve</button>}
          {deal.status === 'approved' && <button onClick={onQuickPause} className="btn btn-secondary btn-sm">⏸ Pause</button>}
          <button onClick={onSelect} className="btn btn-secondary btn-sm">View Details</button>
        </div>
      </div>
    </div>
  )
}
