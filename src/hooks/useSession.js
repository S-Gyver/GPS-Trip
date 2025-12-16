import { useEffect, useState, useCallback } from 'react'
import { getSession, clearSession } from '../services/auth.api'

export function useSession() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    setSession(getSession())
    setLoading(false)
  }, [])

  useEffect(() => {
    // ✅ โหลด session ครั้งแรก
    refresh()

    // ✅ อัปเดตทันทีเมื่อ login/logout ในแท็บเดียวกัน
    const onSessionChanged = () => refresh()

    // ✅ เผื่อเปิดหลายแท็บ (เช็คเฉพาะ key ที่เกี่ยวข้องได้ ถ้าอยากเข้มขึ้น)
    const onStorage = () => refresh()

    window.addEventListener('session_changed', onSessionChanged)
    window.addEventListener('storage', onStorage)

    return () => {
      window.removeEventListener('session_changed', onSessionChanged)
      window.removeEventListener('storage', onStorage)
    }
  }, [refresh])

  const logout = () => {
    clearSession() // ยิง event ให้อัตโนมัติแล้ว
    // กันกรณีบาง browser/โค้ดไม่ยิง event: อัปเดตให้ชัวร์
    refresh()
  }

  return { session, loading, logout }
}
