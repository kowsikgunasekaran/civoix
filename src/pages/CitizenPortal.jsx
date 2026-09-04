import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRequestStore } from '../store/requestStore'
import { PIPELINE_STEPS, LANGUAGES, CATEGORIES } from '../data/requests'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const DEMO_INPUTS = [
  { lang:'ta', flag:'🇮🇳', text:'எங்கள் தெருவில் வடிகால் அடைத்துக்கொண்டுள்ளது, மழை நீர் வீட்டில் புகுகிறது', translation:'The drain on our street is blocked. Rainwater is entering the houses.', category:'Drainage', severity:4, ward:'Mylapore West', district:'Chennai', lat:13.0418, lng:80.2676 },
  { lang:'hi', flag:'🇮🇳', text:'सड़क पर स्ट्रीट लाइट खराब है, रात को बहुत अंधेरा रहता है', translation:'Streetlight on the road is broken, very dark at night', category:'Electricity', severity:3, ward:'Karol Bagh Sector 3', district:'Delhi', lat:28.6514, lng:77.19 },
  { lang:'pt', flag:'🇧🇷', text:'A estrada está cheia de buracos e é perigosa para as crianças da escola', translation:'The road is full of potholes and is dangerous for school children', category:'Roads', severity:4, ward:'Dharavi Block C', district:'Mumbai', lat:19.04, lng:72.855 },
  { lang:'ru', flag:'🇷🇺', text:'Водоснабжение прерывается каждое утро, нет воды 3 дня', translation:'Water supply is interrupted every morning, no water for 3 days', category:'Water', severity:5, ward:'Ambattur Zone 2', district:'Chennai', lat:13.1137, lng:80.1552 },
  { lang:'en', flag:'🇬🇧', text:'Primary health centre has no doctor on weekdays. Patients turned away.', translation:'Primary health centre has no doctor on weekdays. Patients turned away.', category:'Health', severity:5, ward:'Vellore North', district:'Vellore', lat:12.9183, lng:79.1333 },
]

const IVR_STEPS = [
  { step:1, prompt:'ഭാഷ തിരഞ്ഞെടുക്കുക / Select Language', options:['1: Tamil','2: Hindi','3: English','4: Telugu'] },
  { step:2, prompt:'Please speak your development request after the beep…', options:null },
  { step:3, prompt:'You reported: Drain blocked on main street. Is this correct?', options:['1: Yes','2: No, repeat'] },
  { step:4, prompt:'Thank you. Your reference ID is A-4213. You will receive a confirmation.', options:null },
]

// Category stats
const CATEGORY_STATS = [
  { cat:'Drainage', count:342 }, { cat:'Health', count:287 }, { cat:'Roads', count:412 },
  { cat:'Water', count:198 }, { cat:'Electricity', count:156 }, { cat:'Sanitation', count:134 },
  { cat:'Education', count:89 }, { cat:'Transport', count:67 },
]

// Human review queue (low confidence)
const REVIEW_QUEUE = [
  { id:'REQ-R01', refId:'B1102', original:'இந்த அரசு office ல யாரும் வேலை பார்க்கவில்லை', translated:'Nobody is working in this government office', confidence:0.54, category:'Governance?', flag:'Possibly out-of-scope', lang:'ta' },
  { id:'REQ-R02', refId:'B1103', original:'The road near temple is ok but could be better maybe', translated:'same', confidence:0.48, category:'Roads?', flag:'Ambiguous severity', lang:'en' },
  { id:'REQ-R03', refId:'B1104', original:'ये सड़क थोड़ी खराब है जहाँ हम रोज़ जाते हैं', translated:'This road is a bit bad where we go daily', confidence:0.51, category:'Roads?', flag:'Low severity signal', lang:'hi' },
]

