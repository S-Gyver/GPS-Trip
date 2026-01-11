import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer/PageContainer'
import { alertError } from '../../components/ui/alerts'
import Swal from 'sweetalert2'

const BASE_API = 'http://localhost/tripsync_api/api'
const BASE_IMG = 'http://localhost/tripsync_api/'

export default function JoinRequestPage() {
  const location = useLocation()
  const navigate = useNavigate()
  
  // รับข้อมูลทริปที่ส่งมาจากหน้า JoinTripsPage
  const { tripData } = location.state || {}

  // State สำหรับฟอร์ม
  const [formData, setFormData] = useState({
    seats: 1,
    contact_name: '',
    contact_phone: '',
    note: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ถ้าไม่มีข้อมูลทริปส่งมา ให้ดีดกลับ
  useEffect(() => {
    if (!tripData) {
      navigate('/join-trips')
    }
  }, [tripData, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.seats > tripData.seats_left) {
        alertError('ที่นั่งไม่พอ', `ทริปนี้เหลือที่นั่งว่างแค่ ${tripData.seats_left} ที่นั่ง`)
        return
    }
    if (!formData.contact_phone) {
        alertError('ข้อมูลไม่ครบ', 'กรุณาระบุเบอร์ติดต่อกลับ')
        return
    }

    const confirm = await Swal.fire({
        title: 'ยืนยันการขอเข้าร่วม?',
        text: `คุณต้องการขอเข้าร่วมทริปนี้จำนวน ${formData.seats} ที่นั่ง`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก'
    })

    if (!confirm.isConfirmed) return

    try {
        setIsSubmitting(true)
        const res = await fetch(`${BASE_API}/booking/create_join_request.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                trip_id: tripData.id,
                ...formData
            }),
            credentials: 'include'
        })
        const json = await res.json()

        if (json.ok) {
            await Swal.fire('สำเร็จ!', 'ส่งคำขอเข้าร่วมเรียบร้อยแล้ว กรุณารอการตอบรับจากเจ้าของทริป', 'success')
            navigate('/join-trips')
        } else {
            alertError('เกิดข้อผิดพลาด', json.message)
        }
    } catch (err) {
        console.error(err)
        alertError('Error', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้')
    } finally {
        setIsSubmitting(false)
    }
  }

  if (!tripData) return null

  return (
    <PageContainer>
      <div style={{ maxWidth: 900, margin: '0 auto', paddingBottom: 40 }}>
        
        <button onClick={() => navigate('/join-trips')} style={{background:'none', border:'none', cursor:'pointer', color:'#64748b', marginBottom:15, fontSize:14, display:'flex', alignItems:'center', gap:5}}>
            ⬅️ กลับไปหน้ารวมทริป
        </button>

        <h1 style={{ fontSize: 26, marginBottom: 25, color:'#1e293b' }}>📝 แบบฟอร์มขอเข้าร่วมทริป</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 30, alignItems: 'start' }}>
            
            {/* --- ฝั่งซ้าย: สรุปข้อมูลทริป --- */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 10px -2px rgba(0,0,0,0.05)' }}>
                
                {/* ✅ แก้ไขส่วนรูปภาพ: ให้แสดงเต็มใบ ไม่โดนตัด */}
                <div style={{
                    height: 200, 
                    background: '#f8fafc', 
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10
                }}>
                    <img 
                        src={tripData.car_image ? `${BASE_IMG}${tripData.car_image}` : 'https://placehold.co/600x400?text=Trip'} 
                        style={{
                            maxWidth: '100%', 
                            maxHeight: '100%', 
                            objectFit: 'contain', // สำคัญ: ปรับให้รูปไม่ล้น ไม่เบี้ยว
                            borderRadius: 8
                        }}
                    />
                </div>

                <div style={{ padding: 25 }}>
                    <h3 style={{ margin: '0 0 15px 0', color: '#1e293b', fontSize: 20 }}>
                        {tripData.from_location} ➝ {tripData.to_location}
                    </h3>
                    
                    <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.8 }}>
                        <div style={{display:'flex', justifyContent:'space-between', borderBottom:'1px dashed #eee', paddingBottom:8, marginBottom:8}}>
                            <span>📅 วันเดินทาง:</span> 
                            <span style={{fontWeight:'bold', color:'#334155'}}>{new Date(tripData.travel_date).toLocaleDateString('th-TH')}</span>
                        </div>
                        <div style={{display:'flex', justifyContent:'space-between', borderBottom:'1px dashed #eee', paddingBottom:8, marginBottom:8}}>
                            <span>⏰ เวลา:</span> 
                            <span style={{fontWeight:'bold', color:'#334155'}}>{tripData.depart_time.substring(0,5)} น.</span>
                        </div>
                        <div style={{display:'flex', justifyContent:'space-between', borderBottom:'1px dashed #eee', paddingBottom:8, marginBottom:8}}>
                            <span>👤 ผู้จัด:</span> 
                            <span style={{fontWeight:'bold', color:'#334155'}}>{tripData.owner_name}</span>
                        </div>
                        <div style={{display:'flex', justifyContent:'space-between', borderBottom:'1px dashed #eee', paddingBottom:8, marginBottom:8}}>
                            <span>🚗 รถ:</span> 
                            <span style={{fontWeight:'bold', color:'#334155'}}>{tripData.car_brand} {tripData.car_model}</span>
                        </div>
                        <div style={{marginTop:10, textAlign:'center', background:'#dcfce7', padding:8, borderRadius:8, color:'#166534', fontWeight:'bold'}}>
                            ✅ ที่นั่งว่าง: {tripData.seats_left} ที่นั่ง
                        </div>
                    </div>
                </div>
            </div>

            {/* --- ฝั่งขวา: แบบฟอร์ม --- */}
            <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 30, borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 4px 10px -2px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginTop: 0, marginBottom: 20, fontSize: 18, color: '#334155', borderBottom: '2px solid #f1f5f9', paddingBottom: 10 }}>
                    ข้อมูลของคุณ
                </h3>
                
                <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: '600', fontSize: 14, color:'#475569' }}>
                        จำนวนที่นั่งที่ต้องการ <span style={{color:'#ef4444'}}>*</span>
                    </label>
                    <input 
                        type="number" 
                        name="seats"
                        min="1" 
                        max={tripData.seats_left}
                        value={formData.seats}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 16 }}
                    />
                    <div style={{fontSize:13, color:'#94a3b8', marginTop:6}}>* ขอได้สูงสุด {tripData.seats_left} ที่นั่ง</div>
                </div>

                <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: '600', fontSize: 14, color:'#475569' }}>
                        ชื่อผู้ติดต่อ
                    </label>
                    <input 
                        type="text" 
                        name="contact_name"
                        value={formData.contact_name}
                        onChange={handleChange}
                        placeholder="ชื่อ-นามสกุลของคุณ"
                        style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 15 }}
                    />
                </div>

                <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: '600', fontSize: 14, color:'#475569' }}>
                        เบอร์โทรศัพท์ <span style={{color:'#ef4444'}}>*</span>
                    </label>
                    <input 
                        type="tel" 
                        name="contact_phone"
                        value={formData.contact_phone}
                        onChange={handleChange}
                        placeholder="08xxxxxxxx (เพื่อให้ผู้จัดติดต่อกลับ)"
                        required
                        style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 15 }}
                    />
                </div>

                <div style={{ marginBottom: 30 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: '600', fontSize: 14, color:'#475569' }}>
                        ข้อความถึงผู้จัด (ถ้ามี)
                    </label>
                    <textarea 
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        placeholder="เช่น จุดนัดพบที่สะดวก, สัมภาระเยอะไหม..."
                        rows="3"
                        style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #cbd5e1', resize:'vertical', fontSize: 15, fontFamily:'inherit' }}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    style={{
                        width: '100%', padding: '14px', background: isSubmitting ? '#94a3b8' : '#3b82f6', 
                        color: '#fff', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 'bold', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => !isSubmitting && (e.target.style.background = '#2563eb')}
                    onMouseOut={(e) => !isSubmitting && (e.target.style.background = '#3b82f6')}
                >
                    {isSubmitting ? '⏳ กำลังส่งข้อมูล...' : '📩 ส่งคำขอเข้าร่วม'}
                </button>
            </form>
        </div>
      </div>
    </PageContainer>
  )
}