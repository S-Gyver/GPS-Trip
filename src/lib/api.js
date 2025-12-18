// src/lib/api.js
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost/tripsync_api'

async function safeJson(res) {
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    return { ok: false, message: text || 'Invalid JSON response' }
  }
}

export async function loginApi({ email, password, role }) {
  const res = await fetch(`${API_BASE}/login.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role }),
  })

  const data = await safeJson(res)

  // ถ้า backend ส่ง ok:false แต่ status ไม่ใช่ 200 ก็ยังอยากให้เห็น message
  if (!res.ok && data?.ok !== true) return data
  return data
}

export async function registerApi(payload) {
  const res = await fetch(`${API_BASE}/register.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await safeJson(res)
  if (!res.ok && data?.ok !== true) return data
  return data
}

export function saveAuth(user) {
  localStorage.setItem('tripsync_user', JSON.stringify(user))
}

export function getAuth() {
  try {
    return JSON.parse(localStorage.getItem('tripsync_user') || 'null')
  } catch {
    return null
  }
}

export function clearAuth() {
  localStorage.removeItem('tripsync_user')
}
