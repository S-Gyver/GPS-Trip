import Swal from 'sweetalert2'

// 1. แจ้งเตือนสำเร็จ (Auto Close ใน 1.5 วิ)
export const fireSuccess = (title = 'ทำรายการสำเร็จ', text = '') => {
  return Swal.fire({
    icon: 'success',
    title: title,
    text: text,
    showConfirmButton: false,
    timer: 1500,
    customClass: {
      popup: 'rounded-lg shadow-lg'
    }
  })
}

// 2. แจ้งเตือนเมื่อเกิด Error
export const fireError = (title = 'เกิดข้อผิดพลาด', text = 'กรุณาลองใหม่อีกครั้ง') => {
  return Swal.fire({
    icon: 'error',
    title: title,
    text: text,
    confirmButtonText: 'ตกลง',
    confirmButtonColor: '#3b82f6' // สีฟ้าธีม Admin
  })
}

// 3. ป๊อปอัพยืนยัน (เช่น ก่อนลบข้อมูล)
export const fireConfirm = async (
  title = 'ยืนยันการทำรายการ?', 
  text = 'คุณแน่ใจหรือไม่ที่จะดำเนินการต่อ', 
  confirmText = 'ยืนยัน',
  confirmColor = '#d33' // สีแดง (เหมาะสำหรับปุ่มลบ)
) => {
  const result = await Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: confirmColor,
    cancelButtonColor: '#64748b',
    confirmButtonText: confirmText,
    cancelButtonText: 'ยกเลิก',
    reverseButtons: true // สลับปุ่มให้ยกเลิกอยู่ซ้าย ยืนยันอยู่ขวา
  })
  
  return result.isConfirmed // คืนค่า true ถ้ากดยืนยัน, false ถ้ากดยกเลิก
}