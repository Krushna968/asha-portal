import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import MainDashboard from './pages/MainDashboard'
import WorkersListPage from './pages/WorkersListPage'
import WorkerProfilePage from './pages/DashboardPage'
import BeneficiariesListPage from './pages/BeneficiariesListPage'
import HighRiskTrackerPage from './pages/HighRiskTrackerPage'
import PushNotificationsPage from './pages/PushNotificationsPage'
import SakhiChat from './components/SakhiChat'

function SakhiChatWrapper() {
  const location = useLocation()
  // Only show SakhiChat on non-login pages
  if (location.pathname === '/') return null
  return <SakhiChat />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<MainDashboard />} />
        <Route path="/workers" element={<WorkersListPage />} />
        <Route path="/workers/:id" element={<WorkerProfilePage />} />
        <Route path="/beneficiaries" element={<BeneficiariesListPage />} />
        <Route path="/high-risk" element={<HighRiskTrackerPage />} />
        <Route path="/messages" element={<PushNotificationsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <SakhiChatWrapper />
    </BrowserRouter>
  )
}
