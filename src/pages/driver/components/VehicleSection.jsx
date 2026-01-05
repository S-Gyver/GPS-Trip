import './VehicleSection.css'

const VEHICLE_OPTIONS = [
  { value: 'car', label: 'รถยนต์ (Car)' },
  { value: 'van', label: 'รถตู้ (Van)' },
  { value: 'bus', label: 'รถบัส (Bus)' },
]

export default function VehicleSection({ register, errors = {}, submitCount = 0 }) {
  const showErr = (name) => submitCount > 0 && errors?.[name]

  return (
    <div className="vs-wrap">
      <div className="vs-title">ข้อมูลรถ</div>

      <div className="vs-grid">
        <div className={`vs-field ${showErr('plate') ? 'has-error' : ''}`}>
          <div className="vs-label">ทะเบียนรถ</div>
          <input className="vs-input" {...register('plate')} placeholder="เช่น กข1234" />
        </div>

        <div className={`vs-field ${showErr('licenseNo') ? 'has-error' : ''}`}>
          <div className="vs-label">เลขที่ใบขับขี่</div>
          <input className="vs-input" {...register('licenseNo')} placeholder="เลขที่ใบขับขี่" />
        </div>

        <div className={`vs-field ${showErr('vehicleType') ? 'has-error' : ''}`}>
          <div className="vs-label">ประเภทรถ</div>
          <select className="vs-input" {...register('vehicleType')} defaultValue="">
            <option value="">เลือกประเภทรถ</option>
            {VEHICLE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className={`vs-field ${showErr('seats') ? 'has-error' : ''}`}>
          <div className="vs-label">จำนวนที่นั่ง</div>
          <input
            className="vs-input"
            {...register('seats')}
            placeholder="จำนวนที่นั่ง"
            inputMode="numeric"
            onInput={(e) => (e.target.value = e.target.value.replace(/[^\d]/g, ''))}
          />
        </div>

        <div className="vs-field">
          <div className="vs-label">สภาพการตรวจประจำปี</div>
          <input className="vs-input" {...register('inspection')} placeholder="เช่น 8228465" />
        </div>

        <div className="vs-field">
          <div className="vs-label">ยี่ห้อรถ</div>
          <input className="vs-input" {...register('make')} placeholder="เช่น Toyota" />
        </div>

        <div className="vs-field">
          <div className="vs-label">รุ่นรถ</div>
          <input className="vs-input" {...register('model')} placeholder="เช่น SSS" />
        </div>

        <div className="vs-field">
          <div className="vs-label">ขนาดเครื่องยนต์ (cc)</div>
          <input
            className="vs-input"
            {...register('engine')}
            placeholder="เช่น 1500"
            inputMode="numeric"
            onInput={(e) => (e.target.value = e.target.value.replace(/[^\d]/g, ''))}
          />
        </div>

        <div className="vs-field vs-full">
          <div className="vs-label">ราคารถต่อวัน (บาท)</div>
          <input className="vs-input" {...register('pricePerDay')} placeholder="เช่น 200.00" />
        </div>
      </div>

      <hr className="vs-divider" />
    </div>
  )
}
