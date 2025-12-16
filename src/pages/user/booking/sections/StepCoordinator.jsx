import Input from '../../../../components/ui/Input/Input'

const PHONE_PATTERN = /^0\d{9}$/ // เบอร์ไทย 10 หลัก เริ่ม 0
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i

export default function StepCoordinator({
  register,
  errors,
  watch,
  setValue,
  openJoin,
  seatsLeft,
  seatCapacity,
  passengersCount,
  compFields,
  appendComp,
  removeComp,
}) {
  const needApproval = watch('needApproval')

  return (
    <>
      {/* ===== ผู้ประสานงาน ===== */}
      <div className="bk-section">
        <div className="bk-label">ข้อมูลผู้ประสานงาน</div>

        <div className="bk-grid">
          <Input
            label="ชื่อผู้ประสานงาน"
            placeholder="ชื่อ-นามสกุล"
            error={errors.coordinatorName?.message}
            {...register('coordinatorName', {
              required: 'กรุณากรอกชื่อผู้ประสานงาน',
              validate: (v) => (v || '').trim().length > 0 || 'กรุณากรอกชื่อผู้ประสานงาน',
            })}
          />

          <Input
            label="E-mail"
            placeholder="name@email.com"
            error={errors.coordinatorEmail?.message}
            {...register('coordinatorEmail', {
              required: 'กรุณากรอกอีเมลผู้ประสานงาน',
              pattern: { value: EMAIL_PATTERN, message: 'รูปแบบอีเมลไม่ถูกต้อง' },
            })}
          />
        </div>

        <div className="bk-grid">
          <Input
            label="เบอร์มือถือผู้ประสานงาน (1)"
            placeholder="เช่น 08xxxxxxxx"
            error={errors.coordinatorPhone1?.message}
            {...register('coordinatorPhone1', {
              required: 'กรุณากรอกเบอร์มือถือผู้ประสานงาน',
              pattern: { value: PHONE_PATTERN, message: 'รูปแบบเบอร์ไม่ถูกต้อง (10 หลัก)' },
            })}
          />

          <Input
            label="เบอร์มือถือผู้ประสานงาน (2)"
            placeholder="เช่น 08xxxxxxxx"
            error={errors.coordinatorPhone2?.message}
            {...register('coordinatorPhone2', {
              pattern: { value: PHONE_PATTERN, message: 'รูปแบบเบอร์ไม่ถูกต้อง (10 หลัก)' },
            })}
          />
        </div>

        <label className="bk-check">
          <input type="checkbox" {...register('showCoordinatorToPassengers')} />
          <span>เปิดเผยข้อมูลผู้ประสานงานให้ผู้ร่วมเดินทางเพื่อใช้ติดต่อ</span>
        </label>
      </div>

      {/* ===== เงื่อนไข 2 ช่อง ===== */}
      <div className="bk-split">
        <div className="bk-panel">
          <div className="bk-label">การอนุมัติ</div>

          <label className="bk-check">
            <input
              type="checkbox"
              {...register('needApproval')}
              onChange={(e) => {
                setValue('needApproval', e.target.checked, { shouldDirty: true })
                if (!e.target.checked) setValue('approverName', '')
              }}
            />
            <span>ต้องมีผู้อนุมัติ</span>
          </label>

          {needApproval && (
            <Input
              label="ชื่อ-นามสกุลผู้อนุมัติ"
              placeholder="เช่น อ.____ ____"
              error={errors.approverName?.message}
              {...register('approverName', {
                required: 'กรุณากรอกชื่อผู้อนุมัติ',
                validate: (v) => (v || '').trim().length > 0 || 'กรุณากรอกชื่อผู้อนุมัติ',
              })}
            />
          )}

          <p className="bk-hint">
            * Phase 1 ทำเป็น “สถานะรออนุมัติ” ก่อน (ต่ออีเมลแจ้งเตือนภายหลังได้)
          </p>
        </div>

        <div className="bk-panel">
          <div className="bk-label">เปิดรับผู้ร่วมทาง</div>

          <label className="bk-check">
            <input
              type="checkbox"
              {...register('openJoin')}
              onChange={(e) => setValue('openJoin', e.target.checked, { shouldDirty: true })}
            />
            <span>เปิดให้คณะ/หน่วยงานอื่นขอติดรถได้</span>
          </label>

          {openJoin && (
            <>
              <Input
                label="จำนวนที่นั่งทั้งหมด"
                type="number"
                min="1"
                error={errors.seatCapacity?.message}
                {...register('seatCapacity', {
                  required: 'กรุณาระบุจำนวนที่นั่งทั้งหมด',
                  valueAsNumber: true,
                  min: { value: 1, message: 'อย่างน้อย 1 ที่นั่ง' },
                })}
              />

              <div className="bk-mini">
                ที่นั่งว่างโดยประมาณ: <b>{seatsLeft}</b> ที่ (จาก {seatCapacity} - {passengersCount})
              </div>
            </>
          )}
        </div>
      </div>

      {/* ===== ผู้ร่วมเดินทาง ===== */}
      <div className="bk-section" style={{ marginTop: 14 }}>
        <div className="bk-days-head">
          <h2>รายชื่อผู้ร่วมเดินทาง</h2>
          <button
            type="button"
            className="bk-addday"
            onClick={() => appendComp({ fullName: '', email: '', phone1: '', phone2: '' })}
          >
            + เพิ่มรายชื่อ
          </button>
        </div>

        {compFields.map((f, idx) => (
          <div key={f.id} className="bk-daycard" style={{ marginTop: 12 }}>
            <div className="bk-daytitle">
              <b>ผู้ร่วมเดินทาง #{idx + 1}</b>
              {compFields.length > 1 && (
                <button type="button" className="bk-remove" onClick={() => removeComp(idx)}>
                  ลบ
                </button>
              )}
            </div>

            <div className="bk-grid">
              <Input
                label="ชื่อ-นามสกุล"
                placeholder="เช่น ____ ____"
                error={errors?.companions?.[idx]?.fullName?.message}
                {...register(`companions.${idx}.fullName`, {
                  required: 'กรุณากรอกชื่อ-นามสกุล',
                  validate: (v) => (v || '').trim().length > 0 || 'กรุณากรอกชื่อ-นามสกุล',
                })}
              />

              <Input
                label="E-mail"
                placeholder="name@email.com"
                error={errors?.companions?.[idx]?.email?.message}
                {...register(`companions.${idx}.email`, {
                  pattern: { value: EMAIL_PATTERN, message: 'รูปแบบอีเมลไม่ถูกต้อง' },
                })}
              />
            </div>

            <div className="bk-grid">
              <Input
                label="เบอร์มือถือ (1)"
                placeholder="เช่น 08xxxxxxxx"
                error={errors?.companions?.[idx]?.phone1?.message}
                {...register(`companions.${idx}.phone1`, {
                  required: 'กรุณากรอกเบอร์มือถือ',
                  pattern: { value: PHONE_PATTERN, message: 'รูปแบบเบอร์ไม่ถูกต้อง (10 หลัก)' },
                })}
              />

              <Input
                label="เบอร์มือถือ (2)"
                placeholder="เช่น 08xxxxxxxx"
                error={errors?.companions?.[idx]?.phone2?.message}
                {...register(`companions.${idx}.phone2`, {
                  pattern: { value: PHONE_PATTERN, message: 'รูปแบบเบอร์ไม่ถูกต้อง (10 หลัก)' },
                })}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
