import React, { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { formatCurrency, formatNumber, formatPercent } from '../../utils/formatters';

// Count-up hook bundled here for self-containment
export function useCountUp(endValue, duration = 1500) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime = null;
        let animationFrameId;

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            
            // easeOutExpo
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            
            setCount(endValue * easeProgress);

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                setCount(endValue);
            }
        };

        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [endValue, duration]);

    return count;
}

export function AreaSparkline({ data, colorHex, height = 60 }) {
    if (!data || data.length < 2) return null;
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    const width = 200;
    
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * (height * 0.8) - (height * 0.1);
        return { x, y };
    });

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

    const cleanColor = colorHex.replace('#', '');

    return (
        <div className="w-full h-full relative flex items-end">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                    <linearGradient id={`grad-${cleanColor}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={colorHex} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={colorHex} stopOpacity="0.0" />
                    </linearGradient>
                </defs>
                <path d={areaPath} fill={`url(#grad-${cleanColor})`} className="transition-all duration-500 ease-out" />
                <path 
                    d={linePath} 
                    fill="none" 
                    stroke={colorHex} 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="transition-all duration-500 ease-out"
                    style={{ filter: `drop-shadow(0 2px 4px ${colorHex}80)` }}
                />
            </svg>
        </div>
    );
}

export function TrendIndicator({ trend, inverseTrend }) {
    if (trend === null || trend === undefined) return null;
    
    const isPositive = inverseTrend ? trend <= 0 : trend >= 0;
    const absTrend = Math.abs(trend).toFixed(1);
    
    return (
        <span className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            <span className={`text-[12px] ${isPositive ? (inverseTrend ? 'icon-arrow-down-right' : 'icon-arrow-up-right') : (inverseTrend ? 'icon-arrow-up-right' : 'icon-arrow-down-right')}`}></span>
            {absTrend}%
        </span>
    );
}

export function HeroKPICard({ title, value, previousValue, historicalValues, formatter, icon, colorHex, details }) {
    const animatedValue = useCountUp(value, 1500);
    const trend = previousValue ? ((value - previousValue) / previousValue) * 100 : 0;
    
    const rgb = colorHex === '#FF7A00' ? '255, 122, 0' : colorHex === '#10b981' ? '16, 185, 129' : '255, 255, 255';
    
    return (
        <div className="card group cursor-default flex flex-col justify-between h-56 relative overflow-hidden" 
             style={{ background: `linear-gradient(180deg, rgba(${rgb}, 0.05) 0%, rgba(23, 26, 33, 0.6) 100%)` }}>
            
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none -mr-20 -mt-20"
                 style={{ backgroundColor: colorHex }}></div>

            <div className="flex justify-between items-start z-10 relative">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/[0.03] border border-white/10 shadow-lg backdrop-blur-md">
                        <div className={`icon-${icon} text-2xl drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]`} style={{ color: colorHex }}></div>
                    </div>
                    <h3 className="text-sm font-medium tracking-wide text-white capitalize">{title}</h3>
                </div>
            </div>

            <div className="flex flex-col gap-1 z-10 relative mt-4">
                <h2 className="text-5xl font-bold tracking-tighter text-white drop-shadow-sm">
                    {formatter(animatedValue)}
                </h2>
                <div className="flex items-center gap-3 mt-1">
                    <TrendIndicator trend={trend} />
                </div>
            </div>

            {/* Sparkline Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-24 z-0 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                <AreaSparkline data={historicalValues} colorHex={colorHex} height={96} />
            </div>

            {/* Hover Breakdown details overlay */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <h4 className="text-sm font-semibold text-white mb-4 border-b border-white/10 pb-2">{title} Breakdown</h4>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-[var(--text-muted)]">Previous Month</span>
                        <span className="text-white font-medium">{previousValue ? formatter(previousValue) : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-[var(--text-muted)]">Growth Trend</span>
                        <TrendIndicator trend={trend} />
                    </div>
                    {details && Object.entries(details).map(([k, v]) => (
                        <div key={k} className="flex justify-between text-sm">
                            <span className="text-[var(--text-muted)]">{k}</span>
                            <span className="text-white font-medium">{v}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function Tier2KPICard({ title, value, previousValue, historicalValues, formatter, icon, colorHex, inverseTrend = false }) {
    const animatedValue = useCountUp(value, 1500);
    const trend = previousValue ? ((value - previousValue) / previousValue) * 100 : 0;
    
    const rgb = colorHex === '#10b981' ? '16, 185, 129' : colorHex === '#ef4444' ? '239, 68, 68' : '255, 255, 255';

    return (
        <div className="card group cursor-default flex flex-col justify-between h-40 relative overflow-hidden"
             style={{ background: `linear-gradient(180deg, rgba(${rgb}, 0.04) 0%, rgba(23, 26, 33, 0.5) 100%)` }}>
            
            <div className="flex justify-between items-start z-10 relative">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/[0.02] border border-white/5 shadow-sm">
                        <div className={`icon-${icon} text-xl`} style={{ color: colorHex }}></div>
                    </div>
                    <h3 className="text-sm font-medium text-white/80 capitalize">{title}</h3>
                </div>
            </div>

            <div className="flex justify-between items-end z-10 relative mt-2">
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">
                        {formatter(animatedValue)}
                    </h2>
                    <TrendIndicator trend={trend} inverseTrend={inverseTrend} />
                </div>
                <div className="w-32 h-16 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                    <AreaSparkline data={historicalValues} colorHex={colorHex} height={64} />
                </div>
            </div>
        </div>
    );
}

export function Tier3KPICard({ title, value, previousValue, formatter, icon, colorHex, inverseTrend = false }) {
    const animatedValue = useCountUp(value, 1500);
    const trend = previousValue ? ((value - previousValue) / previousValue) * 100 : 0;

    return (
        <div className="card group cursor-default flex items-center justify-between h-24 p-5 relative overflow-hidden bg-[rgba(23,26,33,0.4)]">
            <div className="flex items-center gap-4 z-10 relative">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/[0.02] border border-white/5 group-hover:scale-110 transition-transform duration-300">
                    <div className={`icon-${icon} text-lg`} style={{ color: colorHex }}></div>
                </div>
                <div className="flex flex-col">
                    <h3 className="text-xs font-medium text-white/60 capitalize mb-0.5">{title}</h3>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-xl font-bold tracking-tight text-white drop-shadow-sm">
                            {formatter(animatedValue)}
                        </h2>
                        <TrendIndicator trend={trend} inverseTrend={inverseTrend} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function KPISection({ currentMetrics, previousMetrics, historicalData }) {
    const { theme } = useTheme();

    if (!currentMetrics) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-56 bg-white/5 rounded-2xl"></div>
                    <div className="h-56 bg-white/5 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    const ltvCacRatio = currentMetrics.LTV / currentMetrics.CAC;
    const prevLtvCacRatio = previousMetrics ? previousMetrics.LTV / previousMetrics.CAC : null;

    const getHistory = (key) => historicalData?.map(d => d[key]) || [];
    
    const isBW = theme === 'bw';

    return (
        <div className="flex flex-col gap-6 mb-8" data-name="kpi-section">
            {/* Tier 1 Hero MRR / ARR */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <HeroKPICard 
                    title="Monthly Recurring Revenue" 
                    value={currentMetrics.MRR} 
                    previousValue={previousMetrics?.MRR} 
                    historicalValues={getHistory('MRR')} 
                    formatter={formatCurrency} 
                    icon="banknote" 
                    colorHex={isBW ? "#FFFFFF" : "#FF7A00"}
                    details={{ 
                        "Active Subs": currentMetrics.Subscribers, 
                        "Avg. Revenue Per User": formatCurrency(currentMetrics.MRR / currentMetrics.Subscribers || 0) 
                    }}
                />
                <HeroKPICard 
                    title="Annual Recurring Revenue" 
                    value={currentMetrics.ARR} 
                    previousValue={previousMetrics?.ARR} 
                    historicalValues={getHistory('ARR')} 
                    formatter={formatCurrency} 
                    icon="chart-line" 
                    colorHex={isBW ? "#D4D4D8" : "#FF7A00"}
                    details={{ "YoY Forecast": "+24%", "Run Rate Goal": "$5M" }}
                />
            </div>
            
            {/* Tier 2 Supporting Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Tier2KPICard 
                    title="Active Subscribers" 
                    value={currentMetrics.Subscribers} 
                    previousValue={previousMetrics?.Subscribers} 
                    historicalValues={getHistory('Subscribers')} 
                    formatter={Math.round} 
                    icon="users" 
                    colorHex={isBW ? "#FFFFFF" : "#10b981"} 
                />
                <Tier2KPICard 
                    title="Customer Churn Rate" 
                    value={currentMetrics.ChurnRate} 
                    previousValue={previousMetrics?.ChurnRate} 
                    historicalValues={getHistory('ChurnRate')} 
                    formatter={formatPercent} 
                    icon="user-minus" 
                    inverseTrend={true} 
                    colorHex={isBW ? "#A1A1AA" : "#ef4444"} 
                />
            </div>

            {/* Tier 3 Metric breakdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Tier3KPICard 
                    title="Net Revenue Retention" 
                    value={currentMetrics.NRR} 
                    previousValue={previousMetrics?.NRR} 
                    formatter={formatPercent} 
                    icon="percent" 
                    colorHex={isBW ? "#FFFFFF" : "#10b981"} 
                />
                <Tier3KPICard 
                    title="Acquisition Cost" 
                    value={currentMetrics.CAC} 
                    previousValue={previousMetrics?.CAC} 
                    formatter={formatCurrency} 
                    icon="credit-card" 
                    inverseTrend={true} 
                    colorHex={isBW ? "#A1A1AA" : "#ef4444"} 
                />
                <Tier3KPICard 
                    title="Lifetime Value" 
                    value={currentMetrics.LTV} 
                    previousValue={previousMetrics?.LTV} 
                    formatter={formatCurrency} 
                    icon="gem" 
                    colorHex={isBW ? "#FFFFFF" : "#10b981"} 
                />
                <Tier3KPICard 
                    title="LTV:CAC Ratio" 
                    value={ltvCacRatio} 
                    previousValue={prevLtvCacRatio} 
                    formatter={(val) => `${val.toFixed(1)}x`} 
                    icon="scale" 
                    colorHex={isBW ? "#D4D4D8" : "#8b5cf6"} 
                />
            </div>
        </div>
    );
}
