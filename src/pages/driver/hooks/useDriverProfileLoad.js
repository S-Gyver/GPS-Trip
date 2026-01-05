import { useEffect, useState } from 'react'
import { authMe, getDriverProfile } from './driverApi'

export function useDriverProfileLoad({ reset }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true

    async function load() {
      try {
        const me = await authMe()
        if (!alive) return

        if (!me?.ok || !me?.json?.logged_in) {
          console.warn('Not logged in')
          return
        }

        const res = await getDriverProfile()
        if (!alive) return

        if (res?.ok && res?.json?.success && res.json.data) {
          // ✅ เติมค่าทั้งฟอร์มจาก DB
          reset({ ...res.json.data })
        } else {
          // ✅ ถ้าไม่มีข้อมูลใน drivers (ยังไม่สมัคร) ให้เคลียร์ฟอร์ม
          reset((prev) => ({
            ...prev,
            first_name: '',
            last_name: '',
            phone: '',
            id_card_no: '',
            birth_date: '',
            vehicle_type: '',
            license_plate: '',
            car_brand: '',
            car_model: '',
            engine_cc: '',
            seats: '',
            price_per_day: '',
          }))
        }
      } catch (e) {
        console.error('load driver profile error', e)
      } finally {
        if (alive) setLoading(false)
      }
    }

    load()
    return () => {
      alive = false
    }
  }, [reset])

  return { loading }
}
