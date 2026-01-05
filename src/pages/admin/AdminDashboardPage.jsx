import { useEffect, useState } from 'react'
import PageContainer from '../../components/layout/PageContainer/PageContainer'
import DriverSummaryCard from '../driver/DriverSummaryCard'
import './AdminDashboardPage.css'

export default function AdminDashboardPage() {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)

  // ฟังก์ชันโหลดข้อมูล
  const fetchDrivers = async () => {
    try {
      const res = await fetch('http://localhost/tripsync_api/api/admin/get_drivers.php', {
        credentials: 'include'
      })
      const json = await res.json()
      if (json.ok) {
        setDrivers(json.data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDrivers()
  }, [])

  // ฟังก์ชันกดอนุมัติ/ไม่อนุมัติ
  const handleStatus = async (userId, newStatus) => {
    if (!window.confirm(`ยืนยันการเปลี่ยนสถานะเป็น "${newStatus}" ?`)) return

    try {
      const res = await fetch('http://localhost/tripsync_api/api/admin/update_driver_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, status: newStatus }),
        credentials: 'include'
      })
      const json = await res.json()
      if (json.ok) {
        alert('บันทึกสำเร็จ')
        fetchDrivers() // โหลดข้อมูลใหม่
      } else {
        alert('เกิดข้อผิดพลาด: ' + json.message)
      }
    } catch (err) {
      alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้')
    }
  }

  if (loading) return <PageContainer><div>กำลังโหลดข้อมูล...</div></PageContainer>

  return (
    <PageContainer>
      <div className="ad-wrap">
        <h1 className="ad-title">Admin Dashboard</h1>
        <p className="ad-sub">ตรวจสอบและอนุมัติใบสมัครคนขับ</p>
        
        <div style={{ display: 'grid', gap: 20, marginTop: 20 }}>
          {drivers.map((d) => (
            <div key={d.user_id} className="ad-card" style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              {/* ใช้ Component การ์ดที่มีอยู่แล้วแสดงข้อมูล */}
              <DriverSummaryCard raw={d} />

              <div className="ad-cta" style={{ borderTop: '1px dashed #ddd', paddingTop: 15 }}>
                {d.status === 'pending' && (
                  <>
                    <button 
                      className="ad-btn ad-btn--ok" 
                      onClick={() => handleStatus(d.user_id, 'approved')}
                    >
                      ✅ อนุมัติ
                    </button>
                    <button 
                      className="ad-btn ad-btn--bad" 
                      onClick={() => handleStatus(d.user_id, 'rejected')}
                    >
                      ❌ ไม่อนุมัติ
                    </button>
                  </>
                )}
                
                {d.status === 'approved' && (
                    <button className="ad-btn ad-btn--bad" onClick={() => handleStatus(d.user_id, 'suspended')}>
                        ระงับการใช้งาน
                    </button>
                )}
                 {d.status !== 'pending' && d.status !== 'approved' && (
                     <div style={{color: '#999', fontSize: 13}}>สถานะปัจจุบัน: {d.status}</div>
                 )}
              </div>
            </div>
          ))}
          
          {drivers.length === 0 && <div className="ad-card">ไม่พบรายการใบสมัคร</div>}
        </div>
      </div>
    </PageContainer>
  )
}