export default function CitizenPortal() {
  const [mode, setMode] = useState('home')
  const [recording, setRecording] = useState(false)
  const [pipelineStep, setPipelineStep] = useState(-1)
  const [result, setResult] = useState(null)
  const [demoInput, setDemoInput] = useState(0)
  const [textForm, setTextForm] = useState({ text:'', category:'Drainage', language:'en', ward:'', district:'' })
  const [trackId, setTrackId] = useState('')
  const [trackedReq, setTrackedReq] = useState(null)
  const [activeTab, setActiveTab] = useState('submit') // submit | track | review | stats
  const [ivrStep, setIvrStep] = useState(0)
  const addRequest = useRequestStore(s => s.addRequest)
  const requests = useRequestStore(s => s.requests)

  function startVoice() { setMode('voice'); setRecording(false); setPipelineStep(-1); setResult(null) }
  function startIVR() { setMode('ivr'); setIvrStep(0) }

  async function simulateRecording() {
    setRecording(true)
    await sleep(3500)
    setRecording(false)
    runPipeline(DEMO_INPUTS[demoInput])
  }

  async function runPipeline(input) {
    setMode('processing'); setPipelineStep(0)
    for (let i=0; i<PIPELINE_STEPS.length; i++) {
      setPipelineStep(i)
      await sleep(700+Math.random()*400)
    }
    const req = addRequest({
      channel: mode==='text' ? 'text' : 'voice',
      language: input.lang||textForm.language,
      langName: LANGUAGES.find(l=>l.code===(input.lang||textForm.language))?.name||'English',
      original: input.text||textForm.text,
      translated: input.translation||textForm.text,
      category: input.category||textForm.category,
      severity: input.severity||4,
      ward: input.ward||textForm.ward||'Unknown Ward',
      district: input.district||textForm.district||'Unknown',
      geo:{ lat:input.lat||13.08, lng:input.lng||80.27, ward:input.ward, district:input.district },
      confidence: 0.91+Math.random()*0.08,
    })
    setResult(req)
    setMode('done')
    setActiveTab('submit')
  }

  function handleTextSubmit(e) {
    e.preventDefault()
    const inp = DEMO_INPUTS.find(d=>d.category===textForm.category)||DEMO_INPUTS[0]
    runPipeline({ ...inp, text:textForm.text, translation:textForm.text, lang:textForm.language })
  }

  function trackRequest() {
    const found = requests.find(r=>r.refId===trackId.trim()||r.id===trackId.trim())
    setTrackedReq(found||null)
  }

  return (
    <div>
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">🗣️ Citizen Portal</h1>
            <p className="text-muted text-sm mt-1">
              Submit in any language · Voice / IVR / Text / Web · Reference ID · Track progress · Human review queue
            </p>
          </div>
          <div className="flex gap-2">
            <span className="badge badge-indigo">Module 1 — AwaazFirst Ingestion</span>
            <span className="badge badge-violet" style={{background:'rgba(139,92,246,0.15)',color:'#8b5cf6',border:'1px solid rgba(139,92,246,0.3)'}}>Module 2 — AI Understanding</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding:'0.75rem 2rem 0', borderBottom:'1px solid var(--border)', display:'flex', gap:'0.25rem' }}>
        {[['submit','📝 Submit Request'],['track','🔍 Track Status'],['review','⚠️ Review Queue'],['stats','📊 Intake Stats']].map(([t,l])=>(
          <button key={t} onClick={()=>setActiveTab(t)}
            style={{ padding:'0.5rem 1rem', borderRadius:'8px 8px 0 0', border:'1px solid', cursor:'pointer',
              background: activeTab===t?'var(--bg-card)':'transparent',
              borderColor: activeTab===t?'var(--border)':'transparent',
              borderBottom: activeTab===t?'1px solid var(--bg-card)':'1px solid transparent',
              color: activeTab===t?'var(--text-primary)':'var(--text-muted)',
              fontWeight: activeTab===t?600:400, fontSize:'0.85rem',
              marginBottom:-1, fontFamily:'inherit' }}>
            {l}
          </button>
        ))}
      </div>

      <div className="page-body">

        {/* SUBMIT TAB */}
        {activeTab==='submit' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:'1.5rem', alignItems:'start' }}>
            <div>
              {mode==='home' && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                  <div className="card" style={{textAlign:'center',padding:'2.5rem 2rem',marginBottom:'1.5rem'}}>
                    <h2 style={{fontSize:'1.3rem',fontWeight:800,marginBottom:'0.5rem'}}>How would you like to submit?</h2>
                    <p className="text-muted text-sm mb-4">FR-1.2: No smartphone or internet required for voice submission</p>
                    <div className="flex gap-3" style={{justifyContent:'center',flexWrap:'wrap',marginBottom:'2rem'}}>
                      <button className="btn btn-primary" style={{flexDirection:'column',gap:'0.25rem',padding:'1rem 1.5rem',height:'auto'}} onClick={startVoice}>
                        <span style={{fontSize:'1.8rem'}}>🎙️</span>
                        <span>Voice Note</span>
                        <span style={{fontSize:'0.7rem',opacity:0.7}}>Browser Mic</span>
                      </button>
                      <button className="btn btn-ghost" style={{flexDirection:'column',gap:'0.25rem',padding:'1rem 1.5rem',height:'auto'}} onClick={startIVR}>
                        <span style={{fontSize:'1.8rem'}}>📞</span>
                        <span>IVR / Phone</span>
                        <span style={{fontSize:'0.7rem',opacity:0.7}}>Feature phone</span>
                      </button>
                      <button className="btn btn-ghost" style={{flexDirection:'column',gap:'0.25rem',padding:'1rem 1.5rem',height:'auto'}} onClick={()=>setMode('text')}>
                        <span style={{fontSize:'1.8rem'}}>✍️</span>
                        <span>Text / Web</span>
                        <span style={{fontSize:'0.7rem',opacity:0.7}}>Any language</span>
                      </button>
                      <button className="btn btn-ghost" style={{flexDirection:'column',gap:'0.25rem',padding:'1rem 1.5rem',height:'auto',opacity:0.6}}>
                        <span style={{fontSize:'1.8rem'}}>💬</span>
                        <span>RCS Chat</span>
                        <span style={{fontSize:'0.7rem',opacity:0.7}}>Google-native</span>
                      </button>
                    </div>
                    <div style={{background:'var(--bg-glass-2)',border:'1px solid var(--border)',borderRadius:12,padding:'1rem',textAlign:'left'}}>
                      <div className="text-xs text-muted mb-2 font-semibold">🌐 Demo voice language:</div>
                      <div className="flex gap-2" style={{flexWrap:'wrap'}}>
                        {DEMO_INPUTS.map((d,i)=>(
                          <button key={i} onClick={()=>setDemoInput(i)}
                            className={`btn btn-sm ${demoInput===i?'btn-primary':'btn-ghost'}`}>
                            {d.flag} {LANGUAGES.find(l=>l.code===d.lang)?.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Privacy notice */}
                  <div style={{padding:'0.75rem 1rem',background:'rgba(16,185,129,0.06)',border:'1px solid rgba(16,185,129,0.15)',borderRadius:10}}>
                    <div className="text-xs" style={{color:'var(--accent-emerald)',fontWeight:600,marginBottom:'0.25rem'}}>🔒 Privacy by Design (FR-1.4)</div>
                    <div className="text-xs text-muted">Your phone number is hashed at the edge — never stored in raw form in analytics. You receive only a pseudonymous reference ID.</div>
                  </div>
                </motion.div>
              )}

              {mode==='ivr' && (
                <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} className="card">
                  <div className="flex items-center gap-2 mb-4">
                    <span style={{fontSize:'1.5rem'}}>📞</span>
                    <div>
                      <div className="font-bold">IVR Simulation — Feature Phone Flow</div>
                      <div className="text-xs text-muted">C-4: No smartphone or literacy required</div>
                    </div>
                    <span className="badge badge-synthetic" style={{marginLeft:'auto'}}>⚗️ DEMO</span>
                  </div>
                  <div style={{background:'#0a0a0a',borderRadius:12,padding:'1.5rem',fontFamily:'monospace',marginBottom:'1rem'}}>
                    <div style={{color:'#22c55e',marginBottom:'0.5rem',fontSize:'0.8rem'}}>Civoix IVR System</div>
                    <div style={{color:'#86efac',fontSize:'0.9rem',lineHeight:2}}>
                      {IVR_STEPS[ivrStep].prompt}
                    </div>
                    {IVR_STEPS[ivrStep].options && (
                      <div style={{marginTop:'0.5rem'}}>
                        {IVR_STEPS[ivrStep].options.map(o=>(
                          <div key={o} style={{color:'#6ee7b7',fontSize:'0.82rem',lineHeight:1.8}}>  {o}</div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {ivrStep < IVR_STEPS.length-1 ? (
                      <button className="btn btn-primary" onClick={()=>setIvrStep(s=>s+1)}>
                        {ivrStep===1?'🎙️ Speak':'Press 1 →'}
                      </button>
                    ) : (
                      <button className="btn btn-emerald" onClick={()=>{ setMode('home'); setIvrStep(0) }}>
                        ✅ Complete — Back to Home
                      </button>
                    )}
                    <button className="btn btn-ghost" onClick={()=>{ setMode('home'); setIvrStep(0) }}>Cancel</button>
                  </div>
                </motion.div>
              )}

              {mode==='voice' && (
                <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} className="card" style={{textAlign:'center',padding:'3rem'}}>
                  <div className="text-muted text-sm mb-2">Speak your request in your language</div>
                  <div className="text-xs text-muted mb-4" style={{padding:'0.5rem',background:'var(--bg-glass-2)',borderRadius:8}}>
                    Demo: Will use <strong style={{color:'var(--accent-indigo)'}}>{DEMO_INPUTS[demoInput].flag} {LANGUAGES.find(l=>l.code===DEMO_INPUTS[demoInput].lang)?.name}</strong>
                    &nbsp;— "{DEMO_INPUTS[demoInput].text.slice(0,50)}…"
                  </div>
                  <div style={{display:'flex',justifyContent:'center',marginBottom:'2rem'}}>
                    <button className={`voice-btn ${recording?'recording':''}`} onClick={simulateRecording} disabled={recording}>
                      {recording?'⏹':'🎙️'}
                      {recording && <><div className="voice-ring"/><div className="voice-ring" style={{animationDelay:'0.5s'}}/></>}
                    </button>
                  </div>
                  <div className="font-semibold mb-1">{recording?'🔴 Recording… speak now':'▶ Tap to record'}</div>
                  {!recording && <button className="btn btn-ghost btn-sm mt-3" onClick={()=>setMode('home')}>← Back</button>}
                </motion.div>
              )}

              {mode==='text' && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} className="card">
                  <div className="font-semibold mb-4">✍️ Text Submission (Any Language)</div>
                  <form onSubmit={handleTextSubmit} className="flex-col gap-3">
                    <div>
                      <label className="text-xs text-muted">Language</label>
                      <select className="input mt-1" value={textForm.language} onChange={e=>setTextForm(f=>({...f,language:e.target.value}))}>
                        {LANGUAGES.map(l=><option key={l.code} value={l.code}>{l.flag} {l.name} — {l.nativeName}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-muted">Your Request (in any language)</label>
                      <textarea className="input mt-1" placeholder="Describe your development need…" required
                        value={textForm.text} onChange={e=>setTextForm(f=>({...f,text:e.target.value}))} />
                    </div>
                    <div className="grid-2">
                      <div>
                        <label className="text-xs text-muted">Category</label>
                        <select className="input mt-1" value={textForm.category} onChange={e=>setTextForm(f=>({...f,category:e.target.value}))}>
                          {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-muted">Ward / Area</label>
                        <input className="input mt-1" placeholder="e.g. Mylapore West" value={textForm.ward} onChange={e=>setTextForm(f=>({...f,ward:e.target.value}))} />
                      </div>
                    </div>
                    <div style={{padding:'0.75rem',background:'rgba(99,102,241,0.06)',borderRadius:8,fontSize:'0.78rem',color:'var(--text-muted)'}}>
                      🧠 AI will auto-detect language, translate, classify, extract location, and geo-tag your request
                    </div>
                    <div className="flex gap-2 mt-1">
                      <button type="submit" className="btn btn-primary">Submit → AI Pipeline</button>
                      <button type="button" className="btn btn-ghost" onClick={()=>setMode('home')}>← Back</button>
                    </div>
                  </form>
                </motion.div>
              )}

              {mode==='processing' && <PipelineView step={pipelineStep} input={DEMO_INPUTS[demoInput]} />}
              {mode==='done' && result && <DoneView result={result} setMode={setMode} setActiveTab={setActiveTab} />}
            </div>

            {/* Right sidebar */}
            <div className="flex-col gap-4">
              <div className="card">
                <div className="font-semibold mb-3">🌐 Supported Languages</div>
                {LANGUAGES.map(l=>(
                  <div key={l.code} className="flex items-center gap-2" style={{padding:'0.4rem 0',borderBottom:'1px solid var(--border)'}}>
                    <span>{l.flag}</span>
                    <span className="text-sm">{l.name}</span>
                    <span className="text-xs text-muted" style={{marginLeft:'auto'}}>{l.nativeName}</span>
                  </div>
                ))}
                <div className="text-xs text-muted mt-2">+ code-switching detected automatically</div>
              </div>

              <div className="card">
                <div className="font-semibold mb-2">📋 Recent Requests</div>
                <div className="flex-col gap-1">
                  {requests.slice(0,5).map(r=>(
                    <div key={r.id} className="card-sm" style={{padding:'0.6rem',marginBottom:'0.25rem',cursor:'pointer'}}
                      onClick={()=>{ setTrackId(r.refId); setActiveTab('track') }}>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-indigo">{r.refId}</span>
                        <span className="badge badge-emerald" style={{fontSize:'0.62rem'}}>{r.category}</span>
                      </div>
                      <div className="text-xs text-muted mt-1 truncate">{r.translated||r.original}</div>
                      <div className="text-xs" style={{color:'var(--text-muted)',marginTop:'0.2rem'}}>{r.langName} · {r.ward}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TRACK TAB */}
        {activeTab==='track' && (
          <div style={{ maxWidth:700 }}>
            <div className="card mb-4">
              <div className="font-semibold mb-3">🔍 Track Your Request</div>
              <div className="flex gap-2 mb-2">
                <input className="input" placeholder="Reference ID (e.g. A4213)" value={trackId} onChange={e=>setTrackId(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&trackRequest()} />
                <button className="btn btn-primary" onClick={trackRequest}>Track</button>
              </div>
              <div className="text-xs text-muted">Try: A4213, A4214, A4215, A4216…</div>
            </div>
            {trackedReq && <TrackResult req={trackedReq} />}
            {trackId && !trackedReq && <div className="card text-muted text-sm" style={{textAlign:'center'}}>No request found for "{trackId}"</div>}

            {/* All requests list */}
            <div className="card">
              <div className="font-semibold mb-3">All Submitted Requests</div>
              <table className="data-table">
                <thead>
                  <tr><th>Ref ID</th><th>Category</th><th>Language</th><th>Ward</th><th>Confidence</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {requests.map(r=>(
                    <tr key={r.id} style={{cursor:'pointer'}} onClick={()=>{ setTrackId(r.refId); trackRequest() }}>
                      <td className="font-mono text-indigo">{r.refId}</td>
                      <td><span className="badge badge-muted">{r.category}</span></td>
                      <td>{r.langName}</td>
                      <td>{r.ward}</td>
                      <td>
                        <span style={{color:r.confidence>0.8?'var(--accent-emerald)':'var(--accent-amber)',fontWeight:700}}>
                          {r.confidence?(r.confidence*100).toFixed(0):'95'}%
                        </span>
                      </td>
                      <td><span className="badge badge-emerald">Clustered</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REVIEW QUEUE TAB */}
        {activeTab==='review' && (
          <div style={{maxWidth:900}}>
            <div style={{padding:'0.75rem 1rem',background:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.2)',borderRadius:10,marginBottom:'1.5rem'}}>
              <div className="font-semibold text-amber mb-1" style={{color:'var(--accent-amber)'}}>⚠️ Human-in-the-Loop Review Queue (FR-2.5)</div>
              <div className="text-sm text-muted">Requests below 60% confidence threshold are NOT auto-actioned. A human reviewer must classify them before they enter the pipeline.</div>
            </div>
            <div className="flex-col gap-3">
              {REVIEW_QUEUE.map(r=>(
                <motion.div key={r.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} className="card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-indigo">{r.refId}</span>
                      <span className="badge badge-amber">⚠️ Low Confidence</span>
                      <span className="badge badge-muted">{r.lang}</span>
                    </div>
                    <span style={{color:'var(--accent-amber)',fontWeight:700,fontSize:'1.1rem'}}>{(r.confidence*100).toFixed(0)}%</span>
                  </div>
                  <div style={{background:'var(--bg-glass-2)',padding:'0.75rem',borderRadius:8,marginBottom:'0.75rem'}}>
                    <div className="text-xs text-muted mb-1">Original:</div>
                    <div className="text-sm">{r.original}</div>
                    {r.translated!=='same' && <><div className="text-xs text-muted mt-2 mb-1">Translated:</div><div className="text-sm text-muted">{r.translated}</div></>}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-muted">AI suggested:</span>
                    <span className="badge badge-muted">{r.category}</span>
                    <span className="text-xs" style={{color:'var(--accent-amber)'}}>🚩 {r.flag}</span>
                  </div>
                  <div className="flex gap-2">
                    <select className="input" style={{flex:1}}>
                      {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                    </select>
                    <button className="btn btn-emerald btn-sm">✅ Classify & Release</button>
                    <button className="btn btn-ghost btn-sm">🚫 Mark Out-of-Scope</button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* STATS TAB */}
        {activeTab==='stats' && (
          <div>
            <div className="grid-2">
              <div className="card">
                <div className="font-semibold mb-3">📊 Requests by Category</div>
                <div style={{height:250}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={CATEGORY_STATS} layout="vertical">
                      <XAxis type="number" tick={{fill:'#94a3b8',fontSize:10}} />
                      <YAxis dataKey="cat" type="category" tick={{fill:'#94a3b8',fontSize:10}} width={70} />
                      <Tooltip contentStyle={{background:'#0d1117',border:'1px solid #1e293b',borderRadius:8,fontSize:12}} />
                      <Bar dataKey="count" fill="#6366f1" radius={4} name="Requests" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="card">
                <div className="font-semibold mb-3">🌐 Requests by Channel & Language</div>
                <div className="flex-col gap-3">
                  {[
                    { channel:'Voice/IVR', icon:'📞', count:7841, pct:61, color:'#6366f1' },
                    { channel:'Web Form', icon:'💻', count:3214, pct:25, color:'#10b981' },
                    { channel:'RCS Chat', icon:'💬', count:1249, pct:10, color:'#06b6d4' },
                    { channel:'SMS Text', icon:'📱', count:543,  pct:4,  color:'#f59e0b' },
                  ].map(c=>(
                    <div key={c.channel}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{c.icon} {c.channel}</span>
                        <span className="font-bold" style={{color:c.color}}>{c.count.toLocaleString()} ({c.pct}%)</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{width:`${c.pct}%`,background:c.color}} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="divider" />
                <div className="font-semibold mb-2 mt-2">Top Languages</div>
                {[['Tamil','ta','🇮🇳',42],['Hindi','hi','🇮🇳',28],['English','en','🇬🇧',18],['Portuguese','pt','🇧🇷',8],['Russian','ru','🇷🇺',4]].map(([l,,f,p])=>(
                  <div key={l} className="flex items-center gap-2 mb-1">
                    <span>{f}</span>
                    <span className="text-sm">{l}</span>
                    <div className="progress-track" style={{flex:1}}>
                      <div className="progress-fill" style={{width:`${p}%`,background:'var(--accent-indigo)'}} />
                    </div>
                    <span className="text-xs text-muted">{p}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card mt-4">
              <div className="font-semibold mb-3">🔒 Privacy Architecture (FR-1.4, NFR-5)</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem'}}>
                {[
                  { step:'1. At Edge', desc:'Phone/device ID hashed with SHA-256 before entering system', icon:'📟', color:'#6366f1' },
                  { step:'2. In Analytics', desc:'Only pseudonymous citizen hash used. No raw PII in BigQuery', icon:'🗄️', color:'#10b981' },
                  { step:'3. In Notifications', desc:'Outbound uses channel ref (not PII) to route messages', icon:'🔔', color:'#f59e0b' },
                ].map(s=>(
                  <div key={s.step} style={{padding:'1rem',background:'var(--bg-glass-2)',borderRadius:12,border:`1px solid ${s.color}22`}}>
                    <div style={{fontSize:'1.5rem',marginBottom:'0.5rem'}}>{s.icon}</div>
                    <div className="font-bold text-sm mb-1" style={{color:s.color}}>{s.step}</div>
                    <div className="text-xs text-muted">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

function PipelineView({ step, input }) {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="card">
      <div className="flex items-center gap-2 mb-3">
        <div className="font-semibold">🧠 AI Understanding Pipeline</div>
        <span className="badge badge-indigo">Gemini Flash · [DEMO MODE]</span>
      </div>
      {input && step>=0 && (
        <div style={{padding:'0.75rem',background:'var(--bg-glass-2)',borderRadius:8,marginBottom:'1rem'}}>
          <div className="text-xs text-muted mb-1">Input ({input.flag}):</div>
          <div className="font-semibold text-sm">{input.text}</div>
        </div>
      )}
      <div className="pipeline">
        {PIPELINE_STEPS.map((s,i)=>(
          <motion.div key={s.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.08}}
            className={`pipeline-step ${i===step?'active':i<step?'done':'pending'}`}>
            <span style={{fontSize:'1.1rem'}}>{i<step?'✅':s.icon}</span>
            <div style={{flex:1}}>
              <div className="font-semibold" style={{fontSize:'0.83rem'}}>{s.label}</div>
              <div className="text-xs text-muted">{s.service}</div>
            </div>
            {i===step && <motion.span animate={{rotate:360}} transition={{duration:0.8,repeat:Infinity,ease:'linear'}}>⚙️</motion.span>}
            {i<step && step>=1 && i===0 && input && (
              <span className="text-xs" style={{color:'var(--accent-emerald)'}}>"{input.text.slice(0,20)}…"</span>
            )}
          </motion.div>
        ))}
      </div>
      <div className="mt-3">
        <div className="progress-track">
          <div className="progress-fill" style={{ background:'var(--grad-indigo)', width:`${((step+1)/PIPELINE_STEPS.length)*100}%` }} />
        </div>
        <div className="text-xs text-muted mt-1">{step+1} / {PIPELINE_STEPS.length} steps · Target: {'< 10 seconds'}</div>
      </div>
    </motion.div>
  )
}

function DoneView({ result, setMode, setActiveTab }) {
  return (
    <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} className="card" style={{textAlign:'center'}}>
      <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',bounce:0.5}} style={{fontSize:'3rem',marginBottom:'1rem'}}>✅</motion.div>
      <h3 style={{fontSize:'1.25rem',fontWeight:800,marginBottom:'0.5rem',color:'var(--accent-emerald)'}}>Request Submitted!</h3>
      <div className="ref-id mb-3">{result.refId}</div>
      <div style={{background:'var(--bg-glass-2)',border:'1px solid var(--border)',borderRadius:12,padding:'1rem',textAlign:'left',marginBottom:'1.5rem'}}>
        {[
          ['Category', <span className="badge badge-indigo">{result.category}</span>],
          ['Language', result.langName],
          ['Location', `${result.ward}, ${result.district}`],
          ['Severity', '⭐'.repeat(result.severity||4)],
          ['Confidence', <span style={{color:'var(--accent-emerald)',fontWeight:700}}>{(result.confidence*100).toFixed(0)}%</span>],
          ['Original', <span className="text-sm">{result.original}</span>],
        ].map(([l,v])=>(
          <div key={l} className="flex items-center gap-2" style={{padding:'0.35rem 0',borderBottom:'1px solid var(--border)'}}>
            <span className="text-xs text-muted" style={{width:80,flexShrink:0}}>{l}</span>
            <span>{v}</span>
          </div>
        ))}
      </div>
      <div className="text-sm text-muted mb-3">📍 Mapped to <strong>{result.ward}</strong> · Clustered into hotspot · You'll be notified when actioned</div>
      <div className="flex gap-2" style={{justifyContent:'center'}}>
        <button className="btn btn-primary" onClick={()=>setMode('home')}>Submit Another</button>
        <button className="btn btn-ghost" onClick={()=>setActiveTab('track')}>Track This Request</button>
      </div>
    </motion.div>
  )
}

function TrackResult({ req }) {
  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="card mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-emerald" style={{color:'var(--accent-emerald)',fontSize:'1.1rem'}}>{req.refId}</span>
          <span className="badge badge-emerald">● Clustered</span>
        </div>
        <span className="badge badge-indigo">{req.category}</span>
      </div>
      <div className="text-sm mb-2">{req.translated||req.original}</div>
      {req.translated && req.translated!==req.original && (
        <div className="text-xs text-muted mb-2" style={{fontStyle:'italic'}}>{req.original}</div>
      )}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem',marginBottom:'0.75rem'}}>
        {[['Language',req.langName],['Ward',req.ward],['Channel',req.channel],['Confidence',(req.confidence*100||95).toFixed(0)+'%']].map(([l,v])=>(
          <div key={l} style={{padding:'0.4rem 0.75rem',background:'var(--bg-glass-2)',borderRadius:6}}>
            <div className="text-xs text-muted">{l}</div>
            <div className="text-sm font-semibold">{v}</div>
          </div>
        ))}
      </div>
      <div style={{padding:'0.75rem',background:'rgba(16,185,129,0.06)',border:'1px solid rgba(16,185,129,0.2)',borderRadius:8}}>
        <div className="text-xs text-muted mb-1">📍 Current Status</div>
        <div className="text-sm font-semibold" style={{color:'var(--accent-emerald)'}}>
          ✅ Clustered into demand hotspot · Under policymaker review
        </div>
        <div className="text-xs text-muted mt-1">Submitted {new Date(req.timestamp).toLocaleString()}</div>
      </div>
    </motion.div>
  )
}

function sleep(ms) { return new Promise(r=>setTimeout(r,ms)) }
