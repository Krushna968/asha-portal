import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import MainDashboard from './pages/MainDashboard'
import WorkersListPage from './pages/WorkersListPage'
import WorkerProfilePage from './pages/DashboardPage'
import BeneficiariesListPage from './pages/BeneficiariesListPage'
import HighRiskTrackerPage from './pages/HighRiskTrackerPage'
import RegisterWorker from './pages/RegisterWorker'

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
        <Route path="/register-worker" element={<RegisterWorker />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
