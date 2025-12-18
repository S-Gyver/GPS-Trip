// src/services/auth.api.js

const SESSION_KEY = 'tripsync_session'
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost/tripsync_api'

const emitSessionChange = () => {
  window.dispatchEvent(new Event('session_changed'))
  window.dispatchEvent(
    new StorageEvent('storage', {
      key: SESSION_KEY,
      newValue: localStorage.getItem(SESSION_KEY),
    })
  )
}

async function safeJson(res) {
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    return { ok: false, message: text || 'Invalid JSON response' }
  }
}

const normalizeRole = (role) => (role === 'driver' ? 'driver' : role === 'admin' ? 'admin' : 'user')

/* =========================
   REAL API (AppServ)
========================= */

// ✅ LOGIN
export async function loginUser({ email, password, role }) {
  const e = String(email || '').trim().toLowerCase()
  const p = String(password || '')

  if (!e || !p) throw new Error('กรุณากรอกอีเมลและรหัสผ่าน')

  const payload = { email: e, password: p, role: normalizeRole(role) }

  const res = await fetch(`${API_BASE}/login.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await safeJson(res)

  if (!data?.ok) {
    // backend ส่ง message มาอยู่แล้ว
    throw new Error(data?.message || 'เข้าสู่ระบบไม่สำเร็จ')
  }

  // map ให้เข้ารูปเดิมของเอย
  const user = data.user || {}

  return {
    token: null, // Phase 1 ยังไม่ใช้ token/JWT
    user: {
      id: user.id ?? null,
      role: user.role ?? payload.role ?? 'user',
      email: user.email ?? e,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || null,
      phone: user.phone ?? null,
    },
    raw: data,
  }
}

// ✅ REGISTER
export async function registerUser({ name, firstName, lastName, email, phone, password, role }) {
  const e = String(email || '').trim().toLowerCase()
  const p = String(password || '')

  // รองรับทั้ง name หรือ firstName/lastName
  const fullName = String(name || '').trim()
  const fn = String(firstName || '').trim() || (fullName ? fullName.split(' ')[0] : '')
  const ln = String(lastName || '').trim() || (fullName ? fullName.split(' ').slice(1).join(' ') : '')

  if (!fn || !ln || !e || !p) throw new Error('กรุณากรอกข้อมูลให้ครบ')
  if (p.length < 6) throw new Error('รหัสผ่านต้องอย่างน้อย 6 ตัวอักษร')

  const payload = {
    firstName: fn,
    lastName: ln,
    email: e,
    phone: String(phone || '').trim(),
    password: p,
    role: normalizeRole(role),
  }

  const res = await fetch(`${API_BASE}/register.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await safeJson(res)

  if (!data?.ok) {
    throw new Error(data?.message || 'สมัครสมาชิกไม่สำเร็จ')
  }

  // register.php ของเรายังไม่คืน user กลับมา → คืนตามรูปเดิมให้ useRegisterLogic ใช้ได้
  return {
    token: null,
    user: {
      id: null,
      role: payload.role,
      name: `${fn} ${ln}`.trim(),
      email: e,
    },
    raw: data,
  }
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
