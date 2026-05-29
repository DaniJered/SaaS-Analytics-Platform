import React, { useState, useEffect, useRef, memo } from 'react';
import { Chart as ChartJS } from 'chart.js/auto';
import { useTheme } from '../hooks/useTheme';
import CustomDropdown from '../components/ui/CustomDropdown';

const RevenueForecastChart = memo(({ theme, isRefreshing }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;
        if (chartInstance.current) chartInstance.current.destroy();

        const ctx = chartRef.current.getContext('2d');
        const primaryColor = theme === 'bw' ? '#FFFFFF' : '#FF7A00';
        
        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul (Proj)', 'Aug (Proj)', 'Sep (Proj)'];
        const shift = isRefreshing ? 0 : 1; 
        const historical = [170, 185, 192, 201, 210, 215].map(v => v + shift);
        const forecast = [null, null, null, null, null, 215 + shift, 225, 236, 245];

        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, theme === 'bw' ? 'rgba(255,255,255,0.1)' : 'rgba(255,122,0,0.15)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        chartInstance.current = new ChartJS(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Historical MRR',
                        data: historical,
                        borderColor: primaryColor,
                        borderWidth: 3,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        pointBackgroundColor: primaryColor
                    },
                    {
                        label: 'Forecast MRR',
                        data: forecast,
                        borderColor: primaryColor,
                        borderWidth: 3,
                        borderDash: [6, 6],
                        tension: 0.4,
                        fill: true,
                        backgroundColor: gradient,
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        pointBackgroundColor: 'rgba(0,0,0,0)',
                        pointBorderColor: primaryColor
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                animation: { duration: isRefreshing ? 0 : 700 },
                plugins: { 
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(15, 17, 21, 0.95)',
                        titleColor: '#A1A1AA',
                        bodyColor: '#FAFAFA',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: { label: (ctx) => `$${ctx.parsed.y}k` }
                    }
                },
                scales: {
                    y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#A1A1AA', callback: (val) => `$${val}k` } },
                    x: { grid: { display: false }, ticks: { color: '#A1A1AA' } }
                }
            }
        });

        return () => { if (chartInstance.current) chartInstance.current.destroy(); };
    }, [theme, isRefreshing]);

    return <div className="h-72 mt-6 relative z-10"><canvas ref={chartRef}></canvas></div>;
});

