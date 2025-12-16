import './Navbar.css'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSession } from '../../../hooks/useSession'
import { useEffect, useRef, useState } from 'react'

export default function Navbar() {
  // =========================
  // 1) ดึง session และฟังก์ชัน logout จากระบบ session ของแอป
  // =========================
  const { session, logout } = useSession()
  const navigate = useNavigate()

  // =========================
  // 2) state สำหรับควบคุม dropdown (เปิด / ปิด)
  // =========================
  const [open, setOpen] = useState(false)

  // ref ใช้ตรวจว่าคลิกนอก dropdown หรือไม่
  const ddRef = useRef(null)

  // =========================
  // 3) ปิด dropdown อัตโนมัติเมื่อคลิกนอกกรอบ
  // =========================
  useEffect(() => {
    const onDoc = (e) => {
      if (!ddRef.current) return
      if (!ddRef.current.contains(e.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  // =========================
  // 4) ออกจากระบบ
  // - ล้าง session
  // - ปิด dropdown
  // - redirect ไปหน้า login
  // =========================
  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/login')
  }

  // =========================
  // 5) กำหนด "ชื่อที่แสดงบน Navbar"
  // 👉 เป้าหมาย: ใช้ชื่อผู้ใช้เท่านั้น (ไม่ใช้ email)
  // =========================
  const displayName =
  session?.user?.name ||     // ชื่อผู้ใช้ (หลัก)
  session?.name ||           // บางระบบส่ง name มาแบบนี้
  session?.user?.email ||    // fallback เป็น email
  session?.email ||          // fallback เผื่อโครงสร้างต่าง
  'ผู้ใช้'                   // กันพัง

  return (
    <header className="ts-nav">
      <div className="ts-nav__inner">
        {/* =========================
            6) โลโก้ / ชื่อเว็บ
        ========================= */}
        <NavLink to="/" className="ts-nav__brand">
          TripSync
        </NavLink>

        {/* =========================
            7) เมนูด้านขวา
        ========================= */}
        <nav className="ts-nav__menu">
          <NavLink to="/booking" className="ts-nav__link">
            เริ่มจอง
          </NavLink>

          <NavLink to="/trips" className="ts-nav__link">
            ทริปของฉัน
          </NavLink>

          {/* =========================
              8) ถ้ายังไม่ login → ปุ่มเข้าสู่ระบบ
              ถ้า login แล้ว → ชื่อผู้ใช้ + dropdown
          ========================= */}
          {!session ? (
            <NavLink to="/login" className="ts-nav__btn">
              เข้าสู่ระบบ
            </NavLink>
          ) : (
            <div className="ts-user" ref={ddRef}>
              {/* ปุ่มชื่อผู้ใช้ */}
              <button
                type="button"
                className="ts-nav__btn ts-user__btn"
                onClick={() => setOpen(v => !v)}
                aria-haspopup="menu"
                aria-expanded={open ? 'true' : 'false'}
              >
                {displayName}
                <span className="ts-user__chev">▾</span>
              </button>

              {/* dropdown */}
              {open && (
                <div className="ts-user__menu" role="menu">
                  <button
                    type="button"
                    className="ts-user__item"
                    onClick={() => {
                      setOpen(false)
                      navigate('/profile')
                    }}
                    role="menuitem"
                  >
                    โปรไฟล์
                  </button>

                  <button
                    type="button"
                    className="ts-user__item danger"
                    onClick={handleLogout}
                    role="menuitem"
                  >
                    ออกจากระบบ
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
