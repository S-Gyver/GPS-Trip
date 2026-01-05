import { useRef } from 'react'
import './DriverAvatarCard.css'

export default function DriverAvatarCard({ topPreview = '', onPickPhoto, disabled = false }) {
  const inputRef = useRef(null)

  const pick = () => {
    if (disabled) return
    inputRef.current?.click()
  }

  const onChange = (e) => {
    const file = e.target.files?.[0] || null
    e.target.value = ''
    if (!file) return
    onPickPhoto?.(file)
  }

  return (
    // เปลี่ยนจาก dac-wrap เป็น dr-top ให้ตรงกับ CSS
    <div className="dr-top">
      
      {/* ส่วนแสดงรูปภาพ */}
      <div className="dr-avatarCard">
        {topPreview ? (
          <img src={topPreview} alt="avatar" className="dr-avatarImg" />
        ) : (
          <div className="dr-avatarFallback">
            {/* ไอคอนกล้องตอนยังไม่มีรูป */}
            <span className="dr-avatarIcon">📷</span>
          </div>
        )}
      </div>

      {/* ส่วนปุ่มกด */}
      <div className="dr-topActions">
        <button 
          type="button" 
          className="dr-uploadBtn" 
          onClick={pick} 
          disabled={disabled}
        >
          {topPreview ? 'เปลี่ยนรูปโปรไฟล์' : 'อัปโหลดรูปโปรไฟล์'}
        </button>
        <div className="dr-uploadHint">รองรับ JPG / PNG (≤ 1MB)</div>
      </div>

      {/* Input file ซ่อนไว้ */}
      <input 
        ref={inputRef} 
        type="file" 
        className="dr-fileHidden" 
        accept="image/jpeg,image/png" 
        onChange={onChange} 
        disabled={disabled} 
      />
    </div>
  )
}