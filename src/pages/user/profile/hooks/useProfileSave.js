import { updateProfile } from './profileService'
import { saveToTsUser, updateOriginalSession } from '../utils/sessionStore'
import { toPublicUrl } from '../utils/toPublicUrl'

export function useProfileSave({ sessionUser, form, stored, setSessionUser, setMsg, setErr, setSaving }) {
  return async function onSave(e) {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    setErr('')

    try {
      const id = sessionUser?.id
      if (!id) throw new Error('ไม่พบ user id')

      const payload = {
        id,
        username: form.username,
        email: String(form.email || '').trim().toLowerCase(),
        phone: String(form.phone || '').trim(),
        gender: form.gender,
        birth_day: form.birthDay ? Number(form.birthDay) : null,
        birth_month: form.birthMonth ? Number(form.birthMonth) : null,
        birth_year: form.birthYear ? Number(form.birthYear) : null,
        avatar: form.avatarPath || '',
      }

      const data = await updateProfile(payload)
      const u = data?.user || {}

      const nextUser = { ...(sessionUser || {}), ...u, id }
      setSessionUser(nextUser)

      const storeUser = {
        id,
        role: nextUser.role || 'user',
        name: nextUser.username || payload.username,
        username: nextUser.username || payload.username,
        email: nextUser.email || payload.email,
        phone: nextUser.phone || payload.phone,
        gender: nextUser.gender || payload.gender,
        birth_day: nextUser.birth_day ?? payload.birth_day,
        birth_month: nextUser.birth_month ?? payload.birth_month,
        birth_year: nextUser.birth_year ?? payload.birth_year,
        avatar: nextUser.avatar || payload.avatar || '',
        avatarDataUrl: toPublicUrl(nextUser.avatar || payload.avatar) || '',
      }

      saveToTsUser(storeUser)
      updateOriginalSession(stored, storeUser)
      window.dispatchEvent(new Event('ts_user_updated'))

      setMsg('บันทึกข้อมูลเรียบร้อยแล้ว')
    } catch (e2) {
      setErr(e2?.message || 'บันทึกไม่สำเร็จ')
    } finally {
      setSaving(false)
    }
  }
}
