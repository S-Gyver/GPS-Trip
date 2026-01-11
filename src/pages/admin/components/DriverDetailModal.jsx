import React from 'react'

// 1. กำหนด URL ของ Server (AppServ)
const BASE_IMG_URL = "http://localhost/tripsync_api/";

export default function DriverDetailModal({ driver, onClose }) {
  if (!driver) return null

  // ฟังก์ชันจัดการ Path รูปภาพ
  const getImgUrl = (path) => path ? `${BASE_IMG_URL}${path}` : 'https://placehold.co/400x300?text=No+Image';

  // Helper สำหรับสร้าง Card รูปภาพในส่วนเอกสารแนบ
  const renderDocImage = (imgKey, label) => (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 10, background: '#fff' }}>
      <div style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: '#475569' }}>{label}</div>
      <div style={{ background: '#f8fafc', borderRadius: 4, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <img
          src={getImgUrl(driver[imgKey])}
          alt={label}
          style={{ width: '100%', maxHeight: 250, objectFit: 'contain', cursor: 'pointer' }}
          onClick={() => window.open(getImgUrl(driver[imgKey]))}
          onError={(e) => { e.target.onError = null; e.target.src = 'https://placehold.co/400x300?text=No+Image'; }}
        />
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{
        backgroundColor: '#fff', width: '90%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto',
        borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column'
      }}>

        {/* --- Header --- */}
        <div className="modal-header" style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20 }}>รายละเอียดคนขับ: {driver.first_name} {driver.last_name}</h2>
            <div style={{ color: '#64748b', fontSize: 14 }}>ID: {driver.user_id} | สมัครเมื่อ: {new Date(driver.created_at).toLocaleString('th-TH')}</div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', fontSize: 24, cursor: 'pointer', color: '#64748b' }}>&times;</button>
        </div>

        {/* --- Body --- */}
        <div className="modal-body" style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* 1. รูปประจำตัวคนขับ */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img
              src={getImgUrl(driver.driver_avatar)}
              alt="Driver Avatar"
              style={{
                width: 120, height: 120, borderRadius: '50%', objectFit: 'cover',
                border: '4px solid #fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              onError={(e) => { e.target.src = 'https://placehold.co/150?text=Avatar'; }}
            />
             <div style={{marginTop: 10, fontWeight: 'bold', fontSize: 18}}>{driver.first_name} {driver.last_name}</div>
          </div>

          {/* 2. ข้อมูลส่วนตัว */}
          <section>
             <h4 style={{background:'#f1f5f9', padding:'8px 12px', borderRadius:6, marginBottom:12, fontSize: 16}}>👤 ข้อมูลส่วนตัว</h4>
             <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, fontSize:14, paddingLeft: 10}}>
                <div><strong>เลขบัตร ปชช.:</strong> {driver.id_card_no || '-'}</div>
                <div><strong>วันเกิด:</strong> {driver.birth_date || '-'}</div>
                <div><strong>เบอร์โทร:</strong> {driver.phone || driver.user_phone || '-'}</div>
                <div><strong>Email:</strong> {driver.email || '-'}</div>
             </div>
          </section>

          {/* 3. ข้อมูลยานพาหนะ */}
          <section>
            <h4 style={{background:'#f1f5f9', padding:'8px 12px', borderRadius:6, marginBottom:12, fontSize: 16}}>🚗 ข้อมูลยานพาหนะ</h4>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:15, fontSize:14, paddingLeft: 10}}>
               <div><strong>ประเภทรถ:</strong> <span className="badge badge-admin" style={{background:'#e2e8f0', padding:'2px 8px', borderRadius:4}}>{driver.vehicle_type}</span></div>
               <div><strong>ยี่ห้อ:</strong> {driver.vehicle_brand}</div>
               <div><strong>รุ่น:</strong> {driver.vehicle_model}</div>
               <div><strong>สี:</strong> {driver.vehicle_color}</div>
               <div><strong>ทะเบียน:</strong> <span style={{background:'#000', color:'#fff', padding:'2px 6px', borderRadius:4}}>{driver.license_plate}</span></div>
               <div><strong>ราคาเหมา/วัน:</strong> <span style={{color:'#10b981', fontWeight:'bold'}}>{parseInt(driver.price_per_day || 0).toLocaleString()} บาท</span></div>
            </div>
          </section>

          {/* ✅ 3.5 (ใหม่) รูปภาพยานพาหนะเพิ่มเติม */}
          <section>
            <h4 style={{background:'#fff7ed', color:'#c2410c', padding:'8px 12px', borderRadius:6, marginBottom:12, fontSize: 16, borderLeft: '4px solid #f97316'}}>
              📸 สภาพรถจริง (5 มุมมอง)
            </h4>
            
            <div style={{display:'flex', flexDirection:'column', gap: 20}}>
                {/* แถวบน: รูปรถด้านนอก (ใหญ่หน่อย) */}
                <div style={{display:'flex', gap:20, alignItems:'start', flexWrap:'wrap'}}>
                    <div style={{flex: 1, minWidth: '300px'}}>
                        <div style={{fontSize:13, fontWeight:'bold', marginBottom:5, color:'#444'}}>1. รูปรถด้านนอก (Side/Front)</div>
                        <img 
                            src={getImgUrl(driver.vehicle_outside_img)} 
                            alt="Outside" 
                            style={{width:'100%', height: '250px', objectFit:'cover', borderRadius:8, border:'1px solid #ddd', cursor:'pointer'}}
                            onClick={() => window.open(getImgUrl(driver.vehicle_outside_img))}
                        />
                    </div>
                </div>

                {/* แถวล่าง: รูปภายใน 4 รูป (Grid) */}
                <div>
                    <div style={{fontSize:13, fontWeight:'bold', marginBottom:8, color:'#444'}}>รูปภายในรถ (4 มุมมอง)</div>
                    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:15}}>
                        {[1, 2, 3, 4].map((num) => (
                            <div key={num}>
                                <img 
                                    src={getImgUrl(driver[`vehicle_inside_${num}`])} 
                                    alt={`Inside ${num}`} 
                                    style={{width:'100%', height:'140px', objectFit:'cover', borderRadius:6, border:'1px solid #eee', cursor:'pointer'}} 
                                    onClick={() => window.open(getImgUrl(driver[`vehicle_inside_${num}`]))}
                                />
                                <div style={{fontSize:12, color:'#666', marginTop:4, textAlign:'center'}}>ภายในมุมที่ {num}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </section>

          <hr style={{ border: 0, borderTop: '1px solid #e2e8f0' }} />

          {/* 4. เอกสารแนบ 6 รายการ */}
          <section>
            <h4 style={{ marginBottom: 20, color: '#334155', borderLeft: '4px solid #3b82f6', paddingLeft: 10 }}>
              📑 เอกสารแนบประกอบ
            </h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {renderDocImage('id_card_img', '1. รูปบัตรประชาชน')}
              {renderDocImage('driver_license_img', '2. ใบขับขี่')}
              {renderDocImage('criminal_record_img', '3. ประวัติอาชญากรรม')}
              {renderDocImage('vehicle_reg_img', '4. รูปเล่มทะเบียนรถ')}
              {renderDocImage('insurance_compulsory_img', '5. เอกสาร พ.ร.บ.')}
              {renderDocImage('insurance_commercial_img', '6. เอกสารประกันภัยพาณิชย์')}
            </div>
          </section>

        </div>

        {/* --- Footer --- */}
        <div className="modal-footer" style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', textAlign: 'right', borderRadius: '0 0 12px 12px' }}>
          <button onClick={onClose} style={{
            padding: '8px 20px', background: '#64748b', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14
          }}>
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  )
}