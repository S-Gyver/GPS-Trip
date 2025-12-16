import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

// Pages
import HomePage from '../pages/home/HomePage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'

import BookingPage from '../pages/user/booking/BookingPage'
import BookingStatusPage from '../pages/user/bookingStatus/BookingStatusPage'
import TripsHistoryPage from '../pages/user/trips/TripsHistoryPage'

import AdminLoginPage from '../pages/admin/AdminLoginPage'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'

import DriverJobsPage from '../pages/driver/DriverJobsPage'

export default function AppRoutes() {
  return (
    <Routes>
      {/* ===== Public ===== */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/driver/login" element={<LoginPage />} />
      <Route path="/driver/register" element={<RegisterPage />} />

      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* ===== Booking (เปิดให้กรอกได้ ไม่บังคับ login) ===== */}
      <Route path="/booking" element={<BookingPage />} />

      {/* ===== User (protected) ===== */}
      <Route
        path="/booking/status"
        element={
          <ProtectedRoute allow={['user']}>
            <BookingStatusPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips"
        element={
          <ProtectedRoute allow={['user']}>
            <TripsHistoryPage />
          </ProtectedRoute>
        }
      />

      {/* ===== Driver (protected) ===== */}
      <Route
        path="/driver/jobs"
        element={
          <ProtectedRoute allow={['driver']}>
            <DriverJobsPage />
          </ProtectedRoute>
        }
      />

      {/* ===== Admin ===== */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allow={['admin']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* ===== Not found ===== */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
