import React, { createContext, useState, useEffect, useCallback } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'default';
    });

    const [prefs, setPrefs] = useState(() => {
        const saved = localStorage.getItem('preferences');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                // fall back to default
            }
        }
        return {
            stockMarket: true,
            customCursor: true,
            cardLighting: true,
            reducedMotion: false,
            revAlerts: true,
            churnAlerts: true,
            anomalyAlerts: true,
            weeklyDigest: false,
            chartStyle: 'smooth'
        };
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('preferences', JSON.stringify(prefs));
    }, [prefs]);

    const toggleTheme = useCallback(() => {
        setTheme(prev => prev === 'default' ? 'bw' : 'default');
    }, []);

    const updatePref = useCallback((key, val) => {
        setPrefs(prev => ({
            ...prev,
            [key]: val !== undefined ? val : !prev[key]
        }));
    }, []);

    const resetPrefs = useCallback(() => {
        setPrefs({
            stockMarket: true,
            customCursor: true,
            cardLighting: true,
            reducedMotion: false,
            revAlerts: true,
            churnAlerts: true,
            anomalyAlerts: true,
            weeklyDigest: false,
            chartStyle: 'smooth'
        });
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, prefs, updatePref, resetPrefs }}>
            {children}
        </ThemeContext.Provider>
    );
};
