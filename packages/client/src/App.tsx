import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import LogWorkout from './pages/LogWorkout'
import WorkoutDetail from './pages/WorkoutDetail'
import History from './pages/History'
import Progress from './pages/Progress'

function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pb-16 sm:pb-0">
        <Outlet />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/log" element={<LogWorkout />} />
        <Route path="/workout/:id" element={<WorkoutDetail />} />
        <Route path="/history" element={<History />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
