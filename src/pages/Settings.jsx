import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';

export default function Settings() {
    const { theme, toggleTheme, prefs, updatePref, resetPrefs } = useTheme();
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [activeTab, setActiveTab] = useState('appearance');

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }, 800);
    };

    const Toggle = ({ active, onClick }) => (
        <div 
            onClick={onClick} 
            className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 shrink-0 ${
                active ? 'bg-[var(--primary-color)] shadow-[0_0_10px_rgba(255,122,0,0.5)]' : 'bg-white/10'
            }`}
        >
            <div className={`absolute top-1 w-4 h-4 rounded-full transition-transform duration-300 ${active ? 'bg-black translate-x-7' : 'bg-gray-400 translate-x-1'}`}></div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-8 text-left animate-fade-in" data-name="settings-view">
            <div className="mb-8 text-left">
                <h2 className="text-2xl font-bold text-white tracking-tight text-left">Platform Customization</h2>
                <p className="text-[var(--text-muted)] text-sm mt-1 text-left">Customize appearance, motion, background effects, and notification rules.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                {/* Left Column: Navigation Dock */}
                <div className="md:col-span-1 space-y-2 text-left">
                    {[
                        { id: 'appearance', label: 'Appearance', icon: 'palette' },
                        { id: 'motion', label: 'Motion & Effects', icon: 'zap' },
                        { id: 'notifications', label: 'Notifications', icon: 'bell' },
                    ].map(nav => (
                        <button 
                            key={nav.id} 
                            onClick={() => setActiveTab(nav.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium text-left ${
                                activeTab === nav.id 
                                    ? 'bg-[var(--primary-color)]/10 text-white border border-[var(--primary-color)]/20' 
                                    : 'text-[var(--text-muted)] hover:bg-white/5 hover:text-white border border-transparent'
                            }`}
                        >
                            <div className={`icon-${nav.icon} ${activeTab === nav.id ? 'text-[var(--primary-color)]' : ''}`}></div>
                            {nav.label}
                        </button>
                    ))}
                </div>

                {/* Right Column: Settings Content Panels */}
                <div className="md:col-span-2 space-y-8 text-left">
                    
                    {/* Appearance Section */}
                    {activeTab === 'appearance' && (
                        <div className="card p-6 text-left">
                            <h3 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-2 text-left">
                                <div className="icon-palette text-[var(--text-muted)]"></div> Appearance
                            </h3>
                            <div className="space-y-6 text-left">
                                <div className="text-left">
                                    <h4 className="text-sm font-medium text-white mb-3 text-left">Color Theme</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                                        <div 
                                            onClick={() => theme === 'bw' && toggleTheme()} 
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-colors relative overflow-hidden group text-left ${
                                                theme !== 'bw' ? 'border-[var(--primary-color)] bg-[var(--primary-color)]/5' : 'border-white/10 bg-white/5 hover:border-white/30'
                                            }`}
                                        >
                                            {theme !== 'bw' && <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--primary-color)]/20 rounded-full blur-xl -mr-4 -mt-4"></div>}
                                            <div className="flex justify-between items-center mb-2 relative z-10 text-left">
                                                <span className="font-bold text-white text-left">Graphite + Orange</span>
                                                <div className={`icon-${theme !== 'bw' ? 'circle-check text-[var(--primary-color)]' : 'circle text-[var(--text-muted)]'}`}></div>
                                            </div>
                                            <p className="text-xs text-[var(--text-muted)] relative z-10 text-left">Premium dark mode with energetic orange accents and ambient lighting.</p>
                                        </div>
                                        <div 
                                            onClick={() => theme !== 'bw' && toggleTheme()} 
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-colors text-left ${
                                                theme === 'bw' ? 'border-white bg-white/10' : 'border-white/10 bg-white/5 hover:border-white/30'
                                            }`}
                                        >
                                            <div className="flex justify-between items-center mb-2 text-left">
                                                <span className="font-bold text-white text-left">Monochrome</span>
                                                <div className={`icon-${theme === 'bw' ? 'circle-check text-white' : 'circle text-[var(--text-muted)]'}`}></div>
                                            </div>
                                            <p className="text-xs text-[var(--text-muted)] text-left">Minimalist, distraction-free black and white analytical experience.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-left">
                                    <h4 className="text-sm font-medium text-white mb-3 text-left">Chart Style</h4>
                                    <div className="flex gap-4 text-left">
                                        <label className="flex items-center gap-2 text-sm text-[var(--text-muted)] cursor-pointer hover:text-white text-left">
                                            <input type="radio" name="chart_style" className="accent-[var(--primary-color)]" checked={prefs.chartStyle === 'smooth'} onChange={() => updatePref('chartStyle', 'smooth')} /> Smooth Curves
                                        </label>
                                        <label className="flex items-center gap-2 text-sm text-[var(--text-muted)] cursor-pointer hover:text-white text-left">
                                            <input type="radio" name="chart_style" className="accent-[var(--primary-color)]" checked={prefs.chartStyle === 'stepped'} onChange={() => updatePref('chartStyle', 'stepped')} /> Stepped Lines
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Motion & Backdrop settings */}
                    {activeTab === 'motion' && (
                        <div className="card p-6 text-left">
                            <h3 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-2 text-left">
                                <div className="icon-zap text-[var(--text-muted)]"></div> Motion & Background
                            </h3>
                            <div className="space-y-2 text-left">
                                <div className="flex justify-between items-center p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer text-left" onClick={() => updatePref('stockMarket')}>
                                    <div className="text-left">
                                        <h4 className="font-medium text-white text-sm text-left">Stock Market Animation</h4>
                                        <p className="text-xs text-[var(--text-muted)] mt-1 text-left">Render continuous canvas background data streams and candlesticks.</p>
                                    </div>
                                    <Toggle active={prefs.stockMarket} onClick={(e) => { e.stopPropagation(); updatePref('stockMarket'); }} />
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer text-left" onClick={() => updatePref('customCursor')}>
                                    <div className="text-left">
                                        <h4 className="font-medium text-white text-sm text-left">Custom Cursor Effects</h4>
                                        <p className="text-xs text-[var(--text-muted)] mt-1 text-left">Enable glowing cursor followers and magnetic hover states.</p>
                                    </div>
                                    <Toggle active={prefs.customCursor} onClick={(e) => { e.stopPropagation(); updatePref('customCursor'); }} />
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer text-left" onClick={() => updatePref('cardLighting')}>
                                    <div className="text-left">
                                        <h4 className="font-medium text-white text-sm text-left">Card Hover Lighting</h4>
                                        <p className="text-xs text-[var(--text-muted)] mt-1 text-left">Interactive radial gradients that follow mouse position inside cards.</p>
                                    </div>
                                    <Toggle active={prefs.cardLighting} onClick={(e) => { e.stopPropagation(); updatePref('cardLighting'); }} />
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer text-left" onClick={() => updatePref('reducedMotion')}>
                                    <div className="text-left">
                                        <h4 className="font-medium text-white text-sm text-left">Reduced Motion</h4>
                                        <p className="text-xs text-[var(--text-muted)] mt-1 text-left">Disable all non-essential GSAP animations and transitions.</p>
                                    </div>
                                    <Toggle active={prefs.reducedMotion} onClick={(e) => { e.stopPropagation(); updatePref('reducedMotion'); }} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications Section */}
                    {activeTab === 'notifications' && (
                        <div className="card p-6 text-left">
                            <h3 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-2 text-left">
                                <div className="icon-bell text-[var(--text-muted)]"></div> Alerts & Notifications
                            </h3>
                            <div className="space-y-2 text-left">
                                {[
                                    { id: 'revAlerts', title: 'Revenue Milestones', desc: 'Alert when MRR or ARR hits custom targets.' },
                                    { id: 'churnAlerts', title: 'AI Churn Warnings', desc: 'Predictive alerts for at-risk enterprise accounts.' },
                                    { id: 'anomalyAlerts', title: 'Anomaly Detection', desc: 'Immediate notification of unexpected data spikes or drops.' },
                                    { id: 'weeklyDigest', title: 'Weekly Digest Report', desc: 'Automated email summary of key performance metrics.' }
                                ].map((n) => (
                                    <label key={n.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer text-left">
                                        <input 
                                            type="checkbox" 
                                            checked={prefs[n.id]}
                                            onChange={() => updatePref(n.id)}
                                            className="mt-1 w-4 h-4 rounded border border-white/20 bg-[var(--surface-color)] text-[var(--primary-color)] focus:ring-0 focus:ring-offset-0 appearance-none checked:bg-[var(--primary-color)] checked:border-transparent checked:after:content-['✓'] checked:after:text-black checked:after:text-[10px] checked:after:flex checked:after:justify-center checked:after:items-center relative" 
                                        />
                                        <div className="text-left">
                                            <h4 className="text-sm font-medium text-white text-left">{n.title}</h4>
                                            <p className="text-xs text-[var(--text-muted)] mt-0.5 text-left">{n.desc}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Save Action Footer */}
                    <div className="flex justify-end gap-4 border-t border-white/10 pt-6">
                        <button onClick={resetPrefs} className="btn bg-transparent border border-white/10 hover:bg-white/5 text-white transition-colors">Reset to Defaults</button>
                        <button onClick={handleSave} className={`btn flex items-center gap-2 px-8 shadow-lg transition-all shrink-0 ${saved ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-emerald-500/20' : 'btn-primary shadow-[var(--primary-color)]/20'}`}>
                            {isSaving ? <div className="icon-loader animate-spin"></div> : saved ? <div className="icon-check"></div> : <div className="icon-save"></div>}
                            {isSaving ? 'Saving...' : saved ? 'Saved!' : 'Save Configuration'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
