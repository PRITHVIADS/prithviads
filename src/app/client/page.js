'use client'
import { useEffect, useState } from 'react'
import { api, getUser } from '@/lib/api'
import { StatCard, Badge, ProgressBar, VerticalChip, Spinner, SectionHeader, EmptyState } from '@/components/ui'
import { useToast } from '@/components/ui'
import Link from 'next/link'

export default function ClientDashboard() {
  const [data, setData] = useState(null)
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const user = getUser()
  const { add, ToastContainer } = useToast()

  useEffect(() => {
    async function load() {
      try {
        const [analyticsRes, dealsRes] = await Promise.all([
          api.getAnalytics(),
          api.getDeals(),
        ])
        setData(analyticsRes)
        setDeals(dealsRes.deals.slice(0, 4))
      } catch (err) { add(err.message, 'error') }
      finally { setLoading(false) }
    }
    load()
  }, [])

  if (loading) return <div style={{ padding: 40, display: 'flex', gap: 12, alignItems: 'center' }}><Spinner /><span style={{ color: 'var(--text-muted)' }}>Loading...</span></div>

  const { stats } = data || {}

  return (
    <div style={{ padding: 32, maxWidth: 1100 }}>
      <ToastContainer />

      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(255,107,43,0.15) 0%, rgba(255,107,43,0.03) 100%)',
        border: '1px solid rgba(255,107,43,0.2)', borderRadius: 16, padding: '24px 28px', marginBottom: 28,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--brand)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Welcome back</div>
          <div style={{ fontSize: 22, fontWeight: 900 }}>{user?.companyName || user?.name}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>Manage your campaigns and track performance</div>
        </div>
        <Link href="/client/deals/new" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
          + Create New Deal
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <StatCard label="My Deals" value={stats?.totalDeals ?? 0} icon="🏷️" accent="var(--brand)" />
        <StatCard label="Approved" value={stats?.approvedDeals ?? 0} icon="✅" accent="var(--success)" />
        <StatCard label="Total Clicks" value={(stats?.totalClicks ?? 0).toLocaleString()} icon="👆" accent="var(--info)" />
        <StatCard label="Redemptions" value={(stats?.totalRedemptions ?? 0).toLocaleString()} icon="🎟️" accent="var(--warning)" />
      </div>

      {/* Recent deals */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 800 }}>Recent Campaigns</h2>
          <Link href="/client/deals" style={{ fontSize: 12, color: 'var(--brand)', fontWeight: 600, textDecoration: 'none' }}>View all →</Link>
        </div>
        {deals.length === 0 ? (
          <EmptyState icon="🏷️" title="No deals yet" description="Create your first deal to get started"
            action={<Link href="/client/deals/new" className="btn btn-primary" style={{ textDecoration: 'none' }}>+ Create Deal</Link>} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {deals.map(deal => (
              <div key={deal._id} style={{ background: 'var(--dark)', border: '1px solid var(--dark-border)', borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{deal.brand}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{deal.targetUrl} · {deal.applyOn}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 800, color: 'var(--brand)', letterSpacing: '0.1em' }}>{deal.couponCode}</span>
                    <VerticalChip vertical={deal.vertical} />
                    <Badge status={deal.status} />
                  </div>
                </div>
                {deal.status === 'rejected' && deal.rejectionReason && (
                  <div style={{ background: '#450a0a', border: '1px solid var(--error)', borderRadius: 8, padding: '8px 12px', marginBottom: 10, fontSize: 12, color: '#fca5a5' }}>
                    ❌ Rejected: {deal.rejectionReason}
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <ProgressBar value={deal.currentClicks} max={deal.targetClicks} color="var(--info)" label={`Clicks: ${deal.currentClicks?.toLocaleString()} / ${deal.targetClicks?.toLocaleString()}`} />
                  <ProgressBar value={deal.currentRedemptions} max={deal.maxRedemptions} color="var(--success)" label={`Redemptions: ${deal.currentRedemptions?.toLocaleString()} / ${deal.maxRedemptions?.toLocaleString()}`} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
