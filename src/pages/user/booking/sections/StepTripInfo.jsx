import { useEffect } from 'react'
import Input from '../../../../components/ui/Input/Input'
import DriverPickList from './DriverPickList'

export default function StepTripInfo({ register, errors, watch, setValue }) {
    const vehicleType = watch('vehicleType') // '' | van | bus | car
    const tripType = watch('tripType')       // oneway | roundtrip

    // ✅ ถ้าเปลี่ยนประเภทรถ ให้ล้างคนขับที่เลือกไว้
    useEffect(() => {
        setValue('selectedDriverId', '', { shouldDirty: true })
    }, [vehicleType, setValue])

    return (
        <>
            <div className="bk-grid-top">
                <div className="bk-section">
                    <div className="bk-label">ประเภทรถ</div>
                    <div className="bk-options">
                        {['van', 'bus', 'car'].map((type) => (
                            <button
                                type="button"
                                key={type}
                                className={`bk-option ${vehicleType === type ? 'is-active' : ''}`}
                                onClick={() => setValue('vehicleType', type, { shouldDirty: true })}
                            >
                                {type === 'van' && '🚐 รถตู้'}
                                {type === 'bus' && '🚌 รถบัส'}
                                {type === 'car' && '🚗 รถยนต์'}
                            </button>
                        ))}
                    </div>

                    {/* ✅ ถ้ายังไม่เลือก ให้ขึ้นข้อความนำทาง (ถ้าไม่อยากมี ก็ตัดทิ้งได้) */}
                    {!vehicleType && (
                        <div className="bk-hint">กรุณาเลือกประเภทรถ เพื่อแสดงรายการรถและคนขับ</div>
                    )}
                </div>

                <div className="bk-section">
                    <div className="bk-label">รูปแบบการเดินทาง</div>
                    <div className="bk-options">
                        {['oneway', 'roundtrip'].map((type) => (
                            <button
                                type="button"
                                key={type}
                                className={`bk-option ${tripType === type ? 'is-active' : ''}`}
                                onClick={() => setValue('tripType', type, { shouldDirty: true })}
                            >
                                {type === 'oneway' ? 'เที่ยวเดียว' : 'ไป-กลับ'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bk-section">
                    <Input
                        label="จำนวนผู้โดยสาร (คณะ/หน่วยงานของผู้จอง)"
                        type="number"
                        min="1"
                        error={errors.passengersCount?.message}
                        {...register('passengersCount', {
                            required: 'กรุณาระบุจำนวนผู้โดยสาร',
                            valueAsNumber: true,
                            min: { value: 1, message: 'อย่างน้อย 1 คน' },
                        })}
                    />
                </div>
            </div>

            <div className="bk-grid">
                <Input
                    label="วันเดินทางขาไป"
                    type="date"
                    error={errors.travelDate?.message}
                    {...register('travelDate', { required: 'กรุณาเลือกวันเดินทาง' })}
                />

                <Input
                    label="ช่วงเวลาเดินทางขาไป"
                    type="time"
                    error={errors.departTime?.message}
                    {...register('departTime', { required: 'กรุณาระบุเวลาเดินทาง' })}
                />
            </div>


            {/* ✅ โชว์ขากลับเฉพาะไป-กลับ และชื่อ field ต้องไม่ซ้ำ */}
            {tripType === 'roundtrip' && (
                <div className="bk-grid">
                    <Input
                        label="วันเดินทางขากลับ"
                        type="date"
                        error={errors.returnDate?.message}
                        {...register('returnDate', { required: 'กรุณาเลือกวันเดินทางขากลับ' })}
                    />

                    <Input
                        label="ช่วงเวลาเดินทางขากลับ"
                        type="time"
                        error={errors.returnTime?.message}
                        {...register('returnTime', { required: 'กรุณาระบุเวลาเดินทางขากลับ' })}
                    />
                </div>
            )}

            <Input
                label="วัตถุประสงค์การเดินทาง"
                placeholder="เช่น ไปประชุม / ออกหน่วย / เยี่ยมชมสถานประกอบการ"
                error={errors.purpose?.message}
                {...register('purpose', {
                    required: 'กรุณากรอกวัตถุประสงค์การเดินทาง',
                    validate: (v) => v.trim().length > 0 || 'กรุณากรอกวัตถุประสงค์การเดินทาง',
                })}
            />

            {/* ✅ ยังไม่เลือกประเภทรถ = ยังไม่โชว์ DriverPickList */}
            {vehicleType && (
                <DriverPickList
                    vehicleType={vehicleType} // ✅ ส่งประเภทไปกรองข้อมูล
                    selectedId={watch('selectedDriverId')}
                    onSelect={(id) => setValue('selectedDriverId', id, { shouldDirty: true })}
                    onOpenDetail={(driver) => {
                        alert(
                            `รายละเอียด\nชื่อ: ${driver.name}\nเบอร์: ${driver.phone}\nทะเบียน: ${driver.plate}\nที่นั่ง: ${driver.seats}`
                        )
                    }}
                />
            )}
        </>
    )
}
