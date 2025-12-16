import { Navigate, useLocation } from 'react-router-dom'
import { useSession } from '../hooks/useSession'

export default function ProtectedRoute({ allow = [], children }) {
  const { session, loading } = useSession()   // ✅ ต้องมีบรรทัดนี้
  const location = useLocation()

  // 🔸 รอ session โหลดก่อน
  if (loading) {
    return null
  }

  // 🔸 ยังไม่ login
  if (!session?.token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  const role = session?.user?.role || 'user'

  // 🔸 role ไม่ตรง
  if (allow.length && !allow.includes(role)) {
    const fallback =
      role === 'driver'
        ? '/driver/jobs'
        : role === 'admin'
        ? '/admin'
        : '/booking'

    return <Navigate to={fallback} replace />
  }

  return children
}
