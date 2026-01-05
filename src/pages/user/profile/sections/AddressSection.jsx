import { useState } from 'react'
import Input from '../../../../components/ui/Input/Input'
import Button from '../../../../components/ui/Button/Button'

export default function AddressSection() {
  const [form, setForm] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ts_address') || 'null') || {
        line1: '',
        district: '',
        province: '',
        zip: '',
      }
    } catch {
      return {
        line1: '',
        district: '',
        province: '',
        zip: '',
      }
    }
  })

  const [msg, setMsg] = useState('')

  const onChange = (e) => {
    setMsg('')
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const onSave = () => {
    localStorage.setItem('ts_address', JSON.stringify(form))
    setMsg('บันทึกที่อยู่เรียบร้อยแล้ว')
  }

  return (
    <div className="up-section">
      <h2 className="up-h2">ที่อยู่</h2>

      {msg && <div className="up-alert is-ok">{msg}</div>}

      <div className="up-row">
        <div className="up-label">ที่อยู่</div>
        <div className="up-field">
          <Input
            name="line1"
            value={form.line1}
            onChange={onChange}
            placeholder="บ้านเลขที่ / ถนน"
          />
        </div>
      </div>

      <div className="up-row">
        <div className="up-label">อำเภอ / เขต</div>
        <div className="up-field">
          <Input name="district" value={form.district} onChange={onChange} />
        </div>
      </div>

      <div className="up-row">
        <div className="up-label">จังหวัด</div>
        <div className="up-field">
          <Input name="province" value={form.province} onChange={onChange} />
        </div>
      </div>

      <div className="up-row">
        <div className="up-label">รหัสไปรษณีย์</div>
        <div className="up-field">
          <Input name="zip" value={form.zip} onChange={onChange} />
        </div>
      </div>

      <div className="up-actions">
        <Button type="button" onClick={onSave}>
          บันทึกที่อยู่
        </Button>
      </div>
    </div>
  )
}
