// src/pages/auth/RegisterPage.jsx
import PageContainer from '../../components/layout/PageContainer/PageContainer'
import Input from '../../components/ui/Input/Input'
import Button from '../../components/ui/Button/Button'
import './RegisterPage.css'

import Swal from 'sweetalert2'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useRegisterLogic } from './useAuthForm'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/

export default function RegisterPage() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  // ✅ ตัด Google ออก เหลือแค่ submit
  const { loading, error, submit } = useRegisterLogic()

  const password = watch('password')
  const busy = loading || isSubmitting

  const onSubmit = async (data) => {
    if (busy) return

    const res = await submit({
      username: (data.username || '').trim(),
      email: (data.email || '').trim().toLowerCase(),
      password: data.password,
      confirmPassword: data.confirmPassword,
    })

    if (res) {
      await Swal.fire({
        icon: 'success',
        title: 'สมัครสมาชิกสำเร็จ',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#16a34a',
      })

      navigate('/booking', { replace: true })
    }
  }

  return (
    <PageContainer>
      <div className="auth-card" aria-busy={busy}>
        <h1 className="auth-title">สมัครสมาชิก</h1>
        <p className="auth-sub">สมัครเป็นผู้ใช้งาน TripSync</p>

        {error && <div className="auth-alert">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
          <Input
            label="ชื่อผู้ใช้"
            placeholder="เช่น boy_123"
            autoComplete="username"
            {...register('username', {
              required: 'กรุณากรอกชื่อผู้ใช้',
              minLength: { value: 3, message: 'อย่างน้อย 3 ตัวอักษร' },
              maxLength: { value: 20, message: 'ไม่เกิน 20 ตัวอักษร' },
              pattern: { value: USERNAME_PATTERN, message: 'ใช้ได้เฉพาะ a-z, A-Z, 0-9 และ _' },
            })}
            error={errors.username?.message}
          />

          <Input
            label="อีเมล"
            placeholder="name@email.com"
            autoComplete="email"
            inputMode="email"
            {...register('email', {
              required: 'กรุณากรอกอีเมล',
              pattern: { value: EMAIL_PATTERN, message: 'รูปแบบอีเมลไม่ถูกต้อง' },
            })}
            error={errors.email?.message}
          />

          <Input
            label="รหัสผ่าน"
            type="password"
            placeholder="อย่างน้อย 8 ตัวอักษร"
            autoComplete="new-password"
            {...register('password', {
              required: 'กรุณากรอกรหัสผ่าน',
              minLength: { value: 8, message: 'รหัสผ่านต้องอย่างน้อย 8 ตัวอักษร' },
            })}
            error={errors.password?.message}
          />

          <Input
            label="ยืนยันรหัสผ่าน"
            type="password"
            placeholder="พิมพ์รหัสผ่านเดิมอีกครั้ง"
            autoComplete="new-password"
            {...register('confirmPassword', {
              required: 'กรุณายืนยันรหัสผ่าน',
              validate: (v) => v === password || 'รหัสผ่านไม่ตรงกัน',
            })}
            error={errors.confirmPassword?.message}
          />

          <Button type="submit" loading={busy} disabled={busy || !isValid}>
            สมัครสมาชิก
          </Button>
        </form>

        {/* ✅ ลบส่วนสมัครด้วย Google ออกแล้ว */}
        <div className="auth-footer">
          มีบัญชีแล้ว? <Link to="/login">เข้าสู่ระบบ</Link>
        </div>
      </div>
    </PageContainer>
  )
}
