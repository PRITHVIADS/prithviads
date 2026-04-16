'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { StatCard, VerticalChip, Spinner, SectionHeader } from '@/components/ui'
import { useToast } from '@/components/ui'

export default function ClientAnalyticsPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { add, ToastContainer } = useToast()

  useEffect(() => {
    api.getAnalytics()
      .then(setData)
      .catch(err => add(err.message, 'error'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ padding: 40, display: 'flex', gap: 12, alignItems: 'center' }}><Spinner /><span style={{ color: 'var(--text-muted)' }}>Loading analytics...</span></div>

  const { stats, topDeals, recentRedemptions } = data || {}

  return (
    <div style={{ padding: 32, maxWidth: 1000 }}>
      <ToastContainer />
      <SectionHeader title="My Analytics" subtitle="Performance breakdown across your campaigns" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <StatCard label="Total Deals" value={stats?.totalDeals ?? 0} accent="var(--brand)" icon="🏷️" />
        <StatCard label="Approved" value={stats?.approvedDeals ?? 0} accent="var(--success)" icon="✅" />
        <StatCard label="Total Clicks" value={(stats?.totalClicks ?? 0).toLocaleString()} accent="var(--info)" icon="👆" />
        <StatCard label="Redemptions" value={(stats?.totalRedemptions ?? 0).toLocaleString()} accent="var(--warning)" icon="🎟️" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="card">
          <h2 style={{ fontSize: 15, fontWeight: 800, marginBottom: 18 }}>🏆 Top Campaigns</h2>
          {(topDeals || []).length === 0 ? (
            <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No campaign data yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {topDeals.map((deal, i) => (
                <div key={deal.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--dark)', borderRadius: 10, border: '1px solid var(--dark-border)' }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--dark-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: 'var(--text-muted)' }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{deal.brand}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{deal.couponCode}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--info)' }}>{deal.clicks.toLocaleString()} clicks</div>
                    <div style={{ fontSize: 11, color: 'var(--success)' }}>{deal.redemptions.toLocaleString()} used</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 style={{ fontSize: 15, fontWeight: 800, marginBottom: 18 }}>🕐 Recent Activity</h2>
          {(recentRedemptions || []).length === 0 ? (
            <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No activity yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentRedemptions.slice(0, 10).map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--dark)', borderRadius: 8 }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{r.dealId?.brand || 'Deal'}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 8 }}>{r.couponCode}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                      background: r.type === 'redemption' ? '#052e16' : '#0c1a3a',
                      color: r.type === 'redemption' ? 'var(--success)' : 'var(--info)',
                    }}>{r.type}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.createdAt?.slice(0, 10)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
