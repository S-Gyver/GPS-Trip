// src/pages/driver/hooks/driverApi.js
const BASE = 'http://localhost/tripsync_api/api/drivers'

async function safeJson(res) {
  const text = await res.text()
  try {
    return { json: JSON.parse(text), text }
  } catch {
    return { json: null, text }
  }
}

export async function getDriverProfile() {
  const res = await fetch(`${BASE}/driver_profile_get.php`, {
    method: 'GET',
    credentials: 'include', // สำคัญ: ส่ง Cookie Session ไปด้วย
  })
  const { json, text } = await safeJson(res)
  return { ok: res.ok, json, raw: text, status: res.status }
}

export async function uploadDriverFile({ field, file }) {
  const fd = new FormData()
  fd.append('field', field)
  fd.append('file', file)

  const res = await fetch(`${BASE}/driver_upload.php`, {
    method: 'POST',
    credentials: 'include',
    body: fd,
  })
  const { json, text } = await safeJson(res)
  return { ok: res.ok, json, raw: text, status: res.status }
}

// ✅ แก้ชื่อฟังก์ชันให้สื่อความหมาย และชี้ไปที่ driver_save.php
export async function commitDriver(payload) {
  const res = await fetch(`${BASE}/driver_save.php`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const { json, text } = await safeJson(res)
  return { ok: res.ok, json, raw: text, status: res.status }
}