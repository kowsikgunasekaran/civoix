import { PORTFOLIO_STATS } from '../../data/budget'
import { useRequestStore } from '../../store/requestStore'

export default function StatsBar() {
  const requests = useRequestStore(s => s.requests)
  return (
    <div className="stats-bar">
      <StatChip color="#6366f1" label="Total Requests" value={requests.length + 12837} />
      <StatChip color="#10b981" label="Active Clusters" value={PORTFOLIO_STATS.activeClusters} />
      <StatChip color="#f59e0b" label="Projects In-Flight" value={PORTFOLIO_STATS.projectsInFlight} />
      <StatChip color="#06b6d4" label="Completed" value={PORTFOLIO_STATS.projectsCompleted} />
      <StatChip color="#8b5cf6" label="Avg Impact Score" value={(PORTFOLIO_STATS.avgImpactScore*100).toFixed(0)+'%'} />
      <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'0.5rem'}}>
        <span className="badge badge-synthetic">⚗️ SYNTHETIC DATA — DEMO</span>
      </div>
    </div>
  )
}

function StatChip({ color, label, value }) {
  return (
    <div className="stat-chip">
      <div style={{width:8,height:8,borderRadius:'50%',background:color,flexShrink:0}} />
      <span style={{color:'var(--text-muted)'}}>{label}:</span>
      <span style={{fontWeight:700,color:'var(--text-primary)'}}>{value.toLocaleString()}</span>
    </div>
  )
}
