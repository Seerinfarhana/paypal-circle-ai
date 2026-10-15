import { Route, Routes, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/AppShell'
import Landing from '@/pages/Landing'
import Auth from '@/pages/Auth'
import Dashboard from '@/pages/Dashboard'
import CreateCircle from '@/pages/CreateCircle'
import Workspace from '@/pages/Workspace'
import Purchasing from '@/pages/Purchasing'
import Complete from '@/pages/Complete'
import { ActivityPage, CirclesPage, DiscoverPage, PaymentsPage, ProfilePage } from '@/pages/Sections'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/app" element={<AppShell />}>
        <Route index element={<Dashboard />} />
        <Route path="circles" element={<CirclesPage />} />
        <Route path="circles/new" element={<CreateCircle />} />
        <Route path="circles/:id" element={<Workspace />} />
        <Route path="circles/:id/purchasing" element={<Purchasing />} />
        <Route path="circles/:id/complete" element={<Complete />} />
        <Route path="discover" element={<DiscoverPage />} />
        <Route path="activity" element={<ActivityPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
