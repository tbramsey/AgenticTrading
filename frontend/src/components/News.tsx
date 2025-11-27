import React from 'react';
import { TrendingUp, TrendingDown, Newspaper, ExternalLink } from 'lucide-react';

const App = () => {
  const newsItems = [
    { id: 1, source: "New York Times", ticker: "GOOG", rating: "Buy", summary: "Quarterly earnings exceed expectations due to AI growth." },
    { id: 2, source: "The Wall Street Journal", ticker: "AAPL", rating: "Sell", summary: "Hardware sales slump concerns investors despite services growth." },
    { id: 3, source: "CNN Business", ticker: "GOOG", rating: "Buy", summary: "Analysts upgrade target price following new cloud deals." },
    { id: 4, source: "Bloomberg", ticker: "TSLA", rating: "Sell", summary: "Production delays in European gigafactories impact outlook." },
    { id: 5, source: "MarketWatch", ticker: "NVDA", rating: "Buy", summary: "Demand for H100 chips remains at all-time highs." },
    { id: 6, source: "Reuters", ticker: "AMZN", rating: "Buy", summary: "Logistics efficiency improvements boost retail margins." },
    { id: 7, source: "CNBC", ticker: "META", rating: "Sell", summary: "Regulatory scrutiny in EU markets poses significant risk." },
    { id: 8, source: "Forbes", ticker: "MSFT", rating: "Buy", summary: "Copilot integration drives enterprise software subscriptions." },
    { id: 9, source: "Financial Times", ticker: "NFLX", rating: "Buy", summary: "Ad-tier subscribers surge past initial quarterly estimates." },
    { id: 10, source: "TechCrunch", ticker: "INTC", rating: "Sell", summary: "Foundry business struggles to compete with Asian rivals." },
    { id: 11, source: "Barron's", ticker: "AMD", rating: "Buy", summary: "New server chips gaining market share from competitors." },
    { id: 12, source: "The Economist", ticker: "JPM", rating: "Buy", summary: "Strong balance sheet positions bank well for high-rate environment." }
  ];

  // Styles defined as objects to ensure they work without Tailwind CSS
  const styles = {
    container: {
      minHeight: '30vh',
      backgroundColor: 'transparent', // Dark background for page
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      fontFamily: '"Times New Roman", Times, serif',
      boxSizing: 'border-box',
    },
    widget: {
      width: '100%',
      maxWidth: '400px',
      backgroundColor: '#52525b', // Dark grey container
      borderRadius: '24px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
      overflow: 'hidden',
      border: '4px solid #3f3f46',
    },
    header: {
      backgroundColor: '#3f3f46',
      padding: '1rem',
      borderBottom: '1px solid #27272a',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: '#e4e4e7',
    },
    headerTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      margin: 0,
    },
    badge: {
      fontSize: '0.75rem',
      color: '#a1a1aa',
      backgroundColor: '#27272a',
      padding: '0.25rem 0.5rem',
      borderRadius: '9999px',
    },
    scrollArea: {
      height: '35vh', // Fixed height for scroll wheel effect
      overflowY: 'auto',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    card: {
      backgroundColor: '#d4d4d8', // Light grey card background
      padding: '1rem',
      borderRadius: '16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s',
      cursor: 'pointer',
      position: 'relative',
    },
    source: {
      color: '#18181b',
      fontSize: '1.125rem',
      fontWeight: '500',
      marginBottom: '0.25rem',
      lineHeight: '1.25',
      margin: '0 0 0.5rem 0',
    },
    row: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '0.5rem',
    },
    ticker: {
      fontWeight: 'bold',
      color: '#27272a',
      textTransform: 'uppercase',
      fontSize: '0.875rem',
      letterSpacing: '0.05em',
    },
    rating: (type) => ({
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      color: type === 'Buy' ? '#16a34a' : '#dc2626', // Green for Buy, Red for Sell
    }),
    summary: {
      color: '#52525b',
      fontSize: '0.875rem',
      marginTop: '0.75rem',
      lineHeight: '1.4',
      opacity: '0.9',
    },
    // Footer fade to indicate scrolling
    footerGradient: {
      height: '24px',
      marginTop: '-24px',
      position: 'relative',
      zIndex: 10,
      background: 'linear-gradient(to top, rgba(82, 82, 91, 0.8), transparent)',
      pointerEvents: 'none',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.widget}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>
            <Newspaper size={20} />
            Market Watch
          </h2>
          <span style={styles.badge}>Live Feed</span>
        </div>

        {/* Scrollable List */}
        <div style={styles.scrollArea}>
          {newsItems.map((item) => (
            <div 
              key={item.id} 
              style={styles.card}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div>
                <h3 style={styles.source}>{item.source}</h3>
                
                <div style={styles.row}>
                  <span style={styles.ticker}>
                    {item.ticker}:
                  </span>
                  <span style={styles.rating(item.rating)}>
                    {item.rating}
                    {item.rating === 'Buy' ? (
                      <TrendingUp size={16} strokeWidth={3} />
                    ) : (
                      <TrendingDown size={16} strokeWidth={3} />
                    )}
                  </span>
                </div>

                <p style={styles.summary}>{item.summary}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Gradient Fade at bottom */}
        <div style={styles.footerGradient} />
      </div>
    </div>
  );
};

export default App;