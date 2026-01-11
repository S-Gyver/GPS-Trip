import Input from '../../../../components/ui/Input/Input'

const PHONE_PATTERN = /^0\d{9}$/ // เบอร์ไทย 10 หลัก
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i

export default function StepCoordinator({
  register,
  errors,
  watch,
  setValue,
  openJoin,
  compFields,
  appendComp,
  removeComp,
}) {
  const needApproval = watch('needApproval')
  // ✅ ดึงค่า Checkbox มาใช้
  const submitListLater = watch('submitListLater')

  return (
    <>
      {/* ===== ผู้ประสานงาน ===== */}
      <div className="bk-section">
        <div className="bk-label">ข้อมูลผู้ประสานงาน/และเดินทางไปด้วย</div>

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

        <div style={{ marginTop: '15px' }}>
          <Input
            label="เบอร์มือถือผู้ประสานงาน"
            placeholder="เช่น 08xxxxxxxx"
            error={errors.coordinatorPhone1?.message}
            {...register('coordinatorPhone1', {
              required: 'กรุณากรอกเบอร์มือถือผู้ประสานงาน',
              pattern: { value: PHONE_PATTERN, message: 'รูปแบบเบอร์ไม่ถูกต้อง (10 หลัก)' },
            })}
          />
        </div>

        <label className="bk-check" style={{ marginTop: '10px' }}>
          <input type="checkbox" {...register('showCoordinatorToPassengers')} />
          <span>เปิดเผยข้อมูลผู้ประสานงานให้ผู้ร่วมเดินทางเพื่อใช้ติดต่อ</span>
        </label>
      </div>

      {/* ===== เงื่อนไข 2 ช่อง ===== */}
      <div className="bk-split">
        {/* 1. การอนุมัติ */}
        <div className="bk-panel">
          <div className="bk-label">การอนุมัติ</div>

          <label className="bk-check">
            <input
              type="checkbox"
              {...register('needApproval')}
              onChange={(e) => {
                setValue('needApproval', e.target.checked, { shouldDirty: true })
                if (!e.target.checked) {
                    setValue('approverName', '')
                    setValue('approverEmail', '')
                }
              }}
            />
            <span>ต้องมีผู้อนุมัติ</span>
          </label>

          {needApproval && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                <Input
                  label="ชื่อ-นามสกุลผู้อนุมัติ"
                  placeholder="เช่น อ.____ ____"
                  error={errors.approverName?.message}
                  {...register('approverName', { required: 'กรุณากรอกชื่อผู้อนุมัติ' })}
                />
                
                <Input
                  label="อีเมลผู้อนุมัติ (เพื่อแจ้งเตือน)"
                  placeholder="approver@email.com"
                  error={errors.approverEmail?.message}
                  {...register('approverEmail', {
                    required: 'กรุณากรอกอีเมลผู้อนุมัติ',
                    pattern: { value: EMAIL_PATTERN, message: 'รูปแบบอีเมลไม่ถูกต้อง' },
                  })}
                />
            </div>
          )}
          <p className="bk-hint">* ระบบจะส่งอีเมลแจ้งเตือนไปยังผู้อนุมัติ</p>
        </div>

        {/* 2. เปิดรับผู้ร่วมทาง */}
        <div className="bk-panel">
          <div className="bk-label">เปิดรับผู้ร่วมทาง</div>

          <label className="bk-check">
            <input
              type="checkbox"
              {...register('openJoin')}
              onChange={(e) => setValue('openJoin', e.target.checked, { shouldDirty: true })}
            />
            <span>อนุญาตให้คนอื่นขอติดรถไปด้วยได้</span>
          </label>

          {openJoin && (
            <>
              <Input
                label="จำนวนที่นั่งว่างที่รับเพิ่มได้"
                type="number"
                min="1"
                placeholder="ระบุจำนวน"
                error={errors.seatCapacity?.message}
                {...register('seatCapacity', {
                  required: 'กรุณาระบุจำนวนที่นั่ง',
                  valueAsNumber: true,
                  min: { value: 1, message: 'อย่างน้อย 1 ที่นั่ง' },
                })}
              />
              <div className="bk-hint">* ระบุจำนวนคนที่สามารถติดรถเพิ่มได้</div>
            </>
          )}
        </div>
      </div>

      {/* ===== ผู้ร่วมเดินทาง (ส่วนที่เพิ่ม Checkbox) ===== */}
      <div className="bk-section" style={{ marginTop: 14 }}>
        <div className="bk-days-head">
          <h2>รายชื่อผู้ร่วมเดินทาง</h2>
          
          {/* ซ่อนปุ่มเพิ่ม ถ้าเลือกส่งทีหลัง */}
          {!submitListLater && (
            <button
                type="button"
                className="bk-addday"
                onClick={() => appendComp({ fullName: '', email: '', phone1: '', phone2: '' })}
            >
                + เพิ่มรายชื่อ
            </button>
          )}
        </div>

        {/* ✅ Checkbox: ส่งรายชื่อภายหลัง */}
        <label className="bk-check" style={{ marginBottom: '15px', background: '#fffbeb', padding: '10px', borderRadius: '8px', border: '1px solid #fcd34d' }}>
            <input 
                type="checkbox" 
                {...register('submitListLater')} 
            />
            <span style={{color: '#b45309', fontWeight: 'bold'}}>
                ยังไม่ระบุรายชื่อตอนนี้ (จะดำเนินการส่งไฟล์รายชื่อให้ภายหลัง)
            </span>
        </label>

        {/* ✅ Logic: ถ้าไม่ได้ติ๊ก ให้โชว์ช่องกรอก */}
        {!submitListLater && compFields.map((f, idx) => (
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
                placeholder="ชื่อ-นามสกุล"
                error={errors?.companions?.[idx]?.fullName?.message}
                {...register(`companions.${idx}.fullName`, {
                  required: 'กรุณากรอกชื่อ',
                })}
              />
              <Input
                label="E-mail"
                placeholder="name@email.com"
                {...register(`companions.${idx}.email`)}
              />
            </div>

            <div className="bk-grid">
              <Input
                label="เบอร์มือถือ (1)"
                placeholder="08xxxxxxxx"
                {...register(`companions.${idx}.phone1`)}
              />
              <Input
                label="เบอร์มือถือ (2)"
                placeholder="08xxxxxxxx"
                {...register(`companions.${idx}.phone2`)}
              />
            </div>
          </div>
        ))}
        
        {/* ข้อความแจ้งเตือนเมื่อเลือกส่งทีหลัง */}
        {submitListLater && (
            <div style={{color: '#64748b', fontSize: '14px', fontStyle: 'italic', marginLeft: '30px'}}>
                * กรุณารวบรวมรายชื่อและส่งให้ผู้ประสานงาน หรือแนบไฟล์ในหน้า "ประวัติการจอง" ในภายหลัง
            </div>
        )}
      </div>
    </>
  )
}