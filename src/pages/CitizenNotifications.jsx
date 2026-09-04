import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NOTIFICATIONS, PUBLIC_STATUS } from '../data/notificationsData';

export default function CitizenNotifications() {
    const notifs = (NOTIFICATIONS && NOTIFICATIONS.length > 0) ? NOTIFICATIONS : [
        { id: 'n1', citizenHash: '0x8F9...2A', channel: 'SMS', language: 'Hindi', eventType: 'Resolution', message: 'Your request #1029 is completed.', translation: 'आपका अनुरोध #1029 पूरा हो गया है।', timestamp: '10:42 AM', confirmed: true },
        { id: 'n2', citizenHash: '0x9A1...4B', channel: 'WhatsApp', language: 'Marathi', eventType: 'Delay', message: 'Project delayed due to rain.', translation: 'पावसामुळे प्रकल्पाला विलंब.', timestamp: '11:15 AM', confirmed: false },
        { id: 'n3', citizenHash: '0x3C2...9D', channel: 'App Push', language: 'English', eventType: 'Feedback', message: 'Please rate the new park lights.', translation: '-', timestamp: '01:30 PM', confirmed: true }
    ];

    const statusBoard = (PUBLIC_STATUS && PUBLIC_STATUS.length > 0) ? PUBLIC_STATUS : [
        { ward: 'W-01', activeRequests: 12, projectsActive: 3, sentimentScore: 82 },
        { ward: 'W-02', activeRequests: 45, projectsActive: 1, sentimentScore: 65 },
        { ward: 'W-03', activeRequests: 8, projectsActive: 5, sentimentScore: 91 }
    ];

    return (
        <div>
            <div className="page-header">
                <h1>Citizen Trust Loop</h1>
                <span className="badge badge-indigo">Module 9 Active</span>
            </div>
            <div className="page-body">
                {/* 1. 4 KPIs */}
                <div className="grid-4 gap-4" style={{ marginBottom: '2rem' }}>
                    <div className="card" style={{ borderTop: '3px solid var(--accent-indigo)' }}>
                        <div className="text-sm text-muted">Total Notifications</div>
                        <div className="font-bold" style={{ fontSize: '1.5rem' }}>14,230</div>
                    </div>
                    <div className="card" style={{ borderTop: '3px solid var(--accent-emerald)' }}>
                        <div className="text-sm text-muted">Delivery Rate</div>
                        <div className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--accent-emerald)' }}>99.2%</div>
                    </div>
                    <div className="card" style={{ borderTop: '3px solid var(--accent-amber)' }}>
                        <div className="text-sm text-muted">Awaiting Feedback</div>
                        <div className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--accent-amber)' }}>842</div>
                    </div>
                    <div className="card" style={{ borderTop: '3px solid var(--accent-cyan)' }}>
                        <div className="text-sm text-muted">Multilingual Spread</div>
                        <div className="font-bold" style={{ fontSize: '1.5rem' }}>6 Langs</div>
                    </div>
                </div>

                {/* 2. Loop Closure Flow */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2 className="font-bold" style={{ marginBottom: '1rem' }}>Loop Closure Flow</h2>
                    <div className="flex items-center justify-between" style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: '8px' }}>
                        <div className="badge badge-muted">Event Trigger</div>
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ color: 'var(--accent-indigo)' }}>→</motion.div>
                        <div className="badge badge-indigo">Translation Engine</div>
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ color: 'var(--accent-emerald)' }}>→</motion.div>
                        <div className="badge badge-emerald">Omnichannel Dispatch</div>
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ color: 'var(--accent-cyan)' }}>→</motion.div>
                        <div className="badge badge-cyan">Citizen Confirmation</div>
                    </div>
                </div>

                {/* 3. Two-column Layout */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
                    {/* LEFT */}
                    <div className="flex flex-col gap-3">
                        <h2 className="font-bold">Recent Notifications</h2>
                        {notifs.map(n => (
                            <div key={n.id} className="card-sm" style={{ borderLeft: n.confirmed ? '3px solid var(--accent-emerald)' : '3px solid var(--accent-amber)' }}>
                                <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
                                    <span className="font-mono text-sm">{n.citizenHash}</span>
                                    <span className="text-xs text-muted">{new Date(n.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="flex gap-2" style={{ marginBottom: '0.75rem' }}>
                                    <span className="badge badge-synthetic">{n.channel}</span>
                                    <span className="badge badge-muted">{n.language}</span>
                                    <span className="badge badge-indigo">{n.eventType}</span>
                                </div>
                                <div className="text-sm" style={{ marginBottom: '0.25rem' }}>{n.message}</div>
                                <div className="text-xs text-muted" style={{ marginBottom: '1rem', fontStyle: 'italic' }}>"{n.translatedMessage ?? n.translation}"</div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-semibold" style={{ color: n.confirmed ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
                                        {n.confirmed ? '✓ Confirmed' : '⌛ Pending'}
                                    </span>
                                    <button className="btn btn-sm btn-ghost">Send Follow-up</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-col gap-3">
                        <h2 className="font-bold">Public Status Board</h2>
                        {statusBoard.map(w => (
                            <div key={w.ward} className="card-sm">
                                <div className="font-bold" style={{ marginBottom: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.25rem' }}>{w.ward}</div>
                                <div className="flex justify-between text-sm" style={{ marginBottom: '0.25rem' }}>
                                    <span className="text-muted">Active Requests:</span>
                                    <span className="font-mono">{w.activeRequests}</span>
                                </div>
                                <div className="flex justify-between text-sm" style={{ marginBottom: '0.75rem' }}>
                                    <span className="text-muted">Active Projects:</span>
                                    <span className="font-mono">{w.projectsActive}</span>
                                </div>
                                <div className="text-xs text-muted" style={{ marginBottom: '0.25rem' }}>Sentiment Score</div>
                                <div className="progress-track" style={{ height: '6px' }}>
                                    <div className="progress-fill" style={{ width: `${w.sentimentScore * 100}%`, background: w.sentimentScore > 0.8 ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
