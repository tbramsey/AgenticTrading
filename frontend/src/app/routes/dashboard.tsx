import React from 'react';
import News from '../../components/News';

const Dashboard = () => {
  // --- Data ---
  const metrics = [
    {
      title: "Total Trades",
      value: "56",
      change: "5 trades this month",
      iconType: "wallet",
      theme: "black"
    },
    {
      title: "Portfolio Value",
      value: "$98,750.00",
      change: "+24.2% this year",
      iconType: "pie",
      theme: "green"
    },
    {
      title: "Daily Change",
      value: "+$2,145.32",
      change: "+1.8% today",
      iconType: "chart",
      theme: "green"
    }
  ];

  // --- Icons ---
  const renderIcon = (type) => {
    switch (type) {
      case 'wallet':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
            <path d="M4 6v12a2 2 0 0 0 2 2h14v-4" />
            <path d="M18 12a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v-8Z" />
          </svg>
        );
      case 'pie':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
            <path d="M22 12A10 10 0 0 0 12 2v10Z" />
          </svg>
        );
      case 'chart':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18" />
            <path d="m19 9-5 5-4-4-3 3" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Styles injected directly for single-file portability */}
      <style>{`
        :root {
          --bg-dark: #09090b;
          --card-bg: #111214;
          --border-color: #27272a;
          --text-primary: #ffffff;
          --text-secondary: #a1a1aa;
          --accent-green: #10b981;
          --accent-green-bg: rgba(16, 185, 129, 0.1);
          --accent-blue: #3b82f6;
          --accent-blue-bg: rgba(59, 130, 246, 0.1);
          --accent-red: #ef4444;
          --accent-red-bg: rgba(239, 68, 68, 0.1);
          --badge-gray: #3f3f46;
          --badge-gray-bg: rgba(63, 63, 70, 0.5);
        }

        /* Reset & Base */
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .dashboard-container {
          background-color: var(--bg-dark);
          color: var(--text-primary);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          min-height: 100vh;
          padding: 2rem;
        }

        /* Header */
        header { margin-bottom: 2rem; }
        h1 { font-size: 1.875rem; font-weight: 700; margin-bottom: 0.25rem; }
        .subtitle { color: var(--text-secondary); font-size: 1rem; }

        /* Top Metrics Grid */
        .metrics-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }
        @media (min-width: 768px) {
          .metrics-grid { grid-template-columns: repeat(3, 1fr); }
        }

        /* Card Styles */
        .card {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 0.75rem;
          padding: 1.5rem;
        }

        /* Metric Card Specifics */
        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0rem;
        }
        .metric-title { color: var(--text-secondary); font-size: 0.875rem; font-weight: 500; margin-bottom: 0.25rem; }
        .metric-value { font-size: 1.875rem; font-weight: 700; }
        .icon-box {
          padding: 0.75rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .metric-change { font-size: 0.875rem; font-weight: 500; }

        /* Colors */
        .text-green { color: var(--accent-green); }
        .bg-green { background-color: var(--accent-green-bg); }
        .text-blue { color: var(--accent-blue); }
        .bg-blue { background-color: var(--accent-blue-bg); }
        .text-red { color: var(--accent-red); }
        .bg-red { background-color: var(--accent-red-bg); }
        .text-gray { color: #d4d4d8; }
        .bg-gray { background-color: var(--badge-gray-bg); }

        /* Main Content Grid */
        .main-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        
        /* Adjusted Grid Ratio to make the right column wider */
        @media (min-width: 1024px) {
          .main-content { 
            grid-template-columns: 3fr 2fr; /* Changed from 2fr 1fr to 3fr 2fr */
          }
        }

        /* Section Headers */
        h3 { font-size: 1.25rem; font-weight: 700; margin-bottom: 1.5rem; }

        /* Quick Stats */
        .stat-group { margin-bottom: 2rem; }
        .stat-label-row { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
        .stat-label { color: var(--text-secondary); font-size: 0.875rem; }
        .progress-bg {
          width: 100%;
          background-color: var(--border-color);
          height: 0.5rem;
          border-radius: 9999px;
          margin-bottom: 0.5rem;
        }
        .progress-fill {
          background-color: var(--accent-green);
          height: 100%;
          border-radius: 9999px;
          width: 85%;
        }
        .stat-value-text { color: #71717a; font-size: 0.875rem; }
        .big-stat { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); }
      `}</style>

      {/* --- Header --- */}
      <header>
        <h1>Dashboard</h1>
        <p className="subtitle">Welcome back to your fintech dashboard</p>
      </header>

      {/* --- Top Metrics --- */}
      <div className="metrics-grid">
        {metrics.map((item, index) => (
          <div key={index} className="card">
            <div className="metric-header">
              <div>
                <p className="metric-title">{item.title}</p>
                <h2 className="metric-value">{item.value}</h2>
              </div>
              <div className={`icon-box text-${item.theme} bg-${item.theme}`}>
                {renderIcon(item.iconType)}
              </div>
            </div>
            <p className={`metric-change text-${item.theme}`}>{item.change}</p>
          </div>
        ))}
      </div>

      {/* --- Main Content --- */}
      <div className="main-content">
        
        {/* Left: News Component */}
        <div>
            <News />
        </div>

        {/* Right: Quick Stats */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h3>Quick Stats</h3>
          
          {/* Account Health */}
          <div className="stat-group">
            <div className="stat-label-row">
              <span className="stat-label">Account Health</span>
            </div>
            <div className="progress-bg">
              <div className="progress-fill"></div>
            </div>
            <p className="stat-value-text">Excellent</p>
          </div>

          {/* Risk Level */}
          <div className="stat-group">
            <p className="stat-label" style={{ marginBottom: '0.25rem' }}>Risk Level</p>
            <p className="big-stat">Low</p>
          </div>

          {/* Active Positions */}
          <div className="stat-group">
            <p className="stat-label" style={{ marginBottom: '0.25rem' }}>Active Positions</p>
            <p className="big-stat">12</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;