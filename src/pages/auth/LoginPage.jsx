import PageContainer from '../../components/layout/PageContainer/PageContainer'
import Input from '../../components/ui/Input/Input'
import Button from '../../components/ui/Button/Button'
import './LoginPage.css'

import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLoginLogic } from './useAuthForm'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const redirectByRole = (role) => (role === 'driver' ? '/driver/jobs' : '/booking')

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()

  
  const fromState = location.state?.from
  const from =
    typeof fromState === 'string'
      ? fromState
      : fromState?.pathname
        ? fromState.pathname
        : null

  const isDriver = location.pathname.startsWith('/driver')
  const role = isDriver ? 'driver' : 'user'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: { email: '', password: '' },
  })

  const { loading, error, submit, handleGoogleLogin } = useLoginLogic({
    onSuccess: ({ role }) => {
      if (from) {
        navigate(from, { replace: true })
        return
      }
      navigate(redirectByRole(role), { replace: true })
    },
  })

  const onSubmit = async (data) => {
    if (loading) return
    return submit({
      email: (data.email || '').trim().toLowerCase(),
      password: data.password || '',
      role,
    })
  }

  const goUser = () => navigate('/login', { replace: true })
  const goDriver = () => navigate('/driver/login', { replace: true })

  // =========================
  // ✅ Google Identity Services Button
  // =========================
  const googleBtnRef = useRef(null)
  const gsiRenderedRef = useRef(false)

  useEffect(() => {
  // ✅ ทำเฉพาะหน้า login (กันเคสถูก re-render หลัง navigate)
  if (location.pathname !== '/login' && location.pathname !== '/driver/login') return

  if (gsiRenderedRef.current) return
  if (!googleBtnRef.current) return
  if (!window.google?.accounts?.id) return

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  if (!clientId) return

  googleBtnRef.current.innerHTML = ''
  gsiRenderedRef.current = true

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: (res) => {
      const idToken = res?.credential
      if (!idToken) return
      handleGoogleLogin({ idToken, role })
    },
  })

  window.google.accounts.id.renderButton(googleBtnRef.current, {
    theme: 'outline',
    size: 'large',
    text: 'continue_with',
    shape: 'pill',
    width: 360,
  })

  // ✅ cleanup สำคัญมาก
  return () => {
    try {
      window.google.accounts.id.cancel()
    } catch {}
  }
}, [location.pathname, handleGoogleLogin, role])


  return (
    <PageContainer>
      <div className="auth-card" aria-busy={loading}>
        <h1 className="auth-title">เข้าสู่ระบบ</h1>
        <p className="auth-sub">
          {isDriver ? 'สำหรับคนขับ TripSync' : 'สำหรับผู้ใช้งาน TripSync'}
        </p>

        <div className="role-switch" role="tablist" aria-label="เลือกประเภทการเข้าสู่ระบบ">
          <button
            type="button"
            className={`role-pill ${!isDriver ? 'active' : ''}`}
            onClick={goUser}
            disabled={loading}
            aria-selected={!isDriver}
          >
            👤 ผู้ใช้
          </button>

          <button
            type="button"
            className={`role-pill ${isDriver ? 'active' : ''}`}
            onClick={goDriver}
            disabled={loading}
            aria-selected={isDriver}
          >
            🚗 คนขับ
          </button>
        </div>

        {error && <div className="auth-alert">{error}</div>}

        <form className="auth-form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="อีเมล"
            type="email"
            placeholder="you@email.com"
            error={errors.email?.message}
            autoComplete="email"
            inputMode="email"
            {...register('email', {
              required: 'กรุณากรอกอีเมล',
              validate: (v) => (v || '').trim().length > 0 || 'กรุณากรอกอีเมล',
              pattern: { value: EMAIL_PATTERN, message: 'รูปแบบอีเมลไม่ถูกต้อง' },
            })}
          />

          <Input
            label="รหัสผ่าน"
            type="password"
            placeholder="อย่างน้อย 6 ตัวอักษร"
            error={errors.password?.message}
            autoComplete="current-password"
            {...register('password', {
              required: 'กรุณากรอกรหัสผ่าน',
              minLength: { value: 6, message: 'อย่างน้อย 6 ตัวอักษร' },
            })}
          />

          <Button type="submit" loading={loading}>
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </Button>

          <div className="auth-divider">
            <span>หรือ</span>
          </div>

          {/* ✅ ปุ่ม Google จริง */}
          <div style={{ display: 'grid', justifyContent: 'center' }}>
            <div ref={googleBtnRef} />
          </div>

          <div className="auth-footer">
            ยังไม่มีบัญชี?{' '}
            <Link to={isDriver ? '/driver/register' : '/register'}>สมัครสมาชิก</Link>
          </div>
        </form>
      </div>
    </PageContainer>
  )
}
