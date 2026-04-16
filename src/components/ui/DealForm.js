'use client'
import { useState } from 'react'
import { Input, Select, Textarea, Field } from '@/components/ui'

const VERTICALS = ['Travel', 'Education', 'E-commerce', 'Automobile']
const APPLY_ON = ['checkout', 'cart', 'product', 'homepage']

export default function DealForm({ initial = {}, onSubmit, loading, submitLabel = 'Submit Deal' }) {
  const [form, setForm] = useState({
    brand: '',
    vertical: '',
    couponCode: '',
    discountType: 'percent',
    discountValue: '',
    targetUrl: '',
    description: '',
    applyOn: 'checkout',
    validFrom: '',
    validTo: '',
    maxRedemptions: '1000',
    targetClicks: '5000',
    minimumOrderValue: '0',
    termsAndConditions: '',
    isAutoApply: true,
    ...initial,
  })
  const [errors, setErrors] = useState({})

  const f = (k) => (v) => setForm(p => ({ ...p, [k]: v }))
  const fEvent = (k) => (e) => f(k)(e.target.value)

  function validate() {
    const e = {}
    if (!form.brand) e.brand = 'Required'
    if (!form.vertical) e.vertical = 'Required'
    if (!form.couponCode) e.couponCode = 'Required'
    if (!form.discountValue || isNaN(form.discountValue)) e.discountValue = 'Must be a number'
    if (!form.targetUrl) e.targetUrl = 'Required'
    if (!form.validFrom) e.validFrom = 'Required'
    if (!form.validTo) e.validTo = 'Required'
    if (form.validFrom && form.validTo && form.validFrom >= form.validTo) e.validTo = 'Must be after start date'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Section: Brand Info */}
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid var(--dark-border)' }}>
        Brand & Category
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Input label="Brand Name" required value={form.brand} onChange={fEvent('brand')} placeholder="e.g. MakeMyTrip" error={errors.brand} />
        <Field label="Vertical" required error={errors.vertical}>
          <select className="input" value={form.vertical} onChange={fEvent('vertical')}>
            <option value="">Select vertical</option>
            {VERTICALS.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </Field>
      </div>
      <Input label="Target Website URL" required value={form.targetUrl} onChange={fEvent('targetUrl')}
        placeholder="e.g. myntra.com" hint="Enter domain only — no https:// needed" error={errors.targetUrl} />

      {/* Section: Coupon */}
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '8px 0 14px', paddingBottom: 10, borderBottom: '1px solid var(--dark-border)' }}>
        Coupon Details
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <Input label="Coupon Code" required value={form.couponCode} onChange={e => f('couponCode')(e.target.value.toUpperCase())}
          placeholder="e.g. SAVE200" error={errors.couponCode} style={{ letterSpacing: '0.1em', fontWeight: 700 }} />
        <Field label="Discount Type" required>
          <select className="input" value={form.discountType} onChange={fEvent('discountType')}>
            <option value="percent">Percentage (%)</option>
            <option value="flat">Flat Amount (₹)</option>
            <option value="freeshipping">Free Shipping</option>
          </select>
        </Field>
        <Input label={form.discountType === 'percent' ? 'Discount %' : form.discountType === 'flat' ? 'Amount (₹)' : 'Value'}
          required type="number" value={form.discountValue} onChange={fEvent('discountValue')}
          placeholder={form.discountType === 'percent' ? '20' : '500'} error={errors.discountValue} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Field label="Apply Coupon On" hint="Which page should the extension show the coupon?">
          <select className="input" value={form.applyOn} onChange={fEvent('applyOn')}>
            {APPLY_ON.map(v => <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>)}
          </select>
        </Field>
        <Input label="Minimum Order Value (₹)" type="number" value={form.minimumOrderValue} onChange={fEvent('minimumOrderValue')} placeholder="0 = no minimum" />
      </div>
      <Textarea label="Deal Description" value={form.description} onChange={fEvent('description')}
        placeholder="e.g. Get flat 20% off on all ethnic wear above ₹1000" />

      {/* Section: Validity */}
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '8px 0 14px', paddingBottom: 10, borderBottom: '1px solid var(--dark-border)' }}>
        Validity & KPI Targets
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Input label="Valid From" required type="date" value={form.validFrom} onChange={fEvent('validFrom')} error={errors.validFrom} />
        <Input label="Valid To" required type="date" value={form.validTo} onChange={fEvent('validTo')} error={errors.validTo} />
        <Input label="Max Redemptions" type="number" value={form.maxRedemptions} onChange={fEvent('maxRedemptions')} hint="Max times coupon can be used" />
        <Input label="Target Clicks" type="number" value={form.targetClicks} onChange={fEvent('targetClicks')} hint="Expected extension impressions" />
      </div>

      <Textarea label="Terms & Conditions" value={form.termsAndConditions} onChange={fEvent('termsAndConditions')}
        placeholder="e.g. Valid only on first purchase. Cannot be combined with other offers." />

      <Field label="Auto-Apply Setting">
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <input type="checkbox" checked={form.isAutoApply} onChange={e => f('isAutoApply')(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: 'var(--brand)' }} />
          <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Allow extension to auto-apply this coupon on checkout</span>
        </label>
      </Field>

      <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: 8 }}>
        {loading ? 'Submitting...' : submitLabel}
      </button>
    </form>
  )
}
