import { NavLink } from 'react-router-dom'

const NAV = [
  { section:'CITIZEN LAYER', items:[
    { to:'/citizen',       icon:'🗣️', label:'Citizen Portal',       sub:'Submit · Track · Voice' },
    { to:'/notifications', icon:'🔔', label:'Trust Loop',            sub:'Notifications · Confirmations' },
  ]},
  { section:'AI & DATA LAYER', items:[
    { to:'/data-fusion',   icon:'🔗', label:'Data Fusion',           sub:'Demographic · InfraGap · Budget' },
    { to:'/integrity',     icon:'🛡️', label:'Integrity Engine',      sub:'Anti-Astroturfing · Anomaly' },
  ]},
  { section:'POLICYMAKER LAYER', items:[
    { to:'/cockpit',       icon:'🧭', label:'Decision Cockpit',      sub:'Hotspots · Rank · Approve' },
    { to:'/lifecycle',     icon:'📋', label:'Project Lifecycle',     sub:'Sanction → Verify' },
    { to:'/impact',        icon:'📊', label:'Impact Dashboard',      sub:'Before/After · Sentiment' },
  ]},
  { section:'GOVERNANCE LAYER', items:[
    { to:'/federation',    icon:'🌐', label:'Federation View',       sub:'BRICS · 0 records shared' },
    { to:'/audit',         icon:'🔍', label:'Audit Trail',           sub:'Immutable log · Export' },
  ]},
]

export default function Sidebar() {
  return (
    <nav className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-mark">
          <span style={{background:'linear-gradient(135deg,#6366f1,#10b981)',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent'}}>
            Civ
          </span>
          <span style={{color:'#f0f4ff'}}>oix</span>
        </div>
        <div className="logo-sub">Citizen Demand → Proven Impact</div>
        <div style={{marginTop:'0.5rem',display:'flex',gap:'0.4rem',flexWrap:'wrap'}}>
          <span className="badge badge-synthetic" style={{fontSize:'0.6rem'}}>⚗️ DEMO MODE</span>
          <span className="badge badge-emerald" style={{fontSize:'0.6rem'}}>🌱 DPG</span>
        </div>
      </div>

      {/* Nav */}
      {NAV.map(section => (
        <div key={section.section} className="nav-section">
          <div className="nav-section-label">{section.section}</div>
          {section.items.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <span style={{fontSize:'1rem',flexShrink:0}}>{item.icon}</span>
              <div style={{minWidth:0}}>
                <div style={{fontSize:'0.82rem',fontWeight:600,lineHeight:1.3}}>{item.label}</div>
                <div style={{fontSize:'0.68rem',color:'var(--text-muted)',lineHeight:1.2,marginTop:'0.1rem'}}>{item.sub}</div>
              </div>
            </NavLink>
          ))}
        </div>
      ))}

      {/* Footer */}
      <div style={{marginTop:'auto',padding:'1rem 1.25rem',borderTop:'1px solid var(--border)'}}>
        <div style={{fontSize:'0.68rem',color:'var(--text-muted)',lineHeight:1.8}}>
          <div style={{marginBottom:'0.25rem',fontWeight:700,color:'var(--text-secondary)',fontSize:'0.72rem'}}>
            Google Stack
          </div>
          <div>🤖 Gemini Flash / Pro</div>
          <div>🗄️ BigQuery · Vertex AI</div>
          <div>☁️ Cloud Run · Pub/Sub</div>
          <div>🗺️ Maps Platform · Firebase</div>
          <div style={{marginTop:'0.5rem',color:'var(--accent-emerald)',fontSize:'0.65rem'}}>
            Apache 2.0 · DPG Alliance
          </div>
          <div style={{marginTop:'0.25rem',color:'var(--text-muted)',fontSize:'0.65rem'}}>
            SDG 9 · SDG 11 · SDG 16
          </div>
        </div>
      </div>
    </nav>
  )
}
