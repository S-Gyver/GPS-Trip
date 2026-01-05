// src/pages/driver/hooks/useDriverRegisterSubmit.js

import { saveDriverBasic } from './driverApi'

export function useDriverRegisterSubmit() {
  return async function submitDriverRegister(formData) {
    try {
      const payload = {
        // ⚠️ STEP 3 ชั่วคราว
        user_id: 30, // เปลี่ยนเป็น user จริงใน STEP ถัดไป

        // ===== PERSONAL =====
        first_name: (formData.firstName || '').trim(),
        last_name: (formData.lastName || '').trim(),
        phone: (formData.phone || '').trim(),
        id_card_no: (formData.idCard || '').trim(),
        birth_date: formData.birthDate || null,

        // ===== VEHICLE =====
        vehicle_type: formData.vehicleType || null,
        license_plate: (formData.plate || '').trim(),
        car_brand: (formData.make || '').trim(),
        car_model: (formData.model || '').trim(),

        engine_cc:
          formData.engine === '' || formData.engine == null
            ? null
            : Number(formData.engine),

        seats:
          formData.seats === '' || formData.seats == null
            ? null
            : Number(formData.seats),

        price_per_day:
          formData.pricePerDay === '' || formData.pricePerDay == null
            ? null
            : Number(formData.pricePerDay),
      }

      const res = await saveDriverBasic(payload)

      if (!res?.ok || !res?.json?.success) {
        return {
          success: false,
          message: res?.json?.message || 'บันทึกไม่สำเร็จ',
        }
      }

      return {
        success: true,
        driver_id: res.json.driver_id,
      }
    } catch (err) {
      console.error('useDriverRegisterSubmit error:', err)
      return {
        success: false,
        message: err?.message || 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้',
      }
    }
  }
}
