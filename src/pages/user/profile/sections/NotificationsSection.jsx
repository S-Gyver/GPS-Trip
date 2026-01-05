import { useState } from 'react'
import Button from '../../../../components/ui/Button/Button'

export default function NotificationsSection() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('ts_notify') || 'null')
      return saved ?? { email: true, sms: false, promo: true }
    } catch {
      return { email: true, sms: false, promo: true }
    }
  })

  const toggle = (key) => {
    setSettings((s) => ({ ...s, [key]: !s[key] }))
  }

  const onSave = () => {
    localStorage.setItem('ts_notify', JSON.stringify(settings))
    alert('บันทึกการตั้งค่าเรียบร้อยแล้ว')
  }

  return (
    <div className="up-section">
      <h2 className="up-h2">ตั้งค่าการแจ้งเตือน</h2>

      <label className="up-check">
        <input
          type="checkbox"
          checked={settings.email}
          onChange={() => toggle('email')}
        />
        แจ้งเตือนผ่านอีเมล
      </label>

      <label className="up-check">
        <input
          type="checkbox"
          checked={settings.sms}
          onChange={() => toggle('sms')}
        />
        แจ้งเตือนผ่าน SMS
      </label>

      <label className="up-check">
        <input
          type="checkbox"
          checked={settings.promo}
          onChange={() => toggle('promo')}
        />
        รับข่าวสารและโปรโมชัน
      </label>

      <div className="up-actions">
        <Button type="button" onClick={onSave}>
          บันทึก
        </Button>
      </div>
    </div>
  )
}
