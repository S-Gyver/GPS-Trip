import PageContainer from '../../components/layout/PageContainer/PageContainer'
import './AdminDashboardPage.css'
import { useAdminBookings } from './useAdminBookings'

const statusText = {
  PENDING_APPROVAL: 'รออนุมัติ',
  APPROVED: 'อนุมัติแล้ว',
  REJECTED: 'ไม่อนุมัติ',
}

export default function AdminDashboardPage() {
  const { loading, error, items, filter, setFilter, refresh, approve, reject } = useAdminBookings()

  return (
    <PageContainer>
      <div className="ad-wrap">
        <div className="ad-head">
          <div>
            <h1 className="ad-title">Admin Dashboard</h1>
            <p className="ad-sub">จัดการการจอง (Phase 1)</p>
          </div>

          <div className="ad-actions">
            <select className="ad-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="ALL">ทั้งหมด</option>
              <option value="PENDING_APPROVAL">รออนุมัติ</option>
              <option value="APPROVED">อนุมัติแล้ว</option>
              <option value="REJECTED">ไม่อนุมัติ</option>
            </select>

            <button className="ad-btn ad-btn--ghost" onClick={refresh}>
              รีเฟรช
            </button>
          </div>
        </div>

        {error && <div className="ad-alert">{error}</div>}

        {loading ? (
          <div className="ad-card">กำลังโหลด...</div>
        ) : items.length === 0 ? (
          <div className="ad-card">ยังไม่มีรายการจอง</div>
        ) : (
          <div className="ad-list">
            {items.map((b) => (
              <div key={b.id} className="ad-item">
                <div className="ad-row">
                  <div className={`ad-badge ad-badge--${b.status}`}>{statusText[b.status] || b.status}</div>
                  <div className="ad-id">{b.id}</div>
                </div>

                <div className="ad-grid">
                  <div><b>รถ:</b> {b.vehicleType}</div>
                  <div><b>ทริป:</b> {b.tripType}</div>
                  <div><b>วัน:</b> {b.date}</div>
                  <div><b>เวลา:</b> {b.departTime}</div>
                  <div><b>ผู้โดยสาร:</b> {b.passengers}</div>
                  <div><b>ติดต่อ:</b> {b.contactPhone}</div>
                  <div><b>จุดรับ:</b> {b.pickup}</div>
                  <div><b>จุดส่ง:</b> {b.dropoff}</div>
                </div>

                {b.note && <div className="ad-note"><b>หมายเหตุ:</b> {b.note}</div>}

                <div className="ad-cta">
                  <button
                    className="ad-btn ad-btn--ok"
                    onClick={() => approve(b.id)}
                    disabled={b.status === 'APPROVED'}
                  >
                    อนุมัติ
                  </button>
                  <button
                    className="ad-btn ad-btn--bad"
                    onClick={() => reject(b.id)}
                    disabled={b.status === 'REJECTED'}
                  >
                    ไม่อนุมัติ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  )
}
