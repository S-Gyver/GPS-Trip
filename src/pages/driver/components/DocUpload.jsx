import { useRef, useState } from 'react'
import './DocUpload.css'
import { uploadDriverFile } from '../hooks/driverApi'
import { alertSuccess, alertError } from '../ui/alerts' // 1. เพิ่มบรรทัดนี้ (ถอยกลับไปหาโฟลเดอร์ ui)

const MAX_MB = 1
const OK_MIME = ['image/jpeg', 'image/png', 'application/pdf']
const toPublicUrl = (p) => (p ? `http://localhost/tripsync_api/${p}` : '')

export default function DocUpload({ label, field, value, onUploaded, disabled = false }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const pick = () => {
    if (disabled || uploading) return
    inputRef.current?.click()
  }

  const onChange = async (e) => {
    const file = e.target.files?.[0] || null
    e.target.value = ''
    if (!file) return

    // 2. เปลี่ยน alert ตรวจสอบประเภทไฟล์
    if (!OK_MIME.includes(file.type)) {
      alertError('ไฟล์ไม่ถูกต้อง', 'รองรับ JPG/PNG/PDF เท่านั้น')
      return
    }

    // 3. เปลี่ยน alert ตรวจสอบขนาดไฟล์
    if (file.size > MAX_MB * 1024 * 1024) {
      alertError('ไฟล์ใหญ่เกินไป', `ขนาดไฟล์ต้องไม่เกิน ${MAX_MB} MB`)
      return
    }

    try {
      setUploading(true)
      const res = await uploadDriverFile({ field, file })
      if (!res?.ok || !res?.json?.ok) throw new Error(res?.json?.message || 'อัปโหลดไม่สำเร็จ')

      const path = res.json.path || ''
      
      // 4. เปลี่ยน alert เมื่อสำเร็จ (ใช้ await เพื่อให้ User กด OK ก่อนค่อยอัปเดตรูป)
      await alertSuccess('อัปโหลดสำเร็จ', `อัปโหลด "${label}" เรียบร้อยแล้ว`)
      
      onUploaded?.(field, path)
    } catch (err) {
      // 5. เปลี่ยน alert เมื่อ error
      alertError('อัปโหลดไม่สำเร็จ', err?.message || 'กรุณาลองใหม่อีกครั้ง')
    } finally {
      setUploading(false)
    }
  }

  const isPdf = value && value.toLowerCase().endsWith('.pdf')
  // ใส่ timestamp กัน browser cache รูปเก่า
  const previewUrl = value && !isPdf ? `${toPublicUrl(value)}?t=${Date.now()}` : ''

  return (
    <div className="doc-box">
      <div className="doc-title">{label}</div>

      <div className="doc-row">
        <button type="button" className="doc-btn" onClick={pick} disabled={disabled || uploading}>
          {uploading ? 'กำลังอัปโหลด...' : value ? 'เปลี่ยนไฟล์' : 'เลือกไฟล์'}
        </button>
        <div className={`doc-status ${value ? 'ok' : ''}`}>{value ? 'อัปโหลดแล้ว' : 'ยังไม่อัปโหลด'}</div>
      </div>

      {!!previewUrl && (
        <div className="doc-preview">
          <img src={previewUrl} alt={label} />
        </div>
      )}

      {!!value && !previewUrl && (
        <div className="doc-preview">
          <a href={toPublicUrl(value)} target="_blank" rel="noreferrer">
            เปิดไฟล์ที่อัปโหลด (PDF)
          </a>
        </div>
      )}

      <input ref={inputRef} type="file" hidden accept="image/jpeg,image/png,application/pdf" onChange={onChange} disabled={disabled || uploading} />
    </div>
  )
}