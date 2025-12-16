const KEY = 'tripsync_bookings'

// ========================
// helpers
// ========================
const readAll = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

const writeAll = (items) => {
  localStorage.setItem(KEY, JSON.stringify(items))
}

// ========================
// USER
// ========================

// สร้างการจอง
export function createBooking(payload) {
  const items = readAll()
  const now = Date.now()

  const booking = {
    id: `b_${now}`,
    status: 'PENDING_APPROVAL', // PENDING_APPROVAL | APPROVED | REJECTED
    createdAt: now,
    updatedAt: now,

    // guard โครงสร้าง days (กัน payload แปลก)
    days: Array.isArray(payload.days) ? payload.days : [],

    ...payload,
  }

  items.unshift(booking)
  writeAll(items)
  return booking
}

// ดึงรายการล่าสุดของ user
export function getLatestBookingByUser(userId) {
  return readAll().find((b) => b.userId === userId) || null
}

// ดึงรายการทั้งหมดของ user
export function getBookingsByUser(userId) {
  return readAll().filter((b) => b.userId === userId)
}

// ดึง booking ตาม id
export function getBookingById(bookingId) {
  return readAll().find((b) => b.id === bookingId) || null
}

// ========================
// ADMIN
// ========================

// ดึง booking ทั้งหมด (เรียงใหม่ → เก่า)
export function getAllBookings() {
  return readAll().sort((a, b) => b.createdAt - a.createdAt)
}

// เปลี่ยนสถานะ booking
export function updateBookingStatus(bookingId, nextStatus) {
  const items = readAll()
  const index = items.findIndex((b) => b.id === bookingId)

  if (index === -1) {
    throw new Error('ไม่พบรายการจอง')
  }

  items[index] = {
    ...items[index],
    status: nextStatus,
    updatedAt: Date.now(),
  }

  writeAll(items)
  return items[index]
}
