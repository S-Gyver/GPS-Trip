import DocUpload from './DocUpload'
import './DocumentsSection.css'

export default function DocumentsSection({ docPaths, onUploaded, disabled = false }) {
  return (
    <section className="dr-sec">
      <h2 className="dr-secTitle">เอกสารคนขับ</h2>

      <div className="dr-docGrid">
        <DocUpload label="บัตรประชาชน" field="id_card_img" value={docPaths.id_card_img} onUploaded={onUploaded} disabled={disabled} />
        <DocUpload label="ใบขับขี่" field="driver_license_img" value={docPaths.driver_license_img} onUploaded={onUploaded} disabled={disabled} />
        <DocUpload label="เอกสารตรวจสอบอาชญากรรม" field="criminal_record_img" value={docPaths.criminal_record_img} onUploaded={onUploaded} disabled={disabled} />
        <DocUpload label="เอกสารจดทะเบียนยานพาหนะ" field="vehicle_reg_img" value={docPaths.vehicle_reg_img} onUploaded={onUploaded} disabled={disabled} />
        <DocUpload label="ประกันภาคบังคับ (พรบ)" field="insurance_compulsory_img" value={docPaths.insurance_compulsory_img} onUploaded={onUploaded} disabled={disabled} />
        <DocUpload label="ประกันเชิงพาณิชย์" field="insurance_commercial_img" value={docPaths.insurance_commercial_img} onUploaded={onUploaded} disabled={disabled} />
      </div>
    </section>
  )
}
