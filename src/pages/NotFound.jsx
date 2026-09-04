import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  const nav = useNavigate()
  return (
    <div style={{
      minHeight:'100vh', background:'var(--bg-deep)',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      textAlign:'center', padding:'2rem'
    }}>
      <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:'spring',bounce:0.4}}>
        <div style={{fontSize:'6rem', marginBottom:'1rem'}}>🔍</div>
        <h1 style={{fontSize:'2.5rem', fontWeight:900, color:'var(--accent-indigo)', marginBottom:'0.5rem'}}>404</h1>
        <h2 style={{fontSize:'1.25rem', color:'var(--text-secondary)', marginBottom:'0.5rem'}}>Page not found</h2>
        <p style={{color:'var(--text-muted)', marginBottom:'2rem', maxWidth:400}}>
          This route doesn't exist in Civoix. Navigate using the sidebar or return to the landing page.
        </p>
        <div style={{display:'flex', gap:'1rem', justifyContent:'center'}}>
          <button className="btn btn-primary" onClick={() => nav('/')}>🏠 Go Home</button>
          <button className="btn btn-ghost" onClick={() => nav(-1)}>← Go Back</button>
        </div>
      </motion.div>
    </div>
  )
}
