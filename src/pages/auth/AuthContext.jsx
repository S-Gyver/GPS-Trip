import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)       // { id, name, email ... }
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // โหลดจาก localStorage ตอนเปิดเว็บ
    const raw = localStorage.getItem('ts_user')
    setUser(raw ? JSON.parse(raw) : null)
    setLoading(false)
  }, [])

  const signIn = (payload) => {
    // payload ควรมี user + token (ถ้ามี)
    if (payload?.token) localStorage.setItem('ts_token', payload.token)
    if (payload?.user) {
      localStorage.setItem('ts_user', JSON.stringify(payload.user))
      setUser(payload.user)
    }
  }

  const signOut = () => {
    localStorage.removeItem('ts_token')
    localStorage.removeItem('ts_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
