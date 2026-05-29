import React, { useState } from 'react';

export default function Customers() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isExporting, setIsExporting] = useState(false);
    
    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => setIsExporting(false), 1500);
    };

    const allCustomers = [
        { name: 'Acme Corp', email: 'billing@acme.co', plan: 'Enterprise', mrr: '$1,200', ltv: '$45,000', risk: 'Low', prob: '98%' },
        { name: 'TechFlow', email: 'admin@techflow.io', plan: 'Pro', mrr: '$299', ltv: '$3,500', risk: 'High', prob: '45%' },
        { name: 'GlobalNet', email: 'finance@globalnet.com', plan: 'Enterprise', mrr: '$1,500', ltv: '$62,000', risk: 'Low', prob: '95%' },
        { name: 'DesignCo', email: 'hello@designco.com', plan: 'Starter', mrr: '$49', ltv: '$580', risk: 'Medium', prob: '72%' },
        { name: 'CloudSync', email: 'ops@cloudsync.net', plan: 'Enterprise', mrr: '$2,100', ltv: '$84,000', risk: 'Low', prob: '99%' },
        { name: 'DataWorks', email: 'it@dataworks.io', plan: 'Pro', mrr: '$299', ltv: '$4,100', risk: 'Medium', prob: '78%' }
    ];

    const filteredCustomers = allCustomers.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.plan.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8" data-name="customers-view">
            {/* Header Block */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2 text-left">
                <div className="text-left">
                    <h2 className="text-2xl font-bold text-white tracking-tight text-left">Customer Intelligence Center</h2>
                    <p className="text-[var(--text-muted)] text-sm mt-1 text-left">Understand customer health, behavior, retention, and growth opportunities.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleExport} disabled={isExporting} className="btn bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center gap-2 backdrop-blur-md transition-all">
                        {isExporting ? <div className="icon-loader animate-spin w-4 h-4"></div> : <div className="icon-download w-4 h-4"></div>}
                        {isExporting ? 'Exporting...' : 'Export CSV'}
                    </button>
                </div>
            </div>

            {/* Churn Signals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card p-5 text-left">
                    <h3 className="text-sm font-semibold uppercase text-[var(--text-muted)] tracking-wider mb-2 text-left">Total Customers</h3>
                    <div className="text-3xl font-bold text-white mb-2 text-left">2,022</div>
                    <div className="text-sm text-emerald-400 flex items-center gap-1 text-left"><div className="icon-trending-up w-4 h-4"></div> +12% YoY</div>
                </div>
                <div className="card p-5 border-t-2 border-t-emerald-500 bg-emerald-500/5 text-left">
                    <div className="flex justify-between items-start mb-2 text-left">
                        <h3 className="text-sm font-semibold uppercase text-emerald-400 tracking-wider flex items-center gap-2 text-left">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                            Healthy
                        </h3>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">91%</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1 text-left">1,842</div>
                    <div className="text-xs text-[var(--text-muted)] text-left">Generating $192k MRR</div>
                </div>
                <div className="card p-5 border-t-2 border-t-amber-500 bg-amber-500/5 text-left">
                    <div className="flex justify-between items-start mb-2 text-left">
                        <h3 className="text-sm font-semibold uppercase text-amber-400 tracking-wider flex items-center gap-2 text-left">
                            <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>
                            At Risk
                        </h3>
                        <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded">8%</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1 text-left">156</div>
                    <div className="text-xs text-[var(--text-muted)] text-left">Generating $21k MRR</div>
                </div>
                <div className="card p-5 border-t-2 border-t-rose-500 bg-rose-500/5 text-left">
                    <div className="flex justify-between items-start mb-2 text-left">
                        <h3 className="text-sm font-semibold uppercase text-rose-400 tracking-wider flex items-center gap-2 text-left">
                            <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse"></div>
                            Churning
                        </h3>
                        <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-1 rounded">1%</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1 text-left">24</div>
                    <div className="text-xs text-[var(--text-muted)] text-left">Generating $2k MRR</div>
                </div>
            </div>

            {/* Segmentation & Actions split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="card lg:col-span-1 p-6 text-left">
                    <h3 className="text-sm font-semibold uppercase text-[var(--text-muted)] tracking-wider mb-6 text-left">Customer Segmentation</h3>
                    <div className="space-y-4 text-left">
                        {[
                            { plan: 'Enterprise', count: 180, mrr: '$110k', retention: '98%', growth: '+15%', color: 'border-[var(--primary-color)] text-[var(--primary-color)]' },
                            { plan: 'Pro', count: 842, mrr: '$84k', retention: '92%', growth: '+8%', color: 'border-white/50 text-white' },
                            { plan: 'Starter', count: 1000, mrr: '$21k', retention: '75%', growth: '+2%', color: 'border-white/20 text-[var(--text-muted)]' },
                        ].map((seg, i) => (
                            <div key={i} className={`p-4 rounded-xl border bg-white/[0.02] transition-colors hover:bg-white/[0.05] text-left ${seg.color}`}>
                                <div className="flex justify-between items-center mb-3 text-left">
                                    <h4 className="font-bold text-left">{seg.plan}</h4>
                                    <span className="text-xs px-2 py-1 bg-white/10 rounded">{seg.count} Users</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                    <div>
                                        <div className="text-[var(--text-muted)] mb-1">MRR</div>
                                        <div className="font-medium text-white">{seg.mrr}</div>
                                    </div>
                                    <div>
                                        <div className="text-[var(--text-muted)] mb-1">Retention</div>
                                        <div className="font-medium text-white">{seg.retention}</div>
                                    </div>
                                    <div>
                                        <div className="text-[var(--text-muted)] mb-1">Growth</div>
                                        <div className="font-medium text-emerald-400">{seg.growth}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card lg:col-span-2 p-6 bg-gradient-to-br from-[var(--surface-color)] to-rose-900/10 border-rose-500/10 text-left">
                    <div className="flex items-center gap-3 mb-6 text-left">
                        <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center border border-rose-500/30 text-rose-400 shrink-0">
                            <div className="icon-brain-circuit text-xl"></div>
                        </div>
                        <div className="text-left">
                            <h3 className="text-sm font-semibold uppercase text-white tracking-wider text-left">Predictive Intelligence</h3>
                            <p className="text-xs text-[var(--text-muted)] text-left">AI-driven churn and expansion forecasting</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-left">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left">
                            <div className="text-xs text-[var(--text-muted)] mb-1 text-left">Overall Renewal Prob.</div>
                            <div className="text-2xl font-bold text-white text-left">82%</div>
                        </div>
                        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-colors text-left">
                            <div className="text-xs text-rose-300 mb-1 text-left">High Churn Risk</div>
                            <div className="text-2xl font-bold text-rose-400 text-left">12 Accts</div>
                        </div>
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors text-left">
                            <div className="text-xs text-emerald-300 mb-1 text-left">Expansion Opportunity</div>
                            <div className="text-2xl font-bold text-emerald-400 text-left">34 Accts</div>
                        </div>
                    </div>

                    <div className="space-y-3 text-left">
                        <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase text-left">Priority Actions</h4>
                        {[
                            { action: 'Review Usage Drop', user: 'TechFlow Inc.', detail: 'Active users down 40% this week', risk: 'High' },
                            { action: 'Upsell Campaign', user: 'DesignCo', detail: 'Approaching API limits (95% used)', risk: 'Positive' },
                        ].map((act, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group text-left">
                                <div className="text-left">
                                    <div className="text-sm font-bold text-white group-hover:text-[var(--primary-color)] transition-colors text-left">{act.action} <span className="text-[var(--text-muted)] font-normal ml-2 group-hover:text-white/60 text-left">— {act.user}</span></div>
                                    <div className="text-xs text-[var(--text-muted)] mt-1 text-left">{act.detail}</div>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded border shrink-0 ${act.risk === 'High' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                    {act.risk}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Customer Conversion Journey */}
            <div className="card p-6 text-left">
                <h3 className="text-sm font-semibold uppercase text-[var(--text-muted)] tracking-wider mb-8 text-left">Customer Journey Conversion</h3>
                
                <div className="flex flex-col md:flex-row items-center justify-between w-full relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 -translate-y-1/2 hidden md:block z-0"></div>
                    
                    {[
                        { stage: 'Signup', value: '100%', count: '12,450', icon: 'user-plus' },
                        { stage: 'Trial', value: '45%', count: '5,602', icon: 'clock' },
                        { stage: 'Activation', value: '22%', count: '2,739', icon: 'zap' },
                        { stage: 'Upgrade', value: '12%', count: '1,494', icon: 'arrow-up-circle' },
                        { stage: 'Renewal', value: '10%', count: '1,245', icon: 'refresh-cw' },
                    ].map((step, i) => (
                        <div key={i} className="flex flex-col items-center relative z-10 bg-[var(--surface-color)] p-4 rounded-xl border border-white/10 w-full md:w-32 my-2 md:my-0 shadow-xl group hover:border-[var(--primary-color)]/50 hover:-translate-y-1 transition-all">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:bg-[var(--primary-color)]/20 transition-colors">
                                <div className={`icon-${step.icon} text-[var(--text-muted)] group-hover:text-[var(--primary-color)]`}></div>
                            </div>
                            <h4 className="text-sm font-bold text-white mb-1">{step.stage}</h4>
                            <div className="text-lg font-black text-[var(--primary-color)]">{step.value}</div>
                            <div className="text-xs text-[var(--text-muted)] mt-1">{step.count} users</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Customers Table List */}
            <div className="card p-0 overflow-hidden text-left">
                <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-black/20 gap-4 text-left">
                    <h3 className="text-lg font-bold text-white text-left">Top Customers Directory</h3>
                    <div className="flex gap-3 w-full sm:w-auto text-left">
                        <div className="relative flex-1 sm:w-64">
                            <input 
                                type="text" 
                                placeholder="Search customers..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[var(--primary-color)] transition-colors" 
                            />
                            <div className="icon-search absolute left-3 top-2.5 text-[var(--text-muted)]"></div>
                        </div>
                        <button className="btn bg-white/5 border border-white/10 hover:bg-white/10 px-3 transition-colors shrink-0">
                            <div className="icon-list-filter text-[var(--text-muted)] hover:text-white"></div>
                        </button>
                    </div>
                </div>
                
                <div className="overflow-x-auto min-h-[250px] text-left">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-xs uppercase tracking-wider text-[var(--text-muted)]">
                                <th className="px-6 py-4 font-semibold">Customer</th>
                                <th className="px-6 py-4 font-semibold">Plan</th>
                                <th className="px-6 py-4 font-semibold">MRR</th>
                                <th className="px-6 py-4 font-semibold">LTV</th>
                                <th className="px-6 py-4 font-semibold">Risk Score</th>
                                <th className="px-6 py-4 font-semibold">Renewal Prob.</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredCustomers.length > 0 ? filteredCustomers.map((c, i) => (
                                <tr key={i} className="hover:bg-white/[0.04] transition-colors cursor-pointer group">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-white group-hover:text-[var(--primary-color)] transition-colors">{c.name}</div>
                                        <div className="text-xs text-[var(--text-muted)]">{c.email}</div>
                                    </td>
                                    <td className="px-6 py-4"><span className="px-2 py-1 bg-white/10 border border-white/5 rounded text-xs text-white group-hover:bg-white/20 transition-colors">{c.plan}</span></td>
                                    <td className="px-6 py-4 font-medium text-white">{c.mrr}</td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-muted)]">{c.ltv}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2 py-1 rounded border ${c.risk === 'High' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : c.risk === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                            {c.risk}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-white">{c.prob}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-[var(--text-muted)]">
                                        <div className="icon-search text-3xl mb-3 text-white/20"></div>
                                        <p>No customers found matching "{searchTerm}"</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
