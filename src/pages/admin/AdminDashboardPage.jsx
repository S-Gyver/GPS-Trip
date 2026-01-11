import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminDashboardPage.css'

// ✅ Import Components ที่เราแยกไว้
import UsersTable from './components/UsersTable'
import DriversManagement from './components/DriversManagement'
import TripsManagement from './components/TripsManagement'

// ================= MAIN PAGE =================
export default function AdminDashboardPage() {
  const navigate = useNavigate()
  
  // โหลด Tab ล่าสุดจาก localStorage หรือเริ่มที่ dashboard
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('admin_active_tab') || 'dashboard'
  })

  useEffect(() => {
    localStorage.setItem('admin_active_tab', activeTab)
  }, [activeTab])

  // เพิ่ม total_drivers เข้าไปใน state stats
  const [stats, setStats] = useState({ 
    total_users: 0, 
    total_drivers: 0, 
    pending_drivers: 0, 
    today_trips: 0 
  })

  useEffect(() => {
    if (activeTab === 'dashboard') {
        fetch('http://localhost/tripsync_api/api/admin/get_dashboard_stats.php', { credentials: 'include' })
          .then(r => r.json())
          .then(d => { 
            if (d.ok) setStats(d.data) 
          })
          .catch(console.error)
    }
  }, [activeTab])

  const handleLogout = () => {
    localStorage.removeItem('ts_user')
    localStorage.removeItem('ts_token')
    localStorage.removeItem('admin_active_tab')
    navigate('/login')
  }

  // ฟังก์ชัน render เนื้อหาตาม Tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="stats-grid">
            {/* 1. คลิกแล้วไปหน้าจัดการ User */}
            <div className="stat-card" onClick={() => setActiveTab('users')} style={{ cursor: 'pointer' }}>
              <div className="stat-label">USERS ทั้งหมด</div>
              <div className="stat-value text-blue">{stats.total_users}</div>
            </div>
            
            {/* 2. คลิกแล้วไปหน้าจัดการคนขับ (รายชื่อคนขับ) */}
            <div className="stat-card" onClick={() => setActiveTab('drivers')} style={{ cursor: 'pointer' }}>
              <div className="stat-label">จำนวน คนขับ</div>
              <div className="stat-value" style={{color: '#6366f1'}}>{stats.total_drivers}</div>
            </div>

            {/* 3. คลิกแล้วไปหน้าจัดการคนขับ (รออนุมัติ) */}
            <div className="stat-card" onClick={() => setActiveTab('drivers')} style={{ cursor: 'pointer' }}>
              <div className="stat-label">คนขับรอตรวจสอบ</div>
              <div className="stat-value text-orange">{stats.pending_drivers}</div>
            </div>

            {/* 4. คลิกแล้วไปหน้าจัดการทริป */}
            <div className="stat-card" onClick={() => setActiveTab('trips')} style={{ cursor: 'pointer' }}>
              <div className="stat-label">ทริปวันนี้</div>
              <div className="stat-value text-green">{stats.today_trips}</div>
            </div>
          </div>
        )
      case 'users': return <UsersTable />
      case 'drivers': return <DriversManagement />
      case 'trips': return <TripsManagement />
      
      case 'analytics':
        return <div className="ad-table-card ad-empty">📊 ส่วนแสดงกราฟและสถิติเชิงลึก (Coming Soon)</div>
      case 'export':
        return <div className="ad-table-card ad-empty">📥 หน้าสำหรับ Export ข้อมูลเป็น Excel/CSV (Coming Soon)</div>
      case 'notification':
        return <div className="ad-table-card ad-empty">📢 ระบบส่งประกาศแจ้งเตือนหา User (Coming Soon)</div>
      case 'audit':
        return <div className="ad-table-card ad-empty">📝 บันทึกประวัติการกระทำของ Admin (Coming Soon)</div>
      case 'settings':
        return <div className="ad-table-card ad-empty">⚙️ ตั้งค่าระบบ/ราคา/เงื่อนไข (Coming Soon)</div>
      default:
        return <div>Page Not Found</div>
    }
  }

  const getPageTitle = () => {
    const titles = {
        dashboard: 'Dashboard Overview',
        users: 'จัดการผู้ใช้งาน (Users)',
        drivers: 'จัดการคนขับ (Drivers)',
        trips: 'รายการจอง (Trips)',
        analytics: 'สถิติเชิงลึก (Analytics)',
        export: 'ส่งออกข้อมูล (Export Data)',
        notification: 'ประกาศ/แจ้งเตือน (Notifications)',
        audit: 'ประวัติการใช้งาน (Audit Logs)',
        settings: 'ตั้งค่าระบบ (Settings)'
    }
    return titles[activeTab] || 'Admin Portal'
  }

  return (
    <div className="ad-layout">
      <aside className="ad-sidebar">
        <div className="ad-brand"><span>⚡ TripSync</span><span className="ad-brand-badge">ADMIN</span></div>
        
        <nav className="ad-menu">
          <button className={`ad-menu-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>📊 ภาพรวม</button>
          <button className={`ad-menu-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>👥 จัดการ User</button>
          <button className={`ad-menu-item ${activeTab === 'drivers' ? 'active' : ''}`} onClick={() => setActiveTab('drivers')}>🪪 อนุมัติคนขับ</button>
          <button className={`ad-menu-item ${activeTab === 'trips' ? 'active' : ''}`} onClick={() => setActiveTab('trips')}>📅 จัดการทริป</button>

          <div style={{height: 1, background: '#334155', margin: '15px 0 10px 0', opacity: 0.5}}></div>
          <div style={{fontSize: 11, color: '#64748b', paddingLeft: 12, marginBottom: 5, fontWeight: 'bold', textTransform: 'uppercase'}}>Tools & System</div>

          <button className={`ad-menu-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>📈 Analytics (กราฟ)</button>
          <button className={`ad-menu-item ${activeTab === 'export' ? 'active' : ''}`} onClick={() => setActiveTab('export')}>📥 Export Data</button>
          <button className={`ad-menu-item ${activeTab === 'notification' ? 'active' : ''}`} onClick={() => setActiveTab('notification')}>📢 ประกาศ (Notify)</button>
          <button className={`ad-menu-item ${activeTab === 'audit' ? 'active' : ''}`} onClick={() => setActiveTab('audit')}>📝 Audit Logs</button>
          <button className={`ad-menu-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>⚙️ ตั้งค่า (Settings)</button>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <button className="ad-menu-item" onClick={handleLogout} style={{ color: '#f87171' }}>🚪 ออกจากระบบ</button>
        </div>
      </aside>

      <main className="ad-main">
        <header className="ad-header">
          <h1 className="ad-page-title">{getPageTitle()}</h1>
          <div className="ad-admin-badge">Admin Portal</div>
        </header>

        {renderContent()}
      </main>
    </div>
  )
}