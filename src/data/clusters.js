// Synthetic demand clusters — [SYNTHETIC DATA — DEMO]
export const CLUSTERS = [
  {
    id: 'CLU-001', category:'Drainage', ward:'Mylapore West', district:'Chennai',
    centroid:{lat:13.0414,lng:80.2678}, requestCount:342, demandIntensity:0.87,
    severityAvg:4.4, recency:2, affectedPop:8400,
    score:0.89, rank:1,
    factors:{ demandIntensity:0.87, infraGapIndex:0.79, equityWeight:0.72, budgetFeasibility:0.91, impactPotential:0.84, redundancyPenalty:0.05 },
    rationale:'342 verified requests over 6 weeks, infra-gap index 0.79 (high), serving a high-vulnerability ward with 8,400 affected residents. Fits the ₹18Cr drainage line with ₹14Cr headroom. Est. 8,000 beneficiaries. No overlapping funded project.',
    budgetLine:'Drainage & Stormwater', estCost:12, headroom:14, unit:'Cr',
    constituents:['REQ-001','REQ-008'],
    color:'#6366f1',
  },
  {
    id: 'CLU-002', category:'Health', ward:'Vellore North', district:'Vellore',
    centroid:{lat:12.9183,lng:79.1333}, requestCount:287, demandIntensity:0.83,
    severityAvg:4.8, recency:3, affectedPop:6200,
    score:0.84, rank:2,
    factors:{ demandIntensity:0.83, infraGapIndex:0.85, equityWeight:0.88, budgetFeasibility:0.78, impactPotential:0.91, redundancyPenalty:0.02 },
    rationale:'287 requests over 4 weeks, infra-gap index 0.85 (critical), high-equity area (vulnerability score 88th percentile). PHC serves 3 villages with no doctor. Fits NHM block grant. Est. 6,200 beneficiaries.',
    budgetLine:'National Health Mission', estCost:8, headroom:11, unit:'Cr',
    constituents:['REQ-004','REQ-007'],
    color:'#10b981',
  },
  {
    id: 'CLU-003', category:'Roads', ward:'Dharavi Block C', district:'Mumbai',
    centroid:{lat:19.0399,lng:72.8555}, requestCount:412, demandIntensity:0.91,
    severityAvg:4.2, recency:1, affectedPop:14000,
    score:0.82, rank:3,
    factors:{ demandIntensity:0.91, infraGapIndex:0.68, equityWeight:0.94, budgetFeasibility:0.65, impactPotential:0.77, redundancyPenalty:0.08 },
    rationale:'412 requests in 2 weeks (high velocity), infra-gap 0.68, highest equity score (0.94) — densely populated vulnerable area. Budget feasibility lower (est. ₹28Cr vs ₹22Cr headroom). Flag for split-phase approval.',
    budgetLine:'PMGSY Roads', estCost:28, headroom:22, unit:'Cr',
    constituents:['REQ-003','REQ-006'],
    color:'#f59e0b',
  },
  {
    id: 'CLU-004', category:'Water', ward:'Ambattur Zone 2', district:'Chennai',
    centroid:{lat:13.1137,lng:80.1552}, requestCount:198, demandIntensity:0.74,
    severityAvg:4.6, recency:4, affectedPop:5100,
    score:0.79, rank:4,
    factors:{ demandIntensity:0.74, infraGapIndex:0.82, equityWeight:0.66, budgetFeasibility:0.88, impactPotential:0.80, redundancyPenalty:0.03 },
    rationale:'198 requests, infra-gap 0.82, 3-day water outage documented. CMWSSB budget line with high headroom. Est. 5,100 beneficiaries. Quick win candidate.',
    budgetLine:'CMWSSB Water Supply', estCost:6, headroom:16, unit:'Cr',
    constituents:['REQ-005','REQ-009'],
    color:'#06b6d4',
  },
  {
    id: 'CLU-005', category:'Electricity', ward:'Karol Bagh Sector 3', district:'Delhi',
    centroid:{lat:28.6517,lng:77.1905}, requestCount:156, demandIntensity:0.61,
    severityAvg:3.2, recency:6, affectedPop:3200,
    score:0.62, rank:5,
    factors:{ demandIntensity:0.61, infraGapIndex:0.55, equityWeight:0.48, budgetFeasibility:0.92, impactPotential:0.58, redundancyPenalty:0.15 },
    rationale:'156 requests, infra-gap 0.55 (moderate). High redundancy penalty — 2 similar streetlight projects approved in adjacent wards. Equity weight low (relatively affluent area).',
    budgetLine:'DDUGJY Electricity', estCost:4, headroom:18, unit:'Cr',
    constituents:['REQ-002','REQ-010'],
    color:'#8b5cf6',
  },
]

export const HOTSPOT_COLORS = {
  Drainage:'#6366f1', Health:'#10b981', Roads:'#f59e0b',
  Water:'#06b6d4', Electricity:'#8b5cf6', Sanitation:'#f43f5e',
  Education:'#3b82f6', 'Public Transport':'#ec4899'
}
