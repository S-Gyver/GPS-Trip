import './Navbar.css'
import { NavLink } from 'react-router-dom'
import { useSession } from '../../../hooks/useSession.jsx'
import { useEffect, useRef, useState, useMemo } from 'react'

function safeParse(json) {
  try {
    return JSON.parse(json)
  } catch {
    return null
  }
}

function getLSUser() {
  return safeParse(localStorage.getItem('ts_user')) || null
}

export default function Navbar() {
  const { session, logout } = useSession()

  // ✅ ทุกคนเป็น user เหมือนกันหมด → เช็คแค่ login/token
  const isAuthed = !!session?.token

  // ✅ ดึง user จาก localStorage (เพื่อให้ navbar เปลี่ยนทันทีหลังแก้โปรไฟล์)
  const [lsUser, setLsUser] = useState(() => getLSUser())

  useEffect(() => {
    const sync = () => setLsUser(getLSUser())

    // แท็บเดียวกัน: เราจะ dispatch event นี้เองหลัง setItem
    window.addEventListener('ts_user_updated', sync)

    // คนละแท็บ: storage event จะทำงาน
    const onStorage = (e) => {
      if (e.key === 'ts_user') sync()
    }
    window.addEventListener('storage', onStorage)

    return () => {
      window.removeEventListener('ts_user_updated', sync)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  // ✅ รวม user: เอา localStorage มาก่อน (ล่าสุดสุด), ถ้าไม่มีค่อย fallback ไป session
  const mergedUser = useMemo(() => {
    return {
      ...(session?.user || {}),
      ...(lsUser || {}),
      name:
        (lsUser?.name || session?.user?.name || session?.name || '').trim() ||
        undefined,
      username:
        (lsUser?.username || session?.user?.username || '').trim() ||
        undefined,
      email: (lsUser?.email || session?.user?.email || session?.email || '').trim() || undefined,
    }
  }, [session, lsUser])

  // ✅ ชื่อที่แสดง (อันนี้คือมุมขวาบน)
  const displayName =
    mergedUser?.username ||
    mergedUser?.name ||
    mergedUser?.email ||
    'ผู้ใช้'

  // ===== dropdown states =====
  const [aboutOpen, setAboutOpen] = useState(false)
  const [serviceOpen, setServiceOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

  const aboutRef = useRef(null)
  const serviceRef = useRef(null)
  const userRef = useRef(null)

  const closeAll = () => {
    setAboutOpen(false)
    setServiceOpen(false)
    setUserOpen(false)
  }

  useEffect(() => {
    const onDoc = (e) => {
      const inAbout = aboutRef.current?.contains(e.target)
      const inService = serviceRef.current?.contains(e.target)
      const inUser = userRef.current?.contains(e.target)

      if (!inAbout) setAboutOpen(false)
      if (!inService) setServiceOpen(false)
      if (!inUser) setUserOpen(false)
    }

    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const handleLogout = () => {
    logout()
    closeAll()

    // กันเหนียว: ล้าง localStorage user ด้วย
    localStorage.removeItem('ts_user')
    window.dispatchEvent(new Event('ts_user_updated'))

    window.location.href = '/GPS-Trip/login'
  }

  // ✅ ปุ่มหลัก: ถ้า login แล้ว → ไปจองทริป, ไม่ login → หน้าแรก
  const primary = !isAuthed
    ? { to: '/', label: 'หน้าแรก' }
    : { to: '/booking', label: 'เริ่มจองทริป' }

  return (
    <header className="ts-nav">
      <div className="ts-nav__inner">
        {/* Brand */}
        <NavLink to="/" className="ts-nav__brand" onClick={closeAll}>
          TripSync
        </NavLink>

        <nav className="ts-nav__menu">
          {/* ปุ่มหลัก */}
          <NavLink to={primary.to} className="ts-nav__link" onClick={closeAll}>
            {primary.label}
          </NavLink>

          {/* ===== เกี่ยวกับเรา ▼ ===== */}
          <div className="ts-dd" ref={aboutRef}>
            <button
              type="button"
              className="ts-nav__link ts-dd__btn"
              onClick={() => {
                setAboutOpen((v) => !v)
                setServiceOpen(false)
                setUserOpen(false)
              }}
              aria-haspopup="menu"
              aria-expanded={aboutOpen ? 'true' : 'false'}
            >
              เกี่ยวกับเรา <span className="ts-dd__chev">▾</span>
            </button>

            {aboutOpen && (
              <div className="ts-dd__menu" role="menu">
                <NavLink to="/about/history" className="ts-dd__item" onClick={closeAll}>
                  ประวัติความเป็นมา
                </NavLink>
                <NavLink to="/about/management" className="ts-dd__item" onClick={closeAll}>
                  ผู้บริหาร (วิสัยทัศน์)
                </NavLink>
                <NavLink to="/news" className="ts-dd__item" onClick={closeAll}>
                  ข่าวสารประชาสัมพันธ์
                </NavLink>
                <NavLink to="/how-to-book" className="ts-dd__item" onClick={closeAll}>
                  แนะนำวิธีจองตั๋ว
                </NavLink>
              </div>
            )}
          </div>

          {/* ตารางเดินรถ */}
          <NavLink to="/schedule" className="ts-nav__link" onClick={closeAll}>
            ตารางเดินรถ
          </NavLink>

          {/* ===== บริการของเรา ▼ ===== */}
          <div className="ts-dd" ref={serviceRef}>
            <button
              type="button"
              className="ts-nav__link ts-dd__btn"
              onClick={() => {
                setServiceOpen((v) => !v)
                setAboutOpen(false)
                setUserOpen(false)
              }}
              aria-haspopup="menu"
              aria-expanded={serviceOpen ? 'true' : 'false'}
            >
              บริการของเรา <span className="ts-dd__chev">▾</span>
            </button>

            {serviceOpen && (
              <div className="ts-dd__menu" role="menu">
                <NavLink to="/services/tour-bus" className="ts-dd__item" onClick={closeAll}>
                  แนะนำรถทัวร์
                </NavLink>
                <NavLink to="/services/standards" className="ts-dd__item" onClick={closeAll}>
                  เปรียบเทียบรถแต่ละมาตรฐาน
                </NavLink>
                <NavLink to="/services/parcel" className="ts-dd__item" onClick={closeAll}>
                  บริการรับ-ส่งพัสดุ
                </NavLink>
                <NavLink to="/services/charter" className="ts-dd__item" onClick={closeAll}>
                  รถโดยสารเช่าเหมา
                </NavLink>
                <NavLink to="/services/luggage" className="ts-dd__item" onClick={closeAll}>
                  การนำสัมภาระขึ้นรถโดยสาร
                </NavLink>
              </div>
            )}
          </div>

          {/* ติดต่อเรา */}
          <NavLink to="/contact" className="ts-nav__link" onClick={closeAll}>
            ติดต่อเรา
          </NavLink>

          {/* ===== ขวาสุด: Login หรือเมนูผู้ใช้ ===== */}
          {!isAuthed ? (
            <button
              type="button"
              className="ts-nav__btn"
              onClick={() => {
                closeAll()
                window.location.href = '/GPS-Trip/login'
              }}
            >
              เข้าสู่ระบบ
            </button>
          ) : (
            <div className="ts-user" ref={userRef}>
              <button
                type="button"
                className="ts-nav__btn ts-user__btn"
                onClick={() => {
                  setUserOpen((v) => !v)
                  setAboutOpen(false)
                  setServiceOpen(false)
                }}
                aria-haspopup="menu"
                aria-expanded={userOpen ? 'true' : 'false'}
              >
                {displayName}
                <span className="ts-user__chev">▾</span>
              </button>

              {userOpen && (
                <div className="ts-user__menu" role="menu">
                  <NavLink to="/profile" className="ts-user__item" onClick={closeAll} role="menuitem">
                    ข้อมูลผู้ใช้
                  </NavLink>

                  <NavLink to="/trips" className="ts-user__item" onClick={closeAll} role="menuitem">
                    ทริปของฉัน
                  </NavLink>

                  <NavLink to="/notifications" className="ts-user__item" onClick={closeAll} role="menuitem">
                    การแจ้งเตือน
                  </NavLink>

                  <div className="ts-user__sep" />

                  <button type="button" className="ts-user__item danger" onClick={handleLogout} role="menuitem">
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
