const SESSION_KEY = 'tripsync_session'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const emitSessionChange = () => {
  window.dispatchEvent(new Event('session_changed'))
  window.dispatchEvent(
    new StorageEvent('storage', {
      key: SESSION_KEY,
      newValue: localStorage.getItem(SESSION_KEY),
    })
  )
}

/* =========================
   MOCK API
========================= */
export async function loginUser({ email, password, role }) {
  await sleep(600)

  const e = String(email || '').trim().toLowerCase()
  const p = String(password || '')

  if (!e || !p) {
    throw new Error('กรุณากรอกอีเมลและรหัสผ่าน')
  }

  // ✅ Admin credential: admin@tripsync.com / 123456 (หรือพิมพ์สั้นว่า admin / 123456 ก็ได้)
  const isAdmin = (e === 'admin@tripsync.com' || e === 'admin') && p === '123456'

  if (!isAdmin && p.length < 6) {
    throw new Error('รหัสผ่านต้องอย่างน้อย 6 ตัวอักษร')
  }

  const safeRole = isAdmin ? 'admin' : role === 'driver' ? 'driver' : 'user'

  return {
    token: `mock-token-${safeRole}`,
    user: {
      id: safeRole === 'admin' ? 'a_001' : safeRole === 'driver' ? 'd_001' : 'u_001',
      role: safeRole,
      email: isAdmin ? 'admin@tripsync.com' : email,
      name: safeRole === 'admin' ? 'Admin' : null,
    },
  }
}

export async function registerUser({ name, email, password, role }) {
  await sleep(700)

  if (!name || !email || !password) {
    throw new Error('กรุณากรอกข้อมูลให้ครบ')
  }

  if (password.length < 6) {
    throw new Error('รหัสผ่านต้องอย่างน้อย 6 ตัวอักษร')
  }

  const safeRole = role === 'driver' ? 'driver' : 'user'

  return {
    token: `mock-token-${safeRole}`,
    user: {
      id: safeRole === 'driver' ? 'd_002' : 'u_002',
      role: safeRole,
      name,
      email,
    },
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
