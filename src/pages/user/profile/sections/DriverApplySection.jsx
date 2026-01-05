import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../../../components/ui/Button/Button'
import DriverSummaryCard from '../../../driver/DriverSummaryCard'
import { getDriverProfile } from '../../../driver/hooks/driverApi' // ✅ เรียกใช้ API ตัวกลาง (path ถูกชัวร์)
import './DriverApplySection.css'

export default function DriverApplySection({ onGoRegister }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [driverData, setDriverData] = useState(null)
  const [error, setError] = useState('')

  const handleGo = () => {
    if (onGoRegister) {
      onGoRegister()
    } else {
      navigate('/driver/register')
    }
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError('')
        
        // 1. เรียก API
        const res = await getDriverProfile()

        if (res.ok && res.json?.data) {
          const d = res.json.data
          // 2. เช็คว่ามีข้อมูลคนขับจริงไหม (ดูจาก vehicle_type หรือ id ก็ได้)
          // เพราะ API เรา join user มา ถ้า user มีแต่ driver ไม่มี ข้อมูล driver จะเป็น null
          if (d.vehicle_type || d.license_plate) {
            setDriverData(d)
          } else {
            setDriverData(null) // ยังไม่สมัคร
          }
        } else {
          setDriverData(null)
        }
      } catch (e) {
        console.error(e)
        // กรณี Error จริงๆ ค่อยโชว์ (ถ้าแค่ 404 หรือไม่เจอข้อมูล ถือว่าปกติสำหรับคนยังไม่สมัคร)
        // setError('โหลดข้อมูลไม่สำเร็จ') 
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const hasData = !!driverData

  return (
    <div className="up-section">
      <h2 className="up-h2">ข้อมูลของผู้สมัครเป็นคนขับ</h2>

      {loading ? (
        <div className="up-box da-loading">กำลังโหลดข้อมูล...</div>
      ) : hasData ? (
        // ✅ 3. ถ้ามีข้อมูล โชว์การ์ดสรุป (ส่ง data ก้อนเดียวไปเลย เดี๋ยวการ์ดไปแกะเอง)
        <div className="up-box da-summaryWrap">
          <DriverSummaryCard raw={driverData} />
        </div>
      ) : (
        // ❌ 4. ถ้าไม่มีข้อมูล โชว์คำแนะนำ + ปุ่มสมัคร
        <div className="up-box">
          <div className="up-box-title">สิ่งที่ต้องเตรียม</div>
          <ul className="up-list">
            <li>ข้อมูลรถ + ทะเบียน</li>
            <li>รูปถ่ายใบขับขี่ / บัตรประชาชน</li>
            <li>เอกสารยืนยันตัวตน</li>
          </ul>
        </div>
      )}

      {error && <div className="up-box da-error">{error}</div>}

      <div className="up-actions da-actions">
        <Button type="button" onClick={handleGo} style={{ width: '100%' }}>
          {hasData ? 'แก้ไขข้อมูลการสมัคร' : 'สมัครเป็นคนขับ'}
        </Button>
      </div>
    </div>
  )
}