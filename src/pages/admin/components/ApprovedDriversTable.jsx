import React, { useState } from 'react'
import Swal from 'sweetalert2'
import DriverDetailModal from './DriverDetailModal'
import { fireConfirm, fireSuccess } from '../ui/alerts'

export default function ApprovedDriversTable({ drivers, updateStatus }) {
  const [selectedDriver, setSelectedDriver] = useState(null)

  // กรองเอาเฉพาะคนที่ไม่ใช่ pending (Approved, Suspended)
  const list = drivers.filter(d => d.status !== 'pending')

  // ฟังก์ชันเปลี่ยนรหัสผ่าน (Copy มาไว้ที่นี่)
  const handleResetPassword = async (id, name) => {
    const { value: newPass } = await Swal.fire({
      title: `ตั้งรหัสผ่านใหม่: ${name}`,
      input: 'text',
      inputLabel: 'กรุณากรอกรหัสผ่านใหม่',
      inputPlaceholder: 'New Password',
      showCancelButton: true,
      confirmButtonText: 'บันทึก',
      cancelButtonText: 'ยกเลิก'
    })

    if (newPass) {
        // เชื่อม API เปลี่ยนรหัสตรงนี้
        fireSuccess('สำเร็จ', `เปลี่ยนรหัสผ่านของ ${name} เรียบร้อยแล้ว`)
    }
  }

  // ฟังก์ชันจัดการสถานะ (Wrapper)
  const handleUpdateStatus = async (id, status) => {
    let title = 'ยืนยันการทำรายการ'
    let text = `ต้องการเปลี่ยนสถานะเป็น "${status}" ใช่หรือไม่?`
    let color = '#3b82f6'

    if (status === 'suspended') { title = 'ยืนยันระงับการใช้งาน?'; text = 'คนขับจะรับงานไม่ได้จนกว่าจะปลดแบน'; color = '#d33'; }
    else if (status === 'active') { title = 'ยืนยันปลดแบน?'; text = 'คนขับจะกลับมารับงานได้ปกติ'; color = '#10b981'; }

    const isConfirmed = await fireConfirm(title, text, 'ยืนยัน', color)
    if (isConfirmed) {
        const targetStatus = status === 'active' ? 'approved' : status
        await updateStatus(id, targetStatus)
        fireSuccess('ดำเนินการเรียบร้อย')
    }
  }

  return (
    <>
        <div className="ad-table-card">
            <table className="ad-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>ข้อมูลคนขับ</th>
                        <th>รายละเอียดรถ</th>
                        <th>สถานะ</th>
                        <th>จัดการ</th>
                    </tr>
                </thead>
                <tbody>
                    {list.length === 0 && <tr><td colSpan="5" className="ad-empty">ยังไม่มีคนขับที่ผ่านการอนุมัติ</td></tr>}
                    {list.map(d => (
                        <tr key={d.user_id} style={{background: d.status === 'suspended' ? '#fff1f2' : 'transparent'}}>
                            <td>#{d.user_id}</td>
                            <td>
                                <div className="user-name">{d.first_name} {d.last_name}</div>
                                <div className="user-sub">User: {d.username}</div>
                                <div className="user-sub">📞 {d.phone || d.user_phone}</div>
                            </td>
                            <td>
                                <div>{d.vehicle_brand} {d.vehicle_model}</div>
                                <div className="badge" style={{background:'#f1f5f9', color:'#64748b', border:'1px solid #e2e8f0'}}>
                                    {d.license_plate}
                                </div>
                            </td>
                            <td>
                                <span className={`badge badge-${d.status}`}>{d.status.toUpperCase()}</span>
                            </td>
                            <td>
                                <div style={{display:'flex', gap:5, flexWrap:'wrap'}}>
                                    <button className="btn-xs" onClick={() => setSelectedDriver(d)}>👁️ ดู</button>
                                    <button className="btn-xs" onClick={() => handleResetPassword(d.user_id, d.username)}>🔑 รหัส</button>
                                    
                                    {d.status === 'approved' && (
                                        <button className="btn-xs btn-danger" onClick={() => handleUpdateStatus(d.user_id, 'suspended')}>⛔ แบน</button>
                                    )}
                                    {d.status === 'suspended' && (
                                        <button className="btn-xs btn-approve" onClick={() => handleUpdateStatus(d.user_id, 'active')}>🔓 ปลด</button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Modal ใช้ในไฟล์นี้ได้เลย */}
        <DriverDetailModal driver={selectedDriver} onClose={() => setSelectedDriver(null)} />
    </>
  )
}