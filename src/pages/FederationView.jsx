import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts'

const NODES = [
  { id:'india',  name:'India',        flag:'🇮🇳', color:'#6366f1', requests:12847, models:8, taxonomy:7, x:65, y:42, active:true, cloud:'Google Cloud (Mumbai)', lastSync:'2 min ago' },
  { id:'brazil', name:'Brazil',       flag:'🇧🇷', color:'#10b981', requests:8432,  models:5, taxonomy:6, x:28, y:62, active:true, cloud:'Google Cloud (São Paulo)', lastSync:'8 min ago' },
  { id:'china',  name:'China',        flag:'🇨🇳', color:'#f59e0b', requests:21034, models:9, taxonomy:7, x:76, y:28, active:true, cloud:'Compliant Cloud (Beijing)', lastSync:'15 min ago' },
  { id:'russia', name:'Russia',       flag:'🇷🇺', color:'#f43f5e', requests:6201,  models:3, taxonomy:5, x:60, y:18, active:false, cloud:'Planned', lastSync:'Not connected' },
  { id:'sa',     name:'South Africa', flag:'🇿🇦', color:'#06b6d4', requests:4890,  models:2, taxonomy:5, x:54, y:68, active:false, cloud:'Planned', lastSync:'Not connected' },
]

const TAXONOMY = [
  { category:'Water & Sanitation', brics_code:'W-01',  nations:5, version:'2.1', status:'Stable' },
  { category:'Roads & Transport',  brics_code:'T-01',  nations:5, version:'2.1', status:'Stable' },
  { category:'Electricity',        brics_code:'E-01',  nations:5, version:'2.0', status:'Stable' },
  { category:'Health Infrastructure', brics_code:'H-01', nations:4, version:'1.9', status:'Stable' },
  { category:'Education Facilities',  brics_code:'ED-01',nations:4, version:'1.8', status:'Draft' },
  { category:'Drainage & Stormwater', brics_code:'D-01', nations:3, version:'1.5', status:'Draft' },
  { category:'Housing',            brics_code:'HO-01', nations:3, version:'1.3', status:'Proposed' },
]

const MODEL_EXCHANGES = [
  { from:'India', to:'Brazil', type:'Embedding Delta', params:'142K params', timestamp:'10 min ago', status:'Success' },
  { from:'China', to:'India',  type:'Category Classifier', params:'89K params', timestamp:'22 min ago', status:'Success' },
  { from:'Brazil',to:'China',  type:'Geo Resolver Update', params:'34K params', timestamp:'1 hr ago', status:'Success' },
  { from:'India', to:'All',    type:'Taxonomy v2.1 Release', params:'Schema only', timestamp:'3 hr ago', status:'Published' },
]

const API_ENDPOINTS = [
  { method:'GET',  path:'/api/v1/taxonomy',        desc:'List shared taxonomy categories',     auth:'API key' },
  { method:'GET',  path:'/api/v1/clusters/{ward}', desc:'Get demand clusters for a ward',      auth:'Node JWT' },
  { method:'POST', path:'/api/v1/model/exchange',  desc:'Push model parameter delta to federation', auth:'Node JWT + signature' },
  { method:'GET',  path:'/api/v1/impact/aggregate',desc:'Cross-node impact benchmarks (anonymized)', auth:'API key' },
  { method:'GET',  path:'/api/v1/schema/current',  desc:'OpenAPI schema for current version',  auth:'Public' },
]

// Simulated model accuracy improvement over time
const MODEL_TREND = [
  { week:'W1', india:0.72, brazil:0.68, china:0.75 },
  { week:'W4', india:0.76, brazil:0.73, china:0.78 },
  { week:'W8', india:0.81, brazil:0.79, china:0.83 },
  { week:'W12',india:0.85, brazil:0.84, china:0.87 },
  { week:'W16',india:0.88, brazil:0.87, china:0.89 },
  { week:'W20',india:0.91, brazil:0.90, china:0.92 },
]

