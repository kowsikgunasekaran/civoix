// Synthetic project lifecycle data — [SYNTHETIC DATA — DEMO]
export const LIFECYCLE_STATES = ['Sanctioned','Tendered','In-Progress','Completed','Verified']

export const PROJECTS = [
  {
    id:'PRJ-001', clusterId:'CLU-001', name:'Mylapore West Drainage Rehabilitation',
    category:'Drainage', ward:'Mylapore West', district:'Chennai',
    state:'Verified', estCost:12, actualCost:11.8, currency:'Cr',
    sanctionDate:'2026-04-10', completionDate:'2026-07-28', targetDate:'2026-07-31',
    officer:'Radhika Subramaniam', beneficiaries:8200,
    impactScore:0.86,
    impactFactors:{ demandSatisfaction:0.91, sentimentDelta:0.82, utilizationRate:0.88, costEfficiency:0.84, timeOverrunPenalty:0.05 },
    beforeRequests:342, afterRequests:12,
    sentimentBefore:0.22, sentimentAfter:0.78,
    evidence:['drain_photo_1.jpg','drain_photo_2.jpg'],
    timeline:[
      { state:'Sanctioned',  date:'2026-04-10', note:'Policymaker approved via Civoix cockpit' },
      { state:'Tendered',    date:'2026-04-25', note:'Tender issued to 3 contractors' },
      { state:'In-Progress', date:'2026-05-12', note:'Excavation started, Block A complete' },
      { state:'Completed',   date:'2026-07-28', note:'All 4 blocks complete; drain flow restored' },
      { state:'Verified',    date:'2026-08-05', note:'Field officer verified; citizen confirmations received' },
    ],
    delayDays:0,
  },
  {
    id:'PRJ-002', clusterId:'CLU-002', name:'Vellore North PHC Strengthening',
    category:'Health', ward:'Vellore North', district:'Vellore',
    state:'In-Progress', estCost:8, actualCost:null, currency:'Cr',
    sanctionDate:'2026-05-20', completionDate:null, targetDate:'2026-09-30',
    officer:'Dr. Sundar Rajan', beneficiaries:6200,
    impactScore:null,
    timeline:[
      { state:'Sanctioned',  date:'2026-05-20', note:'NHM grant approved' },
      { state:'Tendered',    date:'2026-06-05', note:'Recruitment + equipment tender issued' },
      { state:'In-Progress', date:'2026-06-28', note:'2 doctors posted; equipment arriving' },
    ],
    delayDays:0,
  },
  {
    id:'PRJ-003', clusterId:'CLU-004', name:'Ambattur Zone 2 Water Supply Upgrade',
    category:'Water', ward:'Ambattur Zone 2', district:'Chennai',
    state:'Tendered', estCost:6, actualCost:null, currency:'Cr',
    sanctionDate:'2026-06-01', completionDate:null, targetDate:'2026-11-30',
    officer:'Karthik Annamalai', beneficiaries:5100,
    impactScore:null,
    timeline:[
      { state:'Sanctioned', date:'2026-06-01', note:'CMWSSB budget allocated' },
      { state:'Tendered',   date:'2026-06-22', note:'Civil works tender floated' },
    ],
    delayDays:0,
  },
  {
    id:'PRJ-004', clusterId:'CLU-003', name:'Dharavi Block C Road Resurfacing (Phase 1)',
    category:'Roads', ward:'Dharavi Block C', district:'Mumbai',
    state:'Sanctioned', estCost:22, actualCost:null, currency:'Cr',
    sanctionDate:'2026-08-15', completionDate:null, targetDate:'2027-03-31',
    officer:'Pending assignment', beneficiaries:14000,
    impactScore:null,
    timeline:[
      { state:'Sanctioned', date:'2026-08-15', note:'Phase 1 split approved (₹22Cr of ₹28Cr ask)' },
    ],
    delayDays:0,
  },
]
