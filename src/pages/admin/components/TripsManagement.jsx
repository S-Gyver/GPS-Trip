import { useState, useEffect } from 'react'

export default function TripsManagement() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const res = await fetch('http://localhost/tripsync_api/api/admin/get_bookings.php', { credentials: 'include' })
      const json = await res.json()
      if (json.ok) setBookings(json.data)
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  useEffect(() => { fetchBookings() }, [])

  const updateStatus = async (id, status) => {
    if (!window.confirm(`ยืนยันเปลี่ยนสถานะเป็น "${status}" ?`)) return
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
      } else alert('เกิดข้อผิดพลาด: ' + json.message)
    } catch (err) { alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้') }
  }

  if (loading) return <div className="ad-empty">กำลังโหลดรายการจอง...</div>

  return (
    <div className="driver-list">
       <div className="driver-toolbar">
         <button className="btn-xs" onClick={fetchBookings}>🔄 รีเฟรชข้อมูล</button>
       </div>
       {bookings.length === 0 && <div className="ad-table-card ad-empty">ยังไม่มีรายการจองเข้ามา</div>}
       {bookings.map(b => (
         <div key={b.id} className="driver-card" style={{borderLeft: `5px solid ${b.status === 'approved' ? '#10b981' : b.status === 'pending' ? '#f59e0b' : '#ef4444'}`}}>
            <div className="driver-header" style={{marginBottom:10, paddingBottom:10}}>
                <div>
                    <h3 className="driver-title" style={{fontSize:16}}>Trip #{b.id}: {b.origin} ➝ {b.destination}</h3>
                    <div style={{fontSize:13, color:'#64748b', marginTop:4}}>
                        ผู้จอง: <b>{b.username}</b> ({b.phone}) | วันที่: {b.trip_date} เวลา: {b.trip_time}
                    </div>
                </div>
                <span className={`badge badge-${b.status === 'pending' ? 'pending' : b.status === 'approved' ? 'driver' : 'rejected'}`}>
                    {b.status.toUpperCase()}
                </span>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, fontSize:14, color:'#334155'}}>
                <div>🚗 รถ: {b.vehicle_type}</div>
                <div>👥 ผู้โดยสาร: {b.passengers} คน</div>
                <div>💰 ราคา: {parseFloat(b.price || 0).toLocaleString()} บาท</div>
                <div>📅 จองเมื่อ: {new Date(b.created_at).toLocaleString('th-TH')}</div>
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
                    <button className="btn-xs" onClick={() => updateStatus(b.id, 'pending')}>↩️ Reset</button>
                )}
            </div>
         </div>
       ))}
    </div>
  )
}