export default function FederationView() {
  const [selectedNode, setSelectedNode] = useState(null)
  const [tab, setTab] = useState('map') // map | exchange | taxonomy | api

  return (
    <div>
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">🌐 Federation View</h1>
            <p className="text-muted text-sm mt-1">
              BRICS sovereign nodes · Shared taxonomy · Model exchange · 0 raw citizen records transferred · OpenAPI
            </p>
          </div>
          <span className="badge badge-indigo">Module 10 — DPG / BRICS Scale</span>
        </div>
      </div>

      <div className="page-body">
        {/* Zero counter */}
        <motion.div animate={{scale:[1,1.01,1]}} transition={{duration:3,repeat:Infinity}}
          style={{ textAlign:'center', padding:'1.5rem', marginBottom:'1.5rem',
            background:'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(6,182,212,0.08))',
            border:'1px solid rgba(99,102,241,0.2)', borderRadius:20 }}>
          <div style={{fontSize:'4.5rem',fontWeight:900,color:'var(--accent-cyan)',lineHeight:1}}>0</div>
          <div style={{fontSize:'1.1rem',color:'var(--text-secondary)',marginTop:'0.25rem'}}>Raw Citizen Records Transferred Across Borders</div>
          <div style={{fontSize:'0.82rem',color:'var(--text-muted)',marginTop:'0.4rem'}}>Only model parameters & taxonomy shared · Full data sovereignty preserved (FR-10.2, NFR-8)</div>
          <div style={{display:'flex',justifyContent:'center',gap:'2.5rem',marginTop:'1.5rem',flexWrap:'wrap'}}>
            {[['5','Nation Nodes','#6366f1'],['3','Active (2 Planned)','#10b981'],['48,404','Total Requests','#f59e0b'],['v2.1','Schema Version','#06b6d4'],['342K','Params Shared Today','#8b5cf6']].map(([v,l,c])=>(
              <div key={l} style={{textAlign:'center'}}>
                <div style={{fontSize:'1.5rem',fontWeight:900,color:c}}>{v}</div>
                <div style={{fontSize:'0.72rem',color:'var(--text-muted)'}}>{l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {[['map','🗺️ Node Map'],['exchange','🔄 Model Exchange'],['taxonomy','📚 Taxonomy Registry'],['api','📡 API Spec']].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)} className={`btn btn-sm ${tab===t?'btn-primary':'btn-ghost'}`}>{l}</button>
          ))}
        </div>

        {/* MAP TAB */}
        {tab==='map' && (
          <div className="grid-2">
            <div className="card" style={{padding:'1.5rem'}}>
              <div className="font-semibold mb-3">🗺️ BRICS Federation Nodes</div>
              <div style={{position:'relative',background:'var(--bg-surface)',borderRadius:12,height:340,border:'1px solid var(--border)',overflow:'hidden'}}>
                <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',opacity:0.04,fontSize:'10rem'}}>🌍</div>
                <div style={{position:'absolute',top:8,left:8,fontSize:'0.68rem',color:'var(--text-muted)'}}>Schematic — not to scale</div>

                {/* Arcs */}
                <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}}>
                  {NODES.filter(n=>n.active&&n.id!=='india').map(n=>{
                    const india = NODES.find(x=>x.id==='india')
                    return (
                      <motion.path key={n.id}
                        d={`M ${india.x}% ${india.y}% Q 50% 50% ${n.x}% ${n.y}%`}
                        stroke={n.color} strokeWidth={1.5} fill="none" strokeDasharray="6 4" strokeOpacity={0.5}
                        initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:2,repeat:Infinity,ease:'linear'}} />
                    )
                  })}
                  {/* China to Brazil */}
                  <motion.path d="M 76% 28% Q 50% 80% 28% 62%" stroke="#f59e0b" strokeWidth={1} fill="none" strokeDasharray="4 6" strokeOpacity={0.3}
                    initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:3,repeat:Infinity,ease:'linear',delay:1}} />
                </svg>

                {NODES.map(n=>(
                  <motion.button key={n.id} whileHover={{scale:1.2}}
                    onClick={()=>setSelectedNode(n===selectedNode?null:n)}
                    style={{
                      position:'absolute', left:`${n.x}%`, top:`${n.y}%`, transform:'translate(-50%,-50%)',
                      width:52, height:52, borderRadius:'50%',
                      background:`${n.color}22`, border:`2px solid ${n.color}${n.active?'':'55'}`,
                      cursor:'pointer', fontSize:'1.4rem',
                      boxShadow:n.active?`0 0 24px ${n.color}44`:'none',
                      display:'flex',alignItems:'center',justifyContent:'center',
                      filter:n.active?'none':'grayscale(0.7)',
                      borderStyle:n.active?'solid':'dashed',
                    }}>
                    {n.flag}
                    {n.active && (
                      <motion.div animate={{scale:[1,1.6,1],opacity:[0.8,0,0.8]}} transition={{duration:2.5,repeat:Infinity}}
                        style={{position:'absolute',width:'100%',height:'100%',borderRadius:'50%',border:`1px solid ${n.color}`,pointerEvents:'none'}} />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Legend */}
              <div className="flex gap-3 mt-2" style={{flexWrap:'wrap'}}>
                <div className="flex items-center gap-1"><div style={{width:8,height:8,borderRadius:'50%',background:'var(--accent-emerald)'}}/><span className="text-xs text-muted">Active Node</span></div>
                <div className="flex items-center gap-1"><div style={{width:8,height:8,borderRadius:'50%',border:'1px dashed var(--text-muted)'}}/><span className="text-xs text-muted">Planned Node</span></div>
                <div className="flex items-center gap-1"><span className="text-xs text-muted">── Model params flow (no raw data)</span></div>
              </div>

              <AnimatePresence>
                {selectedNode && (
                  <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="card-sm mt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span style={{fontSize:'1.6rem'}}>{selectedNode.flag}</span>
                      <div>
                        <div className="font-bold">{selectedNode.name}</div>
                        <div className="text-xs" style={{color:selectedNode.active?'var(--accent-emerald)':'var(--text-muted)'}}>
                          {selectedNode.active?'🟢 Active':'⚪ Planned'}
                        </div>
                      </div>
                    </div>
                    {[['Requests',selectedNode.requests.toLocaleString()],['Models Trained',selectedNode.models],['Taxonomy Entries',selectedNode.taxonomy],['Cloud',selectedNode.cloud],['Last Sync',selectedNode.lastSync]].map(([l,v])=>(
                      <div key={l} className="flex items-center gap-2" style={{fontSize:'0.8rem',padding:'0.2rem 0'}}>
                        <span className="text-muted" style={{width:110}}>{l}:</span>
                        <span style={{color:selectedNode.color,fontWeight:600}}>{v}</span>
                      </div>
                    ))}
                    <div className="text-xs text-muted mt-2" style={{borderTop:'1px solid var(--border)',paddingTop:'0.5rem'}}>
                      Shares: model parameters, taxonomy mappings only<br/>
                      Retains: all raw citizen data (sovereignty guaranteed)
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Data sovereignty explainer */}
            <div className="card" style={{padding:'1.5rem'}}>
              <div className="font-semibold mb-3">🔄 What Flows Across the Federation</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:'1rem',alignItems:'center',marginBottom:'1.5rem'}}>
                <div style={{background:'rgba(244,63,94,0.08)',border:'1px solid rgba(244,63,94,0.2)',borderRadius:12,padding:'1rem'}}>
                  <div className="font-bold mb-2" style={{color:'var(--accent-rose)'}}>🔒 Stays in Nation</div>
                  {['Raw citizen requests','Phone / device IDs','Geo-location details','Audio recordings','Individual profiles','National budget data'].map(i=>(
                    <div key={i} className="flex items-center gap-2 text-xs" style={{padding:'0.2rem 0'}}>
                      <span style={{color:'var(--accent-rose)'}}>✗</span>{i}
                    </div>
                  ))}
                </div>
                <div style={{textAlign:'center',color:'var(--accent-cyan)',fontSize:'1.5rem'}}>⇄</div>
                <div style={{background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.2)',borderRadius:12,padding:'1rem'}}>
                  <div className="font-bold mb-2" style={{color:'var(--accent-emerald)'}}>🌍 Shared Safely</div>
                  {['Model parameter deltas','Category embeddings','Taxonomy definitions','Open schema/API','Anonymised benchmarks','Impact aggregates'].map(i=>(
                    <div key={i} className="flex items-center gap-2 text-xs" style={{padding:'0.2rem 0'}}>
                      <span style={{color:'var(--accent-emerald)'}}>✓</span>{i}
                    </div>
                  ))}
                </div>
              </div>

              {/* Model accuracy improvement */}
              <div className="font-semibold mb-2">📈 Classification Accuracy — Federated Learning Effect</div>
              <div style={{height:180}}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MODEL_TREND}>
                    <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                    <XAxis dataKey="week" tick={{fill:'#94a3b8',fontSize:10}} />
                    <YAxis domain={[0.6,1.0]} tickFormatter={v=>`${(v*100).toFixed(0)}%`} tick={{fill:'#94a3b8',fontSize:10}} />
                    <Tooltip contentStyle={{background:'#0d1117',border:'1px solid #1e293b',borderRadius:8,fontSize:11}}
                      formatter={v=>`${(v*100).toFixed(0)}%`} />
                    <Line dataKey="india"  stroke="#6366f1" strokeWidth={2} dot={false} name="India" />
                    <Line dataKey="brazil" stroke="#10b981" strokeWidth={2} dot={false} name="Brazil" />
                    <Line dataKey="china"  stroke="#f59e0b" strokeWidth={2} dot={false} name="China" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="text-xs text-muted mt-1 text-center">
                Each dip = before receiving partner node's model delta · Accuracy improves without raw data transfer <span className="badge badge-synthetic">⚗️ SYNTHETIC</span>
              </div>
            </div>
          </div>
        )}

        {/* MODEL EXCHANGE TAB */}
        {tab==='exchange' && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <div className="card mb-4">
              <div className="font-semibold mb-3">🔄 Recent Model Parameter Exchanges</div>
              <table className="data-table">
                <thead>
                  <tr><th>From</th><th>To</th><th>Type</th><th>Parameters</th><th>Timestamp</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {MODEL_EXCHANGES.map((e,i)=>(
                    <tr key={i}>
                      <td>{NODES.find(n=>n.name===e.from)?.flag} {e.from}</td>
                      <td>{e.to==='All'?'🌍 All Nodes':<>{NODES.find(n=>n.name===e.to)?.flag} {e.to}</>}</td>
                      <td><span className="badge badge-indigo">{e.type}</span></td>
                      <td className="font-mono text-xs" style={{color:'var(--accent-cyan)'}}>{e.params}</td>
                      <td className="text-muted text-xs">{e.timestamp}</td>
                      <td><span className="badge badge-emerald">{e.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-xs text-muted mt-3">
                ⚠️ All exchanges validated with provenance signatures before application. Model-poisoning protection active.
              </div>
            </div>

            <div className="card">
              <div className="font-semibold mb-3">🛡️ Federation Security Guarantees</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem'}}>
                {[
                  ['Provenance Signing','Every model delta signed by source node — recipients verify before applying','#6366f1','🔐'],
                  ['Validation Gate','Automatic accuracy check after applying delta — roll back if degradation detected','#10b981','✅'],
                  ['Version Control','All taxonomy and schema changes versioned and backward-compatible','#f59e0b','📌'],
                ].map(([t,d,c,ico])=>(
                  <div key={t} style={{padding:'1rem',background:`${c}0d`,border:`1px solid ${c}22`,borderRadius:12}}>
                    <div style={{fontSize:'1.5rem',marginBottom:'0.5rem'}}>{ico}</div>
                    <div className="font-bold text-sm mb-1" style={{color:c}}>{t}</div>
                    <div className="text-xs text-muted">{d}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAXONOMY TAB */}
        {tab==='taxonomy' && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <div className="card mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold">📚 Shared Open Taxonomy Registry</div>
                <div className="flex gap-2">
                  <span className="badge badge-emerald">v2.1 Current</span>
                  <span className="badge badge-muted">Apache 2.0</span>
                  <span className="badge badge-cyan">OpenAPI Documented</span>
                </div>
              </div>
              <table className="data-table">
                <thead>
                  <tr><th>Category</th><th>BRICS Code</th><th>Nations Adopted</th><th>Version</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {TAXONOMY.map(t=>(
                    <tr key={t.brics_code}>
                      <td className="font-semibold">{t.category}</td>
                      <td className="font-mono" style={{color:'var(--accent-cyan)'}}>{t.brics_code}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {Array.from({length:t.nations}).map((_,i)=>(<div key={i} style={{width:8,height:8,borderRadius:'50%',background:'var(--accent-indigo)'}}/>))}
                            {Array.from({length:5-t.nations}).map((_,i)=>(<div key={i} style={{width:8,height:8,borderRadius:'50%',background:'var(--border)'}}/>))}
                          </div>
                          <span className="text-xs text-muted">{t.nations}/5</span>
                        </div>
                      </td>
                      <td><span className="badge badge-muted">{t.version}</span></td>
                      <td>
                        <span className={`badge ${t.status==='Stable'?'badge-emerald':t.status==='Draft'?'badge-amber':'badge-muted'}`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card">
              <div className="font-semibold mb-2">🌍 National Taxonomy Extensions</div>
              <div className="text-sm text-muted mb-3">Each nation maps its local categories to the shared BRICS core, plus may define national extensions.</div>
              <div className="grid-3">
                {[['India','eg: MGNREGS Rural Work','#6366f1'],['Brazil','eg: Bolsa Familia Infrastructure','#10b981'],['China','eg: New Rural Infrastructure','#f59e0b']].map(([n,ext,c])=>(
                  <div key={n} style={{padding:'0.75rem',background:'var(--bg-glass-2)',borderRadius:8,border:`1px solid ${c}22`}}>
                    <div className="font-semibold text-sm" style={{color:c}}>{n}</div>
                    <div className="text-xs text-muted mt-1">Core BRICS: 7 categories ✓</div>
                    <div className="text-xs" style={{color:c,marginTop:'0.25rem'}}>+ National: {ext}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* API TAB */}
        {tab==='api' && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <div className="card mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold">📡 Federation Interoperability API</div>
                <div className="flex gap-2">
                  <span className="badge badge-emerald">OpenAPI 3.0</span>
                  <span className="badge badge-muted">REST + gRPC</span>
                  <button className="btn btn-ghost btn-sm">⬇ Download Spec</button>
                </div>
              </div>
              <div className="flex-col gap-2">
                {API_ENDPOINTS.map(e=>(
                  <div key={e.path} style={{display:'flex',alignItems:'center',gap:'1rem',padding:'0.75rem 1rem',background:'var(--bg-glass-2)',borderRadius:8,border:'1px solid var(--border)'}}>
                    <span className="badge" style={{
                      background:e.method==='GET'?'rgba(16,185,129,0.15)':'rgba(99,102,241,0.15)',
                      color:e.method==='GET'?'var(--accent-emerald)':'var(--accent-indigo)',
                      border:'none',minWidth:50,justifyContent:'center'
                    }}>{e.method}</span>
                    <span className="font-mono text-sm" style={{color:'var(--accent-cyan)',flex:1}}>{e.path}</span>
                    <span className="text-xs text-muted" style={{flex:2}}>{e.desc}</span>
                    <span className="badge badge-muted" style={{fontSize:'0.65rem'}}>{e.auth}</span>
                  </div>
                ))}
              </div>
              <div style={{marginTop:'1rem',padding:'0.75rem',background:'rgba(6,182,212,0.06)',border:'1px solid rgba(6,182,212,0.2)',borderRadius:8,fontSize:'0.78rem',color:'var(--text-muted)'}}>
                📌 All APIs use HTTPS · Node JWT required for write endpoints · Rate limited · All requests logged in federation audit
              </div>
            </div>

            {/* FR compliance */}
            <div className="card">
              <div className="font-semibold mb-3">✅ FR-10 Compliance Checklist</div>
              <div className="flex-col gap-2">
                {[
                  ['FR-10.1','Sovereign per-nation deployment with data residency guaranteed','✅'],
                  ['FR-10.2','Model/aggregate sharing without raw citizen data transfer','✅'],
                  ['FR-10.3','Shared, versioned open taxonomy and data schema','✅'],
                  ['FR-10.4','Open, documented interoperability APIs (OpenAPI 3.0)','✅'],
                  ['NFR-8','Raw citizen data never leaves nation of origin','✅'],
                  ['NFR-9','Open schemas + documented APIs; forkable','✅'],
                ].map(([fr,desc,status])=>(
                  <div key={fr} className="flex items-center gap-3" style={{padding:'0.4rem 0',borderBottom:'1px solid var(--border)'}}>
                    <span className="badge badge-muted font-mono" style={{fontSize:'0.68rem',minWidth:70}}>{fr}</span>
                    <span className="text-sm flex-1">{desc}</span>
                    <span style={{color:'var(--accent-emerald)',fontWeight:700}}>{status}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
