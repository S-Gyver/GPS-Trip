import { useState, useEffect } from 'react'
import UserDetailModal from './UserDetailModal' // เรียกใช้ Modal ที่แยกไว้

export default function UsersTable() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    fetch('http://localhost/tripsync_api/api/admin/get_all_users.php', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { if (d.ok) setUsers(d.data || []) })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handleRoleChange = async (id, newRole) => {
    if(!window.confirm(`ยืนยันเปลี่ยนสิทธิ์เป็น "${newRole}" ?`)) return
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
      } else alert(json.message)
    } catch(e) { alert('Error') }
  }

  const handleToggleBan = async (id, currentStatus) => {
    const newStatus = currentStatus === 'banned' ? 'active' : 'banned'
    const action = newStatus === 'banned' ? 'แบน (Ban)' : 'ปลดแบน (Unban)'
    if(!window.confirm(`ต้องการ "${action}" ผู้ใช้นี้ใช่ไหม?`)) return

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
      } else alert(json.message)
    } catch(e) { alert('Error') }
  }

  const handleResetPassword = (id, name) => {
    const newPass = prompt(`ตั้งรหัสผ่านใหม่สำหรับ user: ${name}`)
    if (newPass) alert(`จำลอง: เปลี่ยนรหัสของ ${name} เป็น ${newPass} เรียบร้อย`)
  }

  if (loading) return <div className="ad-empty">กำลังโหลดรายชื่อผู้ใช้...</div>

  return (
    <>
      <div className="ad-table-card">
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
            {users.map(u => (
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
                    disabled={u.username === 'admin'}
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
            {users.length === 0 && <tr><td colSpan="5" className="ad-empty">ไม่พบข้อมูล</td></tr>}
          </tbody>
        </table>
      </div>
      <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </>
  )
}