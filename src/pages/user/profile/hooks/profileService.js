const API_BASE = 'http://localhost/tripsync_api'

export async function updateProfile(payload) {
  const res = await fetch(`${API_BASE}/api/user/update_profile.php`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok || data?.ok === false) throw new Error(data?.message || 'บันทึกไม่สำเร็จ')
  return data
}
