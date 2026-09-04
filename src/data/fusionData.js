export const WARD_DEMOGRAPHICS = [
  { ward:'Mylapore West', district:'Chennai', state:'Tamil Nadu',
    population:42000, vulnerabilityScore:0.72, literacyRate:0.78, belowPovertyLine:0.28,
    femalePopPct:0.52, scStPopPct:0.34, urbanRural:'Urban' },
  { ward:'Vellore North', district:'Vellore', state:'Tamil Nadu',
    population:31000, vulnerabilityScore:0.88, literacyRate:0.61, belowPovertyLine:0.41,
    femalePopPct:0.49, scStPopPct:0.51, urbanRural:'Semi-Urban' },
  { ward:'Dharavi Block C', district:'Mumbai', state:'Maharashtra',
    population:89000, vulnerabilityScore:0.94, literacyRate:0.58, belowPovertyLine:0.52,
    femalePopPct:0.44, scStPopPct:0.38, urbanRural:'Urban' },
  { ward:'Ambattur Zone 2', district:'Chennai', state:'Tamil Nadu',
    population:28000, vulnerabilityScore:0.66, literacyRate:0.82, belowPovertyLine:0.22,
    femalePopPct:0.51, scStPopPct:0.21, urbanRural:'Urban' },
  { ward:'Karol Bagh Sector 3', district:'Delhi', state:'Delhi',
    population:19000, vulnerabilityScore:0.48, literacyRate:0.91, belowPovertyLine:0.12,
    femalePopPct:0.47, scStPopPct:0.08, urbanRural:'Urban' },
];

export const INFRA_GAP_INDICES = [
  { ward: 'Mylapore West', sector: 'Drainage', gapIndex: 0.85, nationalAvg: 0.60, trend: 'worsening', lastUpdated: '2026-08-01' },
  { ward: 'Mylapore West', sector: 'Health', gapIndex: 0.40, nationalAvg: 0.55, trend: 'improving', lastUpdated: '2026-08-01' },
  { ward: 'Mylapore West', sector: 'Roads', gapIndex: 0.65, nationalAvg: 0.50, trend: 'stable', lastUpdated: '2026-08-01' },
  { ward: 'Mylapore West', sector: 'Water', gapIndex: 0.70, nationalAvg: 0.45, trend: 'worsening', lastUpdated: '2026-08-01' },
  
  { ward: 'Vellore North', sector: 'Drainage', gapIndex: 0.90, nationalAvg: 0.60, trend: 'worsening', lastUpdated: '2026-08-01' },
  { ward: 'Vellore North', sector: 'Health', gapIndex: 0.75, nationalAvg: 0.55, trend: 'stable', lastUpdated: '2026-08-01' },
  { ward: 'Vellore North', sector: 'Roads', gapIndex: 0.82, nationalAvg: 0.50, trend: 'improving', lastUpdated: '2026-08-01' },
  { ward: 'Vellore North', sector: 'Education', gapIndex: 0.88, nationalAvg: 0.58, trend: 'stable', lastUpdated: '2026-08-01' },
  
  { ward: 'Dharavi Block C', sector: 'Sanitation', gapIndex: 0.95, nationalAvg: 0.40, trend: 'worsening', lastUpdated: '2026-08-01' },
  { ward: 'Dharavi Block C', sector: 'Water', gapIndex: 0.92, nationalAvg: 0.45, trend: 'worsening', lastUpdated: '2026-08-01' },
  { ward: 'Dharavi Block C', sector: 'Health', gapIndex: 0.85, nationalAvg: 0.55, trend: 'stable', lastUpdated: '2026-08-01' },
  { ward: 'Dharavi Block C', sector: 'Electricity', gapIndex: 0.60, nationalAvg: 0.35, trend: 'improving', lastUpdated: '2026-08-01' },

  { ward: 'Ambattur Zone 2', sector: 'Roads', gapIndex: 0.72, nationalAvg: 0.50, trend: 'stable', lastUpdated: '2026-08-01' },
  { ward: 'Ambattur Zone 2', sector: 'Drainage', gapIndex: 0.78, nationalAvg: 0.60, trend: 'worsening', lastUpdated: '2026-08-01' },
  { ward: 'Ambattur Zone 2', sector: 'Electricity', gapIndex: 0.40, nationalAvg: 0.35, trend: 'improving', lastUpdated: '2026-08-01' },
  { ward: 'Ambattur Zone 2', sector: 'Water', gapIndex: 0.55, nationalAvg: 0.45, trend: 'stable', lastUpdated: '2026-08-01' },
  
  { ward: 'Karol Bagh Sector 3', sector: 'Drainage', gapIndex: 0.55, nationalAvg: 0.60, trend: 'improving', lastUpdated: '2026-08-01' },
  { ward: 'Karol Bagh Sector 3', sector: 'Sanitation', gapIndex: 0.45, nationalAvg: 0.40, trend: 'stable', lastUpdated: '2026-08-01' },
  { ward: 'Karol Bagh Sector 3', sector: 'Health', gapIndex: 0.38, nationalAvg: 0.55, trend: 'improving', lastUpdated: '2026-08-01' },
  { ward: 'Karol Bagh Sector 3', sector: 'Roads', gapIndex: 0.50, nationalAvg: 0.50, trend: 'stable', lastUpdated: '2026-08-01' },
];

