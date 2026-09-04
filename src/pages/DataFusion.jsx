import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { WARD_DEMOGRAPHICS, INFRA_GAP_INDICES, CANDIDATE_PROJECTS_FUSED, DATASET_VERSIONS } from '../data/fusionData';

export default function DataFusion() {
    const [expandedRow, setExpandedRow] = useState(null);
    const datasets = DATASET_VERSIONS || [
        { id: 'v1', name: 'Citizen Requests', rows: '1.2M', quality: 'A' },
        { id: 'v2', name: 'Sensor Data', rows: '800K', quality: 'B+' },
        { id: 'v3', name: 'Budget Alloc', rows: '5K', quality: 'A+' },
        { id: 'v4', name: 'Demographics', rows: '12K', quality: 'A' }
    ];
    const projects = CANDIDATE_PROJECTS_FUSED || [
        { id: 1, name: 'Water Pipe Extension', ward: 'W-01', score: 85, budget: '1.2Cr' },
        { id: 2, name: 'Solar Streetlights', ward: 'W-04', score: 92, budget: '0.8Cr' }
    ];
    const gaps = INFRA_GAP_INDICES || [
        { ward: 'W-01', water: 40, power: 20, road: 15 },
        { ward: 'W-02', water: 10, power: 50, road: 30 }
    ];

    return (
        <div>
            <div className="page-header">
                <h1>Data Fusion Module</h1>
                <div className="flex gap-2">
                    <span className="badge badge-indigo">Engine Active</span>
                    <span className="badge badge-emerald">Real-time</span>
                </div>
            </div>
            <div className="page-body">
                {/* 1. Dataset architecture */}
                <div className="grid-4 gap-4" style={{ marginBottom: '2rem' }}>
                    {datasets.map(d => (
                        <div key={d.id} className="card flex flex-col items-center gap-2">
                            <div className="font-bold" style={{ color: 'var(--accent-indigo)' }}>{d.name}</div>
                            <div className="text-sm text-muted">{d.rows} rows | Quality: {d.quality}</div>
                        </div>
                    ))}
                </div>
                
                <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                    <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ color: 'var(--accent-emerald)', margin: '0 auto', fontSize: '2rem' }}>
                        ↓
                    </motion.div>
                </div>
                
                <div className="card" style={{ textAlign: 'center', marginBottom: '2rem', border: '1px solid var(--accent-emerald)' }}>
                    <h2 className="font-bold" style={{ color: 'var(--accent-emerald)' }}>Candidate Project Fused Output</h2>
                </div>

                {/* 2. Dataset Versions table */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2 className="font-bold" style={{ marginBottom: '1rem' }}>Dataset Versions</h2>
                    <table className="data-table">
                        <thead><tr><th>ID</th><th>Name</th><th>Rows</th><th>Quality</th></tr></thead>
                        <tbody>
                            {datasets.map(d => (
                                <tr key={d.id}><td>{d.id}</td><td>{d.name}</td><td>{d.rows}</td><td>{d.quality}</td></tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 3. Fused Candidate Projects */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2 className="font-bold" style={{ marginBottom: '1rem' }}>Fused Candidate Projects</h2>
                    <table className="data-table">
                        <thead><tr><th>ID</th><th>Name</th><th>Ward</th><th>Score</th><th>Budget</th></tr></thead>
                        <tbody>
                            {projects.map(p => (
                                <React.Fragment key={p.id}>
                                    <tr onClick={() => setExpandedRow(expandedRow === p.id ? null : p.id)} style={{ cursor: 'pointer' }}>
                                        <td>{p.id}</td><td>{p.name}</td><td>{p.ward}</td>
                                        <td><span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>{p.score}</span></td>
                                        <td>{p.budget}</td>
                                    </tr>
                                    <AnimatePresence>
                                        {expandedRow === p.id && (
                                            <tr>
                                                <td colSpan="5" style={{ padding: 0 }}>
                                                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                                                        <div className="card-sm" style={{ margin: '0.5rem', background: 'var(--bg-surface)' }}>
                                                            <div className="grid-4 gap-2">
                                                                <div><div className="text-xs text-muted">Population</div><div className="font-bold">45,000</div></div>
                                                                <div><div className="text-xs text-muted">Density</div><div className="font-bold">High</div></div>
                                                                <div><div className="text-xs text-muted">Vulnerability</div><div className="font-bold" style={{ color: 'var(--accent-rose)' }}>Severe</div></div>
                                                                <div><div className="text-xs text-muted">Impact Est</div><div className="font-bold" style={{ color: 'var(--accent-emerald)' }}>+24%</div></div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                </td>
                                            </tr>
                                        )}
                                    </AnimatePresence>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 4. Infra-Gap Heatmap */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2 className="font-bold" style={{ marginBottom: '1rem' }}>Infra-Gap Index by Ward</h2>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={gaps} layout="vertical">
                                <CartesianGrid stroke="var(--border)" />
                                <XAxis type="number" stroke="var(--text-muted)" />
                                <YAxis dataKey="ward" type="category" stroke="var(--text-muted)" />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }} />
                                <Legend />
                                <Bar dataKey="water" stackId="a" fill="var(--accent-cyan)" />
                                <Bar dataKey="power" stackId="a" fill="var(--accent-amber)" />
                                <Bar dataKey="road" stackId="a" fill="var(--accent-indigo)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 5. Bottom info card */}
                <div className="card" style={{ background: 'var(--bg-glass-2)', border: '1px solid var(--accent-indigo)' }}>
                    <div className="flex gap-4 items-center">
                        <span style={{ fontSize: '2rem' }}>ℹ️</span>
                        <div>
                            <h3 className="font-bold" style={{ color: 'var(--accent-indigo)' }}>Fusion Engine Status</h3>
                            <p className="text-sm text-muted">All pipelines are operating at normal capacity. Data synthesized from 4 major civic databases.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
