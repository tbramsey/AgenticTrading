import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const MarketOverview = () => {
  // --- Data ---
  const marketIndices = [
    { name: "S&P 500", value: "4,567.89", change: "+105.23", percent: "2.36%", isPositive: true },
    { name: "NASDAQ", value: "14,234.56", change: "+234.12", percent: "1.67%", isPositive: true },
    { name: "DOW JONES", value: "35,678.90", change: "-45.67", percent: "-0.13%", isPositive: false },
  ];

  const topStocks = [
    { company: "Apple Inc.", ticker: "AAPL", price: "$178.5", change: "+8.5%", volume: "52.3M", marketCap: "$2.8T", isPositive: true },
    { company: "Alphabet Inc.", ticker: "GOOGL", price: "$142.3", change: "+5.2%", volume: "52.3M", marketCap: "$1.8T", isPositive: true },
    { company: "Tesla Inc.", ticker: "TSLA", price: "$245.8", change: "-2.3%", volume: "52.3M", marketCap: "$780B", isPositive: false },
    { company: "Microsoft Corp.", ticker: "MSFT", price: "$378.9", change: "+3.8%", volume: "52.3M", marketCap: "$2.8T", isPositive: true },
    { company: "Apple Inc.", ticker: "AAPL", price: "$178.5", change: "+8.5%", volume: "52.3M", marketCap: "$2.8T", isPositive: true },
    { company: "Alphabet Inc.", ticker: "GOOGL", price: "$142.3", change: "+5.2%", volume: "52.3M", marketCap: "$1.8T", isPositive: true },
    { company: "Tesla Inc.", ticker: "TSLA", price: "$245.8", change: "-2.3%", volume: "52.3M", marketCap: "$780B", isPositive: false },
    { company: "Microsoft Corp.", ticker: "MSFT", price: "$378.9", change: "+3.8%", volume: "52.3M", marketCap: "$2.8T", isPositive: true },
  ];

  // --- CSS Styles ---
  const styles = {
    container: {
      backgroundColor: '#09090b',
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      minHeight: '100vh',
      padding: '2rem',
      boxSizing: 'border-box',
    },
    header: { marginBottom: '2rem' },
    title: { fontSize: '1.875rem', fontWeight: '700', margin: '0 0 0.5rem 0' },
    subtitle: { color: '#a1a1aa', fontSize: '1rem', margin: 0 },
    
    // Indices Section
    indicesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '3rem',
    },
    indexCard: {
      backgroundColor: '#111214',
      border: '1px solid #27272a',
      borderRadius: '12px',
      padding: '1.5rem',
    },
    indexHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
    },
    indexName: { color: '#a1a1aa', fontSize: '0.875rem', fontWeight: '600', margin: 0 },
    indexValue: { fontSize: '2rem', fontWeight: '700', margin: '0 0 0.5rem 0' },
    indexChange: { fontSize: '0.875rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' },
    
    // Top Stocks Section
    stocksSectionTitle: { fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' },
    tableContainer: {
      backgroundColor: '#111214',
      border: '1px solid #27272a',
      borderRadius: '12px',
      overflowX: 'auto', // For smaller screens
    },
    table: { width: '100%', borderCollapse: 'collapse', color: '#ffffff' },
    th: {
      textAlign: 'left',
      padding: '1rem 1.5rem',
      color: '#a1a1aa',
      fontSize: '0.875rem',
      fontWeight: '600',
      borderBottom: '1px solid #27272a',
    },
    td: {
      padding: '1rem 1.5rem',
      fontSize: '0.875rem',
      fontWeight: '600',
      borderBottom: '1px solid #27272a',
    },
    companyCell: { display: 'flex', flexDirection: 'column' },
    companyName: { fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' },
    ticker: { color: '#a1a1aa', fontSize: '0.75rem' },

    // Utility
    textGreen: { color: '#10b981' },
    textRed: { color: '#ef4444' },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Market Overview</h1>
        <p style={styles.subtitle}>Real-time market conditions and stock prices</p>
      </header>

      {/* Market Indices */}
      <div style={styles.indicesGrid}>
        {marketIndices.map((index, i) => (
          <div key={i} style={styles.indexCard}>
            <div style={styles.indexHeader}>
              <h3 style={styles.indexName}>{index.name}</h3>
              {index.isPositive ? (
                <ArrowUp size={20} style={styles.textGreen} />
              ) : (
                <ArrowDown size={20} style={styles.textRed} />
              )}
            </div>
            <h2 style={styles.indexValue}>{index.value}</h2>
            <p style={{ ...styles.indexChange, ...(index.isPositive ? styles.textGreen : styles.textRed) }}>
              {index.change} ({index.percent})
            </p>
          </div>
        ))}
      </div>

      {/* Top Stocks Table */}
      <div>
        <h2 style={styles.stocksSectionTitle}>Top Stocks</h2>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Company</th>
                <th style={{...styles.th, textAlign: 'right'}}>Price</th>
                <th style={{...styles.th, textAlign: 'right'}}>Change</th>
                <th style={{...styles.th, textAlign: 'right'}}>Volume</th>
                <th style={{...styles.th, textAlign: 'right'}}>Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {topStocks.map((stock, i) => (
                <tr key={i} style={i === topStocks.length - 1 ? { borderBottom: 'none' } : {}}>
                  <td style={styles.td}>
                    <div style={styles.companyCell}>
                      <span style={styles.companyName}>{stock.company}</span>
                      <span style={styles.ticker}>{stock.ticker}</span>
                    </div>
                  </td>
                  <td style={{...styles.td, textAlign: 'right'}}>{stock.price}</td>
                  <td style={{...styles.td, textAlign: 'right', ...(stock.isPositive ? styles.textGreen : styles.textRed)}}>
                    {stock.change}
                  </td>
                  <td style={{...styles.td, textAlign: 'right'}}>{stock.volume}</td>
                  <td style={{...styles.td, textAlign: 'right'}}>{stock.marketCap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;