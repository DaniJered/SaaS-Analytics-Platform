# NovaMetrics - SaaS Business Dashboard

A comprehensive, production-grade SaaS dashboard designed to visualize key performance indicators (KPIs) effectively with a premium UI overhaul, built using React 18, Vite, Tailwind CSS, GSAP, and Chart.js.

## Features
- **Sophisticated Design System**: Utilizes a "Graphite + Orange" and "Monochrome" theme switcher, complete with noise overlays, custom glowing cursor effects, and ambient light blobs.
- **Core KPI Cards**: Animated hero and secondary cards displaying MRR, ARR, Churn Rate, NRR, CAC, LTV, and Active Subscribers with smooth hover states and glowing accents.
- **GSAP Sidebar Navigation**: Dedicated hover-revealing collapsible dock with micro-staggers and active highlights.
- **Interactive Charts**: Line charts for MRR Growth, bar charts for New vs. Churned Customers, and a doughnut chart for Revenue Breakdown by Plan. Powered by Chart.js.
- **Data Table**: Sortable overview of subscription plans, their MRR contributions, and churn rates.
- **Real-time Database**: Fetches real SaaS demo data from Trickle's built-in database (`kpi_metrics` and `plans` tables) with seamless LocalStorage fallbacks for local and static development environments.
- **Platform Preferences**: Dynamic custom cursor follows, responsive card radial border illumination, and stock market canvas backdrops toggled instantly through settings panels.

## File Structure
- `index.html`: Entry point referencing the React module booster.
- `package.json`: NPM package manifest coordinating React 18, GSAP, and Chart.js.
- `src/`:
  - `main.jsx`: Bootstrapping entry point loading the virtual DOM.
  - `App.jsx`: Global coordinates managing tab states, modal panels, and core visual hooks.
  - `animations/`: Custom reusable GSAP transition presets.
  - `components/`: Modular building blocks split into `ui/` and `dashboard/`.
  - `context/`: `ThemeContext` managing active themes and local storage states.
  - `hooks/`: Custom state coordinates (`useCursorFollower`, `useCardGlow`, `useTheme`).
  - `layouts/`: Core app frames and headers.
  - `pages/`: Swappable analytical sections (Dashboard, Analytics, Customers, Plans, Insights, Settings).
  - `styles/`: Core styles index importing Tailwind layers.
  - `utils/`: API persistence (`api.js`) and formatting helpers (`formatters.js`).