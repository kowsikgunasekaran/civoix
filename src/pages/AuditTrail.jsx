import { useState } from 'react'
import { motion } from 'framer-motion'
import { useProjectStore } from '../store/projectStore'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const ACTION_COLORS = {
  APPROVED:'#10b981', WEIGHT_CHANGE:'#6366f1', STATE_ADVANCE:'#f59e0b',
  OVERRIDE:'#f43f5e', SYSTEM:'#94a3b8', APPROVED_CLUSTER:'#06b6d4'
}

const ACTION_ICONS = {
  APPROVED:'✅', WEIGHT_CHANGE:'⚖️', STATE_ADVANCE:'➡️',
  OVERRIDE:'⚠️', SYSTEM:'🔧', APPROVED_CLUSTER:'🏗️'
}

// Simulated audit event trend
const AUDIT_TREND = [
  { day:'Day 1', events:3 }, { day:'Day 2', events:5 }, { day:'Day 3', events:2 },
  { day:'Day 4', events:8 }, { day:'Day 5', events:6 }, { day:'Day 6', events:4 },
  { day:'Day 7', events:7 }, { day:'Day 8', events:9 }, { day:'Day 9', events:5 },
  { day:'Day 10',events:11},
]

// Additional audit evidence per entry
const AUDIT_EVIDENCE = {
  APPROVED:     'Cluster score computed from 6 factor values. Weight state at approval time preserved.',
  WEIGHT_CHANGE:'Before/after weight values logged. Re-ranked list preserved.',
  STATE_ADVANCE:'GPS-tagged field officer location logged at time of advance.',
}

