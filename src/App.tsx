'use client'
import { Routes, Route, Navigate } from 'react-router-dom'
import { getSession } from './lib/auth'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Staffs from './pages/Staffs'
import Cupons from './pages/Cupons'
import Logs from './pages/Logs'
import Avisos from './pages/Avisos'

function Protected({ children }: { children: React.ReactNode }) {
  return getSession() ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      <Route path="/staffs" element={<Protected><Staffs /></Protected>} />
      <Route path="/cupons" element={<Protected><Cupons /></Protected>} />
      <Route path="/logs" element={<Protected><Logs /></Protected>} />
      <Route path="/avisos" element={<Protected><Avisos /></Protected>} />
      <Route path="*" element={<Navigate to={getSession() ? '/dashboard' : '/login'} replace />} />
    </Routes>
  )
}
