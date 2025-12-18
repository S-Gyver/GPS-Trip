// src/pages/auth/useAuthForm.js
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveSession } from '../../services/auth.api' // ใช้เก็บ session

const normalizeRole = (role) => (role === 'driver' ? 'driver' : 'user')
const redirectByRole = (role) => (role === 'driver' ? '/driver/jobs' : '/booking')

// ตั้ง base URL ไป AppServ (กำหนดใน .env ได้)
const API_BASE =
  (import.meta?.env?.VITE_API_BASE || 'http://localhost/tripsync_api').replace(/\/$/, '')

// helper ยิง API แบบ JSON
async function postJson(path, payload) {
  const url = `${API_BASE}/${String(path).replace(/^\//, '')}`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload || {}),
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const msg =
      data?.message ||
      data?.error ||
      (typeof data === 'string' ? data : '') ||
      `Request failed (${res.status})`
    throw new Error(msg)
  }

  return data
}

// ✅ Google auth (Login/Register endpoint เดียว)
async function googleAuth({ idToken, role }) {
  return postJson('google_auth.php', { idToken, role })
}

/* =========================
   LOGIN LOGIC
========================= */
export function useLoginLogic(options = {}) {
  const { onSuccess } = options

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (values) => {
    if (loading) return
    try {
      setError('')
      setLoading(true)

      const role = normalizeRole(values?.role)
      const email = (values?.email || '').trim().toLowerCase()
      const password = values?.password || ''

      // ✅ FIX: Login ต้องยิง login.php (ไม่ใช่ register.php)
      const session = await postJson('login.php', { email, password, role })

      saveSession({
        user: {
          name: session?.user?.name || session?.user?.username || null,
          email: session?.user?.email || email,
          role: session?.user?.role || role,
          phone: session?.user?.phone || null,
          id: session?.user?.id || null,
        },
        token: session?.token || null,
      })

      if (typeof onSuccess === 'function') {
        onSuccess({ role, session })
        return
      }

      navigate(redirectByRole(role), { replace: true })
    } catch (e) {
      setError(e?.message || 'เข้าสู่ระบบไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  // ✅ Google login (ได้ idToken จากปุ่ม GIS แล้วส่งมาที่นี่)
  const handleGoogleLogin = async ({ idToken, role = 'user' } = {}) => {
    if (!idToken) {
      setError('ไม่พบ Google token')
      return
    }
    if (loading) return
    try {
      setError('')
      setLoading(true)

      const normalizedRole = normalizeRole(role)
      const session = await googleAuth({ idToken, role: normalizedRole })

      saveSession({
        user: {
          name: session?.user?.name || session?.user?.username || null,
          email: session?.user?.email || null,
          role: session?.user?.role || normalizedRole,
          id: session?.user?.id || null,
        },
        token: session?.token || null,
      })

      if (typeof onSuccess === 'function') {
        onSuccess({ role: normalizedRole, session })
        return
      }

      navigate(redirectByRole(normalizedRole), { replace: true })
    } catch (e) {
      setError(e?.message || 'Google Login ไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, submit, handleGoogleLogin }
}

/* =========================
   REGISTER LOGIC
========================= */
export function useRegisterLogic(options = {}) {
  const { onSuccess } = options

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const submit = async (values) => {
    if (loading) return
    try {
      setError('')
      setSuccess('')
      setLoading(true)

      const role = normalizeRole(values?.role)

      // ✅ FIX: ระบบนี้ใช้ username อย่างเดียว (ไม่ต้อง first/last)
      const username = (values?.username || values?.name || '').trim()
      const email = (values?.email || '').trim().toLowerCase()
      const phone = (values?.phone || '').trim()
      const password = values?.password || ''

      const payload = { role, username, email, phone, password }

      // ✅ ยิงไป register.php
      const session = await postJson('register.php', payload)

      // บาง backend อาจไม่ส่ง session.user กลับมา → กันเหนียว
      saveSession({
        user: {
          name: session?.user?.name || session?.user?.username || username || null,
          email: session?.user?.email || email,
          role: session?.user?.role || role,
          id: session?.user?.id || null,
        },
        token: session?.token || null,
      })

      setSuccess('สมัครสมาชิกสำเร็จ! กำลังพาไปต่อ...')

      if (typeof onSuccess === 'function') {
        setTimeout(() => onSuccess({ role, session }), 400)
        return
      }

      setTimeout(() => navigate(redirectByRole(role), { replace: true }), 700)
    } catch (e) {
      setError(e?.message || 'สมัครสมาชิกไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  // ✅ Google register = endpoint เดียวกับ login (ถ้าไม่มี user จะสร้างให้)
  const handleGoogleLogin = async ({ idToken, role = 'user' } = {}) => {
    if (!idToken) {
      setError('ไม่พบ Google token')
      return
    }
    if (loading) return
    try {
      setError('')
      setSuccess('')
      setLoading(true)

      const normalizedRole = normalizeRole(role)
      const session = await googleAuth({ idToken, role: normalizedRole })

      saveSession({
        user: {
          name: session?.user?.name || session?.user?.username || null,
          email: session?.user?.email || null,
          role: session?.user?.role || normalizedRole,
          id: session?.user?.id || null,
        },
        token: session?.token || null,
      })

      setSuccess('สมัคร/เข้าสู่ระบบด้วย Google สำเร็จ! กำลังพาไปต่อ...')

      if (typeof onSuccess === 'function') {
        setTimeout(() => onSuccess({ role: normalizedRole, session }), 400)
        return
      }

      setTimeout(() => navigate(redirectByRole(normalizedRole), { replace: true }), 700)
    } catch (e) {
      setError(e?.message || 'Google สมัคร/เข้าสู่ระบบ ไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, success, submit, handleGoogleLogin }
}
