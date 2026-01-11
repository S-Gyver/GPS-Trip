import { useEffect, useState } from 'react'
import PageContainer from '../../components/layout/PageContainer/PageContainer'

const BASE_IMG = 'http://localhost/tripsync_api/'

export default function CarSchedulePage() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]) // Default Today
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchSchedule()
  }, [date])

  const fetchSchedule = async () => {
    setLoading(true)
    try {
      const res = await fetch(`http://localhost/tripsync_api/api/booking/check_car_schedule.php?date=${date}`)
      const json = await res.json()
      if (json.ok) setCars(json.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContainer>
      <div style={{maxWidth: 800, margin: '0 auto'}}>
        <h1 style={{fontSize: 28, marginBottom: 10}}>📅 ตารางงานรถ (Car Schedule)</h1>
        
        {/* Date Picker */}
        <div style={{marginBottom: 30, background:'#fff', padding:20, borderRadius:12, border:'1px solid #e2e8f0', display:'flex', alignItems:'center', gap:15}}>
            <label style={{fontWeight:'bold'}}>เลือกวันที่ตรวจสอบ:</label>
            <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                style={{padding:'8px 12px', borderRadius:6, border:'1px solid #cbd5e1', fontSize:16}} 
            />
        </div>

        {loading && <div style={{textAlign:'center'}}>⏳ กำลังตรวจสอบตารางงาน...</div>}

        <div style={{display:'flex', flexDirection:'column', gap:15}}>
            {cars.map(c => (
                <div key={c.user_id} style={{
                    display:'flex', alignItems:'center', justifyContent:'space-between',
                    padding: 20, background: '#fff', borderRadius: 16,
                    border: c.is_busy ? '2px solid #fecaca' : '2px solid #bbf7d0', // แดงอ่อน vs เขียวอ่อน
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    opacity: c.is_busy ? 0.9 : 1
                }}>
                    <div style={{display:'flex', alignItems:'center', gap:20}}>
                        <img 
                            src={c.vehicle_outside_img ? `${BASE_IMG}${c.vehicle_outside_img}` : 'https://placehold.co/100'} 
                            style={{width:80, height:60, objectFit:'cover', borderRadius:8, background:'#eee'}} 
                        />
                        <div>
                            <h3 style={{margin:'0 0 5px 0', color:'#1e293b'}}>{c.car_brand} {c.car_model}</h3>
                            <div style={{fontSize:14, color:'#64748b'}}>
                                ทะเบียน: <span style={{background:'#0f172a', color:'#fff', padding:'2px 6px', borderRadius:4}}>{c.license_plate}</span>
                                <span style={{marginLeft:10}}>คนขับ: {c.first_name} {c.last_name}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{textAlign:'right'}}>
                        {c.is_busy ? (
                            <>
                                <div style={{color:'#dc2626', fontWeight:'bold', fontSize:16, marginBottom:5}}>❌ ไม่ว่าง</div>
                                <div style={{fontSize:12, color:'#991b1b', background:'#fee2e2', padding:'4px 8px', borderRadius:6}}>
                                    วิ่ง: {c.trip_info.from_location} ➝ {c.trip_info.to_location} <br/>
                                    เวลา: {c.trip_info.depart_time.substring(0,5)} น.
                                </div>
                            </>
                        ) : (
                            <div style={{color:'#16a34a', fontWeight:'bold', fontSize:16, background:'#dcfce7', padding:'6px 15px', borderRadius:20}}>
                                ✅ ว่าง
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>

      </div>
    </PageContainer>
  )
}