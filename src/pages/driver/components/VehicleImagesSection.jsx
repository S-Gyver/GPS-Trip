// src/pages/driver/components/VehicleImagesSection.jsx
import DocUpload from './DocUpload'
import './DocumentsSection.css' // ใช้ CSS เดิมได้เลย เพราะโครงสร้างเหมือนกัน

export default function VehicleImagesSection({ docPaths, onUploaded, disabled = false }) {
  return (
    <section className="dr-sec">
      <h2 className="dr-secTitle">รูปภาพยานพาหนะ</h2>
      <div style={{ marginBottom: '16px', color: '#64748b', fontSize: '14px' }}>
        อัปโหลดรูปถ่ายจริงของรถเพื่อประกอบการตัดสินใจของผู้จอง (ด้านนอก 1 รูป, ภายใน 4 รูป)
      </div>

      <div className="dr-docGrid">
        {/* รูปรถด้านนอก (โชว์เด่นๆ) */}
        <div style={{ gridColumn: '1 / -1' }}>
           <DocUpload 
             label="รูปรถด้านนอก (Side/Front View)" 
             field="vehicle_outside_img" 
             value={docPaths.vehicle_outside_img} 
             onUploaded={onUploaded} 
             disabled={disabled} 
           />
        </div>

        {/* รูปภายใน 4 รูป */}
        <DocUpload label="ภายในรถ 1 (คนขับ/คอนโซล)" field="vehicle_inside_1" value={docPaths.vehicle_inside_1} onUploaded={onUploaded} disabled={disabled} />
        <DocUpload label="ภายในรถ 2 (ที่นั่งแถวแรก)" field="vehicle_inside_2" value={docPaths.vehicle_inside_2} onUploaded={onUploaded} disabled={disabled} />
        <DocUpload label="ภายในรถ 3 (ที่นั่งแถวหลัง)" field="vehicle_inside_3" value={docPaths.vehicle_inside_3} onUploaded={onUploaded} disabled={disabled} />
        <DocUpload label="ภายในรถ 4 (ภาพรวม/ท้ายรถ)" field="vehicle_inside_4" value={docPaths.vehicle_inside_4} onUploaded={onUploaded} disabled={disabled} />
      </div>
    </section>
  )
}