import { useState, useEffect } from 'react'
import Swal from 'sweetalert2' 
import { fireConfirm, fireSuccess, fireError } from '../ui/alerts'
import UserDetailModal from './UserDetailModal'

export default function UsersTable() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  
  // 🔍 State สำหรับค้นหา
  const [searchTerm, setSearchTerm] = useState('')

  // ฟังก์ชันดึงข้อมูล (แยกออกมาเพื่อให้กด Refresh ได้)
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await fetch('http://localhost/tripsync_api/api/admin/get_all_users.php', { credentials: 'include' })
      const json = await res.json()
      if (json.ok) setUsers(json.data || [])
    } catch (err) { 
      console.error(err)
      fireError('เชื่อมต่อล้มเหลว', 'ไม่สามารถดึงข้อมูลผู้ใช้งานได้')
    } finally { 
      setLoading(false) 
    }
  }

  // โหลดข้อมูลครั้งแรก
  useEffect(() => { fetchUsers() }, [])

  // --- Logic การค้นหา (Filter) ---
  const filteredUsers = users.filter(u => {
    const term = searchTerm.toLowerCase().trim()
    if (!term) return true // ถ้าไม่พิมพ์อะไร ให้แสดงทั้งหมด

    // รวมข้อมูลที่จะค้นหาไว้ใน string เดียว
    const searchString = `
      ${u.id} 
      ${u.username || ''} 
      ${u.email || ''} 
      ${u.phone || ''} 
      ${u.role || ''}
    `.toLowerCase()

    return searchString.includes(term)
  })

  // --- ฟังก์ชันจัดการต่าง ๆ ---

  const handleRoleChange = async (id, newRole) => {
    const isConfirmed = await fireConfirm(
        `ยืนยันเปลี่ยนสิทธิ์?`, 
        `คุณต้องการเปลี่ยนสิทธิ์ผู้ใช้นี้เป็น "${newRole}" ใช่หรือไม่`
    )
    if(!isConfirmed) return

    try {
      const res = await fetch('http://localhost/tripsync_api/api/admin/update_user.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id, role: newRole }),
        credentials: 'include'
      })
      const json = await res.json()
      if(json.ok) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u))
        fireSuccess('เรียบร้อย', `เปลี่ยนสิทธิ์เป็น ${newRole} สำเร็จ`)
      } else {
        fireError('เกิดข้อผิดพลาด', json.message)
      }
    } catch(e) { fireError('Error', 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้') }
  }

  const handleToggleBan = async (id, currentStatus) => {
    const newStatus = currentStatus === 'banned' ? 'active' : 'banned'
    const action = newStatus === 'banned' ? 'แบน (Ban)' : 'ปลดแบน (Unban)'
    
    const isConfirmed = await fireConfirm(
        `ยืนยันการ${action}?`, 
        `คุณต้องการ ${action} ผู้ใช้นี้ใช่ไหม?`,
        newStatus === 'banned' ? 'ยืนยันการแบน' : 'ยืนยันปลดแบน',
        newStatus === 'banned' ? '#d33' : '#10b981'
    )
    if(!isConfirmed) return

    try {
      const res = await fetch('http://localhost/tripsync_api/api/admin/update_user.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id, status: newStatus }),
        credentials: 'include'
      })
      const json = await res.json()
      if(json.ok) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u))
        fireSuccess('เรียบร้อย', `ดำเนินการ ${action} สำเร็จ`)
      } else {
        fireError('เกิดข้อผิดพลาด', json.message)
      }
    } catch(e) { fireError('Error', 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้') }
  }

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
        // เชื่อมต่อ API เปลี่ยนรหัสจริงตรงนี้
        fireSuccess('เปลี่ยนรหัสผ่านสำเร็จ', `(จำลอง) เปลี่ยนรหัสของ ${name} เรียบร้อย`)
    }
  }

  if (loading) return <div className="ad-empty">กำลังโหลดรายชื่อผู้ใช้...</div>

  return (
    <>
      <div className="ad-table-card">
        
        {/* --- Toolbar: Refresh & Search --- */}
        <div style={{
             display:'flex', justifyContent:'space-between', alignItems:'center', 
             padding:'0 0 20px 0', borderBottom: '1px solid #f1f5f9', marginBottom: 20, flexWrap:'wrap', gap:15
        }}>
            <div style={{display:'flex', alignItems:'center', gap:10}}>
                <h3 style={{margin:0, color:'#334155'}}>รายชื่อผู้ใช้งานทั้งหมด ({filteredUsers.length})</h3>
                <button className="btn-xs" onClick={fetchUsers}>🔄 รีเฟรช</button>
            </div>

            {/* 🔍 ช่องค้นหา */}
            <div style={{position: 'relative', minWidth: '250px'}}>
                <input 
                    type="text" 
                    placeholder=" ค้นหา ID, ชื่อ, Email, เบอร์..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '8px 12px 8px 35px',
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

        {/* --- Table --- */}
        <table className="ad-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User Info</th>
              <th>Role (เปลี่ยนได้)</th>
              <th>Status</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 && (
                <tr><td colSpan="5" className="ad-empty">
                    {searchTerm ? `ไม่พบข้อมูลที่ตรงกับ "${searchTerm}"` : 'ไม่พบข้อมูลผู้ใช้'}
                </td></tr>
            )}
            
            {filteredUsers.map(u => (
              <tr key={u.id} style={{background: u.status === 'banned' ? '#fff1f2' : 'transparent'}}>
                <td>#{u.id}</td>
                <td>
                  <div className="user-name">{u.username}</div>
                  <div className="user-sub">{u.email}</div>
                  <div className="user-sub">{u.phone || '-'}</div>
                </td>
                <td>
                  <select 
                    className="ad-select-role"
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    disabled={u.username === 'admin'} // ห้ามแก้ role admin หลัก
                  >
                    <option value="user">User</option>
                    <option value="driver">Driver</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <span className={`badge ${u.status === 'banned' ? 'badge-rejected' : 'badge-approved'}`}>
                    {u.status || 'active'}
                  </span>
                </td>
                <td>
                  <div style={{display:'flex', gap:5, flexWrap:'wrap'}}>
                    <button className="btn-xs" onClick={() => setSelectedUser(u)}>👁️ ดู</button>
                    <button className="btn-xs" onClick={() => handleResetPassword(u.id, u.username)}>🔑 รีเซ็ต</button>
                    {u.username !== 'admin' && (
                        <button 
                            className={`btn-xs ${u.status === 'banned' ? 'btn-approve' : 'btn-danger'}`} 
                            onClick={() => handleToggleBan(u.id, u.status)}
                        >
                            {u.status === 'banned' ? '🔓 ปลด' : '🚫 แบน'}
                        </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </>
  )
}