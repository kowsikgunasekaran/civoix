// Budget lines — [SYNTHETIC DATA — DEMO]
export const BUDGET_LINES = [
  { id:'BL-001', sector:'Drainage & Stormwater', district:'Chennai',  allocated:45, spent:31, headroom:14, vintage:'FY2026-27', color:'#6366f1' },
  { id:'BL-002', sector:'National Health Mission', district:'Vellore', allocated:28, spent:17, headroom:11, vintage:'FY2026-27', color:'#10b981' },
  { id:'BL-003', sector:'PMGSY Roads',             district:'Mumbai',  allocated:80, spent:58, headroom:22, vintage:'FY2026-27', color:'#f59e0b' },
  { id:'BL-004', sector:'CMWSSB Water Supply',     district:'Chennai', allocated:40, spent:24, headroom:16, vintage:'FY2026-27', color:'#06b6d4' },
  { id:'BL-005', sector:'DDUGJY Electricity',      district:'Delhi',   allocated:35, spent:17, headroom:18, vintage:'FY2026-27', color:'#8b5cf6' },
  { id:'BL-006', sector:'Samagra Shiksha',         district:'Vellore', allocated:20, spent:12, headroom:8,  vintage:'FY2026-27', color:'#3b82f6' },
]

export const DEFAULT_WEIGHTS = {
  demandIntensity:    { value:0.7, label:'Demand Intensity',    color:'#6366f1', desc:'How loudly citizens are asking' },
  infraGapIndex:      { value:0.8, label:'Infra-Gap Index',     color:'#10b981', desc:'Objective infrastructure deficiency' },
  equityWeight:       { value:0.9, label:'Equity Weight',       color:'#f59e0b', desc:'Boost for under-served populations' },
  budgetFeasibility:  { value:0.6, label:'Budget Feasibility',  color:'#06b6d4', desc:'Fit within available budget line' },
  impactPotential:    { value:0.7, label:'Impact Potential',    color:'#8b5cf6', desc:'Beneficiaries per unit cost' },
  redundancyPenalty:  { value:0.5, label:'Redundancy Penalty',  color:'#f43f5e', desc:'Penalise overlapping funded projects' },
}

export const PORTFOLIO_STATS = {
  totalRequests: 12847,
  activeClusters: 38,
  projectsInFlight: 14,
  projectsCompleted: 9,
  budgetUtilised: 68,
  avgImpactScore: 0.79,
  sentimentImprovement: 0.34,
}
