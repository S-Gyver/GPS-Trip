import PageContainer from '../../components/layout/PageContainer/PageContainer'
import { useSession } from '../../hooks/useSession'
import { Link } from 'react-router-dom'

export default function DriverDashboard() {
  const { session } = useSession()
  const name = session?.user?.name || session?.user?.email || 'คนขับ'

  return (
    <PageContainer>
      <div style={{ maxWidth: 900, margin: '24px auto' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>
          👋 สวัสดี {name}
        </h1>
        <p style={{ color: '#6b7280', marginBottom: 16 }}>
          หน้านี้คือ Driver Dashboard (Phase 1 ทำเป็นหน้าโครงก่อน)
        </p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link
            to="/booking"
            style={{
              padding: '10px 14px',
              borderRadius: 14,
              border: '1px solid #e5e7eb',
              textDecoration: 'none',
              fontWeight: 700,
              color: '#111827',
              background: '#fff',
            }}
          >
            ไปหน้า Booking (user)
          </Link>

          <Link
            to="/driver/dashboard"
            style={{
              padding: '10px 14px',
              borderRadius: 14,
              border: '1px solid #e5e7eb',
              textDecoration: 'none',
              fontWeight: 700,
              color: '#111827',
              background: '#fff',
            }}
          >
            รีเฟรชหน้า Driver
          </Link>
        </div>
      </div>
    </PageContainer>
  )
}
