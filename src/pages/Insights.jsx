import React, { useState } from 'react';

export default function Insights() {
    const [actionState, setActionState] = useState({});

    const handleAction = (id) => {
        setActionState(prev => ({ ...prev, [id]: 'processing' }));
        setTimeout(() => {
            setActionState(prev => ({ ...prev, [id]: 'done' }));
        }, 1200);
    };

    const renderActionBtn = (id, defaultLabel, colorClass, baseClass) => {
        const state = actionState[id];
        if (state === 'processing') {
            return (
                <button disabled className={`btn flex items-center gap-2 ${baseClass} opacity-70`}>
                    <div className="icon-loader animate-spin w-4 h-4"></div> Processing...
                </button>
            );
        }
        if (state === 'done') {
            return (
                <button disabled className={`btn flex items-center gap-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-sm`}>
                    <div className="icon-check w-4 h-4"></div> Applied
                </button>
            );
        }
        return (
            <button 
                onClick={() => handleAction(id)} 
                className={`btn flex items-center gap-2 ${baseClass} ${colorClass} hover:brightness-125 transition-all`}
            >
                {defaultLabel}
            </button>
        );
    };

    return (
        <div className="space-y-8" data-name="insights-view">
            {/* AI Hero Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-[var(--primary-color)]/30 bg-gradient-to-r from-[var(--surface-color)] to-[var(--primary-color)]/10 p-8 shadow-[0_0_40px_rgba(255,122,0,0.1)] text-left">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--primary-color)]/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-left">
                    <div className="w-20 h-20 rounded-2xl bg-[var(--primary-color)]/20 border border-[var(--primary-color)]/40 flex items-center justify-center shadow-[0_0_30px_rgba(255,122,0,0.4)] shrink-0">
                        <div className="icon-sparkles text-4xl text-[var(--primary-color)]"></div>
                    </div>
                    <div className="text-left">
                        <h2 className="text-3xl font-bold text-white tracking-tight text-left">Nova AI Intelligence Hub</h2>
                        <p className="text-[var(--text-muted)] text-base mt-2 max-w-2xl text-balance text-left">
                            Discover hidden opportunities, mitigate risks before they happen, and automate growth strategies with continuous anomaly detection.
                        </p>
                    </div>
                </div>
            </div>

            {/* Opportunities vs Risks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card p-6 border-t-2 border-t-emerald-500 text-left">
                    <h3 className="text-sm font-semibold uppercase text-emerald-400 tracking-wider flex items-center gap-2 mb-6 text-left">
                        <div className="icon-trending-up"></div> Revenue Opportunities
                    </h3>
                    <div className="space-y-4 text-left">
                        <div className="p-5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors text-left">
                            <div className="flex justify-between items-start mb-2 text-left">
                                <h4 className="text-white font-bold text-lg text-left">Enterprise Upsell Potential</h4>
                                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg font-bold text-sm shrink-0">+$12,400 MRR</span>
                            </div>
                            <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4 text-left">
                                42 Pro customers have exceeded their usage limits by &gt;80% for 3 consecutive months. High probability of Enterprise conversion.
                            </p>
                            {renderActionBtn('upsell_1', 'Review Accounts', 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', 'text-sm')}
                        </div>

                        <div className="p-5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors text-left">
                            <div className="flex justify-between items-start mb-2 text-left">
                                <h4 className="text-white font-bold text-lg text-left">Starter Add-on Sales</h4>
                                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg font-bold text-sm shrink-0">+$4,800 MRR</span>
                            </div>
                            <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4 text-left">
                                150 Starter accounts frequently access locked Pro features. Recommending a targeted micro-upgrade campaign.
                            </p>
                            {renderActionBtn('upsell_2', 'Launch Campaign', 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', 'text-sm')}
                        </div>
                    </div>
                </div>

                <div className="card p-6 border-t-2 border-t-rose-500 text-left">
                    <h3 className="text-sm font-semibold uppercase text-rose-400 tracking-wider flex items-center gap-2 mb-6 text-left">
                        <div className="icon-triangle-alert"></div> Risk & Churn Alerts
                    </h3>
                    <div className="space-y-4 text-left">
                        <div className="p-5 rounded-xl bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500/10 transition-colors text-left">
                            <div className="flex justify-between items-start mb-2 text-left">
                                <h4 className="text-white font-bold text-lg flex items-center gap-2 text-left">
                                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0"></span>
                                    High-Value Churn Risk
                                </h4>
                                <span className="px-3 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg font-bold text-sm shrink-0">15 Accounts</span>
                            </div>
                            <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4 text-left">
                                Engagement dropped by 45% over the last 14 days among key Enterprise clients in the EMEA region. Total MRR at risk: $18,500.
                            </p>
                            {renderActionBtn('risk_1', 'Intervene Now', 'bg-rose-500/10 text-rose-400 border border-rose-500/20', 'text-sm')}
                        </div>

                        <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500/10 transition-colors text-left">
                            <div className="flex justify-between items-start mb-2 text-left">
                                <h4 className="text-white font-bold text-lg text-amber-100 text-left">Pro Plan Churn Anomaly</h4>
                                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg font-bold text-sm shrink-0">+3.2% Spike</span>
                            </div>
                            <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4 text-left">
                                Unusual spike in Pro plan cancellations. Text analysis of exit surveys indicates missing integrations.
                            </p>
                            {renderActionBtn('risk_2', 'View Survey Insights', 'bg-amber-500/10 text-amber-400 border border-amber-500/20', 'text-sm')}
                        </div>
                    </div>
                </div>
            </div>

            {/* Q3 Forecasts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="card lg:col-span-2 p-6 bg-[var(--surface-color)]/80 backdrop-blur-xl border border-[var(--primary-color)]/10 group text-left">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary-color)]/5 rounded-full blur-[80px] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    <div className="flex justify-between items-center mb-6 relative z-10 text-left">
                        <h3 className="text-sm font-semibold uppercase text-[var(--text-muted)] tracking-wider text-left">Predictive Forecasts (Q3)</h3>
                        <div className="flex items-center gap-2 px-3 py-1 bg-[var(--primary-color)]/10 text-[var(--primary-color)] border border-[var(--primary-color)]/20 rounded-full text-xs font-bold shrink-0">
                            Model Confidence: 94%
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10 text-left">
                        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-colors text-left">
                            <div className="text-xs text-[var(--text-muted)] mb-2 uppercase text-left">Forecasted MRR</div>
                            <div className="text-3xl font-black text-white text-left">$245,000</div>
                            <div className="mt-2 text-sm text-emerald-400 font-medium text-left">+14.0% Expected</div>
                        </div>
                        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-colors text-left">
                            <div className="text-xs text-[var(--text-muted)] mb-2 uppercase text-left">Forecasted ARR</div>
                            <div className="text-3xl font-black text-white text-left">$2.94M</div>
                            <div className="mt-2 text-sm text-emerald-400 font-medium text-left">+15.2% Expected</div>
                        </div>
                        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-colors text-left">
                            <div className="text-xs text-[var(--text-muted)] mb-2 uppercase text-left">Forecasted Subs</div>
                            <div className="text-3xl font-black text-white text-left">2,450</div>
                            <div className="mt-2 text-sm text-emerald-400 font-medium text-left">+21.0% Expected</div>
                        </div>
                    </div>
                </div>

                <div className="card lg:col-span-1 p-6 text-left">
                    <h3 className="text-sm font-semibold uppercase text-[var(--text-muted)] tracking-wider mb-6 text-left">Anomaly Detection</h3>
                    <div className="space-y-4 text-left">
                        <div className="flex gap-3 hover:bg-white/5 p-2 -mx-2 rounded transition-colors cursor-pointer text-left">
                            <div className="w-8 h-8 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30"><div className="icon-arrow-up"></div></div>
                            <div className="text-left">
                                <div className="text-sm font-bold text-white text-left">Enterprise Surge</div>
                                <div className="text-xs text-[var(--text-muted)] mt-1 text-left">Unusual 18% spike in top-tier signups from APAC region.</div>
                            </div>
                        </div>
                        <div className="flex gap-3 hover:bg-white/5 p-2 -mx-2 rounded transition-colors cursor-pointer text-left">
                            <div className="w-8 h-8 rounded bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30"><div className="icon-arrow-down"></div></div>
                            <div className="text-left">
                                <div className="text-sm font-bold text-white text-left">Revenue Drop Detected</div>
                                <div className="text-xs text-[var(--text-muted)] mt-1 text-left">Failed renewals increased by 4% due to expired cards.</div>
                            </div>
                        </div>
                        <div className="flex gap-3 hover:bg-white/5 p-2 -mx-2 rounded transition-colors cursor-pointer text-left">
                            <div className="w-8 h-8 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30"><div className="icon-activity"></div></div>
                            <div className="text-left">
                                <div className="text-sm font-bold text-white text-left">Usage Pattern Shift</div>
                                <div className="text-xs text-[var(--text-muted)] mt-1 text-left">API calls per user increased 300% over the weekend.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Action Plan */}
            <div className="card p-6 border border-white/10 bg-white/[0.02] text-left">
                <h3 className="text-sm font-semibold uppercase text-white tracking-wider flex items-center gap-2 mb-6 text-left">
                    <div className="icon-bot"></div> AI Action Plan Recommendations
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                    <div className="p-5 rounded-xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-[var(--primary-color)]/30 transition-all group text-left">
                        <div className="icon-megaphone text-2xl text-[var(--primary-color)] mb-3 group-hover:scale-110 transition-transform"></div>
                        <h4 className="text-lg font-bold text-white mb-2 text-left">Increase Enterprise Marketing</h4>
                        <p className="text-sm text-[var(--text-muted)] mb-4 text-left">CAC is 20% below target for Enterprise accounts. Reallocating $10k ad spend is modeled to yield $45k MRR.</p>
                        <button onClick={() => handleAction('rec_1')} className="text-[var(--primary-color)] text-sm font-bold hover:underline flex items-center gap-1 transition-all shrink-0">
                            {actionState['rec_1'] === 'processing' ? 'Applying...' : actionState['rec_1'] === 'done' ? 'Applied ✓' : 'Apply Strategy'} {actionState['rec_1'] !== 'done' && <div className="icon-arrow-right w-4 h-4"></div>}
                        </button>
                    </div>
                    <div className="p-5 rounded-xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-emerald-500/30 transition-all group text-left">
                        <div className="icon-rocket text-2xl text-emerald-400 mb-3 group-hover:scale-110 transition-transform"></div>
                        <h4 className="text-lg font-bold text-white mb-2 text-left">Optimize Starter Onboarding</h4>
                        <p className="text-sm text-[var(--text-muted)] mb-4 text-left">Users who complete the setup guide within 24h retain 3x better. Recommend forcing setup wizard.</p>
                        <button onClick={() => handleAction('rec_2')} className="text-emerald-400 text-sm font-bold hover:underline flex items-center gap-1 transition-all shrink-0">
                            {actionState['rec_2'] === 'processing' ? 'Loading Flow...' : actionState['rec_2'] === 'done' ? 'Flow Loaded ✓' : 'View Flow'} {actionState['rec_2'] !== 'done' && <div className="icon-arrow-right w-4 h-4"></div>}
                        </button>
                    </div>
                    <div className="p-5 rounded-xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-blue-500/30 transition-all group text-left">
                        <div className="icon-life-buoy text-2xl text-blue-400 mb-3 group-hover:scale-110 transition-transform"></div>
                        <h4 className="text-lg font-bold text-white mb-2 text-left">Launch Retention Campaign</h4>
                        <p className="text-sm text-[var(--text-muted)] mb-4 text-left">Deploy automated discount offers to the 15 at-risk Enterprise accounts. Expected save rate: 40%.</p>
                        <button onClick={() => handleAction('rec_3')} className="text-blue-400 text-sm font-bold hover:underline flex items-center gap-1 transition-all shrink-0">
                            {actionState['rec_3'] === 'processing' ? 'Configuring...' : actionState['rec_3'] === 'done' ? 'Configured ✓' : 'Configure Automation'} {actionState['rec_3'] !== 'done' && <div className="icon-arrow-right w-4 h-4"></div>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
