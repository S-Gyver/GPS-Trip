import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

// Pages
import HomePage from '../pages/home/HomePage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'

// User Pages
import BookingPage from '../pages/user/booking/BookingPage'
import BookingStatusPage from '../pages/user/bookingStatus/BookingStatusPage'
import TripsHistoryPage from '../pages/user/trips/TripsHistoryPage'
import UserProfilePage from '../pages/user/profile/UserProfilePage'

// ✅ หน้าใหม่ที่เพิ่มเข้ามา
import JoinTripsPage from '../pages/join/JoinTripsPage'
import CarSchedulePage from '../pages/schedule/CarSchedulePage'
import JoinRequestPage from '../pages/join/JoinRequestPage' // 👈 เพิ่ม Import นี้

// Admin & Driver Pages
import AdminLoginPage from '../pages/admin/AdminLoginPage'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
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

      {/* ===== Protected (Login Required) ===== */}
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

      {/* ✅✅✅ เพิ่ม Route ใหม่: หาเพื่อนร่วมทาง */}
      <Route
        path="/join-trips"
        element={
          <ProtectedRoute>
            <JoinTripsPage />
          </ProtectedRoute>
        }
      />

      {/* ✅✅✅ เพิ่ม Route ใหม่: ฟอร์มขอร่วมทาง (กดจาก JoinTripsPage มาหน้านี้) */}
      <Route
        path="/join-request"
        element={
          <ProtectedRoute>
            <JoinRequestPage />
          </ProtectedRoute>
        }
      />

      {/* ✅✅✅ เพิ่ม Route ใหม่: ตารางงานรถ */}
      <Route
        path="/schedule"
        element={
          <ProtectedRoute>
            <CarSchedulePage />
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

      {/* ===== Admin & Driver ===== */}
      <Route
        path="/admin/dashboard"
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

      {/* ===== Not found (ต้องไว้ท้ายสุดเสมอ) ===== */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}