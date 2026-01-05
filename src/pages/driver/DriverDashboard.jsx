import PageContainer from '../../components/layout/PageContainer/PageContainer'
import { useSession } from '../../hooks/useSession'
import { Link } from 'react-router-dom'
import './driver.css'


export default function DriverDashboard() {
  const { session } = useSession()
  const name = session?.user?.name || session?.user?.email || 'คนขับ'

  return (
    <PageContainer>
      <div className="dd-wrap">
        <h1 className="dd-title">👋 สวัสดี {name}</h1>
        <p className="dd-sub">หน้านี้คือ Driver Dashboard (Phase 1 ทำเป็นหน้าโครงก่อน)</p>

        <div className="dd-actions">
          <Link to="/booking" className="dd-link">
            ไปหน้า Booking (user)
          </Link>
        </div>
      </div>
    </PageContainer>
  )
}
