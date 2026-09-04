import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProjectStore } from '../store/projectStore'
import { LIFECYCLE_STATES } from '../data/projects'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'

const STATE_COLORS = {
  Sanctioned:'#6366f1', Tendered:'#f59e0b',
  'In-Progress':'#06b6d4', Completed:'#10b981', Verified:'#a3e635'
}
const STATE_ICONS = {
  Sanctioned:'✅', Tendered:'📋', 'In-Progress':'⚙️', Completed:'🏁', Verified:'🛡️'
}

// Simulated Gantt / timeline data
const GANTT_DATA = [
  { project:'Mylapore Drainage', start:0, duration:110, current:110, budget:12, actual:11.8, state:'Verified' },
  { project:'Vellore PHC',       start:40, duration:130, current:75, budget:8, actual:null, state:'In-Progress' },
  { project:'Ambattur Water',    start:55, duration:180, current:30, budget:6, actual:null, state:'Tendered' },
  { project:'Dharavi Roads Ph1', start:90, duration:230, current:5, budget:22, actual:null, state:'Sanctioned' },
]

// Simulated weekly delivery progress
const DELIVERY_TREND = [
  { week:'W1', completed:0, inProgress:2, sanctioned:3 },
  { week:'W4', completed:0, inProgress:3, sanctioned:4 },
  { week:'W8', completed:1, inProgress:3, sanctioned:4 },
  { week:'W12',completed:1, inProgress:3, sanctioned:5 },
  { week:'W16',completed:1, inProgress:4, sanctioned:5 },
  { week:'W20',completed:1, inProgress:4, sanctioned:6 },
]

