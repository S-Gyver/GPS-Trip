import { useState } from 'react'
import Input from '../../../../components/ui/Input/Input'
import Button from '../../../../components/ui/Button/Button'

export default function PasswordSection() {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' })
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const onChange = (e) => {
    setMsg('')
    setErr('')
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const onSave = () => {
    setMsg('')
    setErr('')
    if (!form.next || form.next.length < 6) return setErr('รหัสผ่านใหม่ต้องอย่างน้อย 6 ตัว')
    if (form.next !== form.confirm) return setErr('ยืนยันรหัสผ่านไม่ตรงกัน')
    // Phase 1: ยังไม่ผูก backend
    setMsg('บันทึกสำเร็จ (เดี๋ยว Phase ต่อไปค่อยเชื่อม backend)')
    setForm({ current: '', next: '', confirm: '' })
  }

  return (
    <div className="up-section">
      <h2 className="up-h2">เปลี่ยนรหัสผ่าน</h2>

      {err && <div className="up-alert is-error">{err}</div>}
      {msg && <div className="up-alert is-ok">{msg}</div>}

      <div className="up-row">
        <div className="up-label">รหัสผ่านเดิม</div>
        <div className="up-field">
          <Input type="password" name="current" value={form.current} onChange={onChange} />
        </div>
      </div>

      <div className="up-row">
        <div className="up-label">รหัสผ่านใหม่</div>
        <div className="up-field">
          <Input type="password" name="next" value={form.next} onChange={onChange} />
        </div>
      </div>

      <div className="up-row">
        <div className="up-label">ยืนยันรหัสผ่าน</div>
        <div className="up-field">
          <Input type="password" name="confirm" value={form.confirm} onChange={onChange} />
        </div>
      </div>

      <div className="up-actions">
        <Button type="button" onClick={onSave}>บันทึก</Button>
      </div>
    </div>
  )
}
