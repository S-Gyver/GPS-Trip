// src/routes/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom'
import { useSession } from '../hooks/useSession.jsx'

export default function ProtectedRoute({ children }) {
  const { session, loading } = useSession()
  const location = useLocation()

  if (loading) return null

  // ✅ รองรับทั้งแบบเก่า (session.token) และแบบใหม่ (session.user.id)
  const isLoggedIn = !!(session?.token || session?.user?.id || session?.id)

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
