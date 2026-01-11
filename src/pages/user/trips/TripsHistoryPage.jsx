import { useEffect, useState } from 'react'
import PageContainer from '../../../components/layout/PageContainer/PageContainer'
import './TripsHistoryPage.css'
import UserBookingDetailModal from './components/UserBookingDetailModal' // 👈 Import Modal ที่เพิ่งสร้าง

const statusLabel = {
  pending: 'รออนุมัติ',
  approved: 'อนุมัติแล้ว',
  rejected: 'ไม่อนุมัติ',
  cancelled: 'ยกเลิกแล้ว'
}

const API_LIST_URL = 'http://localhost/tripsync_api/api/booking/get_my_bookings.php'
const API_DETAIL_URL = 'http://localhost/tripsync_api/api/booking/get_booking_detail.php'

export default function TripsHistoryPage() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('ALL')

  // ✅ State สำหรับ Modal
  const [selectedBooking, setSelectedBooking] = useState(null)

  useEffect(() => {
    fetchMyTrips()
  }, [])

  const fetchMyTrips = async () => {
    try {
      setLoading(true)
      const res = await fetch(API_LIST_URL, { method: 'GET', credentials: 'include' })
      const json = await res.json()
      if (json.ok) {
        setTrips(json.data)
      } else {
        if (json.message === 'Unauthorized') setError('กรุณาเข้าสู่ระบบก่อน')
        else setError(json.message || 'ไม่สามารถดึงข้อมูลได้')
      }
    } catch (err) {
      console.error(err)
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ')
    } finally {
      setLoading(false)
    }
  }

  // ✅ ฟังก์ชันกดปุ่ม "รายละเอียด" แล้วดึงข้อมูลมาใส่ Modal
  const handleViewDetail = async (id) => {
      try {
          const res = await fetch(`${API_DETAIL_URL}?id=${id}`, {
              method: 'GET',
              credentials: 'include'
          })
          const json = await res.json()
          if (json.ok) {
              setSelectedBooking(json.data) // เปิด Modal
          } else {
              alertError('ไม่พบข้อมูล', json.message)
          }
      } catch (err) {
          alertError('Error', 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้')
      }
  }

  const filteredTrips = trips.filter((t) => {
    if (activeTab === 'ALL') return true 
    return t.status === activeTab
  })

  return (
    <PageContainer>
      <div className="th-wrap">
        <h1 className="th-title">ทริปของฉัน</h1>
        <p className="th-sub">รายการการจองทั้งหมดของคุณ</p>

        {/* Tabs Menu */}
        <div className="th-nav">
          <button className={`th-tab ${activeTab === 'ALL' ? 'active' : ''}`} onClick={() => setActiveTab('ALL')}>📋 ทั้งหมด ({trips.length})</button>
          <button className={`th-tab ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>⏳ รออนุมัติ ({trips.filter(t => t.status === 'pending').length})</button>
          <button className={`th-tab ${activeTab === 'approved' ? 'active' : ''}`} onClick={() => setActiveTab('approved')}>✅ อนุมัติแล้ว ({trips.filter(t => t.status === 'approved').length})</button>
          <button className={`th-tab ${activeTab === 'rejected' ? 'active' : ''}`} onClick={() => setActiveTab('rejected')}>❌ ไม่อนุมัติ ({trips.filter(t => t.status === 'rejected').length})</button>
        </div>

        {loading && <div className="th-card" style={{textAlign: 'center', color: '#666'}}>กำลังโหลดข้อมูล...</div>}
        
        {error && <div className="th-card" style={{textAlign: 'center', color: '#ef4444'}}>{error}</div>}

        {!loading && !error && filteredTrips.length === 0 && (
          <div className="th-card" style={{textAlign: 'center', padding: '40px', color: '#94a3b8'}}>
            <div style={{fontSize: '40px', marginBottom: '10px'}}>📭</div>
            {activeTab === 'ALL' ? 'ยังไม่มีรายการจอง' : 'ไม่พบรายการในหมวดนี้'}
          </div>
        )}

        {/* ✅ แสดงรายการ */}
        {!loading && !error && filteredTrips.length > 0 && (
          <div className="th-list">
            {filteredTrips.map((t) => (
              // ❌ เปลี่ยนจาก <button> เป็น <div> เพื่อไม่ให้คลิกทั้งก้อนได้
              <div key={t.id} className="th-item">
                
                <div className="th-row">
                  <div style={{display:'flex', gap:10, alignItems:'center'}}>
                      <div className="th-badge" style={{
                            backgroundColor: t.status === 'approved' ? '#dcfce7' : t.status === 'rejected' ? '#fee2e2' : 'rgba(255,122,0,.12)',
                            color: t.status === 'approved' ? '#166534' : t.status === 'rejected' ? '#991b1b' : '#b45309',
                        }}>
                        {statusLabel[t.status] || t.status}
                      </div>
                      <div className="th-id">#{t.id}</div>
                  </div>

                  {/* ✅ ปุ่มรายละเอียด (มุมขวา) */}
                  <button 
                    onClick={() => handleViewDetail(t.id)}
                    style={{
                        padding: '6px 12px', background: '#fff', border: '1px solid #3b82f6', 
                        borderRadius: 6, color: '#3b82f6', cursor: 'pointer', fontSize: 13, fontWeight: 'bold'
                    }}
                  >
                    🔍 รายละเอียด
                  </button>
                </div>

                <div className="th-grid">
                  <div><b>รถ:</b> {t.vehicle_type === 'van' ? 'รถตู้' : t.vehicle_type}</div>
                  <div><b>ทริป:</b> {t.trip_type === 'oneway' ? 'เที่ยวเดียว' : 'ไป-กลับ'}</div>
                  <div><b>วัน:</b> {t.travel_date ? new Date(t.travel_date).toLocaleDateString('th-TH') : '-'}</div>
                  <div><b>เวลา:</b> {t.depart_time ? t.depart_time.substring(0, 5) : '-'}</div>
                  <div><b>จุดรับ:</b> {t.from_location || '-'}</div>
                  <div><b>จุดส่ง:</b> {t.to_location || '-'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ เรียกใช้ Modal */}
      <UserBookingDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
    </PageContainer>
  )
}