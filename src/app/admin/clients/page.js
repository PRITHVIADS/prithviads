'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Spinner, SectionHeader, EmptyState, VerticalChip, Badge } from '@/components/ui'
import { useToast } from '@/components/ui'

export default function AdminClientsPage() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [resetModal, setResetModal] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [resetting, setResetting] = useState(false)
  const { add, ToastContainer } = useToast()

  async function load() {
    try {
      const { clients } = await api.getClients()
      setClients(clients)
    } catch (err) { add(err.message, 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function toggleActive(clientId, isActive) {
    try {
      await api.updateClient({ clientId, isActive })
      setClients(p => p.map(c => c._id === clientId ? { ...c, isActive } : c))
      add(`Client ${isActive ? 'activated' : 'deactivated'}`, 'success')
    } catch (err) { add(err.message, 'error') }
  }

  async function resetPassword() {
    if (!newPassword || newPassword.length < 6) return add('Password must be at least 6 characters', 'error')
    setResetting(true)
    try {
      const res = await fetch('/api/clients/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: resetModal._id, newPassword })
      })
      const data = await res.json()
      if (data.success) { add('Password reset successfully!', 'success'); setResetModal(null); setNewPassword('') }
      else add(data.error, 'error')
    } catch(e) { add(e.message, 'error') }
    finally { setResetting(false) }
  }

  return (
    <div style={{ padding: 32, maxWidth: 1000 }}>
      <ToastContainer />
      <SectionHeader title="Clients" subtitle={`${clients.length} registered advertiser${clients.length !== 1 ? 's' : ''}`} />

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Clients', value: clients.length, color: 'var(--brand)' },
          { label: 'Active', value: clients.filter(c => c.isActive).length, color: 'var(--success)' },
          { label: 'Total Deals', value: clients.reduce((a, c) => a + c.dealStats.total, 0), color: 'var(--info)' },
          { label: 'Total Redemptions', value: clients.reduce((a, c) => a + c.dealStats.totalRedemptions, 0).toLocaleString(), color: 'var(--warning)' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ borderLeft: `3px solid ${s.color}` }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, fontWeight: 700 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 900 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 40 }}>
          <Spinner /> <span style={{ color: 'var(--text-muted)' }}>Loading clients...</span>
        </div>
      ) : clients.length === 0 ? (
        <EmptyState icon="🏢" title="No clients yet" description="Clients will appear here once they register" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {clients.map(client => (
            <div key={client._id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12, background: 'var(--dark)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, border: '1px solid var(--dark-border)', flexShrink: 0,
                  }}>
                    {{ Travel: '✈️', Education: '🎓', 'E-commerce': '🛒', Automobile: '🚗' }[client.vertical] || '🏢'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16 }}>{client.companyName || client.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{client.email}</div>
                    {client.phone && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>📞 {client.phone}</div>}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  {client.vertical && <VerticalChip vertical={client.vertical} />}
                  <span style={{
                    padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                    background: client.isActive ? '#052e16' : '#1a1a1a',
                    color: client.isActive ? 'var(--success)' : 'var(--text-muted)',
                    border: `1px solid ${client.isActive ? 'var(--success)' : 'var(--dark-border)'}`,
                  }}>
                    {client.isActive ? '● Active' : '○ Inactive'}
                  </span>
                </div>
              </div>

              {/* Deal stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, margin: '16px 0', padding: '14px 0', borderTop: '1px solid var(--dark-border)', borderBottom: '1px solid var(--dark-border)' }}>
                {[
                  { label: 'Total Deals', value: client.dealStats.total },
                  { label: 'Approved', value: client.dealStats.approved, color: 'var(--success)' },
                  { label: 'Pending', value: client.dealStats.pending, color: 'var(--warning)' },
                  { label: 'Clicks', value: client.dealStats.totalClicks.toLocaleString(), color: 'var(--info)' },
                  { label: 'Redemptions', value: client.dealStats.totalRedemptions.toLocaleString(), color: 'var(--brand)' },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: s.color || 'var(--text-primary)' }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Joined: {client.createdAt?.slice(0, 10)} · Last login: {client.lastLogin?.slice(0, 10) || 'Never'}
                </div>
                <button onClick={() => toggleActive(client._id, !client.isActive)}
                  className={`btn btn-sm ${client.isActive ? 'btn-secondary' : 'btn-success'}`}>
                  {client.isActive ? '⏸ Deactivate' : '▶ Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reset Password Modal */}
      {resetModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 16, padding: 32, width: 400 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>Reset Password</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>Set new password for <strong style={{color:'var(--brand)'}}>{resetModal.name}</strong></div>
            <input
              type="password"
              placeholder="New password (min 6 chars)"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              style={{ width: '100%', background: 'var(--dark-card2)', border: '1px solid var(--dark-border)', borderRadius: 8, padding: '12px 14px', color: 'var(--text-primary)', fontSize: 14, outline: 'none', marginBottom: 16 }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setResetModal(null); setNewPassword('') }} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid var(--dark-border)', borderRadius: 8, color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={resetPassword} disabled={resetting} style={{ flex: 1, padding: '10px', background: 'var(--brand)', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontWeight: 700 }}>
                {resetting ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
