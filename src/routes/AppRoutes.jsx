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

import UserProfilePage from '../pages/user/profile/UserProfilePage'

import DriverRegisterPage from '../pages/driver/DriverRegisterPage'

export default function AppRoutes() {
  return (
    <Routes>
      {/* ===== Public ===== */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ===== Admin login ===== */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* ===== Protected (login เท่านั้น) ===== */}
      <Route
        path="/booking"
        element={
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/booking/status"
        element={
          <ProtectedRoute>
            <BookingStatusPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/trips"
        element={
          <ProtectedRoute>
            <TripsHistoryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/driver/register"
        element={
          <ProtectedRoute>
            <DriverRegisterPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfilePage />
          </ProtectedRoute>
        }
      />

      {/* ===== Not found (ต้องไว้ท้ายสุดเสมอ) ===== */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
