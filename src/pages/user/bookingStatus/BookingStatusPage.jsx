import PageContainer from '../../../components/layout/PageContainer/PageContainer'
import './BookingStatusPage.css'
import { getSession } from '../../../services/auth.api'
import { getLatestBookingByUser, getBookingById } from '../../../services/booking.api'
import { useLocation, Link } from 'react-router-dom'

const statusMap = {
  PENDING_APPROVAL: { label: 'รอแอดมินอนุมัติ', tone: 'pending' },
  APPROVED: { label: 'อนุมัติแล้ว', tone: 'ok' },
  REJECTED: { label: 'ไม่อนุมัติ', tone: 'bad' },
}

export default function BookingStatusPage() {
  const location = useLocation()
  const session = getSession()

  const bookingId = location.state?.bookingId

  // priority: ถ้ามี bookingId ให้โชว์รายการนั้นก่อน
  let booking = null
  if (bookingId) booking = getBookingById(bookingId)

  // ถ้าไม่มี หรือหาไม่เจอ ให้ fallback เป็นรายการล่าสุดของ user
  if (!booking && session?.user?.id) {
    booking = getLatestBookingByUser(session.user.id)
  }

  const status = booking?.status || 'PENDING_APPROVAL'
  const tone = statusMap[status]?.tone || 'pending'
  const label = statusMap[status]?.label || status

  return (
    <PageContainer>
      <div className="bs-wrap">
        <div className="bs-head">
          <h1 className="bs-title">สถานะการจอง</h1>

          {/* ปุ่มลัดกลับไปดูทั้งหมด */}
          <Link className="bs-link" to="/trips">
            ดูทริปของฉัน
          </Link>
        </div>

        {!booking ? (
          <div className="bs-card">
            <p>ยังไม่มีการจอง</p>
            <div style={{ marginTop: 10 }}>
              <Link className="bs-link" to="/booking">
                ไปหน้าเริ่มจอง
              </Link>
            </div>
          </div>
        ) : (
          <div className="bs-card">
            <div className={`bs-badge bs-badge--${tone}`}>{label}</div>

            <div className="bs-meta">
              <div><b>ID:</b> {booking.id}</div>
              <div><b>สร้างเมื่อ:</b> {booking.createdAt ? new Date(booking.createdAt).toLocaleString() : '-'}</div>
            </div>

            <div className="bs-grid">
              <div><b>ประเภทรถ:</b> {booking.vehicleType}</div>
              <div><b>ทริป:</b> {booking.tripType}</div>
              <div><b>วันเดินทาง:</b> {booking.date}</div>
              <div><b>เวลา:</b> {booking.departTime}</div>
              <div><b>ผู้โดยสาร:</b> {booking.passengers}</div>
              <div><b>ติดต่อ:</b> {booking.contactPhone}</div>
              <div><b>จุดรับ:</b> {booking.pickup}</div>
              <div><b>จุดส่ง:</b> {booking.dropoff}</div>
            </div>

            {booking.note && (
              <div className="bs-note">
                <b>หมายเหตุ:</b> {booking.note}
              </div>
            )}
          </div>
        )}
      </div>
    </PageContainer>
  )
}
