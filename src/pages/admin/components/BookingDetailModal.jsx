import React, { useState } from 'react'

const BASE_IMG_URL = "http://localhost/tripsync_api/";

export default function BookingDetailModal({ booking, onClose }) {
  if (!booking) return null

  // เปิดดูรายละเอียดคนขับเป็น Default
  const [showDriverDocs, setShowDriverDocs] = useState(true);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('th-TH', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
  }

  const getImgUrl = (path) => path ? `${BASE_IMG_URL}${path}` : 'https://placehold.co/400x300?text=No+Image';

  // ✅ ฟังก์ชันแสดงชื่อผู้จอง (ฉบับปรับปรุง)
  const getUserDisplayName = () => {
      const fname = booking.user_fname;
      const lname = booking.user_lname;
      const username = booking.user_username;
      
      // ถ้ามีชื่อจริง ให้แสดง "ชื่อ นามสกุล (user)"
      if (fname && lname) {
          return `${fname} ${lname} (${username || ''})`;
      }
      // ถ้าไม่มีชื่อจริง ให้แสดง username
      return username || 'ไม่ระบุชื่อ';
  }

  // Helper สร้าง Card รูปภาพเอกสาร
  const renderDocImage = (imgKey, label) => (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 10, background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
      <div style={{ fontSize: 13, fontWeight: 'bold', marginBottom: 8, color: '#334155', borderBottom:'1px dashed #eee', paddingBottom:5 }}>{label}</div>
      <div style={{ background: '#f8fafc', borderRadius: 8, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 180 }}>
        <img
          src={getImgUrl(booking[imgKey])}
          alt={label}
          style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: 'pointer', transition: 'transform 0.2s' }}
          onClick={() => window.open(getImgUrl(booking[imgKey]))}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
      </div>
    </div>
  );

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={{ margin: 0, fontSize: 22, color:'#1e293b' }}>รายละเอียดการจอง #{booking.id}</h2>
            <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>
                📅 ทำรายการเมื่อ: {new Date(booking.created_at).toLocaleString('th-TH')}
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>&times;</button>
        </div>

        {/* Body */}
        <div style={styles.body}>
          
          {/* Status Bar */}
          <div style={{ marginBottom: 25, padding: '15px 20px', background: '#f1f5f9', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '5px solid #3b82f6' }}>
             <div style={{display:'flex', alignItems:'center', gap:10}}>
                <strong style={{fontSize:16}}>สถานะ:</strong>
                <span className={`badge badge-${booking.status === 'pending' ? 'pending' : booking.status === 'approved' ? 'driver' : 'rejected'}`} style={{fontSize:14, padding:'4px 12px'}}>
                    {booking.status.toUpperCase()}
                </span>
             </div>
             <div style={{ fontSize: 15, color:'#334155' }}>
                👤 ผู้จอง: <b>{getUserDisplayName()}</b> | 📞 {booking.user_phone || '-'}
             </div>
          </div>

          <div style={styles.grid2}>
            {/* ข้อมูลการเดินทาง */}
            <div>
                <h4 style={styles.sectionTitle}>🚗 ข้อมูลการเดินทาง</h4>
                <div style={styles.infoBox}>
                    <p><strong>ประเภทรถ:</strong> {booking.vehicle_type}</p>
                    <p><strong>รูปแบบ:</strong> {booking.trip_type === 'oneway' ? 'เที่ยวเดียว' : 'ไป-กลับ'}</p>
                    <p><strong>วันเดินทาง:</strong> <span style={{color:'#d97706', fontWeight:'bold'}}>{formatDate(booking.travel_date)}</span></p>
                    <p><strong>เวลา:</strong> {booking.depart_time?.substring(0, 5)} น.</p>
                    <p><strong>ต้นทาง:</strong> {booking.from_location}</p>
                    <p><strong>ปลายทาง:</strong> {booking.to_location}</p>
                    <p><strong>ผู้โดยสาร:</strong> {booking.passengers} ท่าน</p>
                    <p><strong>วัตถุประสงค์:</strong> {booking.note || '-'}</p>
                </div>
            </div>

            {/* ผู้ติดต่อ */}
            <div>
                <h4 style={styles.sectionTitle}>📞 ผู้ประสานงาน</h4>
                <div style={styles.infoBox}>
                    <p><strong>ชื่อ:</strong> {booking.coordinator_name}</p>
                    <p><strong>เบอร์:</strong> {booking.coordinator_phone}</p>
                    <p><strong>Email:</strong> {booking.coordinator_email || '-'}</p>
                    <hr style={{border:0, borderTop:'1px dashed #ccc', margin:'10px 0'}}/>
                    <p><strong>ผู้อนุมัติ:</strong> {booking.approver_name || '-'}</p>
                    {booking.approver_email && <p><strong>Email อนุมัติ:</strong> {booking.approver_email}</p>}
                </div>
            </div>
          </div>

          {/* Timeline */}
          <h4 style={styles.sectionTitle}>🗺️ เส้นทางรายวัน (Timeline)</h4>
          <div style={{background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, marginBottom: 30, boxShadow:'0 4px 6px -1px rgba(0,0,0,0.05)'}}>
             {booking.itinerary_data?.map((day, idx) => (
                 <div key={idx} style={{marginBottom: 20, paddingBottom: 20, borderBottom: idx === booking.itinerary_data.length - 1 ? 'none' : '1px solid #f1f5f9'}}>
                     <div style={{fontWeight:'bold', color:'#ea580c', marginBottom: 8, fontSize:16}}>📅 วันที่ {idx + 1}</div>
                     <div style={{display:'flex', gap: 15, fontSize: 15, marginBottom: 8, alignItems:'center', flexWrap:'wrap'}}>
                        <span style={{color: '#166534', background:'#dcfce7', padding:'4px 10px', borderRadius:6, fontWeight:'600'}}>🚩 {day.start?.label}</span>
                        <span style={{color:'#ccc'}}>➝</span>
                        <span style={{color: '#991b1b', background:'#fee2e2', padding:'4px 10px', borderRadius:6, fontWeight:'600'}}>🏁 {day.end?.label}</span>
                     </div>
                     {day.stops?.length > 0 && (
                         <div style={{marginLeft: 20, marginTop:10, paddingLeft:15, borderLeft:'3px solid #e2e8f0'}}>
                             {day.stops.map((s, si) => (
                                 <div key={si} style={{fontSize: 14, color: '#475569', marginBottom:6}}>
                                    📍 <b>แวะ:</b> {s.place} <span style={{background:'#f1f5f9', padding:'2px 6px', borderRadius:4, fontSize:12, marginLeft:5}}>{s.time}</span>
                                 </div>
                             ))}
                         </div>
                     )}
                 </div>
             ))}
             {(!booking.itinerary_data || booking.itinerary_data.length === 0) && <div style={{color:'#999', textAlign:'center'}}>ไม่มีข้อมูลเส้นทาง</div>}
          </div>

          {/* =======================================================
              ✅ ส่วนคนขับ (แสดงเมื่อมี driver_id > 0)
             ======================================================= */}
          
          {booking.driver_id > 0 ? (
            <div style={{border: '1px solid #cbd5e1', borderRadius: 16, overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}>
                
                {/* Header คนขับ */}
                <div 
                    style={{
                        padding: '20px', background: 'linear-gradient(to right, #eff6ff, #fff)', cursor: 'pointer', 
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}
                    onClick={() => setShowDriverDocs(!showDriverDocs)}
                >
                    <div style={{display:'flex', alignItems:'center', gap: 20}}>
                        {/* รูป Avatar ใหญ่พิเศษ */}
                        <img 
                            src={getImgUrl(booking.driver_avatar)} 
                            style={{width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid #fff', boxShadow:'0 4px 6px rgba(0,0,0,0.1)'}}
                            alt="avatar"
                        />
                        <div>
                            <div style={{fontSize: 13, color: '#64748b', textTransform:'uppercase', letterSpacing:'1px', fontWeight:'bold', marginBottom:4}}>Driver Info</div>
                            <div style={{fontWeight: 'bold', fontSize: 20, color:'#1e293b'}}>{booking.driver_fname} {booking.driver_lname}</div>
                            <div style={{fontSize: 15, color: '#3b82f6', marginTop:4, display:'flex', gap:10, alignItems:'center'}}>
                                <span>📞 {booking.driver_phone || '-'}</span>
                                <span style={{color:'#cbd5e1'}}>|</span>
                                <span style={{color:'#0f172a'}}>🚘 {booking.vehicle_brand} {booking.vehicle_model}</span>
                                <span style={{background:'#0f172a', color:'#fff', padding:'2px 8px', borderRadius:4, fontSize:13}}>ทะเบียน {booking.license_plate}</span>
                            </div>
                        </div>
                    </div>
                    <div style={{fontSize: 14, color: '#64748b', background:'#fff', padding:'8px 16px', borderRadius:20, border:'1px solid #e2e8f0'}}>
                        {showDriverDocs ? '🔽 ซ่อนข้อมูล' : '◀️ ดูรายละเอียดรถ & เอกสาร'}
                    </div>
                </div>

                {/* เนื้อหาภายใน (รูปรถ + เอกสาร) */}
                {showDriverDocs && (
                    <div style={{padding: 25, background: '#fff'}}>
                        
                        {/* 1. รูปรถ (ใหญ่ขึ้น) */}
                        <h5 style={{margin: '0 0 15px 0', color: '#1e293b', fontSize:16, display:'flex', alignItems:'center', gap:8}}>
                            <span>📸 สภาพรถจริง</span>
                            <div style={{height:1, flex:1, background:'#e2e8f0'}}></div>
                        </h5>
                        
                        <div style={{display: 'flex', gap: 15, overflowX: 'auto', paddingBottom: 15}}>
                            {/* รูปด้านนอก (ใหญ่สุด) */}
                            <div style={{flex:'0 0 350px'}}>
                                <img 
                                    src={getImgUrl(booking.vehicle_outside_img)} 
                                    style={{width:'100%', height: 220, borderRadius: 10, border: '1px solid #e2e8f0', objectFit:'cover', cursor:'pointer'}} 
                                    alt="outside" 
                                    onClick={() => window.open(getImgUrl(booking.vehicle_outside_img))}
                                />
                                <div style={{textAlign:'center', fontSize:13, marginTop:5, color:'#64748b'}}>ด้านนอก</div>
                            </div>
                            
                            {/* รูปด้านใน */}
                            {[1,2,3,4].map(n => (
                                <div key={n} style={{flex:'0 0 250px'}}>
                                    <img 
                                        src={getImgUrl(booking[`vehicle_inside_${n}`])} 
                                        style={{width:'100%', height: 220, borderRadius: 10, border: '1px solid #e2e8f0', objectFit:'cover', cursor:'pointer'}} 
                                        alt="inside" 
                                        onClick={() => window.open(getImgUrl(booking[`vehicle_inside_${n}`]))}
                                    />
                                    <div style={{textAlign:'center', fontSize:13, marginTop:5, color:'#64748b'}}>ภายในมุม {n}</div>
                                </div>
                            ))}
                        </div>

                        {/* 2. เอกสาร */}
                        <h5 style={{margin: '25px 0 15px 0', color: '#1e293b', fontSize:16, display:'flex', alignItems:'center', gap:8}}>
                            <span>📑 เอกสารคนขับ & รถ</span>
                            <div style={{height:1, flex:1, background:'#e2e8f0'}}></div>
                        </h5>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                            {renderDocImage('id_card_img', 'บัตรประชาชน')}
                            {renderDocImage('driver_license_img', 'ใบขับขี่')}
                            {renderDocImage('criminal_record_img', 'ประวัติอาชญากรรม')}
                            {renderDocImage('vehicle_reg_img', 'เล่มทะเบียนรถ')}
                            {renderDocImage('insurance_compulsory_img', 'พ.ร.บ.')}
                            {renderDocImage('insurance_commercial_img', 'ประกันภัย')}
                        </div>
                    </div>
                )}
            </div>
          ) : (
            <div style={{padding: 20, background: '#fff7ed', border: '1px dashed #fdba74', borderRadius: 12, color: '#c2410c', textAlign: 'center', fontSize:16}}>
                🚫 ทริปนี้ยังไม่ได้ระบุคนขับ
            </div>
          )}

        </div>

        <div style={styles.footer}>
          <button onClick={onClose} style={styles.btnClose}>ปิดหน้าต่าง</button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1100,
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    backdropFilter: 'blur(3px)'
  },
  modal: {
    background: '#fff', width: '95%', maxWidth: '950px', maxHeight: '95vh',
    borderRadius: '16px', display: 'flex', flexDirection: 'column',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  },
  header: {
    padding: '20px 30px', borderBottom: '1px solid #e2e8f0',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    background: '#fff', borderRadius: '16px 16px 0 0'
  },
  closeBtn: {
    background: 'transparent', border: 'none', fontSize: '32px', cursor: 'pointer', color: '#94a3b8', lineHeight: 1, padding: 0
  },
  body: {
    padding: '30px', overflowY: 'auto', flex: 1, background: '#f8fafc'
  },
  grid2: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 25, marginBottom: 25
  },
  sectionTitle: {
    fontSize: 16, fontWeight: 'bold', color: '#334155', marginBottom: 12, 
    borderLeft: '5px solid #3b82f6', paddingLeft: 10
  },
  infoBox: {
    fontSize: 15, color: '#334155', lineHeight: '1.8',
    background: '#fff', padding: 20, borderRadius: 12, marginBottom: 20, 
    border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  },
  footer: {
    padding: '20px 30px', borderTop: '1px solid #e2e8f0', textAlign: 'right', background: '#fff', borderRadius: '0 0 16px 16px'
  },
  btnClose: {
    padding: '10px 25px', background: '#334155', border: 'none', 
    borderRadius: 8, cursor: 'pointer', fontWeight: '600', color: '#fff', fontSize: 15,
    transition: 'background 0.2s',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  }
}