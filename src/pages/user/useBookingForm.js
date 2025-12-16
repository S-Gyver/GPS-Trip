import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSession } from '../../services/auth.api'
import { createBooking } from '../../services/booking.api'

export function useBookingLogic() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (values) => {
    try {
      setError('')
      setLoading(true)

      const session = getSession()

      // ✅ เช็ค token เป็นหลัก (ไม่เช็ค id เพราะตอนนี้ไม่ได้เก็บ id ใน session)
      if (!session?.token) {
        setError('กรุณาเข้าสู่ระบบก่อนทำการจอง')
        navigate('/login', { replace: true, state: { from: '/booking' } })
        return
      }

      // ✅ fallback user id (ถ้าไม่มี id จริง ๆ ก็ใช้ email แทนชั่วคราว)
      const userId = session?.user?.id || session?.user?.email || 'guest-user'

      // ✅ createBooking มักเป็น async -> await ไว้ก่อนชัวร์
      const booking = await createBooking({
        userId,
        userEmail: session?.user?.email || null,
        ...values,
      })

      // ✅ ไปหน้า status (หน้า protected) ให้ replace กันย้อนกลับไปซ้ำ
      navigate('/booking/status', { replace: true, state: { bookingId: booking?.id } })
    } catch (e) {
      setError(e?.message || 'จองไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, submit }
}
