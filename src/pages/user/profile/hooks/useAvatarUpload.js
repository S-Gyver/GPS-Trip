import { useRef, useState } from 'react'
import { saveToTsUser, updateOriginalSession } from '../utils/sessionStore'
import { toPublicUrl } from '../utils/toPublicUrl'

/**
 * ✅ API_BASE ต้องชี้เข้่า /api (ไม่ใช่รากโปรเจกต์)
 * เพราะไฟล์ PHP อยู่ที่: tripsync_api/api/user/user_avatar_upload.php
 */
const API_BASE = 'http://localhost/tripsync_api/api'
const MAX_MB = 5

// ✅ บีบรูปก่อนอัปโหลด (resize + compress) เพื่อลดจาก 2-5MB เหลือ ~100-300KB
async function compressImage(file, { maxSize = 768, quality = 0.75 } = {}) {
  if (!file?.type?.startsWith('image/')) return file

  const img = new Image()
  const url = URL.createObjectURL(file)

  await new Promise((resolve, reject) => {
    img.onload = resolve
    img.onerror = reject
    img.src = url
  })

  let { width, height } = img

  // resize ให้ด้านยาวสุดไม่เกิน maxSize
  if (width > height) {
    if (width > maxSize) {
      height = Math.round((height * maxSize) / width)
      width = maxSize
    }
  } else {
    if (height > maxSize) {
      width = Math.round((width * maxSize) / height)
      height = maxSize
    }
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, width, height)

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))

  URL.revokeObjectURL(url)

  // กันกรณี toBlob คืน null
  if (!blob) return file

  return new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' })
}

async function uploadAvatar(file) {
  const fd = new FormData()
  fd.append('avatar', file)

  // ✅ ยิงไปที่ path จริงของเอย
  const res = await fetch(`${API_BASE}/user/user_avatar_upload.php`, {
    method: 'POST',
    credentials: 'include',
    body: fd,
  })

  const text = await res.text()
  let json = null
  try {
    json = JSON.parse(text)
  } catch {
    json = null
  }

  if (!res.ok) throw new Error(json?.message || text || 'อัปโหลดรูปไม่สำเร็จ')
  if (!json?.ok || !json?.avatar) throw new Error(json?.message || 'อัปโหลดรูปไม่สำเร็จ')
  return json
}

export function useAvatarUpload({ sessionUser, form, stored, setForm, setSessionUser, setMsg, setErr }) {
  const fileRef = useRef(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const onPickImage = () => {
    if (uploadingAvatar) return
    fileRef.current?.click()
  }

  const onFileChange = async (e) => {
    setMsg('')
    setErr('')

    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    const okType = ['image/jpeg', 'image/png']
    if (!okType.includes(file.type)) return setErr('รองรับไฟล์ .JPEG / .PNG เท่านั้น')

    if (file.size > MAX_MB * 1024 * 1024) return setErr(`ขนาดไฟล์ต้องไม่เกิน ${MAX_MB} MB`)

    setUploadingAvatar(true)

    try {
      // ✅ บีบก่อนอัปโหลด
      const compressed = await compressImage(file, { maxSize: 768, quality: 0.75 })

      // preview รูปที่บีบแล้ว
      const previewUrl = URL.createObjectURL(compressed)
      setForm((s) => ({ ...s, avatarDataUrl: previewUrl }))

      const json = await uploadAvatar(compressed)
      const fullUrl = toPublicUrl(json.avatar)

      setForm((s) => ({ ...s, avatarDataUrl: fullUrl, avatarPath: json.avatar }))
      setSessionUser({ ...(sessionUser || {}), avatar: json.avatar })

      const storeUser = {
        id: sessionUser?.id,
        role: sessionUser?.role || 'user',
        name: form.username,
        username: form.username,
        email: form.email,
        phone: form.phone,
        gender: form.gender,
        birth_day: form.birthDay ? Number(form.birthDay) : null,
        birth_month: form.birthMonth ? Number(form.birthMonth) : null,
        birth_year: form.birthYear ? Number(form.birthYear) : null,
        avatar: json.avatar,
        avatarDataUrl: fullUrl,
      }

      saveToTsUser(storeUser)
      updateOriginalSession(stored, storeUser)
      window.dispatchEvent(new Event('ts_user_updated'))
      setMsg('อัปโหลดรูปโปรไฟล์สำเร็จ')
    } catch (e2) {
      const fallback = toPublicUrl(sessionUser?.avatar) || ''
      setForm((s) => ({ ...s, avatarDataUrl: fallback }))
      setErr(e2?.message || 'อัปโหลดรูปไม่สำเร็จ')
    } finally {
      setUploadingAvatar(false)
    }
  }

  return { fileRef, uploadingAvatar, onPickImage, onFileChange }
}
