import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer/PageContainer'
import Button from '../../components/ui/Button/Button'
import Input from '../../components/ui/Input/Input'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  // ใช้ username แทน email เพื่อให้สื่อความหมายว่ากรอกชื่อ "admin" ได้
  const [form, setForm] = useState({ username: '', password: '' }) 
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // ✅ เรียกใช้ login_local.php ตัวเดียวกับ User ทั่วไป (ที่เราเพิ่งแก้ให้รับ username ได้)
      const res = await fetch('http://localhost/tripsync_api/api/auth/login_local.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include',
      })
      const json = await res.json()

      if (json.ok) {
        // ✅ เช็ค Role ตรงนี้
        const role = json.user.role // 'admin', 'user', 'driver'

        if (role === 'admin') {
          // ถ้าเป็น Admin -> ไป Dashboard
          // window.location.href ช่วยให้ refresh state ทั้งหมด (ชัวร์สุดสำหรับ admin)
          window.location.href = '/admin/dashboard'
        } else {
          // ถ้าไม่ใช่ Admin -> แจ้งเตือน
          setError('บัญชีนี้ไม่มีสิทธิ์เข้าถึงส่วนผู้ดูแลระบบ (Role: ' + role + ')')
        }
      } else {
        setError(json.message || 'เข้าสู่ระบบไม่สำเร็จ')
      }
    } catch (err) {
      setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContainer>
      <div style={{ 
        maxWidth: 400, 
        margin: '60px auto', 
        padding: 30, 
        borderRadius: 24, 
        background: '#fff',
        boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
        border: '1px solid #eee'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 24, color: '#111' }}>Admin Portal</h1>
          <p style={{ margin: '8px 0 0', color: '#666' }}>เข้าสู่ระบบผู้ดูแลระบบ</p>
        </div>
        
        {error && (
          <div style={{ 
            background: '#fee2e2', color: '#b91c1c', 
            padding: '12px', borderRadius: '12px', 
            marginBottom: '20px', fontSize: '14px', fontWeight: 600, textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={onLogin} style={{ display: 'grid', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 700, fontSize: 13 }}>ชื่อผู้ใช้ / อีเมล</label>
            <Input name="username" value={form.username} onChange={onChange} placeholder="เช่น admin" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 700, fontSize: 13 }}>รหัสผ่าน</label>
            <Input type="password" name="password" value={form.password} onChange={onChange} placeholder="••••••••" />
          </div>
          
          <Button type="submit" disabled={loading} style={{ marginTop: 8, width: '100%' }}>
            {loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
          </Button>
        </form>
      </div>
    </PageContainer>
  )
}