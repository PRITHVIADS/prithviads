'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { StatCard, Badge, VerticalChip, Spinner, SectionHeader } from '@/components/ui'
import { useToast } from '@/components/ui'
import Link from 'next/link'

const VERTICAL_COLORS = {
  Travel: '#3B82F6',
  Education: '#8B5CF6',
  'E-commerce': '#EC4899',
  Automobile: '#F59E0B',
}

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const { add, ToastContainer } = useToast()

  useEffect(() => {
    async function load() {
      try {
        const [analyticsRes, dealsRes] = await Promise.all([
          api.getAnalytics(),
          api.getDeals({ status: 'pending' }),
        ])
        setData(analyticsRes)
        setDeals(dealsRes.deals.slice(0, 5))
      } catch (err) {
        add(err.message, 'error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function quickApprove(id) {
    try {
      await api.updateDeal(id, { status: 'approved' })
      setDeals(p => p.filter(d => d._id !== id))
      add('Deal approved and is now live!', 'success')
    } catch (err) {
      add(err.message, 'error')
    }
  }

  if (loading) return (
    <div style={{ padding: 40, display: 'flex', alignItems: 'center', gap: 12 }}>
      <Spinner /> <span style={{ color: 'var(--text-muted)' }}>Loading dashboard...</span>
    </div>
  )

  const { stats, verticalStats, topDeals } = data || {}

  return (
    <div style={{ padding: 32, maxWidth: 1200 }}>
      <ToastContainer />
      <SectionHeader title="Admin Dashboard" subtitle="Overview of PrithviAds platform performance" />

      {/* Stat grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Deals" value={stats?.totalDeals ?? 0} icon="🏷️" accent="var(--brand)" sub="All time submitted" />
        <StatCard label="Pending Review" value={stats?.pendingDeals ?? 0} icon="⏳" accent="var(--warning)" sub="Needs your action" />
        <StatCard label="Total Clicks" value={(stats?.totalClicks ?? 0).toLocaleString()} icon="👆" accent="var(--info)" sub="Extension impressions" />
        <StatCard label="Redemptions" value={(stats?.totalRedemptions ?? 0).toLocaleString()} icon="🎟️" accent="var(--success)" sub="Coupons used" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Pending deals */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800 }}>⏳ Pending Deals</h2>
            <Link href="/admin/deals" style={{ fontSize: 12, color: 'var(--brand)', fontWeight: 600 }}>View all →</Link>
          </div>
          {deals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: 14 }}>
              🎉 No pending deals to review
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {deals.map(deal => (
                <div key={deal._id} style={{
                  background: 'var(--dark)', borderRadius: 10, padding: '12px 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  border: '1px solid var(--dark-border)',
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{deal.brand}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      {deal.couponCode} · {deal.vertical}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => quickApprove(deal._id)} className="btn btn-success btn-sm">✅ Approve</button>
                    <Link href={`/admin/deals`} className="btn btn-secondary btn-sm" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', padding: '6px 14px', fontSize: 12 }}>Review</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vertical stats */}
        <div className="card">
          <h2 style={{ fontSize: 15, fontWeight: 800, marginBottom: 18 }}>📊 By Vertical</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(verticalStats || []).map(v => (
              <div key={v.vertical} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, textAlign: 'center', fontSize: 18 }}>
                  {{ Travel: '✈️', Education: '🎓', 'E-commerce': '🛒', Automobile: '🚗' }[v.vertical]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{v.vertical}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{v.deals} deals · {v.clicks.toLocaleString()} clicks</span>
                  </div>
                  <div style={{ height: 5, background: 'var(--dark-muted)', borderRadius: 99 }}>
                    <div style={{ height: '100%', width: `${Math.min(100, v.deals * 20)}%`, background: VERTICAL_COLORS[v.vertical], borderRadius: 99, transition: 'width 0.6s' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top deals table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h2 style={{ fontSize: 15, fontWeight: 800 }}>🏆 Top Performing Deals</h2>
          <Link href="/admin/analytics" style={{ fontSize: 12, color: 'var(--brand)', fontWeight: 600 }}>Full analytics →</Link>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Brand</th>
                <th>Code</th>
                <th>Vertical</th>
                <th>Clicks</th>
                <th>Redemptions</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(topDeals || []).map(d => (
                <tr key={d.id}>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{d.brand}</td>
                  <td><span style={{ background: 'var(--dark)', border: '1px solid var(--dark-border)', padding: '2px 8px', borderRadius: 6, fontSize: 12, fontWeight: 800, color: 'var(--brand)', letterSpacing: '0.08em' }}>{d.couponCode}</span></td>
                  <td><VerticalChip vertical={d.vertical} /></td>
                  <td>{d.clicks.toLocaleString()}</td>
                  <td>{d.redemptions.toLocaleString()}</td>
                  <td><Badge status={d.status} /></td>
                </tr>
              ))}
              {(!topDeals || topDeals.length === 0) && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No deals yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
