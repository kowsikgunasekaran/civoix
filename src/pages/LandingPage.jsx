import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const LOOP_STEPS = [
  { icon:'🗣️', label:'Citizen Voice',      color:'#6366f1', route:'/citizen',       desc:'IVR · Voice Note · Web · RCS' },
  { icon:'🧠', label:'AI Understanding',   color:'#8b5cf6', route:'/citizen',       desc:'STT · Classify · Geo-tag' },
  { icon:'🔗', label:'Data Fusion',        color:'#06b6d4', route:'/data-fusion',   desc:'Demographic · InfraGap · Budget' },
  { icon:'⚖️', label:'Prioritization',    color:'#10b981', route:'/cockpit',       desc:'Explainable · Equity-aware' },
  { icon:'🧭', label:'Policy Decision',   color:'#f59e0b', route:'/cockpit',       desc:'Simulate · Approve · Budget-fit' },
  { icon:'📋', label:'Track Delivery',    color:'#f59e0b', route:'/lifecycle',     desc:'Sanctioned → Verified' },
  { icon:'📊', label:'Measure Impact',    color:'#f43f5e', route:'/impact',        desc:'Sentiment Delta · Demand-drop' },
  { icon:'🔁', label:'Feed Next Cycle',   color:'#6366f1', route:'/impact',        desc:'Learning signal → Re-prioritize' },
]

const MODULE_CARDS = [
  { route:'/citizen',       icon:'🗣️', label:'Citizen Portal',        desc:'Multilingual voice + text submission · Reference ID · Live tracking', color:'#6366f1', module:'M1+2' },
  { route:'/notifications', icon:'🔔', label:'Trust Loop',             desc:'Citizen notifications in their language · Confirmation feedback', color:'#8b5cf6', module:'M9' },
  { route:'/data-fusion',   icon:'🔗', label:'Data Fusion',            desc:'Census + InfraGap + Budget joins · Dataset provenance · CandidateProjects', color:'#06b6d4', module:'M4' },
  { route:'/integrity',     icon:'🛡️', label:'Integrity Engine',       desc:'Burst detection · Template similarity · Anti-astroturfing quarantine', color:'#f43f5e', module:'M12' },
  { route:'/cockpit',       icon:'🧭', label:'Decision Cockpit',       desc:'Demand heatmap · Explainable rankings · Weight dials · Budget simulation', color:'#10b981', module:'M3+5+8' },
  { route:'/lifecycle',     icon:'📋', label:'Project Lifecycle',      desc:'Sanctioned → Verified · Field officer updates · Evidence tracking', color:'#f59e0b', module:'M6' },
  { route:'/impact',        icon:'📊', label:'Impact Dashboard',       desc:'Before/after · Sentiment delta · Portfolio analysis · Learning signal', color:'#ef4444', module:'M7' },
  { route:'/federation',    icon:'🌐', label:'Federation View',        desc:'BRICS sovereign nodes · 0 raw records transferred · Shared taxonomy', color:'#06b6d4', module:'M10' },
  { route:'/audit',         icon:'🔍', label:'Audit Trail',            desc:'Immutable log · Weight changes · Approvals · CSV export', color:'#94a3b8', module:'M11' },
]

const LIVE_STATS = [
  { label:'Citizen Requests', value:12847, color:'#6366f1', suffix:'' },
  { label:'Active Hotspots',  value:38,    color:'#10b981', suffix:'' },
  { label:'Projects Approved',value:14,    color:'#f59e0b', suffix:'' },
  { label:'Rupees Allocated', value:46,    color:'#06b6d4', suffix:'Cr' },
  { label:'Avg Impact Score', value:86,    color:'#f43f5e', suffix:'%' },
  { label:'BRICS Raw Records Shared', value:0, color:'#8b5cf6', suffix:'' },
]

function AnimatedNumber({ target, suffix='' }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = 0
    const step = target / 60
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setVal(target); clearInterval(timer) }
      else setVal(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target])
  return <span>{val.toLocaleString()}{suffix}</span>
}

