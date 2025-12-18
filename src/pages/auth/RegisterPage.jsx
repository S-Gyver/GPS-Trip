// src/pages/auth/RegisterPage.jsx
import PageContainer from '../../components/layout/PageContainer/PageContainer'
import Input from '../../components/ui/Input/Input'
import Button from '../../components/ui/Button/Button'
import './RegisterPage.css'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useRegisterLogic } from './useAuthForm'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export default function RegisterPage() {
  const navigate = useNavigate()
  const location = useLocation()

  // ✅ เดา role จาก path
  const isDriver = location.pathname.startsWith('/driver')
  const role = isDriver ? 'driver' : 'user'

  // ✅ คุมการโชว์ server error ไม่ให้ “ค้าง”
  const [showServerError, setShowServerError] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, submitCount },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const { loading, error, success, submit, handleGoogleLogin } = useRegisterLogic()
  const pwd = watch('password')

  useEffect(() => {
    if (error) setShowServerError(true)
  }, [error])

  const hasValidationError = useMemo(() => Object.keys(errors || {}).length > 0, [errors])
  const hideServerErrorOnEdit = () => setShowServerError(false)

  // ✅ สมัครด้วย email/password → ส่ง username อย่างเดียว
  const onSubmit = async (data) => {
    if (loading) return

    const payload = {
      role,
      username: (data.name || '').trim(),
      email: (data.email || '').trim().toLowerCase(),
      password: data.password,
    }

    console.log('REGISTER payload =>', payload)
    return submit(payload)
  }

  const goUser = () => navigate('/register')
  const goDriver = () => navigate('/driver/register')

  // =========================
  // ✅ Google Identity Services Button
  // =========================
  const googleBtnRef = useRef(null)

  useEffect(() => {
    if (!window.google || !googleBtnRef.current) return

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    console.log('GOOGLE_CLIENT_ID (Register) =>', clientId)
    if (!clientId) {
      console.error('Missing VITE_GOOGLE_CLIENT_ID in .env')
      return
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (res) => {
        const idToken = res?.credential
        if (!idToken) return
        // ✅ ส่ง idToken เข้า hook ที่เราแก้ไว้แล้ว
        handleGoogleLogin({ idToken, role })
      },
    })

    window.google.accounts.id.renderButton(googleBtnRef.current, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'pill',
      width: 360,
    })
  }, [handleGoogleLogin, role])

  return (
    <PageContainer>
      <div className="auth-card" aria-busy={loading}>
        <h1 className="auth-title">สมัครสมาชิก</h1>
        <p className="auth-sub">
          {isDriver ? 'สมัครสำหรับคนขับ TripSync' : 'สมัครสำหรับผู้ใช้งาน TripSync'}
        </p>

        <div className="role-switch" role="tablist" aria-label="เลือกประเภทการสมัคร">
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

        {submitCount > 0 && hasValidationError && (
          <div className="auth-alert">กรุณากรอกข้อมูลให้ครบ</div>
        )}

        {showServerError && error && !hasValidationError && (
          <div className="auth-alert">{error}</div>
        )}

        {success && <div className="auth-success">{success}</div>}

        <form className="auth-form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="ชื่อผู้ใช้งาน"
            placeholder="เช่น Boy"
            error={errors.name?.message}
            {...register('name', {
              required: 'กรุณากรอกชื่อ',
              validate: (v) => v.trim().length > 0 || 'กรุณากรอกชื่อ',
              onChange: hideServerErrorOnEdit,
            })}
          />

          <Input
            label="อีเมล"
            type="email"
            placeholder="you@email.com"
            error={errors.email?.message}
            {...register('email', {
              required: 'กรุณากรอกอีเมล',
              pattern: { value: EMAIL_PATTERN, message: 'รูปแบบอีเมลไม่ถูกต้อง' },
              onChange: hideServerErrorOnEdit,
            })}
          />

          <Input
            label="รหัสผ่าน"
            type="password"
            placeholder="อย่างน้อย 6 ตัวอักษร"
            error={errors.password?.message}
            {...register('password', {
              required: 'กรุณากรอกรหัสผ่าน',
              minLength: { value: 6, message: 'อย่างน้อย 6 ตัวอักษร' },
              onChange: hideServerErrorOnEdit,
            })}
          />

          <Input
            label="ยืนยันรหัสผ่าน"
            type="password"
            placeholder="กรอกซ้ำอีกครั้ง"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'กรุณายืนยันรหัสผ่าน',
              validate: (v) => v === pwd || 'รหัสผ่านไม่ตรงกัน',
              onChange: hideServerErrorOnEdit,
            })}
          />

          <Button type="submit" loading={loading}>
            {loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
          </Button>

          <Button type="button" variant="ghost" disabled={loading} onClick={() => navigate(-1)}>
            ย้อนกลับ
          </Button>
        </form>

        <div className="auth-divider">
          <span>หรือ</span>
        </div>

        {/* ✅ ปุ่ม Google จริง */}
        <div style={{ display: 'grid', justifyContent: 'center' }}>
          <div ref={googleBtnRef} />
        </div>

        <div className="auth-footer">
          มีบัญชีแล้ว? <Link to={isDriver ? '/driver/login' : '/login'}>เข้าสู่ระบบ</Link>
        </div>
      </div>
    </PageContainer>
  )
}
