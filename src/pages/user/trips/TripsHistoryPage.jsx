import PageContainer from '../../../components/layout/PageContainer/PageContainer'
import './TripsHistoryPage.css'
import { getSession } from '../../../services/auth.api'
import { getBookingsByUser } from '../../../services/booking.api'
import { useNavigate } from 'react-router-dom'

const statusLabel = {
  PENDING_APPROVAL: 'รอแอดมินอนุมัติ',
  APPROVED: 'อนุมัติแล้ว',
  REJECTED: 'ไม่อนุมัติ',
}

export default function TripsHistoryPage() {
  const navigate = useNavigate()
  const session = getSession()
  const userId = session?.user?.id

  const trips = userId ? getBookingsByUser(userId) : []

  return (
    <PageContainer>
      <div className="th-wrap">
        <h1 className="th-title">ทริปของฉัน</h1>
        <p className="th-sub">รายการการจองทั้งหมดของคุณ</p>

        {!userId ? (
          <div className="th-card">กรุณาเข้าสู่ระบบก่อน</div>
        ) : trips.length === 0 ? (
          <div className="th-card">ยังไม่มีการจอง</div>
        ) : (
          <div className="th-list">
            {trips.map((t) => (
              <button
                key={t.id}
                className="th-item"
                onClick={() => navigate('/booking/status', { state: { bookingId: t.id } })}
              >
                <div className="th-row">
                  <div className="th-badge">{statusLabel[t.status] || t.status}</div>
                  <div className="th-id">{t.id}</div>
                </div>

                <div className="th-grid">
                  <div><b>รถ:</b> {t.vehicleType}</div>
                  <div><b>ทริป:</b> {t.tripType}</div>
                  <div><b>วัน:</b> {t.date}</div>
                  <div><b>เวลา:</b> {t.departTime}</div>
                  <div><b>จุดรับ:</b> {t.pickup}</div>
                  <div><b>จุดส่ง:</b> {t.dropoff}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  )
}
