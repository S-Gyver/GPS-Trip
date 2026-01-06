import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminDashboardPage.css'

// Import Components ที่เราทำไว้แล้ว
import DriverSummaryCard from '../driver/DriverSummaryCard'
import { useAdminDrivers } from './useAdminDrivers' 

// ================= SUB-COMPONENT: USERS TABLE (ตาราง User) =================
function UsersTable() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  
  // ดึงข้อมูล User ทั้งหมด
  useEffect(() => {
    fetch('http://localhost/tripsync_api/api/admin/get_all_users.php', { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
         if(d.ok) setUsers(d.data || [])
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handleResetPassword = (id, name) => {
    const newPass = prompt(`ตั้งรหัสผ่านใหม่สำหรับ user: ${name}`)
    if (newPass) {
        // (ในอนาคตค่อยทำ API เปลี่ยนรหัสจริง)
        alert(`จำลอง: เปลี่ยนรหัสของ ${name} เป็น ${newPass} เรียบร้อย`)
    }
  }

  if (loading) return <div>กำลังโหลดรายชื่อผู้ใช้...</div>

  return (
    <div className="ad-table-card">
      <table className="ad-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>ชื่อผู้ใช้</th>
            <th>อีเมล</th>
            <th>สถานะ (Role)</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>#{u.id}</td>
              <td>
                <div style={{fontWeight:600}}>{u.username}</div>
                <div style={{fontSize:12, color:'#94a3b8'}}>{u.phone || '-'}</div>
              </td>
              <td>{u.email}</td>
              <td>
                <span className={`badge badge-${u.role}`}>{u.role}</span>
              </td>
              <td>
                <button className="btn-xs" onClick={() => handleResetPassword(u.id, u.username)}>🔑 รีเซ็ตรหัส</button>
              </td>
            </tr>
          ))}
          {users.length === 0 && <tr><td colSpan="5" style={{textAlign:'center'}}>ไม่พบข้อมูล</td></tr>}
        </tbody>
      </table>
    </div>
  )
}

// ================= SUB-COMPONENT: DRIVERS LIST (รายการคนขับ) =================
function DriversManagement() {
  const { drivers, updateStatus, refresh, loading } = useAdminDrivers()
  
  // เรียงลำดับ: เอาคนที่รอตรวจสอบ (pending) ขึ้นก่อน
  const sorted = [...drivers].sort((a,b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1
    if (a.status !== 'pending' && b.status === 'pending') return 1
    return 0
  })

  if (loading) return <div>กำลังโหลดข้อมูลคนขับ...</div>

  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 20 }}>
       <div style={{ display:'flex', gap: 10, justifyContent: 'flex-end' }}>
         <button className="btn-xs" onClick={refresh}>🔄 รีเฟรชข้อมูล</button>
       </div>

       {sorted.length === 0 && <div className="ad-table-card" style={{padding:20, textAlign:'center'}}>ไม่พบใบสมัครคนขับ</div>}

       {sorted.map(d => (
         <div key={d.user_id} className="ad-table-card" style={{ padding: 20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 15, alignItems:'center' }}>
                <h3 style={{margin:0}}>ใบสมัคร: {d.first_name} {d.last_name}</h3>
                <span className={`badge badge-${d.status === 'approved' ? 'driver' : (d.status==='pending'?'admin':'user')}`}>
                    {d.status}
                </span>
            </div>
            
            {/* โชว์รายละเอียด + เอกสาร (Reuse Component เดิม) */}
            <DriverSummaryCard raw={d} />

            <div style={{ marginTop: 20, paddingTop: 15, borderTop:'1px solid #eee', display:'flex', gap: 10 }}>
                {d.status === 'pending' && (
                    <>
                        <button className="btn-xs" style={{background:'#10b981', color:'white', border:'none', fontSize:14, padding:'8px 16px'}} 
                            onClick={() => updateStatus(d.user_id, 'approved')}>
                            ✅ อนุมัติเป็นคนขับ
                        </button>
                        <button className="btn-xs danger" style={{fontSize:14, padding:'8px 16px'}} 
                            onClick={() => updateStatus(d.user_id, 'rejected')}>
                            ❌ ไม่อนุมัติ
                        </button>
                    </>
                )}
                {d.status === 'approved' && (
                    <button className="btn-xs danger" onClick={() => updateStatus(d.user_id, 'suspended')}>
                        ⛔ ระงับการใช้งาน
                    </button>
                )}
                {d.status === 'rejected' && (
                    <button className="btn-xs" onClick={() => updateStatus(d.user_id, 'pending')}>
                        ↩️ ดึงกลับมารอตรวจสอบ
                    </button>
                )}
            </div>
         </div>
       ))}
    </div>
  )
}

