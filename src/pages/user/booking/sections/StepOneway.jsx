import Input from '../../../../components/ui/Input/Input'
import { useFieldArray } from 'react-hook-form'

export default function StepOneway({
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
            <button type="button" className="bk-option is-active" disabled>
              เที่ยวเดียว
            </button>
            <button type="button" className="bk-option" disabled>
              ไป-กลับ
            </button>
          </div>
        </div>

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

      {/* จุดเริ่มต้น / ปลายทาง */}
      <div className="bk-grid">
        <Input
          label="จุดเริ่มต้น"
          placeholder="ปักหมุด / พิมพ์ชื่อสถานที่"
          error={errors?.days?.[idx]?.start?.label?.message}
          {...register(`days.${idx}.start.label`, { required: 'กรุณากรอกจุดเริ่มต้น' })}
        />
        <Input
          label="ปลายทาง"
          placeholder="ปักหมุด / พิมพ์ชื่อสถานที่"
          error={errors?.days?.[idx]?.end?.label?.message}
          {...register(`days.${idx}.end.label`, { required: 'กรุณากรอกปลายทาง' })}
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

      {/* จุดแวะ */}
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
              placeholder="เช่น 1.30 = 1ชั่วโมง 30นาที"
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

      {/* หมายเหตุ */}
      <Input
        label="หมายเหตุ"
        placeholder="รายละเอียดเพิ่มเติม"
        {...register(`days.${idx}.note`)}
      />
    </div>
  )
}
