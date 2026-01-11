import React, { useState } from 'react'

const BASE_IMG_URL = "http://localhost/tripsync_api/";

export default function UserBookingDetailModal({ booking, onClose }) {
  if (!booking) return null

  const [showDriverDocs, setShowDriverDocs] = useState(true);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('th-TH', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
  }

  const getImgUrl = (path) => path ? `${BASE_IMG_URL}${path}` : 'https://placehold.co/400x300?text=No+Image';

  // Helper สร้าง Card รูปภาพ
  const renderDocImage = (imgKey, label) => (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 8, background: '#fff' }}>
      <div style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5, color: '#334155' }}>{label}</div>
      <div style={{ background: '#f8fafc', borderRadius: 6, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 120 }}>
        <img
          src={getImgUrl(booking[imgKey])}
          alt={label}
          style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: 'pointer' }}
          onClick={() => window.open(getImgUrl(booking[imgKey]))}
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
            <h2 style={{ margin: 0, fontSize: 20, color:'#1e293b' }}>รายละเอียดการจอง #{booking.id}</h2>
            <div style={{ fontSize: 13, color: '#64748b' }}>
                📅 เดินทาง: {new Date(booking.travel_date).toLocaleDateString('th-TH')}
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>&times;</button>
        </div>

        {/* Body */}
        <div style={styles.body}>
          
          {/* Status Bar */}
          <div style={{ marginBottom: 20, padding: 12, background: '#f1f5f9', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <span className={`badge badge-${booking.status}`} style={{
                padding: '6px 12px', borderRadius: 20, fontWeight: 'bold', textTransform: 'uppercase', fontSize:13,
                background: booking.status === 'approved' ? '#dcfce7' : booking.status === 'rejected' ? '#fee2e2' : '#fff7ed',
                color: booking.status === 'approved' ? '#166534' : booking.status === 'rejected' ? '#991b1b' : '#c2410c',
             }}>
                {booking.status === 'pending' ? '⏳ รออนุมัติ' : booking.status === 'approved' ? '✅ อนุมัติแล้ว' : booking.status}
             </span>
             <div style={{ fontSize: 14 }}>
                📞 ผู้จอง: {booking.user_phone || '-'}
             </div>
          </div>

          {/* 1. ข้อมูลคนขับ */}
          {booking.driver_id > 0 ? (
            <div style={{border: '1px solid #bfdbfe', borderRadius: 12, overflow: 'hidden', marginBottom: 20}}>
                <div style={{padding: '15px', background: '#eff6ff', display: 'flex', alignItems: 'center', gap: 15}}>
                    <img 
                        src={getImgUrl(booking.driver_avatar)} 
                        style={{width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '3px solid #fff'}}
                    />
                    <div>
                        <div style={{fontSize: 12, color: '#3b82f6', fontWeight:'bold'}}>DRIVER INFO</div>
                        <div style={{fontWeight: 'bold', fontSize: 16, color:'#1e293b'}}>{booking.driver_fname} {booking.driver_lname}</div>
                        <div style={{fontSize: 13, color: '#64748b'}}>📞 {booking.driver_phone} | 🚘 {booking.license_plate}</div>
                    </div>
                </div>
            </div>
          ) : (
            <div style={{padding: 15, background: '#fffbeb', border: '1px dashed #f59e0b', borderRadius: 10, color: '#b45309', textAlign: 'center', marginBottom: 20, fontSize: 14}}>
                ⚠️ ระบบกำลังดำเนินการจัดหาคนขับรถให้ท่าน
            </div>
          )}

          {/* 2. รูปรถ */}
          {booking.vehicle_outside_img && (
            <div style={{marginBottom: 20}}>
                <h5 style={{margin:'0 0 10px 0'}}>📸 พาหนะที่ใช้เดินทาง</h5>
                <div style={{display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 5}}>
                    <img src={getImgUrl(booking.vehicle_outside_img)} style={{height: 120, borderRadius: 8, border: '1px solid #eee'}} onClick={() => window.open(getImgUrl(booking.vehicle_outside_img))}/>
                    {[1,2,3,4].map(n => (
                        booking[`vehicle_inside_${n}`] && 
                        <img key={n} src={getImgUrl(booking[`vehicle_inside_${n}`])} style={{height: 120, borderRadius: 8, border: '1px solid #eee'}} onClick={() => window.open(getImgUrl(booking[`vehicle_inside_${n}`]))} />
                    ))}
                </div>
            </div>
          )}

          {/* 3. Timeline */}
          <div style={{background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 15}}>
             <h5 style={{margin:'0 0 10px 0', color:'#1e293b'}}>🗺️ แผนการเดินทาง</h5>
             {booking.itinerary_data?.map((day, idx) => (
                 <div key={idx} style={{marginBottom: 15, paddingBottom: 15, borderBottom: idx === booking.itinerary_data.length - 1 ? 'none' : '1px dashed #eee'}}>
                     <div style={{fontWeight:'bold', color:'#ea580c', marginBottom: 5, fontSize:14}}>📅 วันที่ {idx + 1}</div>
                     <div style={{display:'grid', gridTemplateColumns:'20px 1fr', gap:10, fontSize:14}}>
                        <div>🚩</div><div><b>เริ่ม:</b> {day.start?.label}</div>
                        {day.stops?.map((s, si) => (
                            <React.Fragment key={si}>
                                <div>📍</div><div style={{color:'#64748b'}}>แวะ: {s.place} ({s.time})</div>
                            </React.Fragment>
                        ))}
                        <div>🏁</div><div><b>ปลายทาง:</b> {day.end?.label}</div>
                     </div>
                 </div>
             ))}
          </div>

        </div>

        <div style={{...styles.footer, borderTop: 'none', paddingTop: 0}}> {/* Added padding adjustment */}
          <button onClick={onClose} style={styles.btnClose}>ปิด</button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(2px)' },
  modal: { background: '#fff', width: '95%', maxWidth: '700px', maxHeight: '90vh', borderRadius: '12px', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
  header: { padding: '15px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  closeBtn: { background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#94a3b8' },
  body: { padding: '20px', overflowY: 'auto', flex: 1, background: '#fff' },
  footer: { padding: '15px 20px', borderTop: '1px solid #e2e8f0', textAlign: 'right', background: '#f8fafc', borderRadius: '0 0 12px 12px' },
  btnClose: { padding: '8px 20px', background: '#334155', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: '600', color: '#fff' }
}