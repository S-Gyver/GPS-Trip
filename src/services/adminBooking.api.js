import { getAllBookings, updateBookingStatus } from './booking.api'

export function adminListBookings() {
  return getAllBookings()
}

export function adminApproveBooking(id) {
  return updateBookingStatus(id, 'APPROVED')
}

export function adminRejectBooking(id) {
  return updateBookingStatus(id, 'REJECTED')
}
