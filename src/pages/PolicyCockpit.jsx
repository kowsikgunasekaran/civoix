import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet'
import { useBudgetStore } from '../store/budgetStore'
import { useProjectStore } from '../store/projectStore'
import { HOTSPOT_COLORS } from '../data/clusters'
import { REQUESTS } from '../data/requests'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, ErrorBar, LineChart, Line, CartesianGrid } from 'recharts'

export default function PolicyCockpit() {
  const { weights, budgetCap, rankedClusters, setWeight, setBudgetCap, resetWeights } = useBudgetStore()
  const { approveCluster, addAuditEntry } = useProjectStore()
  const [selected, setSelected] = useState(null)
  const [approved, setApproved] = useState(new Set())
  const [simBudget, setSimBudget] = useState(100)
  const [showSim, setShowSim] = useState(false)
  const [showSector, setShowSector] = useState(false)
  const [profiles, setProfiles] = useState([{ name: 'Default', weights: {...weights} }])

  const feasible = rankedClusters.filter(c => c.estCost <= simBudget)
  const totalCost = feasible.reduce((s,c) => s + c.estCost, 0)

  function handleApprove(cluster) {
    approveCluster(cluster)
    setApproved(s => new Set([...s, cluster.id]))
    addAuditEntry({ actor:'Policymaker (Demo)', action:'APPROVED', target:`${cluster.id} — ${cluster.name||cluster.category+' '+cluster.ward}`, detail:`Score ${cluster.score.toFixed(3)}` })
  }
  
  function saveProfile() {
    const name = prompt('Enter profile name:')
    if (name) {
      setProfiles([...profiles, { name, weights: {...weights} }])
      addAuditEntry({ actor:'Policymaker', action:'PROFILE_SAVED', target:name, detail:'Saved weight profile' })
    }
  }

  function loadProfile(e) {
    const p = profiles.find(x => x.name === e.target.value)
    if (p) {
      Object.keys(p.weights).forEach(k => setWeight(k, p.weights[k].value))
      addAuditEntry({ actor:'Policymaker', action:'PROFILE_LOADED', target:p.name, detail:'Loaded weight profile' })
    }
  }

  const sectorData = rankedClusters.reduce((acc, c) => {
    const existing = acc.find(x => x.category === c.category)
    if (existing) existing.requestCount += c.requestCount
    else acc.push({ category: c.category, requestCount: c.requestCount, fill: HOTSPOT_COLORS[c.category] })
    return acc
  }, [])

  return (
    <div>
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">🧭 Policymaker Decision Cockpit</h1>
            <p className="text-muted text-sm mt-1">Demand hotspots · Explainable rankings · Budget simulation · One-click approval</p>
          </div>
          <div className="flex gap-2 items-center">
            <span className="badge badge-synthetic">⚗️ SYNTHETIC DATA</span>
            <span className="badge badge-indigo">Modules 3 · 5 · 8</span>
          </div>
        </div>
      </div>

      <div className="page-body">
        {/* Budget bar */}
        <BudgetBar budgetCap={simBudget} clusters={rankedClusters} approved={approved} />

        <div style={{ display:'grid', gridTemplateColumns:'1fr 420px', gap:'1.5rem', marginTop:'1.5rem' }}>
          {/* Map */}
          <div>
            <div className="map-wrapper" style={{height:480}}>
              <MapContainer center={[18,78]} zoom={5} style={{height:'100%',width:'100%'}} zoomControl={true}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                  className="dark-tiles" />
                {rankedClusters.map(c => (
                  <Circle key={c.id}
                    center={[c.centroid.lat, c.centroid.lng]}
                    radius={c.demandIntensity * 30000}
                    pathOptions={{
                      color: HOTSPOT_COLORS[c.category] || '#6366f1',
                      fillColor: HOTSPOT_COLORS[c.category] || '#6366f1',
                      fillOpacity: 0.25 + c.demandIntensity * 0.3,
                      weight: selected?.id === c.id ? 3 : 1,
                    }}
                    eventHandlers={{ click:()=>setSelected(c) }}>
                    <Popup>
                      <div style={{fontFamily:'Inter,sans-serif',minWidth:200}}>
                        <strong style={{color: HOTSPOT_COLORS[c.category]}}>{c.category}</strong>
                        <div>{c.ward}, {c.district}</div>
                        <div>🔥 {c.requestCount} requests · Score: {c.score.toFixed(2)}</div>
                      </div>
                    </Popup>
                  </Circle>
                ))}
              </MapContainer>
            </div>
            <div className="flex gap-2 mt-2" style={{flexWrap:'wrap'}}>
              {Object.entries(HOTSPOT_COLORS).slice(0,6).map(([cat,col])=>(
                <div key={cat} className="flex items-center gap-1">
                  <div style={{width:10,height:10,borderRadius:'50%',background:col}} />
                  <span className="text-xs text-muted">{cat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Priority list */}
          <div className="flex-col gap-3" style={{maxHeight:480,overflowY:'auto',paddingRight:4}}>
            <button className="btn btn-sm btn-ghost mb-1" onClick={()=>setShowSector(!showSector)}>
              {showSector ? 'Hide' : 'Show'} Sector Breakdown
            </button>
            <AnimatePresence>
              {showSector && (
                <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="card-sm mb-2" style={{background:'var(--bg-glass-2)',overflow:'hidden'}}>
                  <div className="text-xs font-semibold mb-2">Sector Breakdown</div>
                  <div style={{height:120}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sectorData}>
                        <XAxis dataKey="category" tick={{fill:'#94a3b8',fontSize:9}} interval={0} />
                        <YAxis tick={{fill:'#94a3b8',fontSize:9}} />
                        <Tooltip contentStyle={{background:'#0d1117',border:'1px solid #1e293b',borderRadius:8,fontSize:10}} />
                        <Bar dataKey="requestCount" radius={2}>
                          {sectorData.map((d,i)=>(
                            <Cell key={i} fill={d.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {rankedClusters.map((c,i) => (
              <PriorityCard key={c.id} cluster={c} rank={i+1}
                isSelected={selected?.id===c.id}
                isApproved={approved.has(c.id)}
                budgetCap={simBudget}
                onClick={()=>setSelected(c===selected?null:c)}
                onApprove={()=>handleApprove(c)} />
            ))}
          </div>
        </div>

        {/* Weight sliders */}
        <div className="card mt-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-semibold">⚖️ Policy Weight Configuration</div>
              <div className="text-xs text-muted mt-1">Adjust dials to re-rank recommendations in real time. All changes are audited.</div>
            </div>
            <div className="flex gap-2 items-center">
              <select className="input" style={{padding:'0.25rem 0.5rem',fontSize:'0.8rem'}} onChange={loadProfile} defaultValue="">
                <option value="" disabled>Load Profile...</option>
                {profiles.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
              </select>
              <button className="btn btn-ghost btn-sm" onClick={saveProfile}>💾 Save Profile</button>
              <button className="btn btn-ghost btn-sm" onClick={resetWeights}>Reset Defaults</button>
              <button className="btn btn-primary btn-sm" onClick={()=>setShowSim(!showSim)}>
                {showSim ? 'Hide' : '🔮'} Budget Simulation
              </button>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem' }}>
            {Object.entries(weights).map(([key,w]) => (
              <WeightSlider key={key} wkey={key} weight={w} setWeight={setWeight} addAuditEntry={addAuditEntry} />
            ))}
          </div>
          <div style={{marginTop:'1rem',padding:'0.75rem',background:'var(--bg-glass-2)',borderRadius:8,fontSize:'0.78rem',color:'var(--text-muted)'}}>
            💡 <strong style={{color:'var(--text-secondary)'}}>Equity Weight</strong> ensures low-population high-need areas aren't outranked by loud wealthy wards. Try setting it to 0 to see the re-rank.
          </div>
        </div>

        {/* Simulation panel */}
        <AnimatePresence>
          {showSim && (
            <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} className="card mt-4" style={{overflow:'hidden'}}>
              <div className="font-semibold mb-3">🔮 NeetiSim — Budget Simulation with Confidence Bands</div>
              <div className="grid-2">
                <div>
                  <div className="text-xs text-muted mb-2">Budget Cap (₹ Cr)</div>
                  <div className="flex items-center gap-3">
                    <input type="range" min={20} max={200} step={5} value={simBudget}
                      onChange={e=>{ setSimBudget(+e.target.value); setBudgetCap(+e.target.value) }}
                      style={{flex:1}} />
                    <span className="font-bold text-amber" style={{minWidth:60}}>₹{simBudget}Cr</span>
                  </div>
                  <div className="text-xs text-muted mt-3">
                    At ₹{simBudget}Cr: <strong style={{color:'var(--accent-emerald)'}}>{feasible.length} projects feasible</strong>
                    &nbsp;·&nbsp;total cost ₹{totalCost}Cr&nbsp;·&nbsp;est. {feasible.reduce((s,c)=>s+c.affectedPop,0).toLocaleString()} beneficiaries
                  </div>
                </div>
                <div style={{height:180}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={rankedClusters.slice(0,5).map(c=>({ name:c.category, cost:c.estCost, score:+(c.score*100).toFixed(0), err:[c.estCost*0.9, c.estCost*1.1] }))}>
                      <XAxis dataKey="name" tick={{fill:'#94a3b8',fontSize:10}} />
                      <YAxis tick={{fill:'#94a3b8',fontSize:10}} />
                      <Tooltip contentStyle={{background:'#0d1117',border:'1px solid #1e293b',borderRadius:8}} />
                      <Bar dataKey="cost" fill="#6366f1" name="Est Cost (Cr)" radius={4}>
                        <ErrorBar dataKey="err" width={4} strokeWidth={2} stroke="#f43f5e" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected cluster detail */}
        <AnimatePresence>
          {selected && (
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:20}} className="card mt-4">
              <ClusterDetail cluster={selected} approved={approved.has(selected.id)} onApprove={()=>handleApprove(selected)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function BudgetBar({ budgetCap, clusters, approved }) {
  const approvedCost = clusters.filter(c=>approved.has(c.id)).reduce((s,c)=>s+c.estCost,0)
  const pct = Math.min(100,(approvedCost/budgetCap)*100)
  return (
    <div className="card-sm flex items-center gap-4">
      <div className="text-sm font-semibold">💰 Budget</div>
      <div style={{flex:1}}>
        <div className="progress-track">
          <div className="progress-fill" style={{width:`${pct}%`,background:pct>80?'var(--grad-amber)':'var(--grad-emerald)'}} />
        </div>
      </div>
      <div className="text-sm font-bold">₹{approvedCost}Cr / ₹{budgetCap}Cr</div>
      <span className={`badge ${pct > 80 ? 'badge-amber' : 'badge-emerald'}`}>{pct.toFixed(0)}% utilised</span>
    </div>
  )
}

function PriorityCard({ cluster, rank, isSelected, isApproved, budgetCap, onClick, onApprove }) {
  const feasible = cluster.estCost <= budgetCap
  return (
    <motion.div layout className={`card-sm hover-glow cursor-pointer ${isSelected?'':''}` }
      style={{ borderColor: isSelected ? HOTSPOT_COLORS[cluster.category]+'88' : '', cursor:'pointer' }}
      onClick={onClick}>
      <div className="flex items-center gap-2 mb-2">
        <div style={{ width:28, height:28, borderRadius:'50%', background:`${HOTSPOT_COLORS[cluster.category]}22`,
          border:`2px solid ${HOTSPOT_COLORS[cluster.category]}66`,
          display:'flex',alignItems:'center',justifyContent:'center',
          fontWeight:900,fontSize:'0.78rem',color:HOTSPOT_COLORS[cluster.category],flexShrink:0 }}>
          {rank}
        </div>
        <div style={{flex:1}}>
          <div className="font-semibold text-sm">{cluster.category} — {cluster.ward}</div>
          <div className="text-xs text-muted">{cluster.district} · {cluster.requestCount} requests</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div className="font-bold" style={{color: cluster.score>0.8?'var(--accent-emerald)':cluster.score>0.6?'var(--accent-amber)':'var(--accent-rose)',fontSize:'1.1rem'}}>
            {cluster.score.toFixed(2)}
          </div>
          <div className="text-xs text-muted">score</div>
        </div>
      </div>

      {/* Factor mini-bars */}
      <div className="factor-bar" style={{marginBottom:'0.5rem'}}>
        {[
          ['Demand',  cluster.factors.demandIntensity,   '#6366f1'],
          ['InfraGap',cluster.factors.infraGapIndex,     '#10b981'],
          ['Equity',  cluster.factors.equityWeight,      '#f59e0b'],
          ['Budget',  cluster.factors.budgetFeasibility, '#06b6d4'],
        ].map(([l,v,c]) => (
          <div key={l} className="factor-row">
            <span className="factor-label">{l}</span>
            <div className="factor-track"><div className="factor-fill" style={{width:`${v*100}%`,background:c}} /></div>
            <span className="factor-val">{(v*100).toFixed(0)}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <span className={`badge ${feasible?'badge-emerald':'badge-rose'}`} style={{fontSize:'0.68rem'}}>
          {feasible?'✅ Feasible':'⚠️ Over budget'}
        </span>
        <span className="text-xs text-muted">₹{cluster.estCost}Cr est.</span>
        <span className="text-xs text-muted" style={{marginLeft:'auto'}}>{cluster.affectedPop.toLocaleString()} beneficiaries</span>
        {!isApproved && feasible && (
          <button className="btn btn-emerald btn-sm" onClick={e=>{e.stopPropagation();onApprove()}}>
            ✅ Approve
          </button>
        )}
        {isApproved && <span className="badge badge-emerald">Approved ✓</span>}
      </div>
    </motion.div>
  )
}

function WeightSlider({ wkey, weight, setWeight, addAuditEntry }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold" style={{color:weight.color}}>{weight.label}</span>
        <span className="font-mono text-sm font-bold">{weight.value.toFixed(1)}</span>
      </div>
      <input type="range" min={0} max={1} step={0.1} value={weight.value}
        onChange={e => {
          const old = weight.value
          setWeight(wkey, +e.target.value)
          addAuditEntry({ actor:'Policymaker (Demo)', action:'WEIGHT_CHANGE', target:`${weight.label} ${old}→${e.target.value}`, detail:'Adjusted via cockpit slider' })
        }}
        style={{width:'100%'}} />
      <div className="text-xs text-muted mt-1">{weight.desc}</div>
    </div>
  )
}

function ClusterDetail({ cluster, approved, onApprove }) {
  const [activeTab, setActiveTab] = useState('rationale')
  
  const radarData = [
    { factor:'Demand',   value: cluster.factors.demandIntensity*100 },
    { factor:'InfraGap', value: cluster.factors.infraGapIndex*100 },
    { factor:'Equity',   value: cluster.factors.equityWeight*100 },
    { factor:'Budget',   value: cluster.factors.budgetFeasibility*100 },
    { factor:'Impact',   value: cluster.factors.impactPotential*100 },
  ]

  // Synthetic demand timeline for the selected cluster
  const demandTimeline = Array.from({length:8}, (_,i) => ({
    week: `W${i+1}`,
    requests: Math.floor(cluster.requestCount/8) + Math.floor(Math.random()*20 - 10)
  }))

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold" style={{fontSize:'1.1rem'}}>
          {cluster.category} · {cluster.ward}, {cluster.district}
        </div>
        {!approved && (
          <button className="btn btn-emerald" onClick={onApprove}>✅ Approve Project</button>
        )}
        {approved && <span className="badge badge-emerald" style={{padding:'0.5rem 1rem'}}>✓ Approved</span>}
      </div>
      
      <div className="flex gap-2 mb-3 border-b border-bright pb-2">
        <button className={`btn btn-sm ${activeTab==='rationale'?'btn-primary':'btn-ghost'}`} onClick={()=>setActiveTab('rationale')}>AI Rationale</button>
        <button className={`btn btn-sm ${activeTab==='requests'?'btn-primary':'btn-ghost'}`} onClick={()=>setActiveTab('requests')}>Constituent Requests</button>
        <button className={`btn btn-sm ${activeTab==='timeline'?'btn-primary':'btn-ghost'}`} onClick={()=>setActiveTab('timeline')}>Demand Timeline</button>
      </div>

      {activeTab === 'rationale' && (
        <div className="grid-2">
          <div>
            <div className="text-xs text-muted font-semibold mb-2 uppercase tracking-wide">AI Rationale</div>
            <div style={{background:'var(--bg-glass-2)',border:'1px solid var(--border)',borderRadius:8,padding:'0.75rem',fontSize:'0.85rem',lineHeight:1.7,color:'var(--text-secondary)'}}>
              {cluster.rationale}
            </div>
            <div className="text-xs text-muted mt-2">💡 Generated by Gemini from structured factor values — numbers govern, AI narrates</div>
          </div>
          <div style={{height:220}}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="factor" tick={{fill:'#94a3b8',fontSize:11}} />
                <Radar name="Score" dataKey="value" stroke={HOTSPOT_COLORS[cluster.category]||'#6366f1'}
                  fill={HOTSPOT_COLORS[cluster.category]||'#6366f1'} fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="flex-col gap-2" style={{maxHeight:250, overflowY:'auto'}}>
          {REQUESTS.filter(r => r.category === cluster.category).slice(0, 15).map((r,i) => (
            <div key={i} className="card-sm" style={{background:'var(--bg-glass-2)'}}>
              <div className="flex items-center justify-between mb-1">
                <span className="badge badge-indigo text-xs">{r.langName}</span>
                <span className="text-xs text-muted">{new Date(r.timestamp).toLocaleDateString()}</span>
              </div>
              <div className="text-sm">{r.translated || r.original}</div>
              {r.original !== r.translated && (
                <div className="text-xs text-muted mt-1 italic">{r.original.slice(0,60)}…</div>
              )}
              <div className="text-xs text-muted mt-1">📍 {r.ward} · {r.geo?.lat?.toFixed(4)}, {r.geo?.lng?.toFixed(4)}</div>
            </div>
          ))}
          {REQUESTS.filter(r => r.category === cluster.category).length === 0 && (
            <div className="text-sm text-muted">No constituent requests in seed data for this category.</div>
          )}
        </div>
      )}

      {activeTab === 'timeline' && (
        <div style={{height:250}}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={demandTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="week" tick={{fill:'#94a3b8',fontSize:11}} />
              <YAxis tick={{fill:'#94a3b8',fontSize:11}} />
              <Tooltip contentStyle={{background:'#0d1117',border:'1px solid #1e293b',borderRadius:8}} />
              <Line type="monotone" dataKey="requests" stroke={HOTSPOT_COLORS[cluster.category]||'#6366f1'} strokeWidth={3} dot={{r:4}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'0.75rem',marginTop:'1rem'}}>
        {[
          {label:'Requests',  value:cluster.requestCount, color:'#6366f1'},
          {label:'Est. Cost', value:`₹${cluster.estCost}Cr`, color:'#f59e0b'},
          {label:'Headroom',  value:`₹${cluster.headroom}Cr`, color:'#10b981'},
          {label:'Pop. Impact',value:cluster.affectedPop.toLocaleString(), color:'#06b6d4'},
        ].map(s=>(
          <div key={s.label} style={{background:'var(--bg-glass-2)',border:'1px solid var(--border)',borderRadius:8,padding:'0.75rem',textAlign:'center'}}>
            <div style={{fontSize:'1.2rem',fontWeight:800,color:s.color}}>{s.value}</div>
            <div className="text-xs text-muted">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
