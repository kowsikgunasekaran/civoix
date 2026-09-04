import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ANOMALY_CLUSTERS, INTEGRITY_STATS } from '../data/integrityData';

export default function IntegrityEngine() {
    const [expandedRow, setExpandedRow] = useState(null);

    const anomalies = (ANOMALY_CLUSTERS && ANOMALY_CLUSTERS.length > 0) ? ANOMALY_CLUSTERS : [
        { id: 'a1', type: 'Sybil Attack', ward: 'W-14', requestCount: 342, similarity: 98, status: 'Blocked', timespan: '2h', devices: 4 },
        { id: 'a2', type: 'Velocity Spike', ward: 'W-02', requestCount: 150, similarity: 65, status: 'Investigating', timespan: '15m', devices: 120 },
        { id: 'a3', type: 'Template Spam', ward: 'W-09', requestCount: 89, similarity: 100, status: 'Flagged', timespan: '5h', devices: 89 }
    ];

    const rawStats = INTEGRITY_STATS || {
        totalScanned: 1200000, quarantined: 42500, falsePositiveRate: 0.002, flagged: 3
    };
    const stats = {
        scanned: rawStats.totalScanned.toLocaleString('en-IN'),
        blocked: rawStats.quarantined.toLocaleString('en-IN'),
        confidence: `${((1 - rawStats.falsePositiveRate) * 100).toFixed(1)}%`,
        activeThreats: anomalies.filter(a => a.status !== 'Cleared').length
    };

    const timelineData = Array.from({length: 24}, (_, i) => ({
        hour: `${i}h`,
        score: 100 - (Math.random() * 5) - (i === 10 || i === 15 ? 30 : 0) // simulate dips
    }));

    return (
        <div>
            <div className="page-header">
                <h1>Integrity Engine</h1>
                <div className="flex gap-2">
                    <span className="badge badge-rose">Defense Active</span>
                </div>
            </div>
            <div className="page-body">
                {/* 1. 4 KPIs */}
                <div className="grid-4 gap-4" style={{ marginBottom: '2rem' }}>
                    <div className="card" style={{ borderTop: '3px solid var(--accent-indigo)' }}>
                        <div className="text-sm text-muted">Requests Scanned</div>
                        <div className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--accent-indigo)' }}>{stats.scanned}</div>
                    </div>
                    <div className="card" style={{ borderTop: '3px solid var(--accent-rose)' }}>
                        <div className="text-sm text-muted">Anomalies Blocked</div>
                        <div className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--accent-rose)' }}>{stats.blocked}</div>
                    </div>
                    <div className="card" style={{ borderTop: '3px solid var(--accent-emerald)' }}>
                        <div className="text-sm text-muted">Model Confidence</div>
                        <div className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--accent-emerald)' }}>{stats.confidence}</div>
                    </div>
                    <div className="card" style={{ borderTop: '3px solid var(--accent-amber)' }}>
                        <div className="text-sm text-muted">Active Threats</div>
                        <div className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--accent-amber)' }}>{stats.activeThreats}</div>
                    </div>
                </div>

                {/* 2. Detection Patterns */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2 className="font-bold" style={{ marginBottom: '1rem' }}>Detection Patterns</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                        <div className="card-sm flex flex-col gap-2" style={{ flex: '1 1 200px' }}>
                            <span style={{ fontSize: '1.5rem' }}>🤖</span>
                            <span className="font-bold" style={{ color: 'var(--accent-rose)' }}>Sybil Patterns</span>
                            <span className="text-xs text-muted">Identifies single actors using multiple identities.</span>
                        </div>
                        <div className="card-sm flex flex-col gap-2" style={{ flex: '1 1 200px' }}>
                            <span style={{ fontSize: '1.5rem' }}>⚡</span>
                            <span className="font-bold" style={{ color: 'var(--accent-amber)' }}>Velocity Spikes</span>
                            <span className="text-xs text-muted">Sudden unnatural bursts in request volume.</span>
                        </div>
                        <div className="card-sm flex flex-col gap-2" style={{ flex: '1 1 200px' }}>
                            <span style={{ fontSize: '1.5rem' }}>📝</span>
                            <span className="font-bold" style={{ color: 'var(--accent-indigo)' }}>Template Spam</span>
                            <span className="text-xs text-muted">High string similarity across different requests.</span>
                        </div>
                        <div className="card-sm flex flex-col gap-2" style={{ flex: '1 1 200px' }}>
                            <span style={{ fontSize: '1.5rem' }}>📍</span>
                            <span className="font-bold" style={{ color: 'var(--accent-cyan)' }}>Geo-Spoofing</span>
                            <span className="text-xs text-muted">Mismatched network and reported locations.</span>
                        </div>
                    </div>
                </div>

                {/* 3. Suspicious Clusters */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2 className="font-bold" style={{ marginBottom: '1rem' }}>Suspicious Clusters</h2>
                    <table className="data-table">
                        <thead><tr><th>Type</th><th>Ward</th><th>Requests</th><th>Risk Level</th><th>Similarity</th><th>Status</th></tr></thead>
                        <tbody>
                            {anomalies.map(a => (
                                <React.Fragment key={a.id}>
                                    <tr onClick={() => setExpandedRow(expandedRow === a.id ? null : a.id)} style={{ cursor: 'pointer' }}>
                                        <td className="font-semibold">{a.type}</td>
                                        <td>{a.ward}</td>
                                        <td className="font-mono">{a.requestCount}</td>
                                        <td>
                                            <div style={{ width: '60px', height: '6px', background: 'var(--bg-surface)', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div style={{ width: `${Math.min(a.requestCount / 4, 100)}%`, height: '100%', background: a.requestCount > 100 ? 'var(--accent-rose)' : 'var(--accent-amber)' }}></div>
                                            </div>
                                        </td>
                                        <td className="font-mono">{Math.round((a.templateSimilarity ?? a.similarity / 100 ?? 0) * 100)}%</td>
                                        <td><span className={`badge ${a.status === 'Quarantined' || a.status === 'Blocked' ? 'badge-rose' : (a.status === 'Investigating' ? 'badge-amber' : 'badge-muted')}`}>{a.status}</span></td>
                                    </tr>
                                    <AnimatePresence>
                                        {expandedRow === a.id && (
                                            <tr>
                                                <td colSpan="6" style={{ padding: 0 }}>
                                                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                                                        <div className="card-sm" style={{ margin: '0.5rem', background: 'var(--bg-surface)', borderLeft: '3px solid var(--accent-rose)' }}>
                                                            <div className="flex justify-between items-center">
                                                                <div className="flex gap-4">
                                                                    <div><span className="text-xs text-muted">Timespan:</span> <span className="font-bold">{a.timespan ?? `${a.timespanMinutes}m`}</span></div>
                                                                    <div><span className="text-xs text-muted">Unique Devices:</span> <span className="font-bold">{a.devices ?? a.deviceCount}</span></div>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <button className="btn btn-sm btn-ghost">Dismiss</button>
                                                                    <button className="btn btn-sm btn-primary" style={{ background: 'var(--accent-rose)', color: '#fff' }}>Block IPs</button>
                                                                </div>
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

                {/* 4. Integrity Score Timeline */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2 className="font-bold" style={{ marginBottom: '1rem' }}>System Integrity Timeline (24h)</h2>
                    <div style={{ height: 220, width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={timelineData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="hour" stroke="var(--text-muted)" />
                                <YAxis domain={[0, 100]} stroke="var(--text-muted)" />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }} />
                                <Line type="monotone" dataKey="score" stroke="var(--accent-indigo)" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 5. Bottom warning banner */}
                <div className="card flex items-center gap-3" style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--accent-amber)' }}>
                    <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                    <div>
                        <h3 className="font-bold" style={{ color: 'var(--accent-amber)' }}>Elevated Bot Activity Detected</h3>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Automated mitigation rules are active. Review flagged clusters for manual IP blocking.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
