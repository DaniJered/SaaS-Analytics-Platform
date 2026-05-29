import React from 'react';
import KPISection from '../components/dashboard/KPICards';
import { MRRGrowthChart, NewVsChurnedChart, RevenueByPlanChart } from '../components/dashboard/Charts';
import { ProgressWidgets } from '../components/dashboard/Widgets';

export default function Dashboard({ currentMetrics, previousMetrics, filteredMetrics, plans }) {
    return (
        <div className="space-y-8" data-name="dashboard-view">
            <KPISection 
                currentMetrics={currentMetrics} 
                previousMetrics={previousMetrics} 
                historicalData={filteredMetrics} 
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-1">
                    <MRRGrowthChart metricsData={filteredMetrics} />
                </div>
                <div className="lg:col-span-1">
                    <NewVsChurnedChart metricsData={filteredMetrics} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-1">
                    <RevenueByPlanChart plansData={plans} />
                </div>
                <div className="lg:col-span-1">
                    <ProgressWidgets />
                </div>
            </div>
        </div>
    );
}
