import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Courses from './pages/user/Courses'
import MyCourses from './pages/user/MyCourses'
import Profile from './pages/user/Profile'
import AdminDashboard from './pages/admin/Dashboard'
import CourseManagement from './pages/admin/CourseManagement'
import CustomerManagement from './pages/admin/CustomerManagement'
import SalesReport from './pages/admin/SalesReport'
import FeedbackAdmin from './pages/admin/FeedbackAdmin'
import FollowUps from './pages/admin/FollowUps'

function UserRoute() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'ROLE_ADMIN') return <Navigate to="/admin" replace />
  return <Outlet />
}

function AdminRoute() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'ROLE_ADMIN') return <Navigate to="/" replace />
  return <Outlet />
}

function GuestRoute() {
  const { user } = useAuth()
  if (user?.role === 'ROLE_ADMIN') return <Navigate to="/admin" replace />
  if (user?.role === 'ROLE_USER')  return <Navigate to="/courses" replace />
  return <Outlet />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '14px' },
            success: { duration: 3000 },
            error:   { duration: 4000 },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />

          {/* Guest only */}
          <Route element={<GuestRoute />}>
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* User protected */}
          <Route element={<UserRoute />}>
            <Route path="/courses"    element={<Courses />} />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/profile"    element={<Profile />} />
          </Route>

          {/* Admin protected */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route index           element={<AdminDashboard />} />
            <Route path="courses"  element={<CourseManagement />} />
            <Route path="customers"element={<CustomerManagement />} />
            <Route path="sales"    element={<SalesReport />} />
            <Route path="feedback" element={<FeedbackAdmin />} />
            <Route path="followups"element={<FollowUps />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
