import Input from '../../../../components/ui/Input/Input'
import DriverPickList from './DriverPickList'

export default function StepTripInfo({ register, errors, watch, setValue }) {
  const vehicleType = watch('vehicleType')
  const tripType = watch('tripType')
  const selectedDriverId = watch('selectedDriverId')

  return (
    <>
      <div className="bk-grid-top">
        {/* 1. ประเภทรถ */}
        <div className="bk-section">
          <div className="bk-label">
            ประเภทรถ <span style={{ color: 'red' }}>*</span>
          </div>
          <div className="bk-options">
            {['van', 'bus', 'car'].map((type) => (
              <button
                key={type}
                type="button"
                className={`bk-option ${vehicleType === type ? 'is-active' : ''}`}
                onClick={() => {
                  if (vehicleType !== type) {
                    setValue('selectedDriverId', '', { shouldDirty: true })
                  }
                  setValue('vehicleType', type, { shouldValidate: true })
                }}
              >
                {type === 'van' && '🚐 รถตู้'}
                {type === 'bus' && '🚌 รถบัส'}
                {type === 'car' && '🚗 รถยนต์'}
              </button>
            ))}
          </div>
          {errors.vehicleType && <div className="bk-err">{errors.vehicleType.message}</div>}
          <input type="hidden" {...register('vehicleType', { required: 'กรุณาเลือกประเภทรถ' })} />
        </div>

        {/* 2. รูปแบบการเดินทาง */}
        <div className="bk-section">
          <div className="bk-label">
            รูปแบบการเดินทาง <span style={{ color: 'red' }}>*</span>
          </div>
          <div className="bk-options">
            {['oneway', 'roundtrip'].map((type) => (
              <button
                key={type}
                type="button"
                className={`bk-option ${tripType === type ? 'is-active' : ''}`}
                onClick={() => setValue('tripType', type, { shouldValidate: true })}
              >
                {type === 'oneway' ? 'เที่ยวเดียว' : 'ไป-กลับ'}
              </button>
            ))}
          </div>
          {errors.tripType && <div className="bk-err">{errors.tripType.message}</div>}
          <input type="hidden" {...register('tripType', { required: 'กรุณาเลือกรูปแบบการเดินทาง' })} />
        </div>

        {/* 3. จำนวนผู้โดยสาร (แก้ไขล่าสุด: ขอบแดงเท่านั้น) */}
        <div className="bk-section">
          <Input
            label="จำนวนผู้โดยสาร"
            type="number"
            min="1"
            placeholder="โปรดระบุ" // ใช้คำเดิม ไม่เปลี่ยนตาม error
            
            // ❌ ไม่ส่ง prop error เพื่อซ่อนข้อความแจ้งเตือนด้านล่าง
            // error={errors.passengersCount?.message} 
            
            // ✅ ใส่ style บังคับขอบแดงเมื่อมี error
            style={errors.passengersCount ? { borderColor: '#ef4444' } : {}}
            
            {...register('passengersCount', {
              required: true, // ระบุว่าจำเป็นต้องกรอก
              valueAsNumber: true,
              min: { value: 1, message: '' },
            })}
          />
        </div>
      </div>

      {/* 4. วัตถุประสงค์ */}
      <div className="bk-section" style={{ marginTop: '20px' }}>
        <Input
          label="วัตถุประสงค์การเดินทาง"
          placeholder="เช่น ไปประชุม / ออกหน่วย / เยี่ยมชมสถานประกอบการ"
          error={errors.purpose?.message}
          {...register('purpose', {
            required: 'กรุณากรอกวัตถุประสงค์การเดินทาง',
            validate: (v) => (v || '').trim().length > 0 || 'กรุณากรอกวัตถุประสงค์การเดินทาง',
          })}
        />
      </div>

      <hr className="bk-divider" style={{ margin: '30px 0', borderTop: '1px dashed #ddd' }} />

      {/* 5. เลือกรถ/คนขับ */}
      <div className="bk-section">
        {!vehicleType ? (
          <div
            style={{
              padding: '40px',
              textAlign: 'center',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '2px dashed #cbd5e1',
              color: '#64748b',
            }}
          >
            <h3 style={{ marginTop: 0, color: '#475569' }}>🚗 เลือกรถ/คนขับ</h3>
            <p>
              กรุณาเลือก <b>"ประเภทรถ"</b> ด้านบนก่อน เพื่อแสดงรายการรถที่ว่าง
            </p>
          </div>
        ) : (
          <DriverPickList
            vehicleType={vehicleType}
            selectedId={selectedDriverId}
            onSelect={(id) => setValue('selectedDriverId', id, { shouldDirty: true })}
          />
        )}
      </div>
    </>
  )
}