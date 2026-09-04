import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProjectStore } from '../store/projectStore';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, CartesianGrid, ReferenceLine } from 'recharts';

export default function ImpactDashboard() {
    const projectsData = useProjectStore ? useProjectStore(state => state.projects) : [];
    const activeProjects = (projectsData || []).filter(p => p && p.impactScore !== null);
    const fallbackProjects = [
        { id: 'p1', name: 'Smart Meters', impactScore: 88, beforeRequests: 120, afterRequests: 20, sentimentBefore: 40, sentimentAfter: 85, impactFactors: [{label: 'Cost', val: 90}, {label: 'Efficiency', val: 80}] },
        { id: 'p2', name: 'Park Lighting', impactScore: 75, beforeRequests: 50, afterRequests: 5, sentimentBefore: 60, sentimentAfter: 90, impactFactors: [{label: 'Safety', val: 95}, {label: 'Usage', val: 85}] }
    ];
    const displayProjects = activeProjects.length > 0 ? activeProjects : fallbackProjects;
    const [selectedId, setSelectedId] = useState(displayProjects[0]?.id);

    const selected = displayProjects.find(p => p.id === selectedId) || displayProjects[0];

    // Build factor array from either shape: object {key:val} or array [{label,val}]
    const factorArray = selected?.impactFactors
      ? Array.isArray(selected.impactFactors)
        ? selected.impactFactors
        : Object.entries(selected.impactFactors).map(([k, v]) => ({
            label: k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()),
            val: Math.round(v * 100)
          }))
      : []

    const radarData = factorArray.length > 0
      ? factorArray.map(f => ({ dimension: f.label, score: f.val }))
      : [
          { dimension: 'Demand Satisfaction', score: 85 },
          { dimension: 'Sentiment Delta',     score: 70 },
          { dimension: 'Utilization Rate',    score: 90 },
          { dimension: 'Cost Efficiency',     score: 65 },
          { dimension: 'Time Performance',    score: 80 },
        ]

    const longitudinalData = Array.from({length: 12}, (_, i) => ({
        week: `W${i+1}`,
        impact: 40 + (i * 4) + Math.random() * 10
    }));

    const learningSignals = [
        { project: 'Smart Meters', impact: '88%', signal: 'High cost reduction', status: 'Verified' },
        { project: 'Park Lighting', impact: '75%', signal: 'Increased night usage', status: 'Active' },
        { project: 'Road Repair', impact: '60%', signal: 'Traffic flow improved', status: 'Pending' },
        { project: 'Water Pipes', impact: '92%', signal: 'Leakage dropped 40%', status: 'Verified' }
    ];

    return (
        <div>
            <div className="page-header">
                <h1>Impact Dashboard</h1>
                <span className="badge badge-emerald">Module 7 Active</span>
            </div>
            <div className="page-body">
                {/* 1. DPI Summary */}
                <div className="card flex justify-between items-center" style={{ border: '1px solid var(--accent-emerald)', marginBottom: '2rem' }}>
                    <div>
                        <div className="text-sm text-muted">Beneficiaries</div>
                        <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-emerald)' }}>23,400</div>
                    </div>
                    <div>
                        <div className="text-sm text-muted">Investment</div>
                        <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-emerald)' }}>₹46Cr</div>
                    </div>
                    <div>
                        <div className="text-sm text-muted">Cost / Beneficiary</div>
                        <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-emerald)' }}>₹1,966</div>
                    </div>
                    <div>
                        <div className="text-sm text-muted">Overall Impact</div>
                        <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-emerald)' }}>86%</div>
                    </div>
                </div>

                {/* 2. Tabs */}
                <div className="flex gap-2" style={{ marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    {displayProjects.map(p => (
                        <button key={p.id} className={p.id === selectedId ? 'btn btn-primary' : 'btn btn-ghost'} onClick={() => setSelectedId(p.id)}>
                            {p.name}
                        </button>
                    ))}
                </div>

                {/* 3. Selected Project View */}
                {selected && (
                    <div className="card" style={{ marginBottom: '2rem' }}>
                        <h2 className="font-bold" style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>{selected.name} Impact Analysis</h2>
                        <div className="grid-2 gap-4" style={{ marginBottom: '2rem' }}>
                            <div className="card-sm" style={{ borderLeft: '3px solid var(--accent-rose)', background: 'var(--bg-surface)' }}>
                                <h3 className="font-bold" style={{ marginBottom: '1rem' }}>Before Intervention</h3>
                                <div className="flex justify-between items-center text-sm" style={{ marginBottom: '0.5rem' }}>
                                    <span>Requests:</span>
                                    <span className="font-mono">{selected.beforeRequests}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span>Sentiment:</span>
                                    <span className="font-mono">{selected.sentimentBefore}%</span>
                                </div>
                            </div>
                            <div className="card-sm" style={{ borderLeft: '3px solid var(--accent-emerald)', background: 'var(--bg-surface)' }}>
                                <h3 className="font-bold" style={{ marginBottom: '1rem' }}>After Intervention</h3>
                                <div className="flex justify-between items-center text-sm" style={{ marginBottom: '0.5rem' }}>
                                    <span>Requests:</span>
                                    <span className="font-mono">{selected.afterRequests}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span>Sentiment:</span>
                                    <span className="font-mono">{selected.sentimentAfter}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid-2 gap-4" style={{ marginBottom: '2rem' }}>
                            <div>
                                <h3 className="font-semibold text-sm" style={{ marginBottom: '1rem' }}>Impact Factors</h3>
                                {factorArray.length > 0 ? factorArray.map((f, i) => (
                                    <div key={i} className="factor-row">
                                        <div className="factor-label">{f.label}</div>
                                        <div className="factor-track">
                                            <div className="factor-fill" style={{ width: `${f.val}%`, background: 'var(--accent-emerald)' }}></div>
                                        </div>
                                        <div className="factor-val">{f.val}%</div>
                                    </div>
                                )) : <div className="text-muted text-sm">No impact factor data yet.</div>}

                                <div style={{ height: 220, marginTop: '2rem' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                            <PolarGrid stroke="var(--border)" />
                                            <PolarAngleAxis dataKey="dimension" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                                            <Radar name="Score" dataKey="score" stroke="var(--accent-indigo)" fill="var(--accent-indigo)" fillOpacity={0.5} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm" style={{ marginBottom: '1rem' }}>Longitudinal Impact</h3>
                                <div style={{ height: 200, width: '100%' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={longitudinalData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                            <XAxis dataKey="week" stroke="var(--text-muted)" />
                                            <YAxis stroke="var(--text-muted)" />
                                            <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }} />
                                            <ReferenceLine x="W8" stroke="var(--accent-emerald)" label={{ position: 'top', value: 'Project Completed', fill: 'var(--accent-emerald)', fontSize: 12 }} />
                                            <Line type="monotone" dataKey="impact" stroke="var(--accent-emerald)" strokeWidth={2} dot={{ fill: 'var(--accent-emerald)' }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. Portfolio Heatmap & 5. Learning Signal */}
                <div className="grid-2 gap-4" style={{ marginBottom: '2rem' }}>
                    <div className="card">
                        <h3 className="font-bold" style={{ marginBottom: '1rem' }}>Portfolio Heatmap</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.25rem' }}>
                            {Array.from({length: 16}).map((_, i) => {
                                const intensity = 0.2 + (Math.random() * 0.8);
                                return (
                                    <div key={i} style={{ aspectRatio: '1/1', background: `rgba(16, 185, 129, ${intensity})`, borderRadius: '4px' }}></div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="card">
                        <h3 className="font-bold" style={{ marginBottom: '1rem' }}>Learning Signals</h3>
                        <table className="data-table">
                            <thead><tr><th>Project</th><th>Impact</th><th>Signal</th><th>Status</th></tr></thead>
                            <tbody>
                                {learningSignals.map((ls, idx) => (
                                    <tr key={idx}>
                                        <td className="text-sm font-semibold">{ls.project}</td>
                                        <td className="text-sm font-mono" style={{ color: 'var(--accent-emerald)' }}>{ls.impact}</td>
                                        <td className="text-xs text-muted">{ls.signal}</td>
                                        <td><span className="badge badge-synthetic">{ls.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 6. All projects grid */}
                <div className="grid-3 gap-4">
                    {displayProjects.map(p => (
                        <div key={p.id} className="card-sm">
                            <div className="font-bold">{p.name}</div>
                            <div className="text-xs text-muted" style={{ marginTop: '0.5rem' }}>Score: <span style={{ color: 'var(--accent-emerald)' }}>{p.impactScore}</span></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
