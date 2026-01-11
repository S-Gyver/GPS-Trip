import React, { useState } from 'react'
import { useAdminDrivers } from '../useAdminDrivers'
import DriverDetailModal from './DriverDetailModal'
import ApprovedDriversTable from './ApprovedDriversTable' 
import { fireConfirm, fireSuccess } from '../ui/alerts'

export default function DriversManagement() {
  const { drivers, updateStatus, refresh, loading } = useAdminDrivers()
  const [selectedDriver, setSelectedDriver] = useState(null)
  
  // State สลับโหมด
  const [viewMode, setViewMode] = useState('applications') 
  
  // 🔍 State สำหรับค้นหา
  const [searchTerm, setSearchTerm] = useState('')

  // 1. ฟังก์ชันกรองข้อมูล (Search Logic)
  // กรองจาก: ID, Username, Email, เบอร์โทร, ทะเบียนรถ
  const filteredDrivers = drivers.filter(d => {
    const term = searchTerm.toLowerCase().trim()
    if (!term) return true // ถ้าไม่ได้พิมพ์อะไร ให้ส่งคืนข้อมูลทั้งหมด

    // รวมข้อมูลที่จะค้นหาไว้ในตัวแปรเดียว เพื่อเช็คทีเดียว
    const searchString = `
      ${d.user_id} 
      ${d.username || ''} 
      ${d.email || ''} 
      ${d.phone || d.user_phone || ''} 
      ${d.license_plate || ''}
    `.toLowerCase()

    return searchString.includes(term)
  })

  // 2. แยกข้อมูลสำหรับแสดงผล (จากข้อมูลที่กรองแล้ว)
  // รายการใบสมัคร (Pending)
  const applicationList = filteredDrivers
    .filter(d => d.status === 'pending')
    .sort((a,b) => new Date(a.created_at) - new Date(b.created_at))

  // ฟังก์ชันอนุมัติ/ไม่อนุมัติ (สำหรับหน้า Card)
  const handleApproveAction = async (id, status) => {
      let title = status === 'approved' ? 'ยืนยันอนุมัติ?' : 'ยืนยันไม่อนุมัติ?'
      let color = status === 'approved' ? '#10b981' : '#d33'
      
      const isConfirmed = await fireConfirm(title, '', 'ยืนยัน', color)
      if (isConfirmed) {
          await updateStatus(id, status)
          fireSuccess('ดำเนินการเรียบร้อย')
      }
  }

  if (loading) return <div className="ad-empty">กำลังโหลดข้อมูลคนขับ...</div>

  return (
    <>
      <div className="driver-list">
         {/* --- Toolbar --- */}
         <div className="driver-toolbar" style={{
             display:'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between'
         }}>
            <div style={{display:'flex', gap:10}}>
                <button className="btn-xs" onClick={refresh}>🔄 รีเฟรช</button>
                {/* ปุ่มสลับโหมด */}
                <button 
                        className="btn-xs" 
                        style={{
                            background: viewMode === 'applications' ? '#fff' : '#3b82f6', 
                            color: viewMode === 'applications' ? '#3b82f6' : '#fff',
                            border: '1px solid #3b82f6'
                        }}
                        onClick={() => setViewMode(viewMode === 'applications' ? 'all_list' : 'applications')}
                >
                        {viewMode === 'applications' ? '👥 ดูรายชื่อคนขับทั้งหมด' : '📄 กลับไปดูใบสมัคร'}
                </button>
            </div>

            {/* 🔍 ช่องค้นหา (Search Input) */}
            <div style={{position: 'relative', minWidth: '250px'}}>
                <input 
                    type="text" 
                    placeholder=" ค้นหา ID, ชื่อ, เบอร์, ทะเบียน..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '8px 12px 8px 35px', // เว้นซ้ายไว้ใส่ไอคอน
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '14px',
                        outline: 'none'
                    }}
                />
                <span style={{position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)', color:'#94a3b8'}}>
                    🔍
                </span>
            </div>
         </div>

         {/* --- MODE 1: ดูใบสมัคร (Cards Layout) --- */}
         {viewMode === 'applications' && (
             <>
                <h3 style={{marginBottom:15, color:'#334155'}}>
                    📋 รายการใบสมัครใหม่ ({applicationList.length})
                    {searchTerm && <span style={{fontSize:14, color:'#64748b', marginLeft:10}}>(ผลการค้นหา: {applicationList.length} รายการ)</span>}
                </h3>
                
                {applicationList.length === 0 && (
                    <div className="ad-table-card ad-empty">
                        {searchTerm ? `ไม่พบข้อมูลที่ตรงกับ "${searchTerm}"` : 'ไม่พบใบสมัครใหม่'}
                    </div>
                )}
                
                {applicationList.map(d => (
                <div key={d.user_id} className="driver-card">
                    {/* Header */}
                    <div className="driver-header" style={{borderBottom:'none', paddingBottom:0, marginBottom:15}}>
                        <div>
                            <h3 className="driver-title">ใบสมัคร: {d.first_name || '-'} {d.last_name || '-'}</h3>
                            <div style={{fontSize:13, color:'#64748b', marginTop:4}}>
                                บัญชีผู้ใช้: <b>{d.username}</b> (ID: {d.user_id}) | โทร: {d.user_phone || '-'}
                            </div>
                        </div>
                        <span className="badge badge-pending">PENDING</span>
                    </div>
                    
                    {/* Summary */}
                    <div style={{
                        background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px 20px',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 15
                    }}>
                        <div style={{display:'flex', gap: 30, fontSize:14, flexWrap:'wrap'}}>
                             <div><b>รถ:</b> {d.vehicle_brand} ({d.vehicle_type})</div>
                             <div><b>ทะเบียน:</b> {d.license_plate}</div>
                             <div style={{color:'#10b981', fontWeight:'bold'}}>{parseInt(d.price_per_day).toLocaleString()} บ./วัน</div>
                        </div>
                        <button className="btn-xs" style={{border:'1px solid #3b82f6', color:'#3b82f6', background:'#fff'}} onClick={() => setSelectedDriver(d)}>
                            📄 รายละเอียด
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="driver-actions">
                        <button className="btn-xs btn-approve" onClick={() => handleApproveAction(d.user_id, 'approved')}>✅ อนุมัติ</button>
                        <button className="btn-xs btn-danger" onClick={() => handleApproveAction(d.user_id, 'rejected')}>❌ ไม่อนุมัติ</button>
                    </div>
                </div>
                ))}
             </>
         )}

         {/* --- MODE 2: เรียกใช้ Component ตาราง --- */}
         {viewMode === 'all_list' && (
            <>
                <h3 style={{marginBottom:15, color:'#334155'}}>
                    👥 ทำเนียบคนขับรถ
                    {searchTerm && <span style={{fontSize:14, color:'#64748b', marginLeft:10}}>(กำลังค้นหา: "{searchTerm}")</span>}
                </h3>
                {/* ส่งข้อมูลที่กรองแล้ว (filteredDrivers) ไปให้ตารางแสดงผล */}
                <ApprovedDriversTable drivers={filteredDrivers} updateStatus={updateStatus} />
            </>
         )}

      </div>

      <DriverDetailModal driver={selectedDriver} onClose={() => setSelectedDriver(null)} />
    </>
  )
}