const AcquisitionChart = memo(({ theme, isRefreshing }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;
        if (chartInstance.current) chartInstance.current.destroy();

        const ctx = chartRef.current.getContext('2d');
        const colors = theme === 'bw' 
            ? ['#FFFFFF', '#D4D4D8', '#A1A1AA', '#71717A', '#52525B']
            : ['#FF7A00', '#FF9833', '#FFB86B', '#FFD199', '#FFE6CC'];

        chartInstance.current = new ChartJS(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Organic', 'Paid', 'Referral', 'Social', 'Direct'],
                datasets: [{
                    data: [45, 25, 15, 10, 5],
                    backgroundColor: colors,
                    borderColor: 'transparent',
                    borderWidth: 2,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: isRefreshing ? 0 : 700 },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(23, 23, 23, 0.9)',
                        titleColor: '#FAFAFA',
                        bodyColor: '#FAFAFA',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%` }
                    }
                },
                cutout: '75%'
            }
        });

        return () => { if (chartInstance.current) chartInstance.current.destroy(); };
    }, [theme, isRefreshing]);

    return <div className="h-48 relative z-10"><canvas ref={chartRef}></canvas></div>;
});

export default function Analytics() {
    const { theme } = useTheme();
    const [segment, setSegment] = useState('All Segments');
    const [region, setRegion] = useState('Global Region');
    const [dateRange, setDateRange] = useState('Last 12 Months');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const triggerRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 800);
    };

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => setIsExporting(false), 1500);
    };

    useEffect(() => {
        triggerRefresh();
    }, [segment, region, dateRange]);

    return (
        <div className="space-y-6 relative" data-name="analytics-view">
            
            {/* Global Refresh Overlay for Filters */}
            {isRefreshing && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-[var(--bg-color)]/20 backdrop-blur-[2px] rounded-xl transition-all duration-300">
                    <div className="icon-loader animate-spin text-3xl text-[var(--primary-color)]"></div>
                </div>
            )}

            {/* Performance Badges */}
            <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full backdrop-blur-md">
                    <div className="icon-trending-up text-emerald-400 text-sm"></div>
                    <span className="text-sm font-medium text-emerald-100">Revenue Growth +12.4%</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full backdrop-blur-md">
                    <div className="icon-shield-check text-blue-400 text-sm"></div>
                    <span className="text-sm font-medium text-blue-100">Retention +4.8%</span>
                </div>
                <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-full backdrop-blur-md">
                    <div className="icon-target text-purple-400 text-sm"></div>
                    <span className="text-sm font-medium text-purple-100">Forecast Accuracy 94%</span>
                </div>
                <div className="flex items-center gap-2 bg-[var(--primary-color)]/10 border border-[var(--primary-color)]/20 px-3 py-1.5 rounded-full backdrop-blur-md">
                    <div className="icon-building-2 text-[var(--primary-color)] text-sm"></div>
                    <span className="text-sm font-medium text-white">Enterprise Growth +18%</span>
                </div>
            </div>

            {/* Filter Dock */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/[0.03] p-4 rounded-2xl border border-white/10 backdrop-blur-xl shadow-lg relative z-40 gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    <CustomDropdown icon="users" value={segment} onChange={setSegment} options={[ { label: 'All Segments', value: 'All Segments' }, { label: 'Enterprise', value: 'Enterprise' }, { label: 'SMB', value: 'SMB' } ]} />
                    <CustomDropdown icon="globe" value={region} onChange={setRegion} options={[ { label: 'Global Region', value: 'Global Region' }, { label: 'North America', value: 'North America' }, { label: 'EMEA', value: 'EMEA' } ]} />
                    <CustomDropdown icon="calendar" value={dateRange} onChange={setDateRange} options={[ { label: 'Last 12 Months', value: 'Last 12 Months' }, { label: 'Year to Date', value: 'Year to Date' }, { label: 'All Time', value: 'All Time' } ]} />
                </div>
                <button onClick={handleExport} disabled={isExporting} className="btn bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center gap-2 backdrop-blur-md transition-all shadow-sm">
                    {isExporting ? <div className="icon-loader animate-spin w-4 h-4"></div> : <div className="icon-download w-4 h-4"></div>}
                    {isExporting ? 'Generating...' : 'Export Report'}
                </button>
            </div>

            {/* Performance Panels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Revenue Driver', value: 'Enterprise Upsells', sub: 'Accounts for 62% of new MRR', icon: 'arrow-up-right' },
                    { label: 'Top Region', value: 'North America', sub: 'Growing at 15% MoM', icon: 'globe' },
                    { label: 'Highest Growth Plan', value: 'Pro Tier', sub: '34% increase in signups', icon: 'zap' },
                    { label: 'Highest Churn Segment', value: 'Monthly Starter', sub: 'Needs intervention strategy', icon: 'triangle-alert' },
                ].map((panel, i) => (
                    <div key={i} className="card p-5 group cursor-default text-left">
                        <div className="flex items-center justify-between mb-3 text-left">
                            <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider text-left">{panel.label}</h4>
                            <div className={`icon-${panel.icon} text-[var(--text-muted)] group-hover:text-[var(--primary-color)] transition-colors`}></div>
                        </div>
                        <div className="text-lg font-bold text-white mb-1 group-hover:text-[var(--primary-color)] transition-colors text-left">{panel.value}</div>
                        <div className="text-xs text-[var(--text-muted)] text-left">{panel.sub}</div>
                    </div>
                ))}
            </div>

            {/* Main Graphs Block */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 card p-8 relative overflow-hidden group text-left">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--primary-color)]/5 rounded-full blur-[100px] pointer-events-none transition-opacity duration-700 opacity-50 group-hover:opacity-100"></div>
                    <div className="flex justify-between items-start mb-2 relative z-10 text-left">
                        <div className="text-left">
                            <h3 className="text-sm font-semibold uppercase text-[var(--text-muted)] tracking-wider text-left">Revenue Forecasting</h3>
                            <div className="mt-4 flex gap-8 text-left">
                                <div className="text-left">
                                    <div className="text-sm text-[var(--text-muted)] mb-1 text-left">Current MRR</div>
                                    <div className="text-3xl font-bold text-white text-left">$215,000</div>
                                </div>
                                <div className="text-left">
                                    <div className="text-sm text-[var(--text-muted)] mb-1 text-left">Forecasted MRR</div>
                                    <div className="text-3xl font-bold text-[var(--primary-color)] drop-shadow-[0_0_12px_rgba(255,122,0,0.4)] text-left">$245,000</div>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--primary-color)]/10 border border-[var(--primary-color)]/20 rounded-lg">
                                <div className="w-2 h-2 rounded-full bg-[var(--primary-color)] animate-pulse"></div>
                                <span className="text-xs font-medium text-[var(--primary-color)]">High Confidence: 94%</span>
                            </div>
                            <div className="text-sm text-emerald-400 font-medium mt-3 text-right">Proj. Growth: +14.0%</div>
                        </div>
                    </div>
                    <RevenueForecastChart theme={theme} isRefreshing={isRefreshing} />
                </div>

                <div className="lg:col-span-1 card p-6 text-left">
                    <h3 className="text-sm font-semibold uppercase text-[var(--text-muted)] tracking-wider mb-6 text-left">Conversion Funnel</h3>
                    <div className="space-y-0 relative text-left">
                        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-white/5"></div>
                        {[
                            { stage: 'Visitors', value: '124,500', drop: null, color: 'border-white/20 text-white' },
                            { stage: 'Signups', value: '12,450', drop: '10%', color: 'border-white/30 text-gray-200' },
                            { stage: 'Trials', value: '4,150', drop: '33%', color: 'border-white/50 text-gray-300' },
                            { stage: 'Paid Users', value: '1,245', drop: '30%', color: 'border-[var(--primary-color)] text-white shadow-[0_0_15px_rgba(255,122,0,0.3)]' },
                        ].map((step, i) => (
                            <div key={i} className="relative z-10 flex flex-col text-left">
                                {step.drop && (
                                    <div className="ml-14 my-3 flex items-center gap-3 text-left">
                                        <div className="h-[1px] w-6 bg-rose-500/30"></div>
                                        <div className="text-xs font-medium text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 text-left">
                                            ↓ {step.drop} Drop-off
                                        </div>
                                    </div>
                                )}
                                <div className={`flex items-center gap-4 p-4 rounded-xl border bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] transition-all cursor-default text-left ${step.color} ${i===0?'mt-0':''}`}>
                                    <div className="w-4 h-4 rounded-full border-2 border-current bg-[var(--surface-color)] z-10 shrink-0 flex items-center justify-center">
                                        {i === 3 && <div className="w-1.5 h-1.5 bg-current rounded-full"></div>}
                                    </div>
                                    <div className="flex-1 flex justify-between items-center text-left">
                                        <span className="font-medium text-sm tracking-wide text-left">{step.stage}</span>
                                        <span className="font-bold text-lg text-left">{step.value}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cohorts and Channels */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 card p-6 overflow-hidden group text-left">
                    <div className="flex justify-between items-center mb-6 text-left">
                        <h3 className="text-sm font-semibold uppercase text-[var(--text-muted)] tracking-wider text-left">Cohort Retention Matrix</h3>
                        <span className="text-xs text-[var(--text-muted)] text-left">Monthly Retention %</span>
                    </div>
                    <div className="overflow-x-auto custom-scrollbar pb-4 text-left">
                        <div className="min-w-[600px] text-left">
                            <div className="flex mb-2 text-left">
                                <div className="w-16 shrink-0"></div>
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className="flex-1 text-center text-xs text-[var(--text-muted)]">M{i}</div>
                                ))}
                            </div>
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((month, rIdx) => {
                                const rowCells = 12 - rIdx;
                                return (
                                    <div key={month} className="flex mb-1 items-center hover:bg-white/5 rounded transition-colors pr-2 text-left">
                                        <div className="w-16 shrink-0 text-xs text-[var(--text-muted)] font-medium pl-2 text-left">{month}</div>
                                        {[...Array(12)].map((_, cIdx) => {
                                            if (cIdx >= rowCells) return <div key={cIdx} className="flex-1 p-0.5"><div className="w-full h-8 rounded bg-transparent"></div></div>;
                                            
                                            // Mock retention percentages
                                            const retention = cIdx === 0 ? 100 : Math.max(20, Math.round(100 - (cIdx * 7.8) - ((rIdx % 3) * 1.5)));
                                            let bgClass = '';
                                            if (theme === 'bw') {
                                                if (retention > 90) bgClass = 'bg-white text-black';
                                                else if (retention > 70) bgClass = 'bg-gray-300 text-black';
                                                else if (retention > 50) bgClass = 'bg-gray-500 text-white';
                                                else if (retention > 30) bgClass = 'bg-gray-700 text-white';
                                                else bgClass = 'bg-gray-800 text-gray-400';
                                            } else {
                                                if (retention > 90) bgClass = 'bg-emerald-400 text-emerald-950';
                                                else if (retention > 70) bgClass = 'bg-emerald-500/80 text-white';
                                                else if (retention > 50) bgClass = 'bg-emerald-500/50 text-white';
                                                else if (retention > 30) bgClass = 'bg-emerald-500/30 text-white/70';
                                                else bgClass = 'bg-emerald-500/10 text-white/50';
                                            }

                                            return (
                                                <div key={cIdx} className="flex-1 p-0.5 relative group/cell">
                                                    <div className={`w-full h-8 rounded flex items-center justify-center text-[10px] font-medium transition-transform cursor-crosshair hover:scale-110 shadow-sm ${bgClass}`}>
                                                        {retention}%
                                                    </div>
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 p-2 bg-gray-900 border border-white/10 rounded shadow-xl opacity-0 group-hover/cell:opacity-100 pointer-events-none z-50 transition-opacity text-center">
                                                        <div className="text-xs text-white font-bold">{month} Cohort - M{cIdx}</div>
                                                        <div className="text-[10px] text-gray-400 mt-1">Users Retained: {retention}%</div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 card p-6 flex flex-col text-left">
                    <h3 className="text-sm font-semibold uppercase text-[var(--text-muted)] tracking-wider mb-6 text-left">Acquisition Sources</h3>
                    <AcquisitionChart theme={theme} isRefreshing={isRefreshing} />
                    
                    <div className="mt-8 space-y-4 flex-1 flex flex-col justify-end text-left">
                        {[
                            { source: 'Organic Search', pct: 45, color: theme === 'bw' ? 'bg-white' : 'bg-[var(--primary-color)]' },
                            { source: 'Paid Ads', pct: 25, color: theme === 'bw' ? 'bg-gray-300' : 'bg-orange-400' },
                            { source: 'Referral', pct: 15, color: theme === 'bw' ? 'bg-gray-500' : 'bg-orange-300' },
                            { source: 'Social', pct: 10, color: theme === 'bw' ? 'bg-gray-700' : 'bg-orange-200' },
                            { source: 'Direct', pct: 5, color: theme === 'bw' ? 'bg-gray-800' : 'bg-orange-100' },
                        ].map((s, i) => (
                            <div key={i} className="flex items-center justify-between group p-1 -mx-1 hover:bg-white/5 rounded cursor-pointer transition-colors text-left">
                                <div className="flex items-center gap-3 text-left">
                                    <div className={`w-3 h-3 rounded-sm ${s.color}`}></div>
                                    <span className="text-sm text-[var(--text-muted)] group-hover:text-white transition-colors text-left">{s.source}</span>
                                </div>
                                <span className="text-sm font-bold text-white text-left">{s.pct}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
