import { apiUpdateDriverFiles } from './driverApi'

export function useDriverFileSubmit() {
  const submitFiles = async ({ driver_id, tempToken }) => {
    if (!driver_id) throw new Error('driver_id missing')
    if (!tempToken) throw new Error('tempToken missing')

    const res = await apiUpdateDriverFiles({ driver_id, tempToken })
    if (!res?.ok) throw new Error(res?.message || 'อัปเดตไฟล์ไม่สำเร็จ')
    return res
  }

  return { submitFiles }
}