// ================= SUB-COMPONENT: TRIPS (จำลองหน้าทริป) =================
function TripsManagement() {
  return (
    <div className="ad-table-card" style={{ padding: 60, textAlign:'center', color:'#64748b' }}>
        <h2>🚗 จัดการทริป/การจอง</h2>
        <p>หน้านี้จะแสดงรายการจองทั้งหมด ให้ Admin กดอนุมัติ หรือดูรายละเอียด</p>
        <p>(รอเชื่อมต่อกับ Booking API ใน Phase ต่อไป)</p>
    </div>
  )
}


// ================= MAIN PAGE (หน้าหลัก) =================
export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard') // dashboard | users | drivers | trips

  const handleLogout = () => {
    // ล้างค่า session ในเครื่อง
    localStorage.removeItem('ts_user')
    localStorage.removeItem('ts_token')
    navigate('/login')
  }

  return (
    <div className="ad-layout">
      {/* --- Sidebar เมนูซ้าย --- */}
      <aside className="ad-sidebar">
        <div className="ad-brand">
            <span>⚡ TripSync</span> <span style={{fontSize:10, background:'#334155', padding:'2px 6px', borderRadius:4, color:'#fff'}}>ADMIN</span>
        </div>

        <nav className="ad-menu">
          <button className={`ad-menu-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            📊 ภาพรวม
          </button>
          <button className={`ad-menu-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            👥 จัดการ User
          </button>
          <button className={`ad-menu-item ${activeTab === 'drivers' ? 'active' : ''}`} onClick={() => setActiveTab('drivers')}>
            🪪 อนุมัติคนขับ
          </button>
          <button className={`ad-menu-item ${activeTab === 'trips' ? 'active' : ''}`} onClick={() => setActiveTab('trips')}>
            📅 จัดการทริป
          </button>
        </nav>

        <div style={{ marginTop: 'auto' }}>
            <button className="ad-menu-item" onClick={handleLogout} style={{ color: '#f87171' }}>
                🚪 ออกจากระบบ
            </button>
        </div>
      </aside>

      {/* --- Main Content เนื้อหาขวา --- */}
      <main className="ad-main">
        <header className="ad-header">
            <h1 className="ad-page-title">
                {activeTab === 'dashboard' && 'Dashboard Overview'}
                {activeTab === 'users' && 'จัดการผู้ใช้งาน (Users)'}
                {activeTab === 'drivers' && 'จัดการคนขับ (Drivers)'}
                {activeTab === 'trips' && 'รายการจอง (Trips)'}
            </h1>
            <div style={{ fontWeight:600 }}>Admin Portal</div>
        </header>

        {/* Content Switcher */}
        {activeTab === 'dashboard' && (
            <div className="stats-grid">
                <div style={{ background:'#fff', padding:20, borderRadius:16, border:'1px solid #e2e8f0' }}>
                    <div style={{color:'#64748b', fontSize:13, fontWeight:600}}>USERS ทั้งหมด</div>
                    <div style={{fontSize:32, fontWeight:800, color:'#3b82f6'}}>Active</div>
                </div>
                <div style={{ background:'#fff', padding:20, borderRadius:16, border:'1px solid #e2e8f0' }}>
                    <div style={{color:'#64748b', fontSize:13, fontWeight:600}}>ระบบคนขับ</div>
                    <div style={{fontSize:32, fontWeight:800, color:'#f97316'}}>Online</div>
                </div>
                <div style={{ background:'#fff', padding:20, borderRadius:16, border:'1px solid #e2e8f0' }}>
                    <div style={{color:'#64748b', fontSize:13, fontWeight:600}}>สถานะระบบ</div>
                    <div style={{fontSize:32, fontWeight:800, color:'#10b981'}}>Normal</div>
                </div>
            </div>
        )}

        {activeTab === 'users' && <UsersTable />}
        {activeTab === 'drivers' && <DriversManagement />}
        {activeTab === 'trips' && <TripsManagement />}

      </main>
    </div>
  )
}