// src/hooks/useSession.jsx
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { getSession, clearSession } from '../services/auth.api'

const SessionContext = createContext(null)
const SESSION_KEY = 'tripsync_session' // ✅ ถ้า auth.api ใช้ key อื่น เปลี่ยนตรงนี้ให้ตรง

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    try {
      const s = getSession()
      setSession(s || null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // ✅ โหลดครั้งแรก
    refresh()

    // ✅ อัปเดตทันทีเมื่อ login/logout ในแท็บเดียวกัน
    const onSessionChanged = () => refresh()

    // ✅ หลายแท็บ: refresh เฉพาะตอน key เราเปลี่ยน
    const onStorage = (e) => {
      if (e?.key && e.key !== SESSION_KEY) return
      refresh()
    }

    window.addEventListener('session_changed', onSessionChanged)
    window.addEventListener('storage', onStorage)

    return () => {
      window.removeEventListener('session_changed', onSessionChanged)
      window.removeEventListener('storage', onStorage)
    }
  }, [refresh])

  const logout = useCallback(() => {
    clearSession() // ควรยิง event session_changed อยู่แล้ว
    refresh() // กันบางเคสไม่ยิง
  }, [refresh])

  const value = useMemo(() => ({ session, loading, refresh, logout }), [session, loading, refresh, logout])

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) {
    return { session: null, loading: false, refresh: () => {}, logout: () => {} }
  }
  return ctx
}
