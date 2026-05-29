export const formatCurrency = (value) => {
    if (value === undefined || value === null || isNaN(value)) return '$0';
    if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
        return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toLocaleString()}`;
};

export const formatNumber = (value) => {
    if (value === undefined || value === null || isNaN(value)) return '0';
    return value.toLocaleString();
};

export const formatPercent = (value) => {
    if (value === undefined || value === null || isNaN(value)) return '0%';
    return `${value}%`;
};
