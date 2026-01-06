// src/pages/auth/LoginPage.jsx
import PageContainer from '../../components/layout/PageContainer/PageContainer'
import Input from '../../components/ui/Input/Input'
import Button from '../../components/ui/Button/Button'
import './LoginPage.css'

import { useForm } from 'react-hook-form'
import { Link, useLocation } from 'react-router-dom'
import { useLoginLogic } from './useAuthForm'

export default function LoginPage() {
  const location = useLocation()
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '' },
  })

  // ฟังก์ชันเปลี่ยนหน้า (Hard Redirect)
  const hardRedirect = (path) => {
    // ลบ /GPS-Trip/ ออกถ้ามี เพื่อความชัวร์
    const cleanPath = path.replace('/GPS-Trip', '')
    window.location.href = cleanPath
  }

  const { loading, error, submit } = useLoginLogic({
    onSuccess: (session) => {
      console.log('✅ Login Success! Role:', session?.user?.role)
      const role = session?.user?.role || 'user'
      
      if (role === 'admin') {
  // ✅ ถ้าเป็น Admin -> ไป Dashboard
  hardRedirect('/admin/dashboard') 
} else if (role === 'driver') {
  // 🚙 ถ้าเป็นคนขับ -> ไป Profile
  hardRedirect('/profile') 
} else {
  // 👤 ถ้าเป็น User ทั่วไป -> ไป Booking
  hardRedirect('/booking')
      }
    },
  })

  // ฟังก์ชันนี้ทำงานเมื่อกดปุ่ม Submit และข้อมูลถูกต้อง
  const onSubmit = async (data) => {
    console.log('🚀 กำลังส่งข้อมูล...', data)
    if (loading) return
    
    // ส่งค่าไปล็อกอิน (ส่ง key username แทน email เพื่อให้ backend รับได้)
    await submit({
      username: (data.email || '').trim(), 
      password: data.password || '',
    })
  }

  // ฟังก์ชันนี้ทำงานเมื่อกดปุ่ม Submit แต่ข้อมูล "ไม่ผ่าน" (เช่น ลืมกรอก)
  const onError = (err) => {
    console.log('❌ Validation Error:', err)
    alert('กรุณากรอก ชื่อผู้ใช้ และ รหัสผ่าน ให้ครบถ้วน')
  }

  return (
    <PageContainer>
      <div className="auth-card">
        <h1 className="auth-title">เข้าสู่ระบบ</h1>
        <p className="auth-sub">TripSync Login</p>

        {/* แสดง Error จาก Backend */}
        {error && (
          <div className="auth-alert" style={{color:'red', border:'1px solid red', background:'#fff0f0'}}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit, onError)} className="auth-form">
          
          <Input 
            label="ชื่อผู้ใช้ / อีเมล" 
            type="text"
            {...register('email', { required: 'กรุณากรอกชื่อผู้ใช้' })} 
            placeholder="admin"
            error={errors.email?.message} // แสดงข้อความแดงๆ ถ้าลืมกรอก
          />
          
          <Input 
            label="รหัสผ่าน" 
            type="password" 
            {...register('password', { required: 'กรุณากรอกรหัสผ่าน' })} 
            error={errors.password?.message}
          />
          
          {/* ✅ ปุ่มนี้คือปุ่มที่ต้องกดครับ */}
          <Button 
            type="submit" 
            loading={loading} 
            style={{ marginTop: '10px', width: '100%', height: '45px', fontSize: '16px' }}
          >
            เข้าสู่ระบบ (กดตรงนี้)
          </Button>

        </form>

        <div className="auth-footer">
          ยังไม่มีบัญชี? <Link to="/register">สมัครสมาชิก</Link>
        </div>
      </div>
    </PageContainer>
  )
}