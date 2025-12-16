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
  return (
    <div className="bk-days">
      <div className="bk-days-head">
        <div>
          <h2>แผนการเดินทางรายวัน</h2>

          <div className="bk-options" style={{ marginTop: 8 }}>
            <button type="button" className="bk-option" disabled>
              เที่ยวเดียว
            </button>
            <button type="button" className="bk-option is-active" disabled>
              ไป-กลับ
            </button>
          </div>
        </div>

        <button
          type="button"
          className="bk-addday"
          onClick={addDay}
          disabled={dayFields.length >= 4}
          title={dayFields.length >= 4 ? 'เพิ่มได้สูงสุด 4 วัน' : 'เพิ่มวัน'}
        >
          + เพิ่มวัน
        </button>
      </div>

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

      <p className="bk-hint">* เพิ่มได้สูงสุด 4 วัน</p>
    </div>
  )
}

/* ================= Day Card ================= */

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
          <b>จุดแวะ</b>
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
              type="time"
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
