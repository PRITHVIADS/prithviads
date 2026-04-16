'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { StatCard, VerticalChip, Badge, Spinner, SectionHeader } from '@/components/ui'
import { useToast } from '@/components/ui'

const VERTICAL_COLORS = { Travel: '#3B82F6', Education: '#8B5CF6', 'E-commerce': '#EC4899', Automobile: '#F59E0B' }
const VERTICAL_ICONS = { Travel: '✈️', Education: '🎓', 'E-commerce': '🛒', Automobile: '🚗' }

export default function AdminAnalyticsPage() {
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

  const { stats, verticalStats, topDeals, recentRedemptions } = data || {}

  return (
    <div style={{ padding: 32, maxWidth: 1200 }}>
      <ToastContainer />
      <SectionHeader title="Platform Analytics" subtitle="Real-time performance data across all verticals" />

      {/* Top stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Deals" value={stats?.totalDeals ?? 0} accent="var(--brand)" icon="🏷️" sub="All submitted" />
        <StatCard label="Active Clients" value={stats?.totalClients ?? 0} accent="var(--info)" icon="🏢" sub="Registered advertisers" />
        <StatCard label="Total Clicks" value={(stats?.totalClicks ?? 0).toLocaleString()} accent="var(--success)" icon="👆" sub="Extension impressions" />
        <StatCard label="Total Redemptions" value={(stats?.totalRedemptions ?? 0).toLocaleString()} accent="var(--warning)" icon="🎟️" sub="Coupons applied" />
      </div>

      {/* Deal status breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 24, marginBottom: 24 }}>
        <div className="card">
          <h2 style={{ fontSize: 15, fontWeight: 800, marginBottom: 20 }}>📊 Vertical Performance</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {(verticalStats || []).map(v => {
              const maxClicks = Math.max(...(verticalStats || []).map(x => x.clicks), 1)
              return (
                <div key={v.vertical}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 20 }}>{VERTICAL_ICONS[v.vertical]}</span>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{v.vertical}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>({v.deals} deals)</span>
                    </div>
                    <div style={{ display: 'flex', gap: 20 }}>
                      <span style={{ fontSize: 13, color: 'var(--info)', fontWeight: 700 }}>{v.clicks.toLocaleString()} clicks</span>
                      <span style={{ fontSize: 13, color: 'var(--success)', fontWeight: 700 }}>{v.redemptions.toLocaleString()} used</span>
                    </div>
                  </div>
                  <div style={{ height: 8, background: 'var(--dark-muted)', borderRadius: 99 }}>
                    <div style={{ height: '100%', width: `${(v.clicks / maxClicks) * 100}%`, background: VERTICAL_COLORS[v.vertical], borderRadius: 99, transition: 'width 0.6s' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Status doughnut-style */}
        <div className="card">
          <h2 style={{ fontSize: 15, fontWeight: 800, marginBottom: 20 }}>🔵 Deal Status Breakdown</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Approved', value: stats?.approvedDeals ?? 0, color: 'var(--success)', icon: '✅' },
              { label: 'Pending', value: stats?.pendingDeals ?? 0, color: 'var(--warning)', icon: '⏳' },
              { label: 'Rejected', value: stats?.rejectedDeals ?? 0, color: 'var(--error)', icon: '❌' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--dark)', borderRadius: 10, border: '1px solid var(--dark-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span>{s.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{s.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 80, height: 5, background: 'var(--dark-muted)', borderRadius: 99 }}>
                    <div style={{ height: '100%', width: `${stats?.totalDeals > 0 ? (s.value / stats.totalDeals) * 100 : 0}%`, background: s.color, borderRadius: 99, transition: 'width 0.6s' }} />
                  </div>
                  <span style={{ fontSize: 18, fontWeight: 900, color: s.color }}>{s.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Top deals */}
        <div className="card">
          <h2 style={{ fontSize: 15, fontWeight: 800, marginBottom: 18 }}>🏆 Top Performing Deals</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(topDeals || []).map((deal, i) => (
              <div key={deal.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--dark)', borderRadius: 10, border: '1px solid var(--dark-border)' }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: i === 0 ? '#7c3600' : 'var(--dark-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: i === 0 ? '#fb923c' : 'var(--text-muted)' }}>
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
            {(!topDeals || topDeals.length === 0) && <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>No data yet</div>}
          </div>
        </div>

        {/* Recent redemptions */}
        <div className="card">
          <h2 style={{ fontSize: 15, fontWeight: 800, marginBottom: 18 }}>🕐 Recent Activity</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(recentRedemptions || []).slice(0, 8).map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--dark)', borderRadius: 8 }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{r.dealId?.brand || 'Unknown'}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 8 }}>{r.couponCode}</span>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                    background: r.type === 'redemption' ? '#052e16' : r.type === 'apply' ? '#0c1a3a' : '#1a1a1a',
                    color: r.type === 'redemption' ? 'var(--success)' : r.type === 'apply' ? 'var(--info)' : 'var(--text-muted)',
                  }}>{r.type}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.createdAt?.slice(0, 10)}</span>
                </div>
              </div>
            ))}
            {(!recentRedemptions || recentRedemptions.length === 0) && <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>No recent activity</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
