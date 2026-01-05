import PageContainer from '../../components/layout/PageContainer/PageContainer'
import Input from '../../components/ui/Input/Input'
import Button from '../../components/ui/Button/Button'
import './LoginPage.css'

import { useForm } from 'react-hook-form'
import { Link, useLocation } from 'react-router-dom'
import { useLoginLogic } from './useAuthForm'

export default function LoginPage() {
  const location = useLocation()

  const from =
    location.state?.from?.pathname ||
    (typeof location.state?.from === 'string' ? location.state.from : null) ||
    '/booking'

  const { register, handleSubmit } = useForm({
    mode: 'onBlur',
    defaultValues: { email: '', password: '' },
  })

  const hardRedirect = (path) => {
    const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
    const clean = String(path || '/').replace(/^\//, '')
    window.location.assign(`${base}/${clean}`)
  }

  const { loading, error, submit } = useLoginLogic({
    onSuccess: () => hardRedirect(from),
  })

  const onSubmit = async (data) => {
    if (loading) return
    return submit({
      email: (data.email || '').trim().toLowerCase(),
      password: data.password || '',
    })
  }

  return (
    <PageContainer>
      <div className="auth-card" aria-busy={loading}>
        <h1 className="auth-title">เข้าสู่ระบบ</h1>
        <p className="auth-sub">สำหรับผู้ใช้งาน TripSync</p>

        {error && <div className="auth-alert">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <Input label="อีเมล" {...register('email', { required: true })} />
          <Input label="รหัสผ่าน" type="password" {...register('password', { required: true })} />
          <Button type="submit" loading={loading}>
            เข้าสู่ระบบ
          </Button>
        </form>

        <div className="auth-footer">
          ยังไม่มีบัญชี? <Link to="/register">สมัครสมาชิก</Link>
        </div>
      </div>
    </PageContainer>
  )
}
