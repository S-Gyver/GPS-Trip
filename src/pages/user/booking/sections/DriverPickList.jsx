import { useState, useEffect } from 'react'

// 1. กำหนด URL ของ Server
const BASE_IMG_URL = "http://localhost/tripsync_api/"

export default function DriverPickList({
  vehicleType,
  selectedId,
  onSelect,
}) {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(false)
  const [previewDriver, setPreviewDriver] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch('http://localhost/tripsync_api/api/booking/get_available_drivers.php')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setDrivers(data.data)
        }
      })
      .catch((err) => console.error('Error:', err))
      .finally(() => setLoading(false))
  }, [])

  const getImg = (path) => path ? `${BASE_IMG_URL}${path}` : 'https://placehold.co/400x300?text=No+Image'
  const getAvatar = (path) => path ? `${BASE_IMG_URL}${path}` : 'https://placehold.co/150?text=User'

  if (!vehicleType) return null

  const filtered = drivers.filter((d) => d.vehicle_type === vehicleType)

  const vehicleLabelMap = {
    van: 'รถตู้',
    bus: 'รถบัส',
    car: 'รถยนต์'
  }
  const vehicleLabel = vehicleLabelMap[vehicleType] || vehicleType

  return (
    <div className="pick-wrap">
      <div className="pick-head">
        <h2 className="pick-title">เลือกรถ/คนขับ ({vehicleLabel})</h2>
        <div className="pick-sub">เลือก 1 รายการเพื่อจอง</div>
      </div>

      {loading && <div style={{padding: 20}}>กำลังโหลดข้อมูลรถ...</div>}

      {!loading && filtered.length === 0 && (
        <div style={{padding: 20, textAlign: 'center', background: '#f8fafc', borderRadius: 8, color: '#64748b'}}>
           ❌ ไม่พบรถประเภทนี้ที่พร้อมให้บริการ
        </div>
      )}

      <div className="pick-list" style={{display:'flex', flexDirection:'column', gap:'15px'}}>
        {filtered.map((d) => {
          const active = selectedId === d.user_id 

          return (
            <div
              key={d.user_id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect?.(d.user_id)}
              style={{ 
                cursor: 'pointer', 
                display: 'flex', 
                gap: '20px', 
                alignItems: 'center',
                padding: '15px',
                borderRadius: '12px',
                position: 'relative', // เพื่อวางไอคอน checkmark
                transition: 'all 0.2s ease',
                
                // ✅ ปรับสไตล์ตอนเลือก (Active State)
                backgroundColor: active ? '#fff7ed' : '#fff', 
                border: active ? '2px solid #f97316' : '1px solid #e2e8f0',
                boxShadow: active ? '0 4px 15px rgba(249, 115, 22, 0.15)' : '0 1px 3px rgba(0,0,0,0.05)',
                transform: active ? 'translateY(-2px)' : 'none'
              }}
            >
              {/* ✅ ไอคอน Checkmark มุมขวาบน (แสดงเฉพาะตอนเลือก) */}
              {active && (
                <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    background: '#f97316',
                    color: '#fff',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    border: '2px solid #fff',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}>
                    ✓
                </div>
              )}

              {/* --- โซนรูปภาพ (ซ้าย) --- */}
              <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                <div style={{ width: '120px', height: '90px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee' }}>
                   <img src={getImg(d.vehicle_outside_img)} alt="Vehicle" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                </div>
                <div style={{ width: '90px', height: '90px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee' }}>
                   <img src={getAvatar(d.driver_avatar)} alt="Driver" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                </div>
              </div>

              {/* --- โซนข้อมูล (ขวา) --- */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>
                  {d.first_name} {d.last_name}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '5px', fontSize: '14px', color: '#475569' }}>
                    <div>🚗 <b>รถ:</b> {d.car_brand} {d.car_model}</div>
                    <div>🔢 <b>ทะเบียน:</b> {d.license_plate}</div>
                    <div>💺 <b>ที่นั่ง:</b> {d.seats} ที่นั่ง</div>
                    <div>📞 <b>เบอร์:</b> {d.phone}</div>
                </div>
                <div style={{ marginTop: '4px', fontSize: '15px', color: '#10b981', fontWeight: 'bold' }}>
                   💰 ราคา: {parseInt(d.price_per_day || 0).toLocaleString()} บาท/วัน
                </div>
              </div>

              {/* ปุ่มดูรูปเพิ่มเติม */}
              <button
                type="button"
                style={{
                    alignSelf: 'flex-start',
                    marginTop: '5px',
                    background: 'transparent',
                    border: 'none',
                    color: '#f97316',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    textDecoration: 'underline'
                }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setPreviewDriver(d) 
                }}
              >
                ดูรูปภายใน
              </button>
            </div>
          )
        })}
      </div>

      {/* --- Modal แสดงรูปเพิ่มเติม --- */}
      {previewDriver && (
        <div className="modal-overlay" onClick={() => setPreviewDriver(null)} style={{
            position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', 
            zIndex:9999, display:'flex', justifyContent:'center', alignItems:'center'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
              background:'#fff', maxWidth: '800px', width: '90%', maxHeight:'90vh', overflowY:'auto', borderRadius:12, padding:0
          }}>
            <div className="modal-header" style={{padding:'15px 20px', borderBottom:'1px solid #eee', display:'flex', justifyContent:'space-between'}}>
              <h3 style={{margin:0}}>สภาพรถ: {previewDriver.license_plate}</h3>
              <button onClick={() => setPreviewDriver(null)} style={{border:'none', background:'none', fontSize:24, cursor:'pointer'}}>&times;</button>
            </div>
            
            <div className="modal-body" style={{padding:20}}>
                <h5 style={{marginTop: 0}}>รูปรถด้านนอก</h5>
                <img 
                    src={getImg(previewDriver.vehicle_outside_img)} 
                    style={{width: '100%', borderRadius: 8, marginBottom: 20, maxHeight: '400px', objectFit: 'contain', background:'#f9f9f9'}}
                    alt="Outside"
                />

                <h5>ภายในรถ</h5>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 15}}>
                    {[1,2,3,4].map(num => (
                        <div key={num} style={{display: 'flex', flexDirection: 'column'}}>
                            <img 
                                src={getImg(previewDriver[`vehicle_inside_${num}`])}
                                style={{width: '100%', height: '200px', objectFit: 'contain', borderRadius: 6, border: '1px solid #eee', background:'#f9f9f9'}}
                                alt={`Inside ${num}`}
                            />
                            <div style={{fontSize: 12, textAlign: 'center', color: '#666', marginTop:5}}>มุมที่ {num}</div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="modal-footer" style={{padding:15, textAlign:'right', borderTop:'1px solid #eee'}}>
               <button onClick={() => setPreviewDriver(null)} className="btn-xs" style={{padding:'8px 16px', cursor:'pointer', background: '#64748b', color: '#fff', border:'none', borderRadius: 4}}>ปิด</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}