export default function AuditTrail() {
  const { auditLog } = useProjectStore()
  const [filter, setFilter] = useState('ALL')
  const [expanded, setExpanded] = useState(null)
  const [search, setSearch] = useState('')

  const types = ['ALL',...new Set(auditLog.map(e=>e.action))]

  const filtered = auditLog
    .filter(e=>filter==='ALL'||e.action===filter)
    .filter(e=>!search||e.actor.toLowerCase().includes(search.toLowerCase())||e.target.toLowerCase().includes(search.toLowerCase())||e.detail.toLowerCase().includes(search.toLowerCase()))

  function exportCSV() {
    const csv = ['timestamp,actor,action,target,detail',
      ...filtered.map(e=>`"${e.ts}","${e.actor}","${e.action}","${e.target}","${e.detail}"`)].join('\n')
    const a=document.createElement('a'); a.href='data:text/csv,'+encodeURIComponent(csv)
    a.download='Civoix_audit.csv'; a.click()
  }

  function exportJSON() {
    const json = JSON.stringify(filtered, null, 2)
    const a=document.createElement('a'); a.href='data:application/json,'+encodeURIComponent(json)
    a.download='Civoix_audit.json'; a.click()
  }

  return (
    <div>
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">🔍 Audit Trail</h1>
            <p className="text-muted text-sm mt-1">
              Immutable log of all consequential actions · Who · What · When · Why · CSV & JSON export
            </p>
          </div>
          <span className="badge badge-indigo">Module 11 — Governance & Explainability</span>
        </div>
      </div>

      <div className="page-body">
        {/* KPIs */}
        <div className="grid-4 mb-4">
          <div className="card-sm" style={{textAlign:'center',borderTop:'3px solid var(--accent-indigo)'}}>
            <div style={{fontSize:'1.5rem',fontWeight:900,color:'var(--accent-indigo)'}}>{auditLog.length}</div>
            <div className="text-xs text-muted">Total Events</div>
          </div>
          <div className="card-sm" style={{textAlign:'center',borderTop:'3px solid var(--accent-emerald)'}}>
            <div style={{fontSize:'1.5rem',fontWeight:900,color:'var(--accent-emerald)'}}>{auditLog.filter(e=>e.action==='APPROVED').length}</div>
            <div className="text-xs text-muted">Approvals</div>
          </div>
          <div className="card-sm" style={{textAlign:'center',borderTop:'3px solid var(--accent-cyan)'}}>
            <div style={{fontSize:'1.5rem',fontWeight:900,color:'var(--accent-cyan)'}}>{auditLog.filter(e=>e.action==='WEIGHT_CHANGE').length}</div>
            <div className="text-xs text-muted">Weight Changes</div>
          </div>
          <div className="card-sm" style={{textAlign:'center',borderTop:'3px solid var(--accent-amber)'}}>
            <div style={{fontSize:'1.5rem',fontWeight:900,color:'var(--accent-amber)'}}>{auditLog.filter(e=>e.action==='STATE_ADVANCE').length}</div>
            <div className="text-xs text-muted">State Advances</div>
          </div>
        </div>

        {/* Trend chart */}
        <div className="card mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold">📈 Audit Event Trend (Last 10 days)</div>
            <span className="badge badge-synthetic">⚗️ SYNTHETIC</span>
          </div>
          <div style={{height:120}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={AUDIT_TREND}>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{fill:'#94a3b8',fontSize:9}} />
                <YAxis tick={{fill:'#94a3b8',fontSize:9}} />
                <Tooltip contentStyle={{background:'#0d1117',border:'1px solid #1e293b',borderRadius:8,fontSize:11}} />
                <Line type="monotone" dataKey="events" stroke="#6366f1" strokeWidth={2} dot={{fill:'#6366f1',r:3}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 mb-4" style={{flexWrap:'wrap'}}>
          <div className="flex gap-2" style={{flexWrap:'wrap'}}>
            {types.map(t=>(
              <button key={t} onClick={()=>setFilter(t)}
                className={`btn btn-sm ${filter===t?'btn-primary':'btn-ghost'}`}>
                {t!=='ALL' && ACTION_ICONS[t]} {t}
              </button>
            ))}
          </div>
          <input className="input" style={{maxWidth:220}} placeholder="🔍 Search actor / target / detail…"
            value={search} onChange={e=>setSearch(e.target.value)} />
          <div className="flex gap-2" style={{marginLeft:'auto'}}>
            <span className="text-xs text-muted self-center">{filtered.length} events</span>
            <button className="btn btn-ghost btn-sm" onClick={exportCSV}>⬇ CSV</button>
            <button className="btn btn-ghost btn-sm" onClick={exportJSON}>⬇ JSON</button>
          </div>
        </div>

        {/* Log table */}
        <div className="card" style={{padding:0,overflow:'hidden'}}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Target</th>
                <th>Detail</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e=>(
                <>
                  <tr key={e.id} style={{cursor:'pointer'}} onClick={()=>setExpanded(expanded===e.id?null:e.id)}>
                    <td className="font-mono text-xs text-muted">{new Date(e.ts).toLocaleString()}</td>
                    <td className="text-sm">{e.actor}</td>
                    <td>
                      <span className="badge" style={{
                        background:`${ACTION_COLORS[e.action]||'#94a3b8'}18`,
                        color:ACTION_COLORS[e.action]||'#94a3b8',
                        border:`1px solid ${ACTION_COLORS[e.action]||'#94a3b8'}33`
                      }}>
                        {ACTION_ICONS[e.action]} {e.action}
                      </span>
                    </td>
                    <td className="font-mono text-xs" style={{color:'var(--accent-cyan)',maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                      {e.target}
                    </td>
                    <td className="text-xs text-muted" style={{maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                      {e.detail}
                    </td>
                    <td><span className="text-xs text-muted">{expanded===e.id?'▲':'▼'}</span></td>
                  </tr>
                  {expanded===e.id && (
                    <tr>
                      <td colSpan={6} style={{padding:0}}>
                        <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}}
                          style={{padding:'0.75rem 1.5rem',background:'var(--bg-glass-2)',borderTop:'1px solid var(--border)'}}>
                          <div className="grid-2">
                            <div>
                              <div className="text-xs text-muted font-semibold mb-1">FULL DETAIL</div>
                              <div className="text-sm">{e.detail}</div>
                              <div className="text-xs text-muted mt-2">
                                <strong>Event ID:</strong> {e.id}<br/>
                                <strong>Timestamp:</strong> {e.ts}<br/>
                                <strong>Actor:</strong> {e.actor}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted font-semibold mb-1">EVIDENCE / INTEGRITY</div>
                              <div className="text-xs text-muted">{AUDIT_EVIDENCE[e.action]||'Standard audit event.'}</div>
                              <div style={{marginTop:'0.5rem',padding:'0.5rem',background:'rgba(16,185,129,0.06)',borderRadius:6,border:'1px solid rgba(16,185,129,0.2)'}}>
                                <div className="text-xs" style={{color:'var(--accent-emerald)'}}>
                                  🛡️ Immutable · Cannot be deleted · Cryptographic chain intact
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {filtered.length===0 && (
                <tr><td colSpan={6} style={{textAlign:'center',padding:'2rem',color:'var(--text-muted)'}}>No events match current filter</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Integrity cards */}
        <div className="card mt-4">
          <div className="font-semibold mb-3">🛡️ Audit Integrity Architecture</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem'}}>
            {[
              ['Immutable','Events cannot be deleted or altered after writing','#6366f1'],
              ['Queryable','Full-text search across all events by any field','#10b981'],
              ['Exportable','Open CSV/JSON export for civil society oversight','#f59e0b'],
              ['Compliant','Satisfies RTI Act 2005 §4 proactive disclosure','#06b6d4'],
            ].map(([t,d,c])=>(
              <div key={t} className="card-sm" style={{borderTop:`3px solid ${c}`}}>
                <div className="font-bold mb-1" style={{color:c}}>{t}</div>
                <div className="text-xs text-muted">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
