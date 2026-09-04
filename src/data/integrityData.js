export const ANOMALY_CLUSTERS = [
  { id: 'ANOM-01', type: 'BURST_VELOCITY', patternDesc: '745 requests received in 4 minutes', requestCount: 745, timespanMinutes: 4, deviceCount: 8, templateSimilarity: 0.98, riskScore: 0.95, status: 'Quarantined', ward: 'Andheri East', category: 'Roads', detectedAt: '2026-09-03T10:14:00Z' },
  { id: 'ANOM-02', type: 'TEMPLATE_IDENTICAL', patternDesc: 'Exact text match across 210 submissions', requestCount: 210, timespanMinutes: 120, deviceCount: 45, templateSimilarity: 1.0, riskScore: 0.88, status: 'Quarantined', ward: 'T Nagar', category: 'Water', detectedAt: '2026-09-03T14:22:00Z' },
  { id: 'ANOM-03', type: 'DEVICE_ANOMALY', patternDesc: '180 requests from 3 device IPs', requestCount: 180, timespanMinutes: 45, deviceCount: 3, templateSimilarity: 0.75, riskScore: 0.92, status: 'Quarantined', ward: 'Bandra West', category: 'Parks', detectedAt: '2026-09-02T09:45:00Z' },
  { id: 'ANOM-04', type: 'IMPLAUSIBLE_GEO', patternDesc: 'Signatures from Moscow IPs for local Chennai ward', requestCount: 520, timespanMinutes: 30, deviceCount: 120, templateSimilarity: 0.85, riskScore: 0.99, status: 'Quarantined', ward: 'Mylapore', category: 'Health', detectedAt: '2026-09-01T23:10:00Z' },
  { id: 'ANOM-05', type: 'COORDINATED', patternDesc: 'Temporal coordination with social media blast', requestCount: 150, timespanMinutes: 15, deviceCount: 140, templateSimilarity: 0.60, riskScore: 0.45, status: 'Cleared', ward: 'Whitefield', category: 'Transport', detectedAt: '2026-09-04T08:05:00Z' },
];

export const INTEGRITY_STATS = {
  totalScanned: 145020,
  flagged: 3840,
  quarantined: 3690,
  cleared: 150,
  falsePositiveRate: 0.039,
  genuineProtected: 141180
};
