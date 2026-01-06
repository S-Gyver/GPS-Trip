import React from 'react'
import DriverSummaryCard from '../../driver/DriverSummaryCard' // เช็ค path ให้ถูกต้อง (อาจต้องถอยหลังเพิ่ม)
import { useAdminDrivers } from '../useAdminDrivers' // เรียก Hook จากข้างนอก

export default function DriversManagement() {
  const { drivers, updateStatus, refresh, loading } = useAdminDrivers()
  
  const sorted = [...drivers].sort((a,b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1
    if (a.status !== 'pending' && b.status === 'pending') return 1
    return 0
  })

  if (loading) return <div className="ad-empty">กำลังโหลดข้อมูลคนขับ...</div>

  return (
    <div className="driver-list">
       <div className="driver-toolbar">
         <button className="btn-xs" onClick={refresh}>🔄 รีเฟรชข้อมูล</button>
       </div>

       {sorted.length === 0 && <div className="ad-table-card ad-empty">ไม่พบใบสมัครคนขับ</div>}

       {sorted.map(d => (
         <div key={d.user_id} className="driver-card">
            <div className="driver-header">
                <div>
                    <h3 className="driver-title">ใบสมัคร: {d.first_name || '-'} {d.last_name || '-'}</h3>
                    <div style={{fontSize:13, color:'#64748b', marginTop:4}}>
                        บัญชีผู้ใช้: <b style={{color:'#0f172a'}}>{d.username}</b> (ID: {d.user_id}) 
                        <span style={{margin:'0 8px'}}>|</span>
                        เบอร์โทร: {d.user_phone || '-'}
                    </div>
                </div>
                <span className={`badge badge-${d.status}`}>{d.status}</span>
            </div>
            <DriverSummaryCard raw={d} />
            <div className="driver-actions">
                {d.status === 'pending' && (
                    <>
                        <button className="btn-xs btn-approve" onClick={() => updateStatus(d.user_id, 'approved')}>✅ อนุมัติ</button>
                        <button className="btn-xs btn-danger" onClick={() => updateStatus(d.user_id, 'rejected')}>❌ ไม่อนุมัติ</button>
                    </>
                )}
                {d.status === 'approved' && (
                    <button className="btn-xs btn-danger" onClick={() => updateStatus(d.user_id, 'suspended')}>⛔ ระงับการใช้งาน</button>
                )}
                {(d.status === 'rejected' || d.status === 'suspended') && (
                    <button className="btn-xs" onClick={() => updateStatus(d.user_id, 'pending')}>↩️ ดึงกลับมารอตรวจสอบ</button>
                )}
            </div>
         </div>
       ))}
    </div>
  )
}