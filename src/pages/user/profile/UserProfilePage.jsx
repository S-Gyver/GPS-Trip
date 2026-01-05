import { useMemo, useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom' // ✅ 1. เพิ่ม useSearchParams
import PageContainer from '../../../components/layout/PageContainer/PageContainer'
import Button from '../../../components/ui/Button/Button'

import AccountSection from './sections/AccountSection'
import TripsSection from './sections/TripsSection'
import AddressSection from './sections/AddressSection'
import PasswordSection from './sections/PasswordSection'
import NotificationsSection from './sections/NotificationsSection'
import DriverApplySection from './sections/DriverApplySection'

import { getSessionUser } from './utils/sessionStore'
import { useMe } from './hooks/useMe'
import { useLogout } from './hooks/useLogout'
import { useProfileSave } from './hooks/useProfileSave'
import { useAvatarUpload } from './hooks/useAvatarUpload'

import './UserProfilePage.css'

const SIDEBAR_ITEMS = [
  { key: 'account', label: 'บัญชีของฉัน', icon: '👤' },
  { key: 'history', label: 'ทริปของฉัน', icon: '🧾' },
  { key: 'address', label: 'ที่อยู่', icon: '🏠' },
  { key: 'password', label: 'เปลี่ยนรหัสผ่าน', icon: '🔒' },
  { key: 'notify', label: 'ตั้งค่าการแจ้งเตือน', icon: '🔔' },
  { key: 'driver_apply', label: 'สมัครเป็นคนขับ', icon: '🚗' },
]
const SIDEBAR_ACTIONS = [{ key: 'logout', label: 'ออกจากระบบ', icon: '🚪' }]

export default function UserProfilePage() {
  const navigate = useNavigate()
  
  // ✅ 2. เปลี่ยนจาก useState มาใช้ useSearchParams
  const [searchParams, setSearchParams] = useSearchParams()
  // ถ้าใน URL ไม่มี ?tab=... ให้ default เป็น 'account'
  const active = searchParams.get('tab') || 'account'

  const stored = useMemo(() => getSessionUser(), [])

  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [sessionUser, setSessionUser] = useState(null)

  const [form, setForm] = useState({
    username: '',
    email: '',
    phone: '',
    gender: 'none',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    avatarDataUrl: '',
    avatarPath: '',
  })

  useMe({ navigate, stored, setSessionUser, setForm, setErr, setMsg })

  const onChange = (e) => {
    setMsg('')
    setErr('')
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  const onLogout = useLogout({ navigate, stored })

  const onSave = useProfileSave({
    sessionUser,
    form,
    stored,
    setSessionUser,
    setMsg,
    setErr,
    setSaving,
  })

  const { fileRef, uploadingAvatar, onPickImage, onFileChange } = useAvatarUpload({
    sessionUser,
    form,
    stored,
    setForm,
    setSessionUser,
    setMsg,
    setErr,
  })

  // ✅ 3. ฟังก์ชันเปลี่ยน Tab (จะเปลี่ยน URL ด้านบน)
  const handleTabChange = (key) => {
    setMsg('') 
    setErr('')
    setSearchParams({ tab: key }) // เปลี่ยน URL เป็น ?tab=xxx
  }

  const displayName = (sessionUser?.username || '').trim() || (form.username || '').trim() || 'ผู้ใช้ TripSync'

  return (
    <PageContainer>
      <div className="up-layout">
        <aside className="up-side">
          <div className="up-user">
            <div className="up-user-avatar">
              {form.avatarDataUrl ? <img src={form.avatarDataUrl} alt="avatar" /> : <div className="up-user-avatar-fallback">TS</div>}
            </div>

            <div className="up-user-meta">
              <div className="up-user-name">{displayName}</div>
              <div className="up-user-edit">แก้ไขข้อมูลส่วนตัว</div>
            </div>
          </div>

          <nav className="up-nav">
            <div className="up-nav-title">เมนู</div>

            {SIDEBAR_ITEMS.map((it) => (
              <button
                key={it.key}
                type="button"
                className={`up-nav-item ${active === it.key ? 'is-active' : ''}`}
                onClick={() => handleTabChange(it.key)} 
              >
                <span className="up-nav-ic">{it.icon}</span>
                {it.label}
              </button>
            ))}

            <div className="up-nav-sep" />

            <div className="up-nav-title">บัญชี</div>
            {SIDEBAR_ACTIONS.map((it) => (
              <button key={it.key} type="button" className="up-nav-item is-danger" onClick={onLogout}>
                <span className="up-nav-ic">{it.icon}</span>
                {it.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="up-main">
          <div className="up-card">
            <div className="up-head">
              <h1 className="up-title">ข้อมูลของฉัน</h1>
              <p className="up-sub">จัดการข้อมูลส่วนตัวเพื่อความปลอดภัยของบัญชีผู้ใช้</p>
            </div>

            <div className="up-divider" />

            {(err || msg) && <div className={`up-alert ${err ? 'is-error' : 'is-ok'}`}>{err || msg}</div>}

            <form className="up-grid" onSubmit={onSave}>
              <section className="up-form">
                {active === 'account' && <AccountSection form={form} onChange={onChange} />}
                {active === 'history' && <TripsSection />}
                {active === 'address' && <AddressSection />}
                {active === 'password' && <PasswordSection />}
                {active === 'notify' && <NotificationsSection />}
                {active === 'driver_apply' && <DriverApplySection onGoRegister={() => navigate('/driver/register')} />}

                {active === 'account' && (
                  <div className="up-actions">
                    <Button type="submit" loading={saving}>
                      บันทึก
                    </Button>
                  </div>
                )}
              </section>

              <aside className="up-avatar">
                <div className="up-avatar-circle">
                  {form.avatarDataUrl ? <img src={form.avatarDataUrl} alt="avatar" /> : <div className="up-avatar-fallback">TripSync</div>}
                </div>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  style={{ display: 'none' }}
                  onChange={onFileChange}
                />

                <button type="button" className="up-pick" onClick={onPickImage} disabled={uploadingAvatar}>
                  {uploadingAvatar ? 'กำลังอัปโหลด...' : 'เลือกรูป'}
                </button>

                <div className="up-hint">
                  ขนาดไฟล์: สูงสุด 1 MB
                  <br />
                  ไฟล์ที่รองรับ: .JPEG, .PNG
                </div>
              </aside>
            </form>
          </div>
        </main>
      </div>
    </PageContainer>
  )
}