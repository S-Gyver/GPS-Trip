import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser, registerUser, saveSession } from '../../services/auth.api'

const normalizeRole = (role) => (role === 'driver' ? 'driver' : 'user')
const redirectByRole = (role) => (role === 'driver' ? '/driver/jobs' : '/booking')

/* =========================
   LOGIN LOGIC
========================= */
export function useLoginLogic(options = {}) {
  const { onSuccess } = options

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (values) => {
    try {
      setError('')
      setLoading(true)

      const role = normalizeRole(values?.role)

      // ✅ ส่ง role เข้า mock api ด้วย
      const session = await loginUser({ ...values, role })

      saveSession({
        user: {
          name: session?.user?.name || null,
          email: session?.user?.email || values.email,
          role: session?.user?.role || role,
        },
        token: session?.token || null,
      })

      // ✅ ถ้ามี onSuccess ให้ใช้มัน (เช่น กลับไปหน้าเดิมจาก location.state.from)
      if (typeof onSuccess === 'function') {
        onSuccess({ role, session })
        return
      }

      // ✅ fallback เดิม: ไปตาม role
      navigate(redirectByRole(role), { replace: true })
    } catch (e) {
      setError(e?.message || 'เข้าสู่ระบบไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async (opts = {}) => {
    try {
      setError('')
      setLoading(true)

      const role = normalizeRole(opts?.role)
      console.log('Google Login clicked. role =', role)

      alert('ฟีเจอร์ Google Login กำลังพัฒนา')
    } catch (e) {
      setError('ไม่สามารถเข้าสู่ระบบด้วย Google ได้')
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
    try {
      setError('')
      setSuccess('')
      setLoading(true)

      const role = normalizeRole(values?.role)

      // ✅ ส่ง role เข้า mock api
      const session = await registerUser({ ...values, role })

      saveSession({
        user: {
          name: session?.user?.name || values.name,
          email: session?.user?.email || values.email,
          role: session?.user?.role || role,
        },
        token: session?.token || null,
      })

      setSuccess('สมัครสมาชิกสำเร็จ! กำลังพาไปต่อ...')

      // ✅ ถ้ามี onSuccess ให้ใช้มันก่อน
      if (typeof onSuccess === 'function') {
        setTimeout(() => onSuccess({ role, session }), 400)
        return
      }

      // ✅ fallback เดิม: ไปตาม role
      setTimeout(() => navigate(redirectByRole(role), { replace: true }), 700)
    } catch (e) {
      setError(e?.message || 'สมัครสมาชิกไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async (opts = {}) => {
    try {
      setError('')
      setLoading(true)

      const role = normalizeRole(opts?.role)
      console.log('Google Login clicked (Register). role =', role)

      alert('ฟีเจอร์ Google Login กำลังพัฒนา')
    } catch (e) {
      setError('ไม่สามารถเข้าสู่ระบบด้วย Google ได้')
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, success, submit, handleGoogleLogin }
}
