import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer/PageContainer'
import Swal from 'sweetalert2'

const API_URL = 'http://localhost/tripsync_api/api/booking/get_public_trips.php'
const BASE_IMG = 'http://localhost/tripsync_api/'

const vehicleMap = {
    van: 'รถตู้',
    car: 'รถเก๋ง',
    bus: 'รถบัส',
    minibus: 'มินิบัส'
}

export default function JoinTripsPage() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    try {
      setLoading(true)
      const res = await fetch(API_URL, { credentials: 'include' })
      const json = await res.json()
      if (json.ok) {
        setTrips(json.data)
      } else {
        console.error(json.message)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinClick = (trip) => {
    let timelineHtml = ''
    if (trip.itinerary_data && trip.itinerary_data.length > 0) {
        timelineHtml = `<div style="text-align:left; background:#f8fafc; padding:15px; border-radius:12px; font-size:14px; max-height:200px; overflow-y:auto; border:1px solid #e2e8f0;">`
        trip.itinerary_data.forEach((day, idx) => {
            timelineHtml += `
                <div style="margin-bottom:10px;">
                    <div style="color:#d97706; font-weight:bold; margin-bottom:4px;">📅 วันที่ ${idx + 1}</div>
                    <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                        <span style="color:#16a34a;">🚩 ${day.start?.label}</span> 
                        <span style="color:#94a3b8;">➝</span> 
                        <span style="color:#dc2626;">🏁 ${day.end?.label}</span>
                    </div>
            `
            if (day.stops && day.stops.length > 0) {
                timelineHtml += `<div style="margin-left:15px; border-left:2px solid #e2e8f0; padding-left:10px; margin-top:5px;">`
                day.stops.forEach(stop => {
                    timelineHtml += `<div style="font-size:13px; color:#64748b; margin-bottom:2px;">📍 แวะ: ${stop.place} (${stop.time})</div>`
                })
                timelineHtml += `</div>`
            }
            timelineHtml += `</div>`
            if (idx < trip.itinerary_data.length - 1) timelineHtml += `<hr style="margin:10px 0; border:0; border-top:1px dashed #cbd5e1;">`
        })
        timelineHtml += `</div>`
    } else {
        timelineHtml = `<div style="text-align:center; color:#94a3b8; padding:10px; font-style:italic;">- ไม่มีรายละเอียดเส้นทาง -</div>`
    }

    const typeLabel = vehicleMap[trip.vehicle_type] || trip.vehicle_type || 'ไม่ระบุประเภท'

    Swal.fire({
      title: `<div style="display:flex; align-items:center; gap:10px; justify-content:center;">
                <span style="font-size:24px;">📋</span> รายละเอียดทริป
              </div>`,
      width: 700,
      html: `
        <div style="text-align:left; font-size:14px; line-height:1.6; color:#334155;">
          
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-bottom:20px;">
              <div style="background:#eff6ff; padding:15px; border-radius:12px; border:1px solid #bfdbfe;">
                 <h4 style="margin:0 0 8px 0; color:#2563eb; font-size:15px; border-bottom:1px solid #dbeafe; padding-bottom:5px;">👤 ผู้ประสานงาน</h4>
                 <b>ชื่อ:</b> ${trip.owner_name} <br/>
                 <b>โทร:</b> <span style="color:#d97706;">${trip.owner_phone || '-'}</span> <br/>
                 <b>Email:</b> ${trip.owner_email || '-'}
              </div>

              <div style="background:#f0fdf4; padding:15px; border-radius:12px; border:1px solid #bbf7d0;">
                 <h4 style="margin:0 0 8px 0; color:#16a34a; font-size:15px; border-bottom:1px solid #dcfce7; padding-bottom:5px;">🚙 ข้อมูลรถ & คนขับ</h4>
                 <div style="display:flex; gap:10px; align-items:start;">
                    <img src="${trip.car_image ? BASE_IMG + trip.car_image : 'https://placehold.co/100'}" 
                         style="width:60px; height:60px; object-fit:cover; border-radius:8px; border:2px solid #fff; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                    <div style="font-size:13px;">
                        <b>${typeLabel}</b> (${trip.car_brand}) <br/>
                        ทะเบียน: <span style="background:#fff; padding:2px 6px; border-radius:4px; font-weight:bold; border:1px solid #ddd;">${trip.license_plate}</span> <br/>
                        คนขับ: ${trip.driver_fname}
                    </div>
                 </div>
              </div>
          </div>

          <h4 style="margin:0 0 10px 0; color:#475569; font-size:16px;">🗺️ เส้นทาง & เวลาเดินทาง</h4>
          <div style="background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:15px; margin-bottom:15px;">
             <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:15px;">
                <div>🕒 <b>ออกเดินทาง:</b> ${trip.depart_time.substring(0,5)} น.</div>
                <div>💺 <b>ว่าง:</b> <span style="color:#16a34a; font-weight:bold;">${trip.seats_left}</span> ที่นั่ง</div>
             </div>
             <div style="display:flex; align-items:center; gap:10px; background:#f8fafc; padding:10px; border-radius:8px;">
                <span style="font-weight:bold;">${trip.from_location}</span>
                <span style="flex:1; border-bottom:2px dashed #cbd5e1; position:relative; top:-4px;"></span>
                <span style="font-weight:bold;">${trip.to_location}</span>
             </div>
          </div>

          ${timelineHtml}

        </div>
      `,
      showCancelButton: true,
      confirmButtonText: '🙋‍♂️ ขอร่วมทาง',
      cancelButtonText: '❌ ปิดหน้าต่าง',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#94a3b8',
      focusConfirm: false
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/join-request', { state: { tripData: trip } })
      }
    })
  }

  return (
    <PageContainer>
      <div style={{maxWidth: 1000, margin: '0 auto'}}>
        <h1 style={{fontSize: 28, marginBottom: 10}}>🎒 หาเพื่อนร่วมทาง (Join Trip)</h1>
        <p style={{color: '#64748b', marginBottom: 30}}>ทริปที่เปิดรับเพื่อนร่วมทาง แชร์ค่ารถ และเดินทางไปด้วยกัน</p>

        {loading && <div style={{textAlign:'center'}}>กำลังโหลด...</div>}

        {!loading && trips.length === 0 && (
            <div style={{textAlign:'center', padding:50, background:'#f8fafc', borderRadius:12}}>
                🚫 ยังไม่มีทริปที่เปิดรับเพื่อนร่วมทางในขณะนี้
            </div>
        )}

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20}}>
          {trips.map((t) => {
            const typeLabel = vehicleMap[t.vehicle_type] || t.vehicle_type || 'รถ'
            
            return (
                <div key={t.id} style={{
                    background: '#fff', borderRadius: 16, overflow: 'hidden', 
                    border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                    transition: 'transform 0.2s', display:'flex', flexDirection:'column'
                }}>
                
                {/* Cover Image */}
                <div style={{height: 200, background: '#f8fafc', position:'relative', borderBottom:'1px solid #eee', display:'flex', justifyContent:'center', alignItems:'center'}}>
                    <img 
                        src={t.car_image ? `${BASE_IMG}${t.car_image}` : 'https://placehold.co/600x400?text=No+Car+Image'} 
                        style={{width:'100%', height:'100%', objectFit:'contain'}} 
                    />
                    <div style={{
                        position:'absolute', top:10, right:10, 
                        background:'#16a34a', color:'#fff', padding:'4px 12px', 
                        borderRadius:20, fontSize:12, fontWeight:'bold', boxShadow:'0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        ว่าง {t.seats_left} ที่นั่ง
                    </div>
                </div>

                {/* Content */}
                <div style={{padding: 20, flex:1, display:'flex', flexDirection:'column'}}>
                    <div style={{fontSize:13, color:'#64748b', marginBottom:5}}>
                        📅 {new Date(t.travel_date).toLocaleDateString('th-TH')} • ⏰ {t.depart_time.substring(0,5)} น.
                    </div>
                    <h3 style={{margin:'0 0 10px 0', fontSize:18, color:'#1e293b'}}>
                        {t.from_location} ➝ {t.to_location}
                    </h3>
                    
                    <div style={{fontSize:14, color:'#475569', marginBottom:15, lineHeight: 1.6, background:'#f1f5f9', padding:10, borderRadius:8}}>
                        🚐 <b>ประเภท:</b> {typeLabel} <br/>
                        🚗 <b>รถ:</b> {t.car_brand} {t.car_model} <br/>
                        👤 <b>ผู้จัด:</b> {t.owner_name}
                    </div>
                    
                    <div style={{marginTop:'auto'}}>
                        <button 
                            onClick={() => handleJoinClick(t)}
                            style={{
                                width:'100%', padding:'10px', background:'#3b82f6', color:'#fff', 
                                border:'none', borderRadius:8, cursor:'pointer', fontWeight:'bold', fontSize:14
                            }}
                        >
                            🔍 ดูรายละเอียด & ขอร่วมทาง
                        </button>
                    </div>
                </div>
                </div>
            )
          })}
        </div>
      </div>
    </PageContainer>
  )
}