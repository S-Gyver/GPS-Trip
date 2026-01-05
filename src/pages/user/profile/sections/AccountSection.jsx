import Input from '../../../../components/ui/Input/Input'

const MONTHS = [
  { label: 'มกราคม', value: '1' },
  { label: 'กุมภาพันธ์', value: '2' },
  { label: 'มีนาคม', value: '3' },
  { label: 'เมษายน', value: '4' },
  { label: 'พฤษภาคม', value: '5' },
  { label: 'มิถุนายน', value: '6' },
  { label: 'กรกฎาคม', value: '7' },
  { label: 'สิงหาคม', value: '8' },
  { label: 'กันยายน', value: '9' },
  { label: 'ตุลาคม', value: '10' },
  { label: 'พฤศจิกายน', value: '11' },
  { label: 'ธันวาคม', value: '12' },
]

export default function AccountSection({ form, onChange }) {
  // กันค่า 0 / null ให้ select แสดงถูก
  const birthDay = form.birthDay ? String(form.birthDay) : ''
  const birthMonth = form.birthMonth ? String(form.birthMonth) : ''
  const birthYear = form.birthYear ? String(form.birthYear) : ''

  return (
    <>
      <div className="up-row">
        <div className="up-label">ชื่อผู้ใช้</div>
        <div className="up-field">
          <Input name="username" value={form.username} onChange={onChange} placeholder="ชื่อ" />
        </div>
      </div>

      <div className="up-row">
        <div className="up-label">อีเมล</div>
        <div className="up-field up-inline">
          <div className="up-muted">{form.email || '-'}</div>
        </div>
      </div>

      <div className="up-row">
        <div className="up-label">หมายเลขโทรศัพท์</div>
        <div className="up-field up-inline">
          <Input name="phone" value={form.phone} onChange={onChange} placeholder="0xxxxxxxxx" />
        </div>
      </div>

      <div className="up-row">
        <div className="up-label">เพศ</div>
        <div className="up-field up-radios">
          <label className="up-radio">
            <input type="radio" name="gender" value="male" checked={form.gender === 'male'} onChange={onChange} />
            ชาย
          </label>
          <label className="up-radio">
            <input type="radio" name="gender" value="female" checked={form.gender === 'female'} onChange={onChange} />
            หญิง
          </label>
          <label className="up-radio">
            <input type="radio" name="gender" value="none" checked={form.gender === 'none'} onChange={onChange} />
            อื่น ๆ
          </label>
        </div>
      </div>

      <div className="up-row">
        <div className="up-label">วัน/เดือน/ปี เกิด</div>
        <div className="up-field up-dob">
          <select name="birthDay" value={birthDay} onChange={onChange}>
            <option value="">Date</option>
            {Array.from({ length: 31 }, (_, i) => String(i + 1)).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* ✅ ส่งเป็นเลขเดือน 1-12 */}
          <select name="birthMonth" value={birthMonth} onChange={onChange}>
            <option value="">เดือน</option>
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>

          <select name="birthYear" value={birthYear} onChange={onChange}>
            <option value="">ปี</option>
            {Array.from({ length: 80 }, (_, i) => String(new Date().getFullYear() - i)).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  )
}
