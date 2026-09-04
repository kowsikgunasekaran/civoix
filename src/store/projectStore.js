import { create } from 'zustand'
import { PROJECTS, LIFECYCLE_STATES } from '../data/projects'

export const useProjectStore = create((set, get) => ({
  projects: [...PROJECTS],
  auditLog: [
    { id:1, actor:'Kiran Mehta (Policymaker)', action:'APPROVED', target:'PRJ-001', detail:'Approved via cockpit; score 0.89', ts:'2026-04-10T10:22:00Z' },
    { id:2, actor:'Kiran Mehta (Policymaker)', action:'WEIGHT_CHANGE', target:'equityWeight 0.7→0.9', detail:'Increased equity weight before re-rank', ts:'2026-04-10T10:18:00Z' },
    { id:3, actor:'Radhika Subramaniam (Field Officer)', action:'STATE_ADVANCE', target:'PRJ-001 → In-Progress', detail:'Excavation started', ts:'2026-05-12T08:00:00Z' },
    { id:4, actor:'Radhika Subramaniam (Field Officer)', action:'STATE_ADVANCE', target:'PRJ-001 → Completed', detail:'All 4 blocks done', ts:'2026-07-28T17:00:00Z' },
    { id:5, actor:'Kiran Mehta (Policymaker)', action:'APPROVED', target:'PRJ-002', detail:'NHM grant approved; score 0.84', ts:'2026-05-20T11:00:00Z' },
  ],

  advanceProject(id) {
    set(s => ({
      projects: s.projects.map(p => {
        if (p.id !== id) return p
        const idx = LIFECYCLE_STATES.indexOf(p.state)
        if (idx >= LIFECYCLE_STATES.length-1) return p
        const newState = LIFECYCLE_STATES[idx+1]
        return {
          ...p, state: newState,
          timeline:[...p.timeline, { state:newState, date:new Date().toISOString().slice(0,10), note:'Advanced via field officer app' }]
        }
      }),
      auditLog:[{
        id: Date.now(), actor:'Field Officer (Demo)', action:'STATE_ADVANCE',
        target:`${id} → ${LIFECYCLE_STATES[LIFECYCLE_STATES.indexOf(get().projects.find(p=>p.id===id)?.state)+1]}`,
        detail:'Manual advance in lifecycle tracker', ts:new Date().toISOString()
      }, ...s.auditLog]
    }))
  },

  approveCluster(cluster) {
    const p = {
      id:`PRJ-${String(Date.now()).slice(-4)}`,
      clusterId:cluster.id, name:`${cluster.ward} ${cluster.category} Project`,
      category:cluster.category, ward:cluster.ward, district:cluster.district,
      state:'Sanctioned', estCost:cluster.estCost, actualCost:null, currency:'Cr',
      sanctionDate:new Date().toISOString().slice(0,10), completionDate:null,
      targetDate:'2027-03-31', officer:'Pending assignment',
      beneficiaries:cluster.affectedPop, impactScore:null,
      timeline:[{ state:'Sanctioned', date:new Date().toISOString().slice(0,10), note:'Approved via policymaker cockpit' }],
      delayDays:0,
    }
    set(s => ({
      projects:[p,...s.projects],
      auditLog:[{
        id:Date.now(), actor:'Policymaker (Demo)', action:'APPROVED',
        target:p.id, detail:`Score ${cluster.score.toFixed(2)} — approved via cockpit`, ts:new Date().toISOString()
      },...s.auditLog]
    }))
    return p
  },

  addAuditEntry(entry) {
    set(s => ({ auditLog:[{...entry, id:Date.now(), ts:new Date().toISOString()},...s.auditLog] }))
  }
}))
