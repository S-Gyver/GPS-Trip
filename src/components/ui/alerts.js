import Swal from 'sweetalert2'

export const alertSuccess = (title = 'สำเร็จ', text = '') =>
  Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonText: 'ตกลง',
    confirmButtonColor: '#16a34a',
  })

export const alertError = (title = 'เกิดข้อผิดพลาด', text = '') =>
  Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'โอเค',
  })

export const alertWarn = (title = 'แจ้งเตือน', text = '') =>
  Swal.fire({
    icon: 'warning',
    title,
    text,
    confirmButtonText: 'โอเค',
  })

export const confirmAction = async ({
  title = 'ยืนยัน?',
  text = '',
  confirmText = 'ยืนยัน',
  cancelText = 'ยกเลิก',
} = {}) => {
  const res = await Swal.fire({
    icon: 'question',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  })
  return !!res.isConfirmed
}
