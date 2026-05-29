import React from 'react';
import { useTheme } from '../hooks/useTheme';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import Sidebar from '../components/ui/Sidebar';
import CustomDropdown from '../components/ui/CustomDropdown';

export default function MainLayout({ 
    children, 
    timeRange, 
    setTimeRange, 
    onRefresh, 
    onUpdateMetrics, 
    currentTab, 
    setCurrentTab 
}) {
    const { theme, toggleTheme } = useTheme();

    const tabTitles = {
        dashboard: { title: 'Overview', subtitle: 'Performance snapshot and trends' },
        analytics: { title: 'Analytics', subtitle: 'Deep business intelligence' },
        customers: { title: 'Customers', subtitle: 'Customer health and journey' },
        plans: { title: 'Plans', subtitle: 'Subscription strategy and monetization' },
        insights: { title: 'Insights', subtitle: 'AI-powered business intelligence' },
        settings: { title: 'Settings', subtitle: 'Experience customization' }
    };

    const currentTitle = tabTitles[currentTab] || tabTitles.dashboard;

    return (
        <div className="flex h-screen bg-[var(--bg-color)] overflow-hidden transition-colors duration-500 text-left w-full" data-name="main-layout">
            
            {/* Dynamic stock market grid backdrop */}
            <AnimatedBackground currentTab={currentTab} />
            
            {/* Ambient aesthetic gradient light blobs */}
            <div className="ambient-blob w-[600px] h-[600px] top-[-200px] left-[-200px] opacity-[0.03] z-0" style={{ backgroundColor: 'var(--ambient-1)' }}></div>
            <div className="ambient-blob w-[500px] h-[500px] bottom-[-100px] right-[-100px] opacity-[0.02] z-0" style={{ backgroundColor: 'var(--ambient-2)' }}></div>
            
            {/* Collapsible hover reveal navigation dock */}
            <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

            <div className="flex-1 flex flex-col h-screen overflow-y-auto relative z-10 w-full text-left">
                
                {/* Sticky layout header */}
                <header className="sticky top-0 z-30 border-b border-[var(--border-color)] text-left shrink-0" style={{ backdropFilter: 'blur(20px)', background: 'rgba(15, 17, 21, 0.6)' }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex flex-col sm:flex-row items-start sm:items-center justify-center sm:justify-between text-left">
                        <div className="hidden sm:block text-left">
                            <h2 className="text-xl font-bold text-white tracking-tight text-left">{currentTitle.title}</h2>
                            <p className="text-sm text-[var(--text-muted)] text-left">{currentTitle.subtitle}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end mt-2 sm:mt-0">
                            {/* Color mode switcher */}
                            <button 
                                className="btn border border-[var(--border-color)] bg-white/5 hover:bg-white/10 text-[var(--text-main)] text-sm flex items-center justify-center w-10 h-10 backdrop-blur-md transition-all duration-300 rounded-full shrink-0"
                                onClick={toggleTheme}
                                title="Toggle Theme"
                            >
                                <div className={`text-lg transition-transform duration-500 ${theme === 'bw' ? 'icon-moon scale-100 rotate-0' : 'icon-sun scale-110 rotate-90'}`}></div>
                            </button>
                            
                            {/* Period select dropdown */}
                            <CustomDropdown 
                                value={timeRange} 
                                onChange={setTimeRange} 
                                options={[
                                    { label: 'Last 3 Months', value: '3M' },
                                    { label: 'Last 6 Months', value: '6M' },
                                    { label: 'Last 12 Months', value: '12M' }
                                ]} 
                            />

                            {/* Refresh action trigger */}
                            <button className="btn border border-[var(--border-color)] bg-white/5 hover:bg-white/10 text-sm flex items-center gap-2 backdrop-blur-md shrink-0" onClick={onRefresh}>
                                <div className="icon-refresh-cw w-4 h-4"></div>
                                <span className="hidden sm:inline">Refresh</span>
                            </button>
                            
                            {/* Entry addition trigger */}
                            <button className="btn btn-primary text-sm flex items-center gap-2 shrink-0" onClick={onUpdateMetrics}>
                                <div className="icon-plus w-4 h-4"></div>
                                <span className="hidden sm:inline">Update</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Primary layout body */}
                <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex-grow">
                    {children}
                </main>

                {/* Platform legal summary footer */}
                <footer className="py-6 text-center text-sm text-[var(--text-muted)] border-t border-[var(--border-color)] bg-black/20 backdrop-blur-md shrink-0">
                    &copy; 2026 NovaMetrics SaaS. All rights reserved.
                </footer>
            </div>
        </div>
    );
}
