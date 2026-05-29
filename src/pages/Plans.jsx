import React, { useState, useEffect, useRef, memo } from 'react';
import { Chart as ChartJS } from 'chart.js/auto';
import { useTheme } from '../hooks/useTheme';
import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters';

const RevenueChart = memo(({ enrichedPlans, theme }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!chartRef.current || !enrichedPlans || enrichedPlans.length === 0) return;
        if (chartInstance.current) chartInstance.current.destroy();

        const ctx = chartRef.current.getContext('2d');
        const data = enrichedPlans.map(p => p.MRR);
        const labels = enrichedPlans.map(p => p.Name);
        
        const isBW = theme === 'bw';
        const colors = isBW 
            ? ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.5)', 'rgba(255,255,255,0.2)']
            : ['rgba(255,122,0,0.8)', 'rgba(255,152,51,0.8)', 'rgba(255,184,107,0.8)'];

        chartInstance.current = new ChartJS(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'MRR Contribution',
                    data,
                    backgroundColor: colors,
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: isBW ? 'rgba(255,255,255,0.1)' : 'rgba(255,122,0,0.2)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#A1A1AA' } },
                    x: { grid: { display: false }, ticks: { color: '#FAFAFA', font: { weight: 'bold' } } }
                }
            }
        });

        return () => { if (chartInstance.current) chartInstance.current.destroy(); }
    }, [theme, enrichedPlans]);

    return <div className="h-64 mt-4"><canvas ref={chartRef}></canvas></div>;
});

