// background.js — PrithviAds service worker

chrome.runtime.onInstalled.addListener(() => {
  console.log('[PrithviAds] Extension installed successfully!')
})

// Listen for tab updates to trigger content script if needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Badge management — show deal count on icon
    updateBadge(tabId, tab.url)
  }
})

async function updateBadge(tabId, url) {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '')
    const API_BASE = 'https://your-prithviads-domain.com'

    const res = await fetch(`${API_BASE}/api/extension?url=${encodeURIComponent(hostname)}`)
    const data = await res.json()
    const count = data.deals?.length || 0

    if (count > 0) {
      chrome.action.setBadgeText({ tabId, text: String(count) })
      chrome.action.setBadgeBackgroundColor({ tabId, color: '#FF6B2B' })
    } else {
      chrome.action.setBadgeText({ tabId, text: '' })
    }
  } catch {
    chrome.action.setBadgeText({ tabId, text: '' })
  }
}
