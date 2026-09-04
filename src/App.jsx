import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import LandingPage from './pages/LandingPage'
import CitizenPortal from './pages/CitizenPortal'
import PolicyCockpit from './pages/PolicyCockpit'
import ProjectLifecycle from './pages/ProjectLifecycle'
import ImpactDashboard from './pages/ImpactDashboard'
import FederationView from './pages/FederationView'
import AuditTrail from './pages/AuditTrail'
import DataFusion from './pages/DataFusion'
import IntegrityEngine from './pages/IntegrityEngine'
import CitizenNotifications from './pages/CitizenNotifications'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<Layout />}>
          {/* Citizen Layer */}
          <Route path="/citizen"       element={<CitizenPortal />} />
          <Route path="/notifications" element={<CitizenNotifications />} />
          {/* AI & Data Layer */}
          <Route path="/data-fusion"   element={<DataFusion />} />
          <Route path="/integrity"     element={<IntegrityEngine />} />
          {/* Policymaker Layer */}
          <Route path="/cockpit"       element={<PolicyCockpit />} />
          <Route path="/lifecycle"     element={<ProjectLifecycle />} />
          <Route path="/impact"        element={<ImpactDashboard />} />
          {/* Governance Layer */}
          <Route path="/federation"    element={<FederationView />} />
          <Route path="/audit"         element={<AuditTrail />} />
        </Route>
        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
