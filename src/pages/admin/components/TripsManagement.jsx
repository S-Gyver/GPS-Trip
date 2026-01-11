import { useState, useEffect, useMemo } from 'react'
import { fireConfirm, fireError, fireSuccess } from '../ui/alerts'
import BookingDetailModal from './BookingDetailModal'

export default function TripsManagement() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState(null)

  // ✅ 1. เพิ่ม State เก็บ Tab ปัจจุบัน (ค่าเริ่มต้น: 'pending')
  const [activeTab, setActiveTab] = useState('pending')

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const res = await fetch('http://localhost/tripsync_api/api/admin/get_bookings.php', { credentials: 'include' })
      const json = await res.json()
      if (json.ok) setBookings(json.data)
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  useEffect(() => { fetchBookings() }, [])

  // ฟังก์ชันดึงรายละเอียด
  const handleViewDetail = async (id) => {
      try {
          const res = await fetch(`http://localhost/tripsync_api/api/admin/get_booking_detail.php?id=${id}`, {
              credentials: 'include'
          })
          const json = await res.json()
          if (json.ok) {
              setSelectedBooking(json.data)
          } else {
              fireError('เกิดข้อผิดพลาด', json.message)
          }
      } catch (err) {
          fireError('Error', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์')
      }
  }

  const updateStatus = async (id, status) => {
    const isConfirmed = await fireConfirm(
        `ยืนยันการเปลี่ยนสถานะ?`,
        `คุณต้องการเปลี่ยนสถานะเป็น "${status}" ใช่หรือไม่`
    )
    if (!isConfirmed) return

    try {
      const res = await fetch('http://localhost/tripsync_api/api/admin/update_booking_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
        credentials: 'include'
      })
      const json = await res.json()
      
      if (json.ok) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
        fireSuccess('สำเร็จ', `เปลี่ยนสถานะเป็น ${status} เรียบร้อยแล้ว`)
      } else {
        fireError('เกิดข้อผิดพลาด', json.message)
      }
    } catch (err) { 
        fireError('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้') 
    }
  }

  // ✅ 2. คำนวณจำนวนรายการในแต่ละสถานะ (เพื่อโชว์ตัวเลข)
  const counts = useMemo(() => {
      return {
          pending: bookings.filter(b => b.status === 'pending').length,
          approved: bookings.filter(b => b.status === 'approved' || b.status === 'completed').length,
          rejected: bookings.filter(b => b.status === 'rejected' || b.status === 'cancelled').length
      }
  }, [bookings])

  // ✅ 3. กรองข้อมูลตาม Tab ที่เลือก
  const filteredBookings = useMemo(() => {
      return bookings.filter(b => {
          if (activeTab === 'pending') return b.status === 'pending'
          // อนุมัติแล้ว (รวมงานที่จบแล้วด้วย)
          if (activeTab === 'approved') return b.status === 'approved' || b.status === 'completed'
          // ยกเลิกแล้ว
          if (activeTab === 'rejected') return b.status === 'rejected' || b.status === 'cancelled'
          return true
      })
  }, [bookings, activeTab])

  if (loading) return <div className="ad-empty">กำลังโหลดรายการจอง...</div>

  return (
    <div className="driver-list">
       {/* Toolbar & Tabs */}
       <div className="driver-toolbar" style={{flexDirection: 'column', alignItems: 'flex-start', gap: 15}}>
         <div style={{display:'flex', justifyContent:'space-between', width:'100%'}}>
            <h3 style={{margin:0, color:'#334155'}}>จัดการรายการจอง</h3>
            <button className="btn-xs" onClick={fetchBookings}>🔄 รีเฟรช</button>
         </div>

         {/* ✅ เมนู Tabs */}
         <div style={{display: 'flex', gap: 10, borderBottom: '1px solid #e2e8f0', width: '100%', paddingBottom: 1}}>
            <button 
                onClick={() => setActiveTab('pending')}
                style={{
                    padding: '8px 16px', border: 'none', background: 'none', cursor: 'pointer',
                    fontSize: 15, fontWeight: activeTab === 'pending' ? 'bold' : 'normal',
                    color: activeTab === 'pending' ? '#d97706' : '#64748b',
                    borderBottom: activeTab === 'pending' ? '3px solid #d97706' : '3px solid transparent',
                    marginBottom: -2
                }}
            >
                ⏳ รออนุมัติ ({counts.pending})
            </button>
            <button 
                onClick={() => setActiveTab('approved')}
                style={{
                    padding: '8px 16px', border: 'none', background: 'none', cursor: 'pointer',
                    fontSize: 15, fontWeight: activeTab === 'approved' ? 'bold' : 'normal',
                    color: activeTab === 'approved' ? '#16a34a' : '#64748b',
                    borderBottom: activeTab === 'approved' ? '3px solid #16a34a' : '3px solid transparent',
                    marginBottom: -2
                }}
            >
                ✅ อนุมัติแล้ว ({counts.approved})
            </button>
            <button 
                onClick={() => setActiveTab('rejected')}
                style={{
                    padding: '8px 16px', border: 'none', background: 'none', cursor: 'pointer',
                    fontSize: 15, fontWeight: activeTab === 'rejected' ? 'bold' : 'normal',
                    color: activeTab === 'rejected' ? '#dc2626' : '#64748b',
                    borderBottom: activeTab === 'rejected' ? '3px solid #dc2626' : '3px solid transparent',
                    marginBottom: -2
                }}
            >
                ❌ ยกเลิกแล้ว ({counts.rejected})
            </button>
         </div>
       </div>

       {filteredBookings.length === 0 && (
           <div className="ad-table-card ad-empty" style={{marginTop: 20}}>
               ไม่พบรายการในหมวดนี้
           </div>
       )}
       
       {/* แสดงรายการที่กรองแล้ว */}
       {filteredBookings.map(b => (
         <div key={b.id} className="driver-card" style={{borderLeft: `5px solid ${b.status === 'approved' ? '#10b981' : b.status === 'pending' ? '#f59e0b' : '#ef4444'}`}}>
            <div className="driver-header" style={{marginBottom:10, paddingBottom:10}}>
                <div>
                    <h3 className="driver-title" style={{fontSize:16}}>Trip #{b.id}: {b.from_location || 'ไม่ระบุ'} ➝ {b.to_location || 'ไม่ระบุ'}</h3>
                    <div style={{fontSize:13, color:'#64748b', marginTop:4}}>
                        ผู้จอง: <b>{b.username || 'Guest'}</b> ({b.phone || '-'}) | วันที่: {b.travel_date ? new Date(b.travel_date).toLocaleDateString('th-TH') : '-'}
                    </div>
                </div>
                <div style={{display:'flex', gap: 10, alignItems:'center'}}>
                    <button 
                        className="btn-xs" 
                        style={{background:'#fff', color:'#3b82f6', border:'1px solid #3b82f6'}}
                        onClick={() => handleViewDetail(b.id)}
                    >
                        🔍 ดูรายละเอียด
                    </button>
                    
                    <span className={`badge badge-${b.status === 'pending' ? 'pending' : b.status === 'approved' ? 'driver' : 'rejected'}`}>
                        {b.status.toUpperCase()}
                    </span>
                </div>
            </div>
            
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, fontSize:14, color:'#334155'}}>
                <div>🚗 รถ: {b.vehicle_type}</div>
                <div>👥 ผู้โดยสาร: {b.passengers} คน</div>
                <div>💰 ราคา: {parseFloat(b.price || 0).toLocaleString()} บาท</div>
                <div>📅 ทำรายการ: {new Date(b.created_at).toLocaleString('th-TH')}</div>
            </div>

            <div className="driver-actions">
                {b.status === 'pending' && (
                    <>
                        <button className="btn-xs btn-approve" onClick={() => updateStatus(b.id, 'approved')}>✅ ยืนยันการจอง</button>
                        <button className="btn-xs btn-danger" onClick={() => updateStatus(b.id, 'rejected')}>❌ ยกเลิก</button>
                    </>
                )}
                {b.status === 'approved' && (
                    <button className="btn-xs" style={{background:'#3b82f6', color:'#fff', border:'none'}} onClick={() => updateStatus(b.id, 'completed')}>🏁 จบงาน</button>
                )}
                 {b.status !== 'pending' && (
                    <button className="btn-xs" onClick={() => updateStatus(b.id, 'pending')}>↩️ Reset สถานะ</button>
                )}
            </div>
         </div>
       ))}

       {/* Modal Detail */}
       <BookingDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
    </div>
  )
}