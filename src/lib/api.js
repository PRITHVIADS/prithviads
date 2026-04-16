'use client'

const BASE = ''

function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('prithviads_token')
}

function authHeaders() {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...options.headers },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export const api = {
  // Auth
  login: (body) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/api/auth/me'),

  // Deals
  getDeals: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return request(`/api/deals${q ? '?' + q : ''}`)
  },
  getDeal: (id) => request(`/api/deals/${id}`),
  createDeal: (body) => request('/api/deals', { method: 'POST', body: JSON.stringify(body) }),
  updateDeal: (id, body) => request(`/api/deals/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteDeal: (id) => request(`/api/deals/${id}`, { method: 'DELETE' }),

  // Analytics
  getAnalytics: () => request('/api/analytics'),

  // Clients (admin)
  getClients: () => request('/api/clients'),
  updateClient: (body) => request('/api/clients', { method: 'PATCH', body: JSON.stringify(body) }),

  // Extension (public)
  getDealsForUrl: (url) => request(`/api/extension?url=${encodeURIComponent(url)}`),
  trackEvent: (body) => request('/api/extension', { method: 'POST', body: JSON.stringify(body) }),
}

export function saveToken(token) {
  localStorage.setItem('prithviads_token', token)
}

export function saveUser(user) {
  localStorage.setItem('prithviads_user', JSON.stringify(user))
}

export function getUser() {
  if (typeof window === 'undefined') return null
  try {
    return JSON.parse(localStorage.getItem('prithviads_user'))
  } catch { return null }
}

export function logout() {
  localStorage.removeItem('prithviads_token')
  localStorage.removeItem('prithviads_user')
  window.location.href = '/login'
}
