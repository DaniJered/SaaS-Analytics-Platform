// Utility functions to interact with Trickle database with local storage fallbacks

const fallbackMetrics = [
    { Month: "2025-06", MRR: 120000, ARR: 1440000, ChurnRate: 2.1, NRR: 104, CAC: 180, LTV: 2400, Subscribers: 1200, NewCustomers: 85, ChurnedCustomers: 25 },
    { Month: "2025-07", MRR: 128000, ARR: 1536000, ChurnRate: 1.9, NRR: 106, CAC: 175, LTV: 2500, Subscribers: 1260, NewCustomers: 90, ChurnedCustomers: 24 },
    { Month: "2025-08", MRR: 135000, ARR: 1620000, ChurnRate: 2.0, NRR: 107, CAC: 170, LTV: 2550, Subscribers: 1320, NewCustomers: 95, ChurnedCustomers: 26 },
    { Month: "2025-09", MRR: 142000, ARR: 1704000, ChurnRate: 1.8, NRR: 108, CAC: 168, LTV: 2600, Subscribers: 1390, NewCustomers: 102, ChurnedCustomers: 25 },
    { Month: "2025-10", MRR: 151000, ARR: 1812000, ChurnRate: 1.7, NRR: 110, CAC: 165, LTV: 2700, Subscribers: 1470, NewCustomers: 110, ChurnedCustomers: 25 },
    { Month: "2025-11", MRR: 160000, ARR: 1920000, ChurnRate: 1.5, NRR: 112, CAC: 160, LTV: 2800, Subscribers: 1550, NewCustomers: 115, ChurnedCustomers: 23 },
    { Month: "2025-12", MRR: 170000, ARR: 2040000, ChurnRate: 1.6, NRR: 111, CAC: 162, LTV: 2850, Subscribers: 1630, NewCustomers: 120, ChurnedCustomers: 26 },
    { Month: "2026-01", MRR: 178000, ARR: 2136000, ChurnRate: 1.4, NRR: 113, CAC: 158, LTV: 2900, Subscribers: 1710, NewCustomers: 122, ChurnedCustomers: 24 },
    { Month: "2026-02", MRR: 186000, ARR: 2232000, ChurnRate: 1.5, NRR: 114, CAC: 155, LTV: 3000, Subscribers: 1780, NewCustomers: 118, ChurnedCustomers: 27 },
    { Month: "2026-03", MRR: 195000, ARR: 2340000, ChurnRate: 1.3, NRR: 115, CAC: 150, LTV: 3100, Subscribers: 1860, NewCustomers: 130, ChurnedCustomers: 24 },
    { Month: "2026-04", MRR: 205000, ARR: 2460000, ChurnRate: 1.2, NRR: 116, CAC: 145, LTV: 3200, Subscribers: 1940, NewCustomers: 135, ChurnedCustomers: 23 },
    { Month: "2026-05", MRR: 215000, ARR: 2580000, ChurnRate: 1.1, NRR: 118, CAC: 140, LTV: 3300, Subscribers: 2022, NewCustomers: 145, ChurnedCustomers: 22 }
];

const fallbackPlans = [
    { Name: "Starter", Subscribers: 1000, MRR: 21000, ChurnRate: 2.5 },
    { Name: "Pro", Subscribers: 842, MRR: 84000, ChurnRate: 1.5 },
    { Name: "Enterprise", Subscribers: 180, MRR: 110000, ChurnRate: 0.5 }
];

// Initialize LocalStorage if empty
if (!localStorage.getItem('kpi_metrics')) {
    localStorage.setItem('kpi_metrics', JSON.stringify(fallbackMetrics));
}
if (!localStorage.getItem('plans')) {
    localStorage.setItem('plans', JSON.stringify(fallbackPlans));
}

export async function fetchKPIMetrics() {
    // If Trickle environment globals exist, attempt standard queries
    if (window.trickleListObjects) {
        try {
            const result = await window.trickleListObjects('kpi_metrics', 100, false);
            if (result && result.items) {
                return result.items.map(item => item.objectData).sort((a, b) => a.Month.localeCompare(b.Month));
            }
        } catch (error) {
            console.warn("Trickle Database fetch failed. Reverting to local fallback.", error);
        }
    }
    
    // Otherwise fallback to localStorage
    const saved = localStorage.getItem('kpi_metrics');
    return JSON.parse(saved).sort((a, b) => a.Month.localeCompare(b.Month));
}

export async function fetchPlans() {
    if (window.trickleListObjects) {
        try {
            const result = await window.trickleListObjects('plans', 100, false);
            if (result && result.items) {
                return result.items.map(item => item.objectData);
            }
        } catch (error) {
            console.warn("Trickle Database fetch failed. Reverting to local fallback.", error);
        }
    }

    const saved = localStorage.getItem('plans');
    return JSON.parse(saved);
}

export async function addKPIMetric(data) {
    if (window.trickleCreateObject) {
        try {
            await window.trickleCreateObject('kpi_metrics', data);
            return true;
        } catch (error) {
            console.warn("Trickle Database create failed. Reverting to local fallback.", error);
        }
    }

    // Fallback updates in localStorage
    const saved = JSON.parse(localStorage.getItem('kpi_metrics'));
    
    // Replace if month exists, otherwise push
    const index = saved.findIndex(item => item.Month === data.Month);
    if (index !== -1) {
        saved[index] = data;
    } else {
        saved.push(data);
    }
    
    localStorage.setItem('kpi_metrics', JSON.stringify(saved));
    return true;
}
