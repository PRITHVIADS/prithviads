// popup.js — PrithviAds Extension Popup

const API_BASE = 'http://127.0.0.1:3000'
async function init() {
  // Get active tab URL
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  const url = tab?.url || ''

  let hostname = ''
  try {
    hostname = new URL(url).hostname.replace(/^www\./, '')
  } catch {
    showNoDeal('Could not detect current site.')
    return
  }

  document.getElementById('site-name').textContent = hostname

  // Fetch deals
  let deals = []
  try {
    const res = await fetch(`${API_BASE}/api/extension?url=${encodeURIComponent(hostname)}`)
    const data = await res.json()
    deals = data.deals || []
  } catch {
    showNoDeal('Could not connect to PrithviAds. Check your connection.')
    return
  }

  if (deals.length === 0) {
    showNoDeal(`No active deals found for ${hostname}`)
    return
  }

  showDeals(deals, tab.id, hostname)
}

function showDeals(deals, tabId, hostname) {
  const container = document.getElementById('content')
  const deal = deals[0]

  const discountLabel = deal.discountType === 'percent'
    ? `${deal.discountValue}% OFF`
    : deal.discountType === 'flat'
    ? `₹${deal.discountValue} OFF`
    : 'FREE SHIPPING'

  container.innerHTML = `
    <div style="margin-bottom: 14px;">
      <div style="font-size: 11px; color: #666; margin-bottom: 8px;">
        ${deals.length} deal${deals.length > 1 ? 's' : ''} found <span style="color: #22C55E; font-weight: 700;">●</span>
      </div>

      <div class="deal-card">
        <div class="deal-top">
          <div class="deal-brand">${deal.brand}</div>
          <div class="deal-desc">${deal.description || `Save ${discountLabel} on your purchase`}</div>
        </div>
        <div class="deal-code-row">
          <span class="deal-code">${deal.couponCode}</span>
          <span class="deal-discount">Save ${discountLabel}!</span>
        </div>
      </div>

      ${deals.length > 1 ? `
        <div style="font-size: 11px; color: #666; margin-bottom: 8px;">Other deals:</div>
        ${deals.slice(1, 3).map(d => `
          <div style="background: #161616; border: 1px solid #222; border-radius: 8px; padding: 8px 12px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-size: 12px; font-weight: 700;">${d.brand}</div>
              <div style="font-size: 10px; color: #666;">${d.couponCode}</div>
            </div>
            <div style="font-size: 12px; font-weight: 700; color: #FF6B2B;">
              ${d.discountType === 'percent' ? `${d.discountValue}%` : d.discountType === 'flat' ? `₹${d.discountValue}` : 'Free Ship'} off
            </div>
          </div>
        `).join('')}
      ` : ''}
    </div>

    <button class="btn btn-primary" id="auto-apply-btn">⚡ Auto-Apply at Checkout</button>
    <button class="btn btn-secondary" id="copy-btn">📋 Copy Code — ${deal.couponCode}</button>
    <div style="font-size: 10px; color: #444; text-align: center; margin-top: 10px;">
      Valid till ${deal.validTo?.slice(0, 10)}
    </div>
  `

  // Auto-apply: inject script into the page
  document.getElementById('auto-apply-btn').addEventListener('click', async () => {
    const btn = document.getElementById('auto-apply-btn')
    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        func: injectAndApply,
        args: [deal.couponCode, deal._id, API_BASE],
      })
      btn.textContent = '✅ Applied at checkout!'
      btn.style.background = '#16a34a'
    } catch {
      btn.textContent = '💡 Stored — will apply at checkout'
      btn.style.background = '#444'
    }

    // Track
    trackEvent(deal._id, 'apply', hostname)
  })

  // Copy code
  document.getElementById('copy-btn').addEventListener('click', async () => {
    await navigator.clipboard.writeText(deal.couponCode).catch(() => {})
    const btn = document.getElementById('copy-btn')
    btn.textContent = '✅ Copied!'
    setTimeout(() => { btn.textContent = `📋 Copy Code — ${deal.couponCode}` }, 2000)
  })
}

// This function runs in the context of the web page
function injectAndApply(code, dealId, apiBase) {
  const selectors = [
    'input[name="coupon"]', 'input[name="coupon_code"]', 'input[name="promo_code"]',
    'input[name="discount_code"]', 'input[id*="coupon"]', 'input[id*="promo"]',
    'input[placeholder*="coupon" i]', 'input[placeholder*="promo" i]',
    'input[placeholder*="code" i]', 'input[aria-label*="coupon" i]',
  ]

  for (const selector of selectors) {
    const input = document.querySelector(selector)
    if (input) {
      input.value = code
      input.dispatchEvent(new Event('input', { bubbles: true }))
      input.dispatchEvent(new Event('change', { bubbles: true }))

      setTimeout(() => {
        const parent = input.closest('form') || input.parentElement?.parentElement
        const btn = parent?.querySelector('button[type="submit"], button[id*="apply" i]')
        if (btn) btn.click()
        else input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }))

        fetch(`${apiBase}/api/extension`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dealId, type: 'redemption', url: location.hostname }),
        }).catch(() => {})
      }, 400)

      return true
    }
  }
  return false
}

function showNoDeal(message) {
  document.getElementById('content').innerHTML = `
    <div class="no-deals">
      <div class="no-deals-icon">🏷️</div>
      <h3>No deals found</h3>
      <p>${message}</p>
    </div>
  `
}

async function trackEvent(dealId, type, url) {
  if (!dealId) return
  try {
    await fetch(`${API_BASE}/api/extension`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dealId, type, url }),
    })
  } catch {}
}

init()
