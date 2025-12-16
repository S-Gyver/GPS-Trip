import PageContainer from '../../components/layout/PageContainer/PageContainer'
import Input from '../../components/ui/Input/Input'
import Button from '../../components/ui/Button/Button'
import './RegisterPage.css'

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

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
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

  const onSubmit = async (data) => {
    if (loading) return

    const payload = {
      ...data,
      role, // 👈 สำคัญ
      name: (data.name || '').trim(),
      email: (data.email || '').trim().toLowerCase(),
    }

    return submit(payload)
  }

  const goUser = () => navigate('/register')
  const goDriver = () => navigate('/driver/register')

  return (
    <PageContainer>
      <div className="auth-card" aria-busy={loading}>
        <h1 className="auth-title">สมัครสมาชิก</h1>
        <p className="auth-sub">
          {isDriver ? 'สมัครสำหรับคนขับ TripSync' : 'สมัครสำหรับผู้ใช้งาน TripSync'}
        </p>

        {/* ===== role switch ===== */}
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

        {error && <div className="auth-alert">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form className="auth-form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="ชื่อผู้ใช้งาน"
            placeholder="เช่น Boy"
            error={errors.name?.message}
            {...register('name', {
              required: 'กรุณากรอกชื่อ',
              validate: (v) => v.trim().length > 0 || 'กรุณากรอกชื่อ',
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
            })}
          />

          <Button type="submit" loading={loading}>
            {loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
          </Button>

          <Button
            type="button"
            variant="ghost"
            disabled={loading}
            onClick={() => window.history.back()}
          >
            ย้อนกลับ
          </Button>
        </form>

        <div className="auth-divider">
          <span>หรือ</span>
        </div>

        {/* ===== Google ===== */}
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
          <span>สมัคร / เข้าสู่ระบบด้วย Google</span>
        </button>

        <div className="auth-footer">
          มีบัญชีแล้ว?{' '}
          <Link to={isDriver ? '/driver/login' : '/login'}>เข้าสู่ระบบ</Link>
        </div>
      </div>
    </PageContainer>
  )
}
