import React, { useState, useEffect, useCallback, useMemo, useRef, Component } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { useCursorFollower } from './hooks/useCursorFollower';
import { useCardGlow } from './hooks/useCardGlow';
import { fetchKPIMetrics, fetchPlans } from './utils/api';
import MainLayout from './layouts/MainLayout';
import UpdateForm from './components/dashboard/UpdateForm';

// Page Views
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Customers from './pages/Customers';
import Plans from './pages/Plans';
import Insights from './pages/Insights';
import Settings from './pages/Settings';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F1115] text-white">
          <div className="text-center card">
            <h1 className="text-2xl font-bold mb-4 text-white">Something went wrong</h1>
            <p className="text-[#9CA3AF] mb-4">We're sorry, but something unexpected happened.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainApp() {
    const [metrics, setMetrics] = useState([]);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('12M');
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [currentTab, setCurrentTab] = useState('dashboard');
    
    const followerRef = useRef(null);

    // Bind custom cursor follower and mouse radial illuminated card lighting
    useCursorFollower(followerRef);
    useCardGlow();

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [metricsData, plansData] = await Promise.all([
                fetchKPIMetrics(),
                fetchPlans()
            ]);
            setMetrics(metricsData);
            setPlans(plansData);
        } catch (error) {
            console.error("Error loading app data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const filteredMetrics = useMemo(() => {
        if (!metrics || metrics.length === 0) return [];
        let numMonths = 12;
        if (timeRange === '6M') numMonths = 6;
        if (timeRange === '3M') numMonths = 3;
        return metrics.slice(-numMonths);
    }, [metrics, timeRange]);

    const currentMetrics = filteredMetrics.length > 0 ? filteredMetrics[filteredMetrics.length - 1] : null;
    const previousMetrics = filteredMetrics.length > 1 ? filteredMetrics[filteredMetrics.length - 2] : null;

    const renderTabContent = () => {
        if (loading) {
            return (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="h-40 bg-[var(--surface-color)]/50 rounded-2xl animate-pulse"></div>
                        <div className="h-40 bg-[var(--surface-color)]/50 rounded-2xl animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                        {[...Array(6)].map((_, i) => <div key={i} className="h-32 bg-[var(--surface-color)]/50 rounded-2xl animate-pulse"></div>)}
                    </div>
                </div>
            );
        }

        switch(currentTab) {
            case 'dashboard':
                return <Dashboard 
                            currentMetrics={currentMetrics} 
                            previousMetrics={previousMetrics} 
                            filteredMetrics={filteredMetrics} 
                            plans={plans} 
                        />;
            case 'analytics':
                return <Analytics />;
            case 'customers':
                return <Customers />;
            case 'plans':
                return <Plans plans={plans} />;
            case 'insights':
                return <Insights />;
            case 'settings':
                return <Settings />;
            default:
                return <Dashboard currentMetrics={currentMetrics} previousMetrics={previousMetrics} filteredMetrics={filteredMetrics} plans={plans} />;
        }
    };

    return (
        <React.Fragment>
            {/* Custom glowing cursor follower element */}
            <div ref={followerRef} className="cursor-follower"></div>

            <MainLayout
                timeRange={timeRange}
                setTimeRange={setTimeRange}
                onRefresh={loadData}
                onUpdateMetrics={() => setShowUpdateModal(true)}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
            >
                <div className="animate-fade-in" style={{ animationDuration: '0.4s' }} key={currentTab}>
                    {renderTabContent()}
                </div>
            </MainLayout>

            <UpdateForm 
                isOpen={showUpdateModal} 
                onClose={() => setShowUpdateModal(false)} 
                onSuccess={loadData} 
            />
        </React.Fragment>
    );
}

export default function App() {
    return (
        <ErrorBoundary>
            <ThemeProvider>
                <MainApp />
            </ThemeProvider>
        </ErrorBoundary>
    );
}
