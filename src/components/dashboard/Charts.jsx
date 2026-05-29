import React, { useRef, useEffect } from 'react';
import { Chart as ChartJS } from 'chart.js/auto';

export function MRRGrowthChart({ metricsData, theme }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        try {
            if (!chartRef.current || !metricsData || metricsData.length === 0) return;

            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = chartRef.current.getContext('2d');
            
            const labels = metricsData.map(d => d.Month);
            const data = metricsData.map(d => d.MRR);

            const isBW = theme === 'bw';
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            
            if (isBW) {
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
            } else {
                gradient.addColorStop(0, 'rgba(255, 122, 0, 0.4)');
                gradient.addColorStop(1, 'rgba(255, 122, 0, 0.0)');
            }

            const primaryColor = isBW ? '#FFFFFF' : '#FF7A00';

            chartInstance.current = new ChartJS(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'MRR',
                        data: data,
                        borderColor: primaryColor,
                        backgroundColor: gradient,
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: primaryColor,
                        pointBorderColor: isBW ? '#000' : '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: primaryColor,
                        pointHoverBorderColor: isBW ? '#000' : '#fff',
                        pointHoverBorderWidth: 3
                    }]
                },
                options: {
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 700,
                        easing: 'easeOutQuart'
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(15, 17, 21, 0.95)',
                            titleColor: '#A1A1AA',
                            titleFont: { size: 12, weight: 'medium' },
                            bodyColor: '#FAFAFA',
                            bodyFont: { size: 14, weight: 'bold' },
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderWidth: 1,
                            padding: 16,
                            borderRadius: 8,
                            displayColors: false,
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                                    }
                                    return label;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            grid: { color: 'rgba(255,255,255,0.03)' },
                            ticks: {
                                color: '#A1A1AA',
                                callback: function(value) {
                                    if (value >= 1000000) {
                                        return '$' + value / 1000000 + 'M';
                                    }
                                    if (value >= 1000) {
                                        return '$' + value / 1000 + 'k';
                                    }
                                    return '$' + value;
                                }
                            }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: '#A1A1AA' }
                        }
                    }
                }
            });
        } catch (error) {
            console.error("MRRGrowthChart error:", error);
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [metricsData, theme]);

    return (
        <div className="card h-96" data-name="mrr-chart">
            <h3 className="text-sm font-semibold tracking-wide uppercase text-[var(--text-muted)] mb-4">MRR Growth</h3>
            <div className="relative h-72">
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    );
}

export function NewVsChurnedChart({ metricsData }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        try {
            if (!chartRef.current || !metricsData || metricsData.length === 0) return;

            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = chartRef.current.getContext('2d');
            
            const labels = metricsData.map(d => d.Month);
            const newCustomers = metricsData.map(d => d.NewCustomers);
            const churnedCustomers = metricsData.map(d => -d.ChurnedCustomers);

            chartInstance.current = new ChartJS(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'New Customers',
                            data: newCustomers,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: 4
                        },
                        {
                            label: 'Churned Customers',
                            data: churnedCustomers,
                            backgroundColor: 'rgba(113, 113, 122, 0.6)',
                            borderRadius: 4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: '#A1A1AA' }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(23, 23, 23, 0.9)',
                            titleColor: '#FAFAFA',
                            bodyColor: '#FAFAFA',
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderWidth: 1,
                            padding: 12,
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': ' + Math.abs(context.parsed.y);
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            stacked: true,
                            grid: { color: 'rgba(255,255,255,0.03)' },
                            ticks: {
                                color: '#A1A1AA',
                                callback: function(value) {
                                    return Math.abs(value);
                                }
                            }
                        },
                        x: {
                            stacked: true,
                            grid: { display: false },
                            ticks: { color: '#A1A1AA' }
                        }
                    }
                }
            });
        } catch (error) {
            console.error("NewVsChurnedChart error:", error);
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [metricsData]);

    return (
        <div className="card h-96" data-name="new-churn-chart">
            <h3 className="text-sm font-semibold tracking-wide uppercase text-[var(--text-muted)] mb-4">New vs Churned</h3>
            <div className="relative h-72">
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    );
}

export function RevenueByPlanChart({ plansData, theme }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        try {
            if (!chartRef.current || !plansData || plansData.length === 0) return;

            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = chartRef.current.getContext('2d');
            
            const labels = plansData.map(p => p.Name);
            const data = plansData.map(p => p.MRR);
            const colors = theme === 'bw' 
                ? ['#FFFFFF', '#D4D4D8', '#A1A1AA', '#71717A', '#52525B']
                : ['#FF7A00', '#FF9833', '#FFB86B', '#FFD199', '#FFE6CC'];

            chartInstance.current = new ChartJS(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: colors.slice(0, data.length),
                        borderColor: 'transparent',
                        borderWidth: 2,
                        hoverOffset: 10
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { 
                                color: '#A1A1AA',
                                usePointStyle: true,
                                padding: 20,
                                font: { size: 12, family: "'Inter', sans-serif" }
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(23, 23, 23, 0.9)',
                            titleColor: '#FAFAFA',
                            bodyColor: '#FAFAFA',
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderWidth: 1,
                            padding: 12,
                            callbacks: {
                                label: function(context) {
                                    let label = context.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed !== null) {
                                        label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed);
                                    }
                                    return label;
                                }
                            }
                        }
                    },
                    cutout: '75%'
                }
            });
        } catch (error) {
            console.error("RevenueByPlanChart error:", error);
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [plansData, theme]);

    return (
        <div className="card h-96" data-name="revenue-plan-chart">
            <h3 className="text-sm font-semibold tracking-wide uppercase text-[var(--text-muted)] mb-4">Revenue by Plan</h3>
            <div className="relative h-72">
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    );
}
