import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PageContainer from '../../../components/layout/PageContainer/PageContainer'

const BASE_API = 'http://localhost/tripsync_api/api'
const BASE_IMG = 'http://localhost/tripsync_api/'

export default function BookingStatusPage() {
  const location = useLocation()
  const navigate = useNavigate()
  
  // รับ ID จาก state
  const { bookingId } = location.state || {}

  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!bookingId) {
        setLoading(false)
        return
    }

    // ดึงข้อมูลการจอง
    fetch(`${BASE_API}/booking/get_booking_detail.php?id=${bookingId}`)
      .then(res => res.json())
      .then(data => {
        if (data.ok && data.data) {
            setBooking(data.data)
        } else {
            setError('ไม่พบข้อมูลการจองในระบบ')
        }
      })
      .catch(err => {
          console.error(err)
          setError('เกิดข้อผิดพลาดในการเชื่อมต่อ')
      })
      .finally(() => setLoading(false))
  }, [bookingId])

  // --- ส่วนการแสดงผล (Render) ---

  // 1. กรณีไม่มี ID
  if (!bookingId) {
    return (
      <PageContainer>
        <div style={{padding: 40, textAlign: 'center', color: '#64748b'}}>
            <h3>🚫 ไม่พบรหัสการจอง</h3>
            <button onClick={() => navigate('/booking')} style={{marginTop: 10, padding: '8px 16px', cursor:'pointer'}}>กลับไปหน้าจอง</button>
        </div>
      </PageContainer>
    )
  }

  // 2. กำลังโหลด
  if (loading) {
      return <PageContainer><div style={{padding: 40, textAlign: 'center'}}>⏳ กำลังตรวจสอบสถานะ...</div></PageContainer>
  }

  // 3. กรณีเกิดข้อผิดพลาด หรือ ข้อมูลเป็น Null (ป้องกันจอขาวตรงนี้)
  if (error || !booking) {
      return (
        <PageContainer>
            <div style={{padding: 40, textAlign: 'center', color: '#ef4444'}}>
                <h3>❌ เกิดข้อผิดพลาด</h3>
                <p>{error || 'ไม่พบข้อมูลการจอง'}</p>
                <button onClick={() => navigate('/booking')} style={{marginTop: 10, padding: '8px 16px', cursor:'pointer'}}>ทำรายการใหม่</button>
            </div>
        </PageContainer>
      )
  }

  // 4. โหลดสำเร็จ (แสดงข้อมูล)
  return (
    <PageContainer>
      <div style={{maxWidth: 600, margin: '40px auto', background: '#fff', padding: 30, borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}}>
        
        {/* หัวข้อ */}
        <div style={{textAlign:'center', marginBottom: 30}}>
            <div style={{fontSize: 60, marginBottom: 10}}>🎉</div>
            <h1 style={{fontSize: 24, color: '#1e293b', marginBottom: 8}}>จองสำเร็จ!</h1>
            <div style={{fontSize: 16, color: '#64748b'}}>รหัสการจอง: #{booking.id}</div>
            
            <div style={{
                display:'inline-block', 
                background: booking.status === 'approved' ? '#dcfce7' : '#fff7ed', 
                color: booking.status === 'approved' ? '#166534' : '#c2410c', 
                padding:'6px 16px', 
                borderRadius:20, 
                marginTop: 15, 
                fontWeight: 'bold',
                border: '1px solid #ffedd5'
            }}>
                สถานะ: {booking.status === 'approved' ? 'อนุมัติแล้ว' : 'รอการอนุมัติ (PENDING)'}
            </div>
        </div>

        <hr style={{borderColor:'#f1f5f9', margin:'20px 0'}} />

        {/* รายละเอียด */}
        <div style={{display:'grid', gap: 15, fontSize: 15, color: '#334155'}}>
            <div style={{display:'flex', justifyContent:'space-between'}}>
                <span>📅 วันเดินทาง:</span>
                <b>{booking.travel_date} ({booking.depart_time})</b>
            </div>
            <div style={{display:'flex', justifyContent:'space-between'}}>
                <span>🚐 ประเภทรถ:</span>
                <b>{booking.vehicle_type}</b>
            </div>
            <div style={{display:'flex', justifyContent:'space-between'}}>
                <span>🚩 ต้นทาง:</span>
                <b>{booking.from_location}</b>
            </div>
            <div style={{display:'flex', justifyContent:'space-between'}}>
                <span>🏁 ปลายทาง:</span>
                <b>{booking.to_location}</b>
            </div>
        </div>

        {/* ข้อมูลคนขับ (ถ้ามี) */}
        {booking.driver_id && (
            <div style={{marginTop: 25, background: '#f8fafc', padding: 15, borderRadius: 8, display:'flex', alignItems:'center', gap: 15}}>
                <img 
                    src={booking.driver_avatar ? `${BASE_IMG}${booking.driver_avatar}` : 'https://placehold.co/100'} 
                    style={{width: 60, height: 60, borderRadius: '50%', objectFit:'cover', border:'2px solid #fff', boxShadow:'0 2px 5px rgba(0,0,0,0.1)'}}
                />
                <div>
                    <div style={{fontSize: 12, color: '#64748b'}}>คนขับที่เลือก</div>
                    <div style={{fontWeight: 'bold', fontSize: 16}}>{booking.driver_fname} {booking.driver_lname}</div>
                    <div style={{fontSize: 13, color:'#475569'}}>ทะเบียน: {booking.license_plate} | เบอร์: {booking.driver_phone}</div>
                </div>
            </div>
        )}

        <button 
            onClick={() => navigate('/booking')}
            style={{
                width:'100%', padding: '12px', marginTop: 30, 
                background: '#3b82f6', color:'#fff', border:'none', borderRadius: 8, fontSize: 16, cursor: 'pointer'
            }}
        >
            จองรายการใหม่
        </button>

      </div>
    </PageContainer>
  )
}