export default function ProjectLifecycle() {
  const { projects, advanceProject } = useProjectStore()
  const [selected, setSelected] = useState(null)
  const [view, setView] = useState('kanban') // kanban | gantt | analytics

  const byState = LIFECYCLE_STATES.reduce((acc,s) => {
    acc[s] = projects.filter(p=>p.state===s)
    return acc
  }, {})

  const totalBudget = projects.reduce((s,p)=>s+p.estCost,0)
  const actualSpent = projects.filter(p=>p.actualCost).reduce((s,p)=>s+p.actualCost,0)
  const delayedCount = projects.filter(p=>p.delayDays>0).length

  return (
    <div>
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">📋 Project Lifecycle Tracker</h1>
            <p className="text-muted text-sm mt-1">
              Sanction → Tender → In-Progress → Complete → Verified · Field officer updates · Gantt · Analytics
            </p>
          </div>
          <span className="badge badge-indigo">Module 6 — Civoix Spine Part 1</span>
        </div>
      </div>

      <div className="page-body">
        {/* KPI bar */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:'0.75rem', marginBottom:'1.5rem' }}>
          {LIFECYCLE_STATES.map(s=>(
            <div key={s} className="card-sm" style={{borderLeft:`3px solid ${STATE_COLORS[s]}`,textAlign:'center',padding:'0.75rem'}}>
              <div style={{fontSize:'1.4rem',fontWeight:900,color:STATE_COLORS[s]}}>{byState[s].length}</div>
              <div className="text-xs text-muted">{STATE_ICONS[s]} {s}</div>
            </div>
          ))}
          <div className="card-sm" style={{borderLeft:'3px solid var(--accent-rose)',textAlign:'center',padding:'0.75rem'}}>
            <div style={{fontSize:'1.4rem',fontWeight:900,color:'var(--accent-rose)'}}>{delayedCount}</div>
            <div className="text-xs text-muted">⚠️ Delayed</div>
          </div>
        </div>

        {/* Budget summary */}
        <div className="card-sm flex items-center gap-4 mb-4">
          <div className="text-sm font-semibold">💰 Portfolio Budget</div>
          <div style={{flex:1}}>
            <div className="progress-track">
              <div className="progress-fill" style={{
                width:`${actualSpent/totalBudget*100}%`,
                background:'var(--grad-emerald)'
              }} />
            </div>
          </div>
          <div className="text-sm font-bold">₹{actualSpent}Cr spent / ₹{totalBudget}Cr sanctioned</div>
          <span className="badge badge-emerald">{(actualSpent/totalBudget*100).toFixed(0)}% utilised</span>
        </div>

        {/* View switcher */}
        <div className="flex gap-2 mb-4">
          {[['kanban','🗂️ Kanban'],['gantt','📅 Gantt Timeline'],['analytics','📊 Analytics']].map(([v,l])=>(
            <button key={v} onClick={()=>setView(v)}
              className={`btn btn-sm ${view===v?'btn-primary':'btn-ghost'}`}>{l}</button>
          ))}
        </div>

        {/* KANBAN VIEW */}
        {view==='kanban' && (
          <div className="kanban">
            {LIFECYCLE_STATES.map(state => (
              <div key={state} className="kanban-col">
                <div className="kanban-col-header">
                  <div className="flex items-center gap-2">
                    <span style={{color:STATE_COLORS[state]}}>{STATE_ICONS[state]}</span>
                    <span className="font-semibold text-sm">{state}</span>
                  </div>
                  <span style={{background:`${STATE_COLORS[state]}22`,color:STATE_COLORS[state],
                    borderRadius:99,padding:'0.1rem 0.5rem',fontSize:'0.72rem',fontWeight:700}}>
                    {byState[state].length}
                  </span>
                </div>
                {byState[state].length===0 && (
                  <div className="text-xs text-muted" style={{textAlign:'center',padding:'1rem 0',opacity:0.5}}>Empty</div>
                )}
                {byState[state].map(p => (
                  <motion.div key={p.id} layout className="kanban-card" onClick={()=>setSelected(p===selected?null:p)}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs text-indigo">{p.id}</span>
                      <span className="badge badge-muted" style={{fontSize:'0.62rem'}}>{p.category}</span>
                    </div>
                    <div className="font-semibold" style={{fontSize:'0.82rem',marginBottom:'0.25rem'}}>{p.name}</div>
                    <div className="text-xs text-muted mb-2">{p.ward}</div>

                    {/* Cost bar */}
                    <div className="progress-track mb-2">
                      <div className="progress-fill" style={{
                        width:p.actualCost?`${Math.min(100,p.actualCost/p.estCost*100)}%`:'0%',
                        background:p.actualCost && p.actualCost<=p.estCost?'var(--grad-emerald)':'var(--grad-amber)'
                      }} />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted">₹{p.estCost}Cr</span>
                      <span className="text-xs" style={{color:'var(--accent-cyan)'}}>{p.beneficiaries?.toLocaleString()} pop.</span>
                    </div>

                    {p.delayDays>0 && <div className="badge badge-rose mt-1" style={{fontSize:'0.62rem'}}>⚠️ {p.delayDays}d delayed</div>}

                    {/* Officer tag */}
                    <div className="text-xs text-muted mt-1" style={{borderTop:'1px solid var(--border)',paddingTop:'0.4rem'}}>
                      👤 {p.officer}
                    </div>

                    {state!=='Verified' && (
                      <button className="btn btn-ghost btn-sm w-full mt-2"
                        onClick={e=>{e.stopPropagation();advanceProject(p.id)}}>
                        ➡️ Advance to {LIFECYCLE_STATES[LIFECYCLE_STATES.indexOf(state)+1]}
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* GANTT VIEW */}
        {view==='gantt' && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="card">
            <div className="font-semibold mb-4">📅 Project Delivery Timeline (days from sanction)</div>
            <div className="flex-col gap-3">
              {GANTT_DATA.map((g,i)=>{
                const pct = Math.min(100,(g.current/g.duration)*100)
                return (
                  <div key={g.project}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold">{g.project}</span>
                      <div className="flex items-center gap-2">
                        <span style={{color:STATE_COLORS[g.state],fontSize:'0.75rem',fontWeight:600}}>{STATE_ICONS[g.state]} {g.state}</span>
                        <span className="text-xs text-muted">Day {g.current}/{g.duration}</span>
                      </div>
                    </div>
                    <div style={{position:'relative',height:28,background:'var(--bg-glass-2)',borderRadius:6,overflow:'hidden',marginLeft:`${(g.start/300)*100}%`}}>
                      <div style={{
                        position:'absolute',left:0,top:0,bottom:0,
                        width:`${pct}%`,
                        background:`${STATE_COLORS[g.state]}66`,
                        transition:'width 0.8s ease',
                        display:'flex',alignItems:'center',paddingLeft:'0.5rem'
                      }}>
                        <span className="text-xs font-bold" style={{color:STATE_COLORS[g.state],whiteSpace:'nowrap'}}>
                          {pct.toFixed(0)}%
                        </span>
                      </div>
                      {/* Target marker */}
                      <div style={{
                        position:'absolute',right:0,top:0,bottom:0,
                        width:2,background:'var(--accent-amber)',opacity:0.6
                      }} />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted">₹{g.budget}Cr budgeted · {g.actual?`₹${g.actual}Cr actual`:'In progress'}</span>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="text-xs text-muted mt-4">
              📌 Bar width = progress · Orange marker = target date · <span className="badge badge-synthetic">⚗️ SYNTHETIC</span>
            </div>
          </motion.div>
        )}

        {/* ANALYTICS VIEW */}
        {view==='analytics' && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <div className="grid-2">
              <div className="card">
                <div className="font-semibold mb-3">📈 Portfolio Status Over Time</div>
                <div style={{height:220}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={DELIVERY_TREND}>
                      <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                      <XAxis dataKey="week" tick={{fill:'#94a3b8',fontSize:10}} />
                      <YAxis tick={{fill:'#94a3b8',fontSize:10}} />
                      <Tooltip contentStyle={{background:'#0d1117',border:'1px solid #1e293b',borderRadius:8,fontSize:12}} />
                      <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} dot={{fill:'#10b981'}} name="Completed" />
                      <Line type="monotone" dataKey="inProgress" stroke="#06b6d4" strokeWidth={2} dot={{fill:'#06b6d4'}} name="In-Progress" />
                      <Line type="monotone" dataKey="sanctioned" stroke="#6366f1" strokeWidth={2} dot={{fill:'#6366f1'}} name="Sanctioned" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="card">
                <div className="font-semibold mb-3">💰 Budget vs Actual</div>
                <div style={{height:220}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={projects.map(p=>({ name:p.id, budget:p.estCost, actual:p.actualCost||0 }))}>
                      <XAxis dataKey="name" tick={{fill:'#94a3b8',fontSize:10}} />
                      <YAxis tick={{fill:'#94a3b8',fontSize:10}} unit="Cr" />
                      <Tooltip contentStyle={{background:'#0d1117',border:'1px solid #1e293b',borderRadius:8,fontSize:12}} />
                      <Bar dataKey="budget" fill="#6366f155" name="Budgeted" radius={4} />
                      <Bar dataKey="actual" fill="#10b981" name="Actual Spent" radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Delay risk matrix */}
            <div className="card mt-4">
              <div className="font-semibold mb-3">⚠️ Delay Risk Assessment</div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>State</th>
                    <th>Days Elapsed</th>
                    <th>Expected Duration</th>
                    <th>Risk Level</th>
                    <th>Officer</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(p=>{
                    const elapsed = p.sanctionDate ? Math.floor((Date.now()-new Date(p.sanctionDate))/86400000) : 0
                    const risk = elapsed>180?'High':elapsed>90?'Medium':'Low'
                    const riskColor = risk==='High'?'var(--accent-rose)':risk==='Medium'?'var(--accent-amber)':'var(--accent-emerald)'
                    return (
                      <tr key={p.id}>
                        <td className="font-semibold text-sm">{p.name}</td>
                        <td><span style={{color:STATE_COLORS[p.state],fontWeight:600}}>{STATE_ICONS[p.state]} {p.state}</span></td>
                        <td className="font-mono">{elapsed}d</td>
                        <td className="text-muted">~180d avg</td>
                        <td><span className="badge" style={{background:`${riskColor}18`,color:riskColor,border:`1px solid ${riskColor}33`}}>{risk}</span></td>
                        <td className="text-muted text-xs">{p.officer}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Detail panel */}
        <AnimatePresence>
          {selected && (
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:20}} className="card mt-4">
              <ProjectDetail project={selected} advance={()=>advanceProject(selected.id)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function ProjectDetail({ project, advance }) {
  const [showEvidence, setShowEvidence] = useState(false)
  const canAdvance = project.state!=='Verified'
  const nextState = LIFECYCLE_STATES[LIFECYCLE_STATES.indexOf(project.state)+1]

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-bold text-lg">{project.name}</div>
          <div className="text-sm text-muted">{project.ward}, {project.district}</div>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-ghost btn-sm" onClick={()=>setShowEvidence(!showEvidence)}>
            📷 {showEvidence?'Hide':'Show'} Evidence
          </button>
          {canAdvance && (
            <button className="btn btn-primary" onClick={advance}>➡️ Advance to {nextState}</button>
          )}
          {!canAdvance && <span className="badge badge-emerald" style={{padding:'0.5rem 1rem'}}>🛡️ Fully Verified</span>}
        </div>
      </div>

      <div className="grid-2">
        {/* Timeline */}
        <div>
          <div className="text-xs text-muted font-semibold uppercase mb-3">Delivery Timeline</div>
          <div style={{position:'relative'}}>
            <div style={{position:'absolute',left:16,top:0,bottom:0,width:2,background:'var(--border)'}} />
            {project.timeline.map((t,i)=>(
              <div key={i} style={{display:'flex',gap:'1rem',marginBottom:'1rem',position:'relative'}}>
                <div style={{width:34,height:34,borderRadius:'50%',flexShrink:0,
                  background:`${STATE_COLORS[t.state]}22`,border:`2px solid ${STATE_COLORS[t.state]}`,
                  display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.85rem',zIndex:1}}>
                  {STATE_ICONS[t.state]}
                </div>
                <div style={{paddingTop:'0.3rem'}}>
                  <div className="font-semibold text-sm" style={{color:STATE_COLORS[t.state]}}>{t.state}</div>
                  <div className="text-xs text-muted">{t.date}</div>
                  <div className="text-xs text-muted" style={{marginTop:'0.15rem'}}>{t.note}</div>
                </div>
              </div>
            ))}
            {/* Remaining states */}
            {LIFECYCLE_STATES.slice(LIFECYCLE_STATES.indexOf(project.state)+1).map(s=>(
              <div key={s} style={{display:'flex',gap:'1rem',marginBottom:'1rem',opacity:0.3}}>
                <div style={{width:34,height:34,borderRadius:'50%',flexShrink:0,
                  background:'var(--bg-glass-2)',border:'2px dashed var(--border)',
                  display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.85rem',zIndex:1}}>
                  {STATE_ICONS[s]}
                </div>
                <div style={{paddingTop:'0.3rem'}}>
                  <div className="font-semibold text-sm">{s}</div>
                  <div className="text-xs text-muted">Pending</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats + evidence */}
        <div>
          <div className="text-xs text-muted font-semibold uppercase mb-3">Project Details</div>
          <div className="flex-col gap-2 mb-3">
            {[
              ['Status',        <span style={{color:STATE_COLORS[project.state],fontWeight:700}}>{STATE_ICONS[project.state]} {project.state}</span>],
              ['Category',      project.category],
              ['Est. Cost',     `₹${project.estCost}Cr`],
              ['Actual Cost',   project.actualCost?`₹${project.actualCost}Cr`:<span className="badge badge-muted">Pending</span>],
              ['Beneficiaries', project.beneficiaries?.toLocaleString()],
              ['Sanction Date', project.sanctionDate],
              ['Target Date',   project.targetDate],
              ['Completion',    project.completionDate||<span className="badge badge-muted">Pending</span>],
              ['Field Officer', project.officer],
              ['Impact Score',  project.impactScore?(
                <span style={{color:'var(--accent-emerald)',fontWeight:700}}>{(project.impactScore*100).toFixed(0)}%</span>
              ):<span className="badge badge-muted">Pending completion</span>],
            ].map(([label,value])=>(
              <div key={label} className="flex items-center gap-2" style={{padding:'0.3rem 0',borderBottom:'1px solid var(--border)'}}>
                <span className="text-xs text-muted" style={{width:110,flexShrink:0}}>{label}</span>
                <span className="text-sm">{value}</span>
              </div>
            ))}
          </div>

          {/* Evidence panel */}
          <AnimatePresence>
            {showEvidence && (
              <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}}
                style={{overflow:'hidden'}}>
                <div style={{padding:'0.75rem',background:'var(--bg-glass-2)',borderRadius:8,border:'1px solid var(--border)'}}>
                  <div className="text-xs text-muted font-semibold mb-2">📷 Geo-tagged Evidence</div>
                  {project.evidence?.length > 0 ? (
                    <div className="flex gap-2">
                      {project.evidence.map(e=>(
                        <div key={e} style={{
                          width:80,height:60,borderRadius:6,
                          background:'linear-gradient(135deg,#1e293b,#0f172a)',
                          border:'1px solid var(--border)',
                          display:'flex',alignItems:'center',justifyContent:'center',
                          fontSize:'1.5rem',cursor:'pointer'
                        }} title={e}>📸</div>
                      ))}
                      <div style={{
                        width:80,height:60,borderRadius:6,
                        background:'var(--bg-glass-2)',border:'1px dashed var(--border)',
                        display:'flex',alignItems:'center',justifyContent:'center',
                        fontSize:'1.2rem',cursor:'pointer',color:'var(--text-muted)'
                      }}>+</div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-xs text-muted mb-2">No evidence uploaded yet</div>
                      <button className="btn btn-ghost btn-sm">📷 Upload Evidence</button>
                    </div>
                  )}
                  <div className="text-xs text-muted mt-2">Requires evidence before state advances to Verified</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
