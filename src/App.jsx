// src/App.jsx
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StockAnalysis from './components/StockAnalysis';
import Market from './components/Market';
import Portfolio from './components/Portfolio';

export const stockData = {
  AAPL: {
    name: 'Apple Inc.',
    symbol: 'AAPL',
    price: 178.5,
    change: 8.5,
    shares: 50,
    icon: 'fa-apple',
    color: 'from-gray-700 to-gray-900',
    marketCap: '$2.8T',
    peRatio: '29.5',
    high52w: '$198.23',
    low52w: '$124.17',
  },
  GOOGL: {
    name: 'Alphabet Inc.',
    symbol: 'GOOGL',
    price: 142.3,
    change: 5.2,
    shares: 30,
    icon: 'fa-google',
    color: 'from-blue-600 to-blue-800',
    marketCap: '$1.8T',
    peRatio: '25.3',
    high52w: '$152.45',
    low52w: '$102.21',
  },
  TSLA: {
    name: 'Tesla Inc.',
    symbol: 'TSLA',
    price: 245.8,
    change: -2.3,
    shares: 25,
    icon: 'fa-bolt',
    color: 'from-red-600 to-red-800',
    marketCap: '$780B',
    peRatio: '65.2',
    high52w: '$299.29',
    low52w: '$152.37',
  },
  MSFT: {
    name: 'Microsoft Corp.',
    symbol: 'MSFT',
    price: 378.9,
    change: 3.8,
    shares: 40,
    icon: 'fa-microsoft',
    color: 'from-blue-500 to-blue-700',
    marketCap: '$2.8T',
    peRatio: '32.1',
    high52w: '$398.45',
    low52w: '$245.61',
  },
};

export const newsData = [
  {
    id: 1,
    title: 'Fed Announces Rate Decision',
    description:
      'Federal Reserve maintains interest rates, signaling cautious approach to inflation management.',
    impact: 'High',
    impactColor: 'green-primary',
    time: '2 hours ago',
  },
  {
    id: 2,
    title: 'Tech Sector Rally Continues',
    description:
      'Major tech stocks surge as AI investments drive market optimism and quarterly earnings exceed expectations.',
    impact: 'Medium',
    impactColor: 'yellow-500',
    time: '4 hours ago',
  },
  {
    id: 3,
    title: 'Energy Prices Fluctuate',
    description:
      'Oil prices drop 3% amid concerns over global demand and increased production from OPEC nations.',
    impact: 'High',
    impactColor: 'red-500',
    time: '5 hours ago',
  },
  {
    id: 4,
    title: 'Market Volatility Expected',
    description:
      'Analysts predict increased volatility as earnings season approaches with mixed economic indicators.',
    impact: 'Medium',
    impactColor: 'yellow-500',
    time: '6 hours ago',
  },
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('login');
  const [selectedStock, setSelectedStock] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentPage('login');
      setSelectedStock(null);
    }
  }, [isAuthenticated]);

  function handleLogin(email, password) {
    console.log('Login attempt:', email, password);
    if (email === 'demo@berry.com' && password === 'demo123') {
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
      return true;
    } else {
      return false;
    }
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setCurrentPage('login');
    setSelectedStock(null);
  }

  function navigateTo(page) {
    setCurrentPage(page);
    if (page !== 'analysis') {
      setSelectedStock(null);
    }
  }

  function selectStock(symbol) {
    setSelectedStock(symbol);
  }

  console.log('App rendering, isAuthenticated:', isAuthenticated);

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  let content;
  switch (currentPage) {
    case 'dashboard':
      content = <Dashboard newsData={newsData} />;
      break;
    case 'analysis':
      content = (
        <StockAnalysis
          stockData={stockData}
          selectedStock={selectedStock}
          onSelectStock={selectStock}
        />
      );
      break;
    case 'market':
      content = <Market stockData={stockData} />;
      break;
    case 'portfolio':
      content = <Portfolio />;
      break;
    default:
      content = <Dashboard newsData={newsData} />;
  }

  return (
    <div className="flex min-h-screen bg-dark-bg text-gray-100">
      <Sidebar
        currentPage={currentPage}
        navigateTo={navigateTo}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-auto">{content}</main>
    </div>
  );
}

export default App;