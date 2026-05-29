import React from 'react';
import { useTheme } from '../../hooks/useTheme';

export function CircularProgress({ percent, label, color = "#FFFFFF", icon }) {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percent / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/[0.08] transition-colors">
            <div className="relative flex items-center justify-center mb-3">
                <svg className="transform -rotate-90 w-24 h-24">
                    <circle cx="48" cy="48" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="transparent" />
                    <circle 
                        cx="48" 
                        cy="48" 
                        r={radius} 
                        stroke={color} 
                        strokeWidth="4" 
                        fill="transparent" 
                        strokeDasharray={circumference} 
                        strokeDashoffset={strokeDashoffset} 
                        className="transition-all duration-1000 ease-out"
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                    <div className={`icon-${icon} text-lg mb-1 text-white`}></div>
                    <span className="text-sm font-bold text-white">{percent}%</span>
                </div>
            </div>
            <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">{label}</span>
        </div>
    );
}

export function ProgressWidgets() {
    const { theme } = useTheme();
    const isBW = theme === 'bw';
    return (
        <div className="card text-left" data-name="progress-widgets">
            <h3 className="text-sm font-semibold tracking-wide uppercase text-[var(--text-muted)] mb-6">Goals & Targets</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
                <CircularProgress percent={85} label="MRR Goal" icon="target" color={isBW ? "#FFFFFF" : "#FF7A00"} />
                <CircularProgress percent={92} label="Retention" icon="shield-check" color={isBW ? "#D4D4D8" : "#10b981"} />
            </div>
            
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-xs mb-2">
                        <span className="text-[var(--text-muted)]">Enterprise Growth</span>
                        <span className="text-white font-medium">78%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full w-[78%]"></div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-xs mb-2">
                        <span className="text-[var(--text-muted)]">Churn Reduction</span>
                        <span className="text-white font-medium">64%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-400 rounded-full w-[64%]"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ActivityFeed() {
    const activities = [
        { id: 1, type: 'upgrade', user: 'Acme Corp', action: 'upgraded to Enterprise', time: '10 mins ago', icon: 'arrow-up-circle', color: 'text-white', bg: 'bg-white/10' },
        { id: 2, type: 'new', user: 'TechFlow', action: 'subscribed to Pro', time: '1 hour ago', icon: 'user-plus', color: 'text-gray-300', bg: 'bg-white/5' },
        { id: 3, type: 'churn', user: 'GlobalNet', action: 'canceled Starter plan', time: '3 hours ago', icon: 'user-minus', color: 'text-gray-500', bg: 'bg-white/5' },
        { id: 4, type: 'payment', user: 'DesignCo', action: 'paid $4,500 invoice', time: '5 hours ago', icon: 'badge-check', color: 'text-white', bg: 'bg-white/10' },
    ];

    return (
        <div className="card flex flex-col h-full text-left" data-name="activity-feed">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-semibold tracking-wide uppercase text-[var(--text-muted)]">Live Activity</h3>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                    <span className="text-xs text-white font-medium tracking-wider">LIVE</span>
                </div>
            </div>
            
            <div className="flex flex-col gap-4 flex-1">
                {activities.map((act, index) => (
                    <div key={act.id} className="flex gap-4 relative group text-left">
                        {index !== activities.length - 1 && (
                            <div className="absolute left-5 top-10 bottom-[-16px] w-[1px] bg-gradient-to-b from-white/10 to-transparent"></div>
                        )}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-white/5 relative z-10 ${act.bg}`}>
                            <div className={`icon-${act.icon} ${act.color}`}></div>
                        </div>
                        <div className="flex flex-col justify-center text-left">
                            <p className="text-sm text-white text-left">
                                <span className="font-semibold">{act.user}</span> <span className="text-[var(--text-muted)]">{act.action}</span>
                            </p>
                            <span className="text-xs text-[var(--text-muted)]/70 text-left">{act.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function AIInsights() {
    return (
        <div className="card border border-white/10 relative overflow-hidden text-left" data-name="ai-insights">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[60px] pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/20 to-transparent p-[1px]">
                    <div className="w-full h-full bg-[var(--surface-color)] rounded-xl flex items-center justify-center">
                        <div className="icon-sparkles text-white"></div>
                    </div>
                </div>
                <div className="text-left">
                    <h3 className="text-sm font-semibold tracking-wide uppercase text-white">Nova AI Insights</h3>
                    <p className="text-xs text-[var(--text-muted)]">Generated just now</p>
                </div>
            </div>

            <div className="space-y-3 relative z-10 text-left">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors cursor-default text-left">
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed text-left">
                        <strong className="text-white">Revenue Anomaly:</strong> Enterprise MRR increased by <span className="text-white font-medium">12.4%</span> this month, primarily driven by upsells in the NA region.
                    </p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors cursor-default text-left">
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed text-left">
                        <strong className="text-white">Churn Improved:</strong> Customer retention rate is trending positively. Churn rate dropped by <span className="text-white font-medium">1.2%</span> compared to previous quarter.
                    </p>
                </div>
            </div>
        </div>
    );
}
