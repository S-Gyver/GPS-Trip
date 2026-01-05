// src/pages/auth/useAuthForm.js
import { useCallback, useMemo, useState } from 'react'
import { saveSession, clearSession } from '../../services/auth.api'

const API_BASE = (import.meta?.env?.VITE_API_BASE || 'http://localhost/tripsync_api').replace(/\/$/, '')

async function readJsonSafe(res) {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return { ok: false, message: text }
  }
}

async function postForm(path, payload) {
  const url = `${API_BASE}/${String(path).replace(/^\//, '')}`

  const body = new URLSearchParams()
  Object.entries(payload || {}).forEach(([k, v]) => {
    if (v === undefined || v === null) return
    body.set(k, String(v))
  })

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    credentials: 'include',
    body,
  })

  const data = await readJsonSafe(res)

  if (!res.ok || data?.ok === false) {
    const msg = data?.message || data?.error || `Request failed (${res.status})`
    throw new Error(String(msg))
  }

  return data
}

async function fetchMeUser() {
  const url = `${API_BASE}/api/auth/me.php`
  const res = await fetch(url, { credentials: 'include' })
  const data = await readJsonSafe(res)
  if (!res.ok) return null
  return data?.user || null
}

async function tryServerLogout() {
  const url = `${API_BASE}/api/auth/logout.php`
  try {
    await fetch(url, { method: 'POST', credentials: 'include' })
  } catch {}
}

function applySession(user) {
  // ✅ ทำให้ session มี token แบบ “local”
  const session = { token: 'local', user }
  saveSession(session)
  return session
}

/* =========================
   LOGIN (LOCAL)
========================= */
export function useLoginLogic({ onSuccess } = {}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = useCallback(
    async (payload = {}) => {
      if (loading) return null
      try {
        setError('')
        setLoading(true)

        await tryServerLogout()
        await postForm('api/auth/login_local.php', payload)

        const meUser = await fetchMeUser()
        if (!meUser) throw new Error('เข้าสู่ระบบไม่สำเร็จ (session ไม่ถูกตั้ง)')

        const sess = applySession(meUser)
        onSuccess?.(sess)
        return sess
      } catch (e) {
        setError(e?.message || 'เข้าสู่ระบบไม่สำเร็จ')
        return null
      } finally {
        setLoading(false)
      }
    },
    [loading, onSuccess]
  )

  return useMemo(() => ({ loading, error, submit }), [loading, error, submit])
}

/* =========================
   REGISTER (LOCAL)
========================= */
export function useRegisterLogic({ onSuccess } = {}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = useCallback(
    async (payload = {}) => {
      if (loading) return null
      try {
        setError('')
        setLoading(true)

        // 1) register
        await postForm('api/auth/register_local.php', payload)

        // 2) auto-login
        await postForm('api/auth/login_local.php', {
          email: payload.email,
          password: payload.password,
        })

        // 3) me
        const meUser = await fetchMeUser()
        if (!meUser) throw new Error('สมัครแล้วแต่ session ไม่ถูกตั้ง')

        const sess = applySession(meUser)
        onSuccess?.(sess)
        return sess
      } catch (e) {
        setError(e?.message || 'สมัครสมาชิกไม่สำเร็จ')
        return null
      } finally {
        setLoading(false)
      }
    },
    [loading, onSuccess]
  )

  return useMemo(() => ({ loading, error, submit }), [loading, error, submit])
}

/* =========================
   LOGOUT
========================= */
export function useLogoutLogic({ onSuccess } = {}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const logout = useCallback(async () => {
    if (loading) return
    try {
      setError('')
      setLoading(true)

      await tryServerLogout()
      clearSession()
      onSuccess?.()
    } catch (e) {
      setError(e?.message || 'ออกจากระบบไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }, [loading, onSuccess])

  return useMemo(() => ({ loading, error, logout }), [loading, error, logout])
}
