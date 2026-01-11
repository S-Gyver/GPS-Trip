import Input from '../../../../components/ui/Input/Input'
import { useFieldArray } from 'react-hook-form'

export default function StepRoutes({
  dayFields,
  addDay,
  removeDay,
  register,
  errors,
  control,
}) {
  
  // ✅ ฟังก์ชันคำนวณวันอัตโนมัติ (เพิ่ม/ลด ตามเลขที่กรอก)
  const handleDayCountChange = (e) => {
    const val = parseInt(e.target.value) || 1
    const count = Math.max(1, Math.min(30, val)) // จำกัด 1-30 วัน
    const currentDiff = count - dayFields.length

    if (currentDiff > 0) {
      // เพิ่มวัน (เรียก addDay ตามจำนวนที่ขาด)
      for (let i = 0; i < currentDiff; i++) addDay()
    } else if (currentDiff < 0) {
      // ลดวัน (ลบจากวันท้ายสุด)
      for (let i = 0; i < Math.abs(currentDiff); i++) {
        removeDay(dayFields.length - 1 - i)
      }
    }
  }

  return (
    <div className="bk-days">
      <div className="bk-days-head" style={{ alignItems: 'flex-end' }}>
        <div>
          <h2>แผนการเดินทางรายวัน</h2>

          {/* ✅ ส่วนเลือกรูปแบบ (เก็บไว้ตามเดิม) */}
          <div className="bk-options" style={{ marginTop: 8 }}>
            <button type="button" className="bk-option" disabled>
              เที่ยวเดียว
            </button>
            <button type="button" className="bk-option is-active" disabled>
              ไป-กลับ
            </button>
          </div>
        </div>

        {/* ✅ เปลี่ยนจากปุ่มกด เป็นช่องกรอกจำนวนวัน */}
        <div style={{ width: '150px' }}>
            <Input
                label="จำนวนวันเดินทาง"
                type="number"
                min="1"
                max="30"
                value={dayFields.length} // ให้ตัวเลขตรงกับจำนวนวันปัจจุบันเสมอ
                onChange={handleDayCountChange}
                placeholder="ระบุจำนวน"
                style={{ borderColor: '#f97316' }} // เน้นสีส้ม
            />
        </div>
      </div>

      {/* Loop แสดงการ์ดวัน */}
      {dayFields.map((field, idx) => (
        <DayCard
          key={field.id}
          idx={idx}
          removeDay={removeDay}
          register={register}
          errors={errors}
          control={control}
        />
      ))}
    </div>
  )
}

/* ================= Day Card (เหมือนเดิม) ================= */

function DayCard({ idx, removeDay, register, errors, control }) {
  const {
    fields: stopFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `days.${idx}.stops`,
  })

  return (
    <div className="bk-daycard">
      <div className="bk-daytitle">
        <b>วันที่ {idx + 1}</b>
        {/* ปุ่มลบรายวัน (ยังเก็บไว้เผื่อ user อยากลบเฉพาะวันนี้) */}
        {idx > 0 && (
          <button type="button" className="bk-remove" onClick={() => removeDay(idx)}>
            ลบวันนี้
          </button>
        )}
      </div>

      {/* ===== ขาไป ===== */}
      <div className="bk-grid">
        <Input
          label="จุดเริ่มต้น"
          placeholder="ปักหมุด / พิมพ์ชื่อสถานที่"
          error={errors?.days?.[idx]?.start?.label?.message}
          {...register(`days.${idx}.start.label`, {
            required: 'กรุณากรอกจุดเริ่มต้น',
            validate: (v) => (v || '').trim().length > 0 || 'กรุณากรอกจุดเริ่มต้น',
          })}
        />
        <Input
          label="ปลายทาง"
          placeholder="ปักหมุด / พิมพ์ชื่อสถานที่"
          error={errors?.days?.[idx]?.end?.label?.message}
          {...register(`days.${idx}.end.label`, {
            required: 'กรุณากรอกปลายทาง',
            validate: (v) => (v || '').trim().length > 0 || 'กรุณากรอกปลายทาง',
          })}
        />
      </div>

     {/* วันเดินทาง / เวลา */}
      <div className="bk-grid">
        <Input
          label="วันเดินทาง"
          type="date"
          {...register(`days.${idx}.travelDate`)}
        />
        <Input
          label="เวลา"
          type="time"
          {...register(`days.${idx}.travelTime`)}
        />
      </div>

      {/* ===== จุดแวะ ===== */}
      <div className="bk-stops">
        <div className="bk-stops-head">
          <b>จุดแวะ (ข้ามได้)</b>
          <button
            type="button"
            className="bk-addstop"
            onClick={() => append({ place: '', time: '' })}
          >
            + เพิ่มจุดแวะ
          </button>
        </div>

        {stopFields.map((s, sidx) => (
          <div key={s.id} className="bk-grid">
            <Input
              label="จุดแวะ"
              placeholder="สถานที่"
              {...register(`days.${idx}.stops.${sidx}.place`)}
            />
            <Input
              label="เวลาทำกิจกรรม"
              placeholder="เช่น 1.30 = 1ขั่วโมง 30นาที"
              type="text"
              {...register(`days.${idx}.stops.${sidx}.time`)}
            />
            <button
              type="button"
              className="bk-remove-stop"
              onClick={() => remove(sidx)}
            >
              ลบ
            </button>
          </div>
        ))}
      </div>

      {/* ===== หมายเหตุ ===== */}
      <Input
        label="หมายเหตุ"
        placeholder="รายละเอียดเพิ่มเติม"
        {...register(`days.${idx}.note`)}
      />
    </div>
  )
}