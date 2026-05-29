import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { animateSidebarExpand, animateSidebarCollapse } from '../../animations/sidebar';

export default function Sidebar({ currentTab, setCurrentTab }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { prefs } = useTheme();
    const sidebarRef = useRef(null);
    const titleRef = useRef(null);
    const labelsRef = useRef([]);

    const menuItems = [
        { id: 'dashboard', icon: 'layout-dashboard', label: 'Dashboard' },
        { id: 'analytics', icon: 'chart-line', label: 'Analytics' },
        { id: 'customers', icon: 'users', label: 'Customers' },
        { id: 'plans', icon: 'credit-card', label: 'Plans' },
        { id: 'insights', icon: 'sparkles', label: 'Insights' },
        { id: 'settings', icon: 'settings', label: 'Settings' }
    ];

    // Trigger high-performance GSAP sidebar animations
    useEffect(() => {
        if (!sidebarRef.current) return;
        if (prefs.reducedMotion) {
            // Bypass GSAP if reduced motion is enabled
            return;
        }

        const labels = labelsRef.current.filter(Boolean);
        if (isExpanded) {
            animateSidebarExpand(sidebarRef.current, titleRef.current, labels);
        } else {
            animateSidebarCollapse(sidebarRef.current, titleRef.current, labels);
        }
    }, [isExpanded, prefs.reducedMotion]);

    return (
        <aside 
            ref={sidebarRef}
            className="h-screen border-r border-[var(--border-color)] flex flex-col py-6 bg-[var(--surface-color)]/70 backdrop-blur-2xl relative z-40 hidden sm:flex shrink-0 overflow-hidden"
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            style={{ 
                width: isExpanded ? '256px' : '80px', 
                transition: prefs.reducedMotion ? 'width 0.3s ease' : 'none' 
            }}
        >
            {/* Sidebar Logo Header */}
            <div className={`flex items-center gap-3 mb-12 w-full px-5 ${isExpanded ? 'justify-start' : 'justify-center'}`}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white to-gray-400 flex items-center justify-center shadow-[0_4px_12px_rgba(255,255,255,0.1)] shrink-0 transition-transform duration-[300ms] hover:scale-105">
                    <div className="icon-activity text-black text-xl"></div>
                </div>
                <h1 
                    ref={titleRef}
                    className="text-xl font-bold tracking-tight text-white whitespace-nowrap overflow-hidden"
                    style={{ 
                        opacity: isExpanded || prefs.reducedMotion ? 1 : 0, 
                        display: isExpanded || prefs.reducedMotion ? 'block' : 'none' 
                    }}
                >
                    Nova<span className="text-gray-400">Metrics</span>
                </h1>
            </div>

            {/* Navigation Menus */}
            <nav className="w-full flex flex-col gap-2 flex-1 px-3">
                {menuItems.map((item, idx) => {
                    const active = currentTab === item.id;
                    return (
                        <button 
                            key={item.id}
                            onClick={() => setCurrentTab(item.id)}
                            className={`flex items-center gap-3 py-3 rounded-xl transition-all duration-[180ms] group relative w-full ${isExpanded ? 'px-3' : 'justify-center'} ${active ? 'text-white bg-white/10 shadow-inner' : 'text-[var(--text-muted)] hover:text-white hover:bg-white/[0.04]'}`}
                        >
                            {active && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full shadow-[0_0_12px_rgba(255,255,255,0.4)]"></div>
                            )}
                            <div className={`icon-${item.icon} text-xl transition-colors duration-[180ms] shrink-0 ${active ? 'text-[var(--primary-color)]' : 'group-hover:text-white'}`}></div>
                            <span 
                                ref={el => labelsRef.current[idx] = el}
                                className="font-medium whitespace-nowrap overflow-hidden text-sm"
                                style={{ 
                                    opacity: isExpanded || prefs.reducedMotion ? 1 : 0, 
                                    display: isExpanded || prefs.reducedMotion ? 'block' : 'none' 
                                }}
                            >
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </nav>

            {/* Admin Profile Drawer Section */}
            <div className="w-full mt-auto px-3">
                <button className={`flex items-center gap-3 py-3 rounded-xl text-[var(--text-muted)] hover:text-white hover:bg-white/[0.04] transition-all duration-[180ms] w-full group ${isExpanded ? 'px-3' : 'justify-center'}`}>
                    <div className="w-8 h-8 rounded-full bg-[var(--bg-color)] border border-[var(--border-color)] overflow-hidden shrink-0 flex items-center justify-center transition-transform duration-[300ms] group-hover:scale-105">
                        <div className="icon-user text-sm group-hover:text-white"></div>
                    </div>
                    <div 
                        className="flex flex-col items-start overflow-hidden whitespace-nowrap text-left"
                        style={{ display: isExpanded || prefs.reducedMotion ? 'flex' : 'none' }}
                    >
                        <span className="text-sm font-medium text-white truncate w-32">Admin User</span>
                        <span className="text-xs text-[var(--text-muted)] truncate w-32">admin@nova.io</span>
                    </div>
                </button>
            </div>
        </aside>
    );
}
