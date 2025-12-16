import PageContainer from '../../components/layout/PageContainer/PageContainer'
import Input from '../../components/ui/Input/Input'
import Button from '../../components/ui/Button/Button'
import './LoginPage.css'

import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLoginLogic } from './useAuthForm'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()

  // 🔸 หน้าที่ควรกลับไปหลัง login
  const from = location.state?.from || '/booking'

  // เดา role จาก path: /driver/login = driver, อื่นๆ = user
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
    onSuccess: () => {
      navigate(from, { replace: true })
    },
  })

  const onSubmit = async (data) => {
    if (loading) return
    const payload = { ...data, email: (data.email || '').trim().toLowerCase() }
    return submit({ ...payload, role })
  }

  const goUser = () => navigate('/login')
  const goDriver = () => navigate('/driver/login')

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
              validate: (v) => v.trim().length > 0 || 'กรุณากรอกอีเมล',
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

          <button
            type="button"
            className="google-login-btn"
            onClick={() => handleGoogleLogin({ role })}
            disabled={loading}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="google-icon"
            />
            <span>เข้าสู่ระบบด้วย Google</span>
          </button>

          <div className="auth-footer">
            ยังไม่มีบัญชี?{' '}
            <Link to={isDriver ? '/driver/register' : '/register'}>สมัครสมาชิก</Link>
          </div>
        </form>
      </div>
    </PageContainer>
  )
}
