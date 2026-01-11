import './Navbar.css'
import { NavLink, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()

  const isAuthed = !!session?.token
  const [lsUser, setLsUser] = useState(() => getLSUser())

  useEffect(() => {
    const sync = () => setLsUser(getLSUser())
    window.addEventListener('ts_user_updated', sync)
    const onStorage = (e) => {
      if (e.key === 'ts_user') sync()
    }
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('ts_user_updated', sync)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

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

  const displayName =
    mergedUser?.username ||
    mergedUser?.name ||
    mergedUser?.email ||
    'ผู้ใช้'

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
    localStorage.removeItem('ts_user')
    window.dispatchEvent(new Event('ts_user_updated'))
    navigate('/login')
  }

  const primary = !isAuthed
    ? { to: '/', label: 'หน้าแรก' }
    : { to: '/booking', label: 'เริ่มจองทริป' }

  return (
    <header className="ts-nav">
      <div className="ts-nav__inner">
        <NavLink to="/" className="ts-nav__brand" onClick={closeAll}>
          TripSync
        </NavLink>

        <nav className="ts-nav__menu">
          <NavLink to={primary.to} className="ts-nav__link" onClick={closeAll}>
            {primary.label}
          </NavLink>

          {/* ✅✅✅ เหลือแค่ "ขอร่วมทาง" อันเดียวครับ (ลบตารางงานรถออกแล้ว) */}
          <NavLink to="/join-trips" className="ts-nav__link" onClick={closeAll}>
            ขอร่วมทาง
          </NavLink>
          {/* ==================================== */}

          {/* --- Dropdown เกี่ยวกับเรา --- */}
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

          {/* --- Dropdown บริการของเรา --- */}
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

          <NavLink to="/contact" className="ts-nav__link" onClick={closeAll}>
            ติดต่อเรา
          </NavLink>

          {/* --- ส่วน User / Login --- */}
          {!isAuthed ? (
            <button
              type="button"
              className="ts-nav__btn"
              onClick={() => {
                closeAll()
                navigate('/login')
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