export default function Plans({ plans }) {
    const { theme } = useTheme();
    const [actionState, setActionState] = useState({});

    const handleAction = (id) => {
        setActionState(prev => ({ ...prev, [id]: 'loading' }));
        setTimeout(() => {
            setActionState(prev => ({ ...prev, [id]: 'loaded' }));
            setTimeout(() => setActionState(prev => ({ ...prev, [id]: null })), 2000);
        }, 800);
    };

    const enrichedPlans = plans.map(p => {
        let ltv, cac, profit;
        if (p.Name === 'Enterprise') { ltv = '$45k'; cac = '$3k'; profit = '93%'; }
        else if (p.Name === 'Pro') { ltv = '$3.5k'; cac = '$300'; profit = '91%'; }
        else { ltv = '$580'; cac = '$80'; profit = '86%'; }
        
        return { ...p, ltv, cac, profit };
    });

    return (
        <div className="space-y-8" data-name="plans-view">
            <div className="mb-4 text-left">
                <h2 className="text-2xl font-bold text-white tracking-tight text-left">Subscription Monetization</h2>
                <p className="text-[var(--text-muted)] text-sm mt-1 text-left">Analyze plan performance, revenue contribution, and upgrade funnels.</p>
            </div>

            {/* Plans List cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {enrichedPlans.map((plan, i) => {
                    const isPremium = plan.Name === 'Enterprise';
                    const state = actionState[`plan_${i}`];
                    return (
                        <div key={i} className={`card flex flex-col p-6 group hover:-translate-y-1 transition-transform text-left ${isPremium ? 'border border-[var(--primary-color)]/50 shadow-[0_0_30px_rgba(255,122,0,0.1)] relative' : ''}`}>
                            {isPremium && <div className="absolute top-0 right-0 px-3 py-1 bg-[var(--primary-color)] text-black text-[10px] font-black tracking-widest rounded-bl-lg uppercase z-10">Core Driver</div>}
                            
                            <div className="flex justify-between items-center mb-6 text-left">
                                <h2 className="text-2xl font-black text-white text-left">{plan.Name}</h2>
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors shrink-0">
                                    <div className={`icon-${isPremium ? 'building-2' : plan.Name === 'Pro' ? 'briefcase' : 'user'} text-lg ${isPremium ? 'text-[var(--primary-color)]' : 'text-[var(--text-muted)]'}`}></div>
                                </div>
                            </div>
                            
                            <div className="mb-6 pb-6 border-b border-white/10 text-center">
                                <div className="text-sm text-[var(--text-muted)] uppercase tracking-wider mb-1">MRR Generated</div>
                                <div className="text-4xl font-black text-white">{formatCurrency(plan.MRR)}</div>
                            </div>

                            <div className="space-y-4 flex-1 text-left">
                                <div className="flex justify-between items-center text-left">
                                    <span className="text-sm text-[var(--text-muted)] text-left">Active Subs</span>
                                    <span className="font-bold text-white text-left">{formatNumber(plan.Subscribers)}</span>
                                </div>
                                <div className="flex justify-between items-center text-left">
                                    <span className="text-sm text-[var(--text-muted)] text-left">Churn Rate</span>
                                    <span className={`font-bold text-left ${plan.ChurnRate > 3 ? 'text-rose-400' : 'text-emerald-400'}`}>{formatPercent(plan.ChurnRate)}</span>
                                </div>
                                <div className="flex justify-between items-center text-left">
                                    <span className="text-sm text-[var(--text-muted)] text-left">Average LTV</span>
                                    <span className="font-bold text-white text-left">{plan.ltv}</span>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => handleAction(`plan_${i}`)}
                                disabled={state === 'loading'}
                                className={`mt-6 w-full py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 shrink-0 ${
                                    isPremium 
                                        ? 'bg-[var(--primary-color)] text-black hover:bg-[var(--primary-soft)]' 
                                        : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                                } ${state === 'loading' ? 'opacity-70' : ''}`}
                            >
                                {state === 'loading' ? <div className="icon-loader animate-spin w-4 h-4"></div> : state === 'loaded' ? <div className="icon-check w-4 h-4"></div> : null}
                                {state === 'loading' ? 'Loading Details...' : state === 'loaded' ? 'Details Loaded' : 'View Details'}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Profitability Splits */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card p-6 text-left">
                    <h3 className="text-sm font-semibold uppercase text-[var(--text-muted)] tracking-wider mb-2 text-left">Revenue Comparison</h3>
                    <p className="text-xs text-[var(--text-muted)] mb-6 text-left">Distribution of MRR across subscription tiers.</p>
                    <RevenueChart enrichedPlans={enrichedPlans} theme={theme} />
                </div>

                <div className="card p-6 text-left">
                    <h3 className="text-sm font-semibold uppercase text-[var(--text-muted)] tracking-wider mb-6 text-left">Unit Economics & Profitability</h3>
                    
                    <div className="space-y-6 text-left">
                        {enrichedPlans.map((plan, i) => (
                            <div key={i} className="flex flex-col group cursor-default text-left">
                                <div className="flex justify-between items-end mb-2 text-left">
                                    <div className="text-left">
                                        <h4 className="font-bold text-white text-sm group-hover:text-[var(--primary-color)] transition-colors text-left">{plan.Name}</h4>
                                        <div className="text-xs text-[var(--text-muted)] text-left">CAC: {plan.cac} | LTV: {plan.ltv}</div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="text-sm font-bold text-emerald-400">{plan.profit} Margin</div>
                                    </div>
                                </div>
                                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden flex relative z-0">
                                    <div className="h-full bg-rose-500/50 hover:bg-rose-400 transition-colors" style={{ width: `${100 - parseInt(plan.profit)}%` }} title={`Acquisition Cost: ${100 - parseInt(plan.profit)}%`}></div>
                                    <div className="h-full bg-emerald-500 hover:bg-emerald-400 transition-colors" style={{ width: plan.profit }} title={`Net Profit: ${plan.profit}`}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Expansion Funnel visual */}
            <div className="card p-8 text-left">
                <div className="mb-8 text-left">
                    <h3 className="text-sm font-semibold uppercase text-[var(--text-muted)] tracking-wider text-left">Upgrade Path Funnel</h3>
                    <p className="text-xs text-[var(--text-muted)] mt-1 text-left">Conversion rates along the core monetization journey.</p>
                </div>
                
                <div className="flex flex-col md:flex-row items-center justify-between w-full relative max-w-4xl mx-auto">
                    <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-white/5 -translate-y-1/2 z-0"></div>
                    
                    <div className="relative z-10 flex flex-col items-center bg-[var(--surface-color)] p-4 rounded-xl border border-white/10 shadow-xl my-4 md:my-0 w-40 hover:border-[var(--primary-color)]/30 hover:-translate-y-1 transition-all">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                            <div className="icon-user text-xl text-white"></div>
                        </div>
                        <span className="font-bold text-white text-lg">Starter</span>
                        <span className="text-xs text-[var(--text-muted)] mt-1">Freemium Pool</span>
                    </div>

                    <div className="relative z-10 flex flex-col items-center px-4 group cursor-help text-center">
                        <div className="text-emerald-400 font-black text-lg bg-[var(--surface-color)] px-2 py-1 rounded border border-emerald-500/20 shadow-lg group-hover:scale-110 transition-transform">12%</div>
                        <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mt-2">Conversion</div>
                        <div className="hidden md:block icon-arrow-right mt-2 text-white/20 text-xl group-hover:text-white/60 transition-colors"></div>
                        <div className="block md:hidden icon-arrow-down my-2 text-white/20 text-xl group-hover:text-white/60 transition-colors"></div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center bg-[var(--surface-color)] p-4 rounded-xl border border-[var(--primary-color)]/30 shadow-[0_0_20px_rgba(255,122,0,0.1)] my-4 md:my-0 w-40 hover:-translate-y-1 transition-transform">
                        <div className="w-12 h-12 rounded-full bg-[var(--primary-color)]/10 flex items-center justify-center mb-3 border border-[var(--primary-color)]/20">
                            <div className="icon-briefcase text-xl text-[var(--primary-color)]"></div>
                        </div>
                        <span className="font-bold text-white text-lg">Pro</span>
                        <span className="text-xs text-[var(--text-muted)] mt-1">Core Revenue</span>
                    </div>

                    <div className="relative z-10 flex flex-col items-center px-4 group cursor-help text-center">
                        <div className="text-[var(--primary-color)] font-black text-lg bg-[var(--surface-color)] px-2 py-1 rounded border border-[var(--primary-color)]/20 shadow-lg group-hover:scale-110 transition-transform">4%</div>
                        <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mt-2">Expansion</div>
                        <div className="hidden md:block icon-arrow-right mt-2 text-white/20 text-xl group-hover:text-white/60 transition-colors"></div>
                        <div className="block md:hidden icon-arrow-down my-2 text-white/20 text-xl group-hover:text-white/60 transition-colors"></div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center bg-[var(--surface-color)] p-4 rounded-xl border border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.05)] my-4 md:my-0 w-40 hover:border-white/60 hover:-translate-y-1 transition-all">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-3 border-4 border-black">
                            <div className="icon-building-2 text-xl text-black"></div>
                        </div>
                        <span className="font-bold text-white text-lg">Enterprise</span>
                        <span className="text-xs text-[var(--text-muted)] mt-1">High LTV</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
