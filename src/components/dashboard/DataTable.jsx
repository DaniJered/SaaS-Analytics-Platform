import React from 'react';
import { formatCurrency, formatNumber, formatPercent } from '../../utils/formatters';

export default function DataTable({ plansData }) {
    try {
        if (!plansData || plansData.length === 0) {
            return <div className="card text-center py-8 text-[var(--text-muted)]">No plan data available</div>;
        }

        return (
            <div className="card overflow-hidden" data-name="data-table">
                <h3 className="text-lg font-semibold mb-4">Subscription Plans Overview</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border-color)] text-xs uppercase tracking-wider">
                                <th className="pb-4 pt-2 px-4 font-semibold text-[var(--text-muted)]">Plan Name</th>
                                <th className="pb-4 pt-2 px-4 font-semibold text-[var(--text-muted)]">Subscribers</th>
                                <th className="pb-4 pt-2 px-4 font-semibold text-[var(--text-muted)]">MRR Contribution</th>
                                <th className="pb-4 pt-2 px-4 font-semibold text-[var(--text-muted)]">Status / Churn</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {plansData.map((plan, idx) => {
                                const isHealthy = plan.ChurnRate < 2;
                                const isWarning = plan.ChurnRate >= 2 && plan.ChurnRate <= 3;
                                
                                return (
                                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-[var(--bg-color)] border border-white/5 flex items-center justify-center group-hover:border-[var(--primary-color)]/30 transition-colors">
                                                    <div className="icon-package text-[var(--primary-soft)] text-sm"></div>
                                                </div>
                                                <span className="font-medium text-white">{plan.Name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-[var(--text-muted)] group-hover:text-white transition-colors">
                                            {formatNumber(plan.Subscribers)}
                                        </td>
                                        <td className="py-4 px-4 font-medium">{formatCurrency(plan.MRR)}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                                                    isHealthy 
                                                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                                        : isWarning 
                                                            ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' 
                                                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                                                }`}>
                                                    {formatPercent(plan.ChurnRate)} Churn
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    } catch (error) {
        console.error("DataTable component error:", error);
        return null;
    }
}
