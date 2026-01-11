import { useState, useEffect } from 'react'

// URL หลักสำหรับรูปภาพ (ถ้ามี Config กลางให้ย้ายไปใช้ตัวนั้น)
const BASE_IMG_URL = "http://localhost/tripsync_api/"

export default function StepSummary({ watch, vehicleType, tripType, seatsLeft }) {
  const days = watch('days') || []
  const companions = watch('companions') || []
  const submitListLater = watch('submitListLater') // ดึงค่า Checkbox

  // เช็คว่ามีผู้ร่วมเดินทางหรือไม่
  const hasCompanions = submitListLater || (companions.length > 0 && companions.some(c => c.fullName))

  // --- ดึงข้อมูลรถที่เลือก ---
  const selectedDriverId = watch('selectedDriverId')
  const [driver, setDriver] = useState(null)

  useEffect(() => {
    if (!selectedDriverId) return

    fetch(`${BASE_IMG_URL}api/booking/get_available_drivers.php`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          const found = data.data.find(d => String(d.user_id) === String(selectedDriverId))
          setDriver(found)
        }
      })
      .catch(console.error)
  }, [selectedDriverId])

  // Helper สร้าง URL รูป
  const getImgUrl = (filename) => {
    if (!filename) return null
    if (filename.startsWith('http')) return filename
    return `${BASE_IMG_URL}${filename.replace(/\\/g, '/')}`
  }

  // ✅ คำนวณราคา (ราคาต่อวัน * จำนวนวัน)
  const totalDays = days.length > 0 ? days.length : 1
  const pricePerDay = driver ? parseInt(driver.price_per_day || 0) : 0
  const totalPrice = pricePerDay * totalDays

  return (
    <div className="bk-summary">
      <h2 className="bk-sum-title">สรุปข้อมูลการจอง</h2>

      {/* --- ส่วนที่ 1: รถและคนขับที่เลือก --- */}
      {driver && (
        <div className="bk-section" style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
          <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#1e293b' }}>🚗 รถและคนขับที่เลือก</h3>
          <div style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            background: '#fff7ed',
            padding: '15px',
            borderRadius: '12px',
            border: '1px solid #ffedd5'
          }}>
            {/* รูปภาพ */}
            <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
              <div style={{ width: '120px', height: '90px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', background: '#f0f0f0' }}>
                <img
                  src={getImgUrl(driver.vehicle_outside_img) || 'https://placehold.co/400x300?text=No+Vehicle'}
                  alt="Vehicle"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=Error'; }}
                />
              </div>
              <div style={{ width: '90px', height: '90px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', background: '#f0f0f0' }}>
                <img
                  src={getImgUrl(driver.driver_avatar) || 'https://placehold.co/150?text=No+Driver'}
                  alt="Driver"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = 'https://placehold.co/150?text=User'; }}
                />
              </div>
            </div>

            {/* รายละเอียด */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#ea580c', marginBottom: '8px' }}>
                {driver.first_name} {driver.last_name}
              </div>
              <div style={{ fontSize: '14px', color: '#475569', display: 'grid', gap: '4px' }}>
                <div>🚘 <b>รถ:</b> {driver.car_brand} {driver.car_model}</div>
                <div>🔢 <b>ทะเบียน:</b> {driver.license_plate}</div>
                <div>📞 <b>เบอร์ติดต่อ:</b> {driver.phone}</div>
              </div>
              {/* แสดงราคาคำนวณ */}
              <div style={{ fontSize: '15px', color: '#16a34a', fontWeight: 'bold', marginTop: '8px', padding: '4px 8px', background: '#dcfce7', borderRadius: '4px', display: 'inline-block' }}>
                💰 ค่าเช่ารวม: {pricePerDay.toLocaleString()} x {totalDays} วัน = {totalPrice.toLocaleString()} บาท
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- ส่วนที่ 2: ข้อมูลทั่วไป --- */}
      <div className="bk-section" style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#1e293b' }}>📋 ข้อมูลทั่วไป</h3>
        <div className="bk-sum-grid">
          <div className="bk-sum-item">
            <div className="bk-sum-k">ประเภทรถ</div>
            <div className="bk-sum-v">
              {vehicleType === 'van' ? '🚐 รถตู้' : vehicleType === 'bus' ? '🚌 รถบัส' : '🚗 รถยนต์'}
            </div>
          </div>
          <div className="bk-sum-item">
            <div className="bk-sum-k">รูปแบบ</div>
            <div className="bk-sum-v">
              {tripType === 'oneway' ? 'เที่ยวเดียว' : 'ไป-กลับ'}
            </div>
          </div>
          <div className="bk-sum-item">
            <div className="bk-sum-k">จำนวนผู้โดยสาร</div>
            <div className="bk-sum-v">{watch('passengersCount')} ท่าน</div>
          </div>
          <div className="bk-sum-item">
            <div className="bk-sum-k">วัตถุประสงค์</div>
            <div className="bk-sum-v">{watch('purpose') || '-'}</div>
          </div>
        </div>
      </div>

      {/* --- ส่วนที่ 3: เส้นทางรายวัน --- */}
      <div className="bk-section" style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#1e293b' }}>🗺️ รายละเอียดเส้นทาง</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {days.map((d, i) => (
            <div key={i} style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px' }}>
                <strong style={{ color: '#0f172a' }}>วันที่ {i + 1}</strong>
                <span style={{ color: '#64748b' }}>
                  {d.travelDate ? new Date(d.travelDate).toLocaleDateString('th-TH') : 'ไม่ระบุวันที่'}
                  &nbsp;({d.travelTime || '--:--'})
                </span>
              </div>

              <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#22c55e' }}>🚩 เริ่มต้น:</span>
                  <b>{d.start?.label || '-'}</b>
                </div>

                {d.stops?.map((s, idx) => (
                  (s.place || s.time) && (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '10px', color: '#64748b' }}>
                      <span>📍 แวะ:</span>
                      <span>{s.place}</span>
                      {s.time && <span style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '12px' }}>⏱️ {s.time}</span>}
                    </div>
                  )
                ))}

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#ef4444' }}>🏁 ปลายทาง:</span>
                  <b>{d.end?.label || '-'}</b>
                </div>

                {d.note && (
                  <div style={{ marginTop: '8px', padding: '8px', background: '#fff', borderRadius: '4px', fontSize: '13px', color: '#64748b', border: '1px dashed #cbd5e1' }}>
                    📝 <b>หมายเหตุ:</b> {d.note}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- ส่วนที่ 4: ผู้ร่วมเดินทาง --- */}
      {hasCompanions && (
        <div className="bk-section" style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
          <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#1e293b' }}>
            👥 ผู้ร่วมเดินทาง 
            {!submitListLater && ` (${companions.length})`}
          </h3>
          
          {submitListLater ? (
             <div style={{color: '#eab308', fontStyle: 'italic', background: '#fefce8', padding: '10px', borderRadius: '6px', border: '1px solid #fef08a'}}>
                ⚠️ ผู้จองจะดำเนินการส่งรายชื่อให้ภายหลัง
             </div>
          ) : (
             <ul style={{ margin: 0, paddingLeft: '20px', color: '#334155' }}>
                {companions.map((c, i) => (
                  <li key={i} style={{ marginBottom: '8px', lineHeight: '1.6' }}>
                    <span style={{ fontWeight: 'bold', marginRight: '8px' }}>{c.fullName || '-'}</span>
                    {c.phone1 && <span style={{ color: '#64748b', fontSize: '14px', marginRight: '8px' }}>📞 {c.phone1}</span>}
                    {c.phone2 && <span style={{ color: '#64748b', fontSize: '14px', marginRight: '8px' }}>, {c.phone2}</span>}
                    {c.email && <span style={{ color: '#94a3b8', fontSize: '13px' }}>✉️ {c.email}</span>}
                  </li>
                ))}
             </ul>
          )}
        </div>
      )}

      {/* --- ส่วนที่ 5: การติดต่อ & เงื่อนไข --- */}
      <div className="bk-section">
        <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#1e293b' }}>📞 การติดต่อ & เงื่อนไข</h3>
        <div className="bk-sum-grid">
          <div className="bk-sum-item">
            <div className="bk-sum-k">ผู้ประสานงาน</div>
            <div className="bk-sum-v">
              {watch('coordinatorName')} <br />
              {watch('coordinatorEmail') && <span style={{fontSize: '13px', color: '#64748b'}}>✉️ {watch('coordinatorEmail')}<br/></span>}
              {watch('coordinatorPhone1') && <span>📞 {watch('coordinatorPhone1')}</span>}
              <br />
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                {watch('showCoordinatorToPassengers') ? '(เปิดเผยเบอร์ให้ผู้ร่วมทาง)' : '(ไม่เปิดเผยเบอร์)'}
              </span>
            </div>
          </div>
          
          <div className="bk-sum-item">
            <div className="bk-sum-k">การอนุมัติ</div>
            <div className="bk-sum-v">
              {watch('needApproval')
                ? <div>
                    <span style={{ color: '#eab308' }}>⚠️ รออนุมัติโดย: {watch('approverName')}</span>
                    {watch('approverEmail') && <div style={{fontSize: '12px', color: '#94a3b8'}}>({watch('approverEmail')})</div>}
                  </div>
                : <span style={{ color: '#22c55e' }}>✅ ไม่ต้องขออนุมัติ</span>}
            </div>
          </div>
          
          <div className="bk-sum-item">
            <div className="bk-sum-k">Join ทริป</div>
            <div className="bk-sum-v">
              {watch('openJoin')
                ? `👐 เปิดรับเพิ่ม ${watch('seatCapacity') || 0} ที่นั่ง`
                : '🔒 ส่วนตัว (ไม่รับคนนอก)'}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}