export const CANDIDATE_PROJECTS_FUSED = [
  { id: 'FP-101', clusterId: 'C-001', category: 'Drainage', ward: 'Mylapore West', district: 'Chennai', demandIntensity: 'High', infraGapIndex: 0.85, demographic: WARD_DEMOGRAPHICS[0], budgetLine: 'Urban Flood Mgmt', budgetHeadroom: '₹14Cr', estCost: '₹3.2Cr', dataVintage: 'Q4-2025' },
  { id: 'FP-102', clusterId: 'C-005', category: 'Health', ward: 'Vellore North', district: 'Vellore', demandIntensity: 'Critical', infraGapIndex: 0.75, demographic: WARD_DEMOGRAPHICS[1], budgetLine: 'NHM Infra', budgetHeadroom: '₹5Cr', estCost: '₹1.8Cr', dataVintage: 'Q4-2025' },
  { id: 'FP-103', clusterId: 'C-012', category: 'Sanitation', ward: 'Dharavi Block C', district: 'Mumbai', demandIntensity: 'Critical', infraGapIndex: 0.95, demographic: WARD_DEMOGRAPHICS[2], budgetLine: 'SBM-U 2.0', budgetHeadroom: '₹85Cr', estCost: '₹12.5Cr', dataVintage: 'Q4-2025' },
  { id: 'FP-104', clusterId: 'C-008', category: 'Roads', ward: 'Ambattur Zone 2', district: 'Chennai', demandIntensity: 'Medium', infraGapIndex: 0.72, demographic: WARD_DEMOGRAPHICS[3], budgetLine: 'Smart City Roads', budgetHeadroom: '₹22Cr', estCost: '₹4.5Cr', dataVintage: 'Q4-2025' },
  { id: 'FP-105', clusterId: 'C-021', category: 'Drainage', ward: 'Karol Bagh Sector 3', district: 'Delhi', demandIntensity: 'Low', infraGapIndex: 0.55, demographic: WARD_DEMOGRAPHICS[4], budgetLine: 'MCD Local Fund', budgetHeadroom: '₹18Cr', estCost: '₹2.1Cr', dataVintage: 'Q4-2025' },
];

export const DATASET_VERSIONS = [
  { name:'Census 2021', type:'Demographic', vintage:'2021', status:'Active', records:28000 },
  { name:'NITI Aayog Infra Index', type:'Infrastructure Gap', vintage:'Q4-2025', status:'Active', records:5400 },
  { name:'Union Budget FY2026-27', type:'Budget/Investment', vintage:'Feb-2026', status:'Active', records:892 },
  { name:'Administrative Boundaries', type:'Geo-Boundary', vintage:'2023', status:'Active', records:7234 },
];
