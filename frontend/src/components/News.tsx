import React from 'react';
import { TrendingUp, TrendingDown, Newspaper } from 'lucide-react';

const News = () => {
  const newsItems = [
    { id: 1, source: "New York Times", ticker: "GIS", rating: "Buy", summary: "Hamburger Helper Sales Rise as Americans Try to Stretch Their Food Dollars", url: "https://www.nytimes.com/2025/09/20/business/hamburger-helper-food-prices.html" },
    { id: 2, source: "CNBC", ticker: "GOOG", rating: "Buy", summary: "Gemini 3 — and the custom chips that power it — is a wake up call for AI investors", url: "https://www.cnbc.com/2025/11/25/gemini-3-and-the-custom-chips-that-train-it-is-a-wake-up-call-for-ai-investors.html" },
    { id: 3, source: "Reuters", ticker: "MS", rating: "Sell", summary: "Dutch prosecutor fines Morgan Stanley 101 million euros for tax evasion", url: "https://www.reuters.com/business/dutch-prosecutor-fines-morgan-stanley-101-million-euros-tax-evasion-2025-11-27/" },
    { id: 4, source: "Bloomberg", ticker: "TSLA", rating: "Sell", summary: "Production delays in European gigafactories impact outlook.", url: "#" },
    { id: 5, source: "MarketWatch", ticker: "NVDA", rating: "Buy", summary: "Demand for H100 chips remains at all-time highs.", url: "#" },
    { id: 6, source: "Reuters", ticker: "AMZN", rating: "Buy", summary: "Logistics efficiency improvements boost retail margins.", url: "#" },
    { id: 7, source: "CNBC", ticker: "META", rating: "Sell", summary: "Regulatory scrutiny in EU markets poses significant risk.", url: "#" },
    { id: 8, source: "Forbes", ticker: "MSFT", rating: "Buy", summary: "Copilot integration drives enterprise software subscriptions.", url: "#" },
    { id: 9, source: "Financial Times", ticker: "NFLX", rating: "Buy", summary: "Ad-tier subscribers surge past initial quarterly estimates.", url: "#" },
    { id: 10, source: "TechCrunch", ticker: "INTC", rating: "Sell", summary: "Foundry business struggles to compete with Asian rivals.", url: "#" },
    { id: 11, source: "Barron's", ticker: "AMD", rating: "Buy", summary: "New server chips gaining market share from competitors.", url: "#" },
    { id: 12, source: "The Economist", ticker: "JPM", rating: "Buy", summary: "Strong balance sheet positions bank well for high-rate environment.", url: "#" }
  ];

  // Styles defined to match the #111214 / #09090b dark theme
  const styles = {
    container: {
      minHeight: '30vh',
      backgroundColor: '#09090b', // Main Dashboard BG color
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      boxSizing: 'border-box',
    },
    widget: {
      width: '100%',
      backgroundColor: '#111214', // Card BG color from dashboard
      borderRadius: '12px',       // Matched rounded corners
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
      overflow: 'hidden',
      border: '1px solid #27272a', // Subtle dark border
    },
    header: {
      backgroundColor: '#111214',
      padding: '1.5rem',
      borderBottom: '1px solid #27272a',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: '#ffffff',
    },
    headerTitle: {
      fontSize: '1.25rem',
      fontWeight: '700',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      margin: 0,
    },
    badge: {
      fontSize: '0.75rem',
      fontWeight: '600',
      color: '#10b981',             // Emerald Green Text
      backgroundColor: 'rgba(16, 185, 129, 0.1)', // Emerald Green BG (low opacity)
      padding: '0.25rem 0.75rem',
      borderRadius: '6px',
    },
    scrollArea: {
      height: '42vh',
      overflowY: 'auto',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    card: {
      display: 'block', // Ensures the anchor tag behaves like a block box
      textDecoration: 'none', // Removes default underline
      backgroundColor: '#18181b', // Slightly lighter than widget bg
      border: '1px solid #27272a',
      padding: '1rem',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      position: 'relative',
    },
    source: {
      color: '#e4e4e7', // Light gray/white
      fontSize: '1rem',
      fontWeight: '600',
      marginBottom: '0.25rem',
      lineHeight: '1.25',
      margin: '0 0 0.5rem 0',
    },
    row: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '0.75rem',
      marginBottom: '0.5rem',
    },
    ticker: {
      fontWeight: '600',
      color: '#a1a1aa', // Muted gray
      textTransform: 'uppercase',
      fontSize: '0.75rem',
      letterSpacing: '0.05em',
      backgroundColor: '#27272a',
      padding: '2px 6px',
      borderRadius: '4px',
    },
    rating: (type) => ({
      fontWeight: '600',
      fontSize: '0.875rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      color: type === 'Buy' ? '#10b981' : '#ef4444', // Emerald Green vs Red
    }),
    summary: {
      color: '#a1a1aa', // Secondary text color
      fontSize: '0.875rem',
      marginTop: '0.5rem',
      lineHeight: '1.5',
    },
    // Footer fade to match the dark theme #111214
    footerGradient: {
      height: '40px',
      marginTop: '-40px',
      position: 'relative',
      zIndex: 10,
      background: 'linear-gradient(to top, #111214, transparent)',
      pointerEvents: 'none',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.widget}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>
            <Newspaper size={20} className="text-gray-400" />
            Market Watch
          </h2>
          <span style={styles.badge}>Live Feed</span>
        </div>

        {/* Scrollable List */}
        <div style={styles.scrollArea}>
          {newsItems.map((item) => (
            <a 
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = '#3f3f46';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#27272a';
              }}
            >
              <div>
                <h3 style={styles.source}>{item.source}</h3>
                <p style={styles.summary}>{item.summary}</p>

                <div style={styles.row}>
                  <span style={styles.ticker}>
                    {item.ticker}
                  </span>
                  <span style={styles.rating(item.rating)}>
                    {item.rating}
                    {item.rating === 'Buy' ? (
                      <TrendingUp size={14} strokeWidth={2.5} />
                    ) : (
                      <TrendingDown size={14} strokeWidth={2.5} />
                    )}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
        
        {/* Gradient Fade at bottom */}
        <div style={styles.footerGradient} />
      </div>
    </div>
  );
};

export default News;