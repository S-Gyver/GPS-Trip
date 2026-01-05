// src/services/auth.api.js
const SESSION_KEY = 'tripsync_session'
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost/tripsync_api'

const emitSessionChange = () => {
  window.dispatchEvent(new Event('session_changed'))
}

async function safeJson(res) {
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    return { ok: false, message: text || 'Invalid JSON response' }
  }
}

/* =========================
   LOGIN
========================= */
export async function loginUser({ email, password }) {
  const e = String(email || '').trim().toLowerCase()
  const p = String(password || '')

  const res = await fetch(`${API_BASE}/login.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: e, password: p }),
  })

  const data = await safeJson(res)
  if (!data?.ok) throw new Error(data?.message || 'เข้าสู่ระบบไม่สำเร็จ')

  return {
    token: data.token,
    user: {
      id: data.user?.id,
      email: data.user?.email,
      name: data.user?.name,
      phone: data.user?.phone || null,
    },
  }
}

/* =========================
   REGISTER
========================= */
export async function registerUser({ name, email, phone, password }) {
  const res = await fetch(`${API_BASE}/register.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, phone, password }),
  })

  const data = await safeJson(res)
  if (!data?.ok) throw new Error(data?.message || 'สมัครสมาชิกไม่สำเร็จ')

  return true
}

/* =========================
   SESSION
========================= */
export function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  emitSessionChange()
}

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
  } catch {
    return null
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
  emitSessionChange()
}