export default function LandingPage() {
  const nav = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const [hoveredCard, setHoveredCard] = useState(null)

  // Animate loop steps
  useEffect(() => {
    const t = setInterval(() => setActiveStep(s => (s+1) % LOOP_STEPS.length), 1800)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-deep)', position:'relative', overflow:'hidden' }}>

      {/* Background blobs */}
      <div className="blob" style={{ width:700, height:700, background:'#6366f1', top:-300, left:-200 }} />
      <div className="blob" style={{ width:500, height:500, background:'#10b981', bottom:-200, right:-100, animationDelay:'5s' }} />
      <div className="blob" style={{ width:300, height:300, background:'#06b6d4', top:'40%', right:'30%', animationDelay:'2s' }} />

      {/* Hero */}
      <div style={{ textAlign:'center', padding:'4rem 2rem 2rem', position:'relative', zIndex:1 }}>
        <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{duration:0.6}}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'0.75rem', padding:'0.5rem 1.25rem',
            background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.3)', borderRadius:99,
            fontSize:'0.82rem', color:'#a5b4fc', marginBottom:'1.5rem' }}>
            <span>🏆</span>
            <span>BRICS Track 1 — AI for Digital Public Infrastructure & Governance</span>
            <span className="badge badge-emerald" style={{fontSize:'0.65rem'}}>Innovation Theme</span>
          </div>
        </motion.div>

        <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{duration:0.7,delay:0.1}}>
          <h1 style={{ fontSize:'clamp(3rem,8vw,5.5rem)', fontWeight:900, lineHeight:1.05, marginBottom:'1rem', letterSpacing:'-2px' }}>
            <span style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent'}}>Civ</span>
            <span style={{color:'var(--text-primary)'}}>oix</span>
          </h1>
        </motion.div>

        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3}}
          style={{ fontSize:'1.3rem', color:'var(--text-secondary)', maxWidth:700, margin:'0 auto 0.5rem', lineHeight:1.6, fontWeight:300 }}>
          <em>"From the citizen's voice to the built road — and back again."</em>
        </motion.p>

        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}}
          style={{ fontSize:'0.95rem', color:'var(--text-muted)', maxWidth:750, margin:'0 auto 2.5rem' }}>
          Multilingual AI civic intelligence platform: ingest demand across 6 languages →
          fuse with national datasets → explainable budget-aware prioritization →
          track delivery → <strong style={{color:'var(--accent-emerald)'}}>measure proven impact</strong>.
          <br/>Built entirely on Google's stack · Open-source DPG · BRICS federation-ready.
        </motion.p>

        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.5}}
          style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap', marginBottom:'3rem' }}>
          <button className="btn btn-primary" style={{fontSize:'1rem',padding:'0.9rem 2.5rem'}} onClick={()=>nav('/cockpit')}>
            🧭 Open Decision Cockpit
          </button>
          <button className="btn btn-emerald" style={{fontSize:'1rem',padding:'0.9rem 2rem'}} onClick={()=>nav('/citizen')}>
            🗣️ Try Citizen Portal
          </button>
          <button className="btn btn-ghost" style={{fontSize:'1rem',padding:'0.9rem 2rem'}} onClick={()=>nav('/impact')}>
            📊 See Impact Results
          </button>
        </motion.div>

        {/* Live stats ticker */}
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.6}}>
          <div style={{ display:'flex', gap:'0', justifyContent:'center', flexWrap:'wrap',
            background:'var(--bg-glass)', border:'1px solid var(--border)', borderRadius:16,
            maxWidth:900, margin:'0 auto 3rem', overflow:'hidden', backdropFilter:'blur(20px)' }}>
            {LIVE_STATS.map((s,i) => (
              <div key={s.label} style={{
                flex:'1 1 120px', padding:'1rem 1.5rem', textAlign:'center',
                borderRight: i < LIVE_STATS.length-1 ? '1px solid var(--border)' : 'none',
                minWidth:120
              }}>
                <div style={{fontSize:'1.6rem',fontWeight:900,color:s.color,lineHeight:1}}>
                  <AnimatedNumber target={s.value} suffix={s.suffix} />
                </div>
                <div style={{fontSize:'0.68rem',color:'var(--text-muted)',marginTop:'0.25rem',lineHeight:1.3}}>{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* The Loop — animated */}
      <div style={{ position:'relative', zIndex:1, padding:'0 2rem 3rem', maxWidth:1100, margin:'0 auto' }}>
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.8}}>
          <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
            <h2 style={{ fontSize:'1.75rem', fontWeight:800 }}>
              The <span style={{color:'var(--accent-indigo)'}}>Closed Loop</span> — What Others Miss
            </h2>
            <p style={{ color:'var(--text-muted)', fontSize:'0.9rem', marginTop:'0.4rem' }}>
              80% of civic platforms stop at intake → dashboard. Civoix closes the full feedback cycle.
            </p>
          </div>

          <div style={{ background:'var(--bg-glass)', border:'1px solid var(--border)', borderRadius:24,
            padding:'2rem', backdropFilter:'blur(20px)' }}>

            {/* Steps row */}
            <div style={{ display:'flex', alignItems:'stretch', gap:0, overflowX:'auto', justifyContent:'center', flexWrap:'wrap', gap:'0.25rem' }}>
              {LOOP_STEPS.map((step, i) => (
                <div key={step.label} style={{ display:'flex', alignItems:'center' }}>
                  <motion.div
                    animate={{
                      scale: activeStep===i ? 1.1 : 1,
                      boxShadow: activeStep===i ? `0 0 24px ${step.color}55` : '0 0 0px transparent'
                    }}
                    transition={{duration:0.3}}
                    onClick={() => nav(step.route)}
                    style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem',
                      minWidth:90, cursor:'pointer', padding:'0.75rem 0.5rem', borderRadius:12,
                      background: activeStep===i ? `${step.color}12` : 'transparent',
                      border: `1px solid ${activeStep===i ? step.color+'44' : 'transparent'}`,
                      transition:'all 0.3s' }}>
                    <div style={{ width:52, height:52, borderRadius:'50%',
                      background: activeStep===i ? `${step.color}30` : `${step.color}15`,
                      border:`2px solid ${step.color}${activeStep===i?'88':'33'}`,
                      display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem' }}>
                      {step.icon}
                    </div>
                    <div style={{ fontSize:'0.72rem', fontWeight:600, color: activeStep===i ? step.color : 'var(--text-muted)',
                      textAlign:'center', lineHeight:1.3 }}>
                      {step.label}
                    </div>
                    <div style={{ fontSize:'0.62rem', color:'var(--text-muted)', textAlign:'center', lineHeight:1.2 }}>
                      {step.desc}
                    </div>
                  </motion.div>
                  {i < LOOP_STEPS.length-1 && (
                    <div style={{ color: activeStep===i ? step.color : 'var(--text-muted)',
                      fontSize:'1rem', margin:'0 0.1rem', paddingBottom:'2rem', transition:'color 0.3s' }}>→</div>
                  )}
                </div>
              ))}
            </div>

            {/* Active step detail */}
            <AnimatePresence mode="wait">
              <motion.div key={activeStep}
                initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-5}}
                style={{ marginTop:'1.5rem', padding:'1rem', background:'var(--bg-glass-2)',
                  borderRadius:12, border:`1px solid ${LOOP_STEPS[activeStep].color}33`,
                  display:'flex', alignItems:'center', gap:'1rem' }}>
                <span style={{fontSize:'2rem'}}>{LOOP_STEPS[activeStep].icon}</span>
                <div>
                  <div style={{fontWeight:700,color:LOOP_STEPS[activeStep].color}}>{LOOP_STEPS[activeStep].label}</div>
                  <div style={{fontSize:'0.82rem',color:'var(--text-muted)'}}>{LOOP_STEPS[activeStep].desc}</div>
                </div>
                <button className="btn btn-ghost btn-sm" style={{marginLeft:'auto'}}
                  onClick={()=>nav(LOOP_STEPS[activeStep].route)}>
                  Explore →
                </button>
              </motion.div>
            </AnimatePresence>

            {/* Differentiation callout */}
            <div style={{ marginTop:'1rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
              <div style={{ padding:'0.75rem 1rem', background:'rgba(244,63,94,0.08)', border:'1px solid rgba(244,63,94,0.2)', borderRadius:10 }}>
                <div style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--accent-rose)', marginBottom:'0.25rem' }}>❌ What competitors do</div>
                <div style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>Complaint collection → static dashboard → done. No loop.</div>
              </div>
              <div style={{ padding:'0.75rem 1rem', background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:10 }}>
                <div style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--accent-emerald)', marginBottom:'0.25rem' }}>✅ Civoix adds</div>
                <div style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>Delivery tracking + post-project impact measurement + citizen confirmation + learning signal for next cycle.</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Module cards grid */}
      <div style={{ padding:'0 4rem 2rem', position:'relative', zIndex:1 }}>
        <h2 style={{ textAlign:'center', fontSize:'1.5rem', fontWeight:700, marginBottom:'0.5rem' }}>
          Explore All <span style={{color:'var(--accent-indigo)'}}>12 Modules</span>
        </h2>
        <p style={{ textAlign:'center', color:'var(--text-muted)', fontSize:'0.85rem', marginBottom:'2rem' }}>
          Every module from the SRS is implemented — click to explore
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'1rem', maxWidth:1100, margin:'0 auto' }}>
          {MODULE_CARDS.map((card,i) => (
            <motion.div key={card.route}
              initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.9+i*0.06}}
              onHoverStart={()=>setHoveredCard(card.route)}
              onHoverEnd={()=>setHoveredCard(null)}
              className="card" style={{
                cursor:'pointer',
                borderColor: hoveredCard===card.route ? `${card.color}44` : '',
                boxShadow: hoveredCard===card.route ? `0 0 24px ${card.color}22` : '',
                transition:'all 0.2s'
              }}
              onClick={() => nav(card.route)}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:'0.75rem', marginBottom:'0.75rem' }}>
                <div style={{ fontSize:'1.8rem', lineHeight:1 }}>{card.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, color:card.color, fontSize:'0.95rem' }}>{card.label}</div>
                  <span className="badge badge-muted" style={{fontSize:'0.62rem',marginTop:'0.2rem'}}>{card.module}</span>
                </div>
              </div>
              <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', lineHeight:1.6 }}>{card.desc}</div>
              <div style={{ marginTop:'0.75rem', display:'flex', alignItems:'center', gap:'0.25rem',
                fontSize:'0.78rem', color:card.color, fontWeight:600 }}>
                Open <span>→</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* SRS compliance & DPG badges */}
      <div style={{ textAlign:'center', padding:'2rem 4rem 4rem', position:'relative', zIndex:1 }}>
        <div style={{ display:'inline-block', padding:'1.5rem 2rem',
          background:'var(--bg-glass)', border:'1px solid var(--border)', borderRadius:20, backdropFilter:'blur(20px)' }}>
          <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginBottom:'1rem', fontWeight:600 }}>
            SRS COVERAGE · GOOGLE-ONLY STACK · DPG COMPLIANT
          </div>
          <div style={{ display:'flex', gap:'0.75rem', justifyContent:'center', flexWrap:'wrap' }}>
            {[
              '🌱 Apache 2.0 Open Source',
              '🔒 Edge Pseudonymization',
              '🌍 BRICS Federation Ready',
              '⚖️ SDG 9 · SDG 11 · SDG 16',
              '🏛️ DPG Alliance Standard',
              '🤖 Gemini · Vertex AI',
              '🗄️ BigQuery · Firestore',
              '🗺️ Google Maps Platform',
              '♿ WCAG-Aligned UIs',
              '📡 12 Modules Implemented',
            ].map(b => (
              <span key={b} className="badge badge-muted" style={{fontSize:'0.76rem',padding:'0.4rem 0.8rem'}}>{b}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
