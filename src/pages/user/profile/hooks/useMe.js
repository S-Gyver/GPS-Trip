import { useEffect } from 'react'
import { saveToTsUser, updateOriginalSession } from '../utils/sessionStore'
import { toPublicUrl } from '../utils/toPublicUrl'

const API_BASE = 'http://localhost/tripsync_api'

export function useMe({ navigate, stored, setSessionUser, setForm, setErr, setMsg }) {
  useEffect(() => {
    let mounted = true

    async function loadMe() {
      setErr('')
      setMsg('')
      try {
        const res = await fetch(`${API_BASE}/api/auth/me.php`, { credentials: 'include' })
        const data = await res.json()

        if (!mounted) return

        if (!data?.authed || !data?.user?.id) {
          navigate('/login', { replace: true })
          return
        }

        const u = data.user
        setSessionUser(u)

        setForm((s) => ({
          ...s,
          username: u.username || u.name || '',
          email: u.email || '',
          phone: u.phone || '',
          gender: u.gender || 'none',
          birthDay: u.birth_day || '',
          birthMonth: u.birth_month || '',
          birthYear: u.birth_year || '',
          avatarPath: u.avatar || '',
          avatarDataUrl: toPublicUrl(u.avatar) || '',
        }))

        const nextUser = {
          id: u.id,
          role: u.role || 'user',
          name: u.username || '',
          username: u.username || '',
          email: u.email || '',
          phone: u.phone || '',
          gender: u.gender || 'none',
          birth_day: u.birth_day || null,
          birth_month: u.birth_month || null,
          birth_year: u.birth_year || null,
          avatar: u.avatar || '',
          avatarDataUrl: toPublicUrl(u.avatar) || '',
        }

        saveToTsUser(nextUser)
        updateOriginalSession(stored, nextUser)
        window.dispatchEvent(new Event('ts_user_updated'))
      } catch (e) {
        if (!mounted) return
        setErr(e?.message || 'โหลดข้อมูลผู้ใช้ไม่สำเร็จ')
      }
    }

    loadMe()
    return () => {
      mounted = false
    }
  }, [])
}
