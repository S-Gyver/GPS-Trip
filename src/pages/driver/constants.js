// src/pages/driver/constants.js
export const PHONE_PATTERN = /^0\d{9}$/
export const ID_PATTERN = /^\d{13}$/
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const API_BASE = 'http://localhost/tripsync_api'

// อนุญาตไฟล์เอกสาร/รูป
export const MAX_FILE_MB = 1
export const OK_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf']

// helper ทำ path เป็น url เปิดดูได้
export function toPublicUrl(path) {
  if (!path) return ''
  if (String(path).startsWith('http')) return path
  const clean = String(path).replace(/^\/+/, '')
  return `${API_BASE}/${clean}`
}
