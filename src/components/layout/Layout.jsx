import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import StatsBar from './StatsBar'

export default function Layout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <StatsBar />
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
