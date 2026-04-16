'use client'
import { useEffect, useState } from 'react'

// ─── Toast ───────────────────────────────────────────────────────────────────
export function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])
  const icons = { success: '✅', error: '❌', info: 'ℹ️' }
  return (
    <div className={`toast ${type}`}>
      <span>{icons[type]}</span>
      <span>{message}</span>
      <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', fontSize: 16, cursor: 'pointer' }}>×</button>
    </div>
  )
}

export function useToast() {
  const [toasts, setToasts] = useState([])
  const add = (message, type = 'success') => {
    const id = Date.now()
    setToasts(p => [...p, { id, message, type }])
  }
  const remove = (id) => setToasts(p => p.filter(t => t.id !== id))
  const ToastContainer = () => (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {toasts.map(t => <Toast key={t.id} {...t} onClose={() => remove(t.id)} />)}
    </div>
  )
  return { add, ToastContainer }
}

// ─── Spinner ─────────────────────────────────────────────────────────────────
export function Spinner({ size = 20, color = 'var(--brand)' }) {
  return (
    <div style={{
      width: size, height: size, border: `2px solid transparent`,
      borderTopColor: color, borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
  )
}

// ─── Badge ───────────────────────────────────────────────────────────────────
export function Badge({ status }) {
  return <span className={`badge badge-${status}`}>{status}</span>
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
export function ProgressBar({ value = 0, max = 100, color = 'var(--brand)', label }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div className="progress-wrap">
      <div className="progress-header">
        <span className="progress-label">{label || `${value.toLocaleString()} / ${max.toLocaleString()}`}</span>
        <span className="progress-pct" style={{ color }}>{pct}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, accent = 'var(--brand)', icon }) {
  return (
    <div className="stat-card" style={{ borderLeft: `3px solid ${accent}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{label}</div>
          <div style={{ color: 'var(--text-primary)', fontSize: 28, fontWeight: 900, lineHeight: 1 }}>{value}</div>
          {sub && <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 6 }}>{sub}</div>}
        </div>
        {icon && <div style={{ fontSize: 28 }}>{icon}</div>}
      </div>
    </div>
  )
}

// ─── Modal ───────────────────────────────────────────────────────────────────
export function Modal({ isOpen, onClose, title, children, width = 520 }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        width: '100%', maxWidth: width, background: 'var(--dark-card)',
        border: '1px solid var(--dark-border)', borderRadius: 18,
        animation: 'slideUp 0.25s ease',
        maxHeight: '90vh', overflow: 'auto',
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--dark-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 17, fontWeight: 800 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 22, lineHeight: 1, cursor: 'pointer' }}>×</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  )
}

// ─── Form Field ───────────────────────────────────────────────────────────────
export function Field({ label, required, hint, error, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 700, marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          {label} {required && <span style={{ color: 'var(--brand)' }}>*</span>}
        </label>
      )}
      {hint && <div style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 6 }}>{hint}</div>}
      {children}
      {error && <div style={{ color: 'var(--error)', fontSize: 12, marginTop: 4 }}>{error}</div>}
    </div>
  )
}

export function Input({ label, required, hint, error, ...props }) {
  return (
    <Field label={label} required={required} hint={hint} error={error}>
      <input className="input" {...props} />
    </Field>
  )
}

export function Select({ label, required, hint, error, children, ...props }) {
  return (
    <Field label={label} required={required} hint={hint} error={error}>
      <select className="input" {...props}>{children}</select>
    </Field>
  )
}

export function Textarea({ label, required, hint, error, ...props }) {
  return (
    <Field label={label} required={required} hint={hint} error={error}>
      <textarea className="input" rows={3} style={{ resize: 'vertical' }} {...props} />
    </Field>
  )
}

// ─── Empty State ─────────────────────────────────────────────────────────────
export function EmptyState({ icon = '📭', title, description, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 24px' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{title}</div>
      <div style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>{description}</div>
      {action}
    </div>
  )
}

// ─── Section Header ─────────────────────────────────────────────────────────
export function SectionHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 4 }}>{title}</h1>
        {subtitle && <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

// ─── Vertical chip ──────────────────────────────────────────────────────────
const VERTICAL_META = {
  Travel: { icon: '✈️', color: '#3B82F6' },
  Education: { icon: '🎓', color: '#8B5CF6' },
  'E-commerce': { icon: '🛒', color: '#EC4899' },
  Automobile: { icon: '🚗', color: '#F59E0B' },
}

export function VerticalChip({ vertical }) {
  const meta = VERTICAL_META[vertical] || { icon: '🏷️', color: '#666' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: `${meta.color}18`, color: meta.color,
      border: `1px solid ${meta.color}40`,
      padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
    }}>
      {meta.icon} {vertical}
    </span>
  )
}

export { VERTICAL_META }
