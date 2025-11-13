import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  LineChart, 
  TrendingUp, 
  Briefcase, 
  User, 
  Bell, 
  ChevronDown, 
  Send, 
  MessageSquare, 
  BriefcaseBusiness, 
  AlertTriangle 
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react'; // Fixed type-only import
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// --- Type Definitions for TypeScript ---

type Page = 'dashboard' | 'analysis' | 'trading' | 'portfolio';

interface NavItem {
  name: string;
  icon: LucideIcon;
  page: Page;
}

interface StockData {
  symbol: string;
  price: number;
  change: number;
  percent: number;
  trend: 'up' | 'down';
}

interface Update {
  type: 'alert' | 'trade' | 'news';
  text: string;
}

interface ChartData {
  name: string;
  uv: number;
  pv: number;
}

interface PageProps {
  currentPage: Page;
  setCurrentPage: React.Dispatch<React.SetStateAction<Page>>;
}

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

interface StockDisplayProps {
  data: StockData[];
}

interface UpdatesPanelProps {
  updates: Update[];
}

interface FinancialChartProps {
  data: ChartData[];
  color: string;
}

// --- Mock Data ---

const mockNavItems: NavItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, page: 'dashboard' },
  { name: 'Stocks Analysis', icon: LineChart, page: 'analysis' },
  { name: 'Trading', icon: TrendingUp, page: 'trading' },
  { name: 'Portfolio', icon: Briefcase, page: 'portfolio' },
];

const mockStockData: StockData[] = [
  { symbol: 'APPL', price: 175.40, change: 1.25, percent: 0.72, trend: 'up' },
  { symbol: 'TSLA', price: 210.15, change: -2.30, percent: -1.08, trend: 'down' },
  { symbol: 'GOOG', price: 155.90, change: 3.80, percent: 2.50, trend: 'up' },
  { symbol: 'MSFT', price: 399.70, change: -0.55, percent: -0.14, trend: 'down' },
];

const mockUpdates: Update[] = [
  { type: 'alert', text: 'APPL reached new 52-week high.' },
  { type: 'trade', text: 'Sold 5 TSLA shares at $210.15.' },
  { type: 'alert', text: 'GOOG earnings report released.' },
  { type: 'news', text: 'Fed rate hike expected next week.' },
];

const mockChartData: ChartData[] = [
  { name: 'Mon', uv: 4000, pv: 2400 },
  { name: 'Tue', uv: 3000, pv: 1398 },
  { name: 'Wed', uv: 2000, pv: 9800 },
  { name: 'Thu', uv: 2780, pv: 3908 },
  { name: 'Fri', uv: 1890, pv: 4800 },
  { name: 'Sat', uv: 2390, pv: 3800 },
  { name: 'Sun', uv: 3490, pv: 4300 },
];

// --- Custom Components ---

const Sidebar: React.FC<PageProps> = ({ currentPage, setCurrentPage }) => (
  <div className="hidden lg:flex flex-col w-56 bg-[#0D0D0D] border-r border-[#3B593F] p-6 shadow-2xl">
    {/* Faux 3D Logo Element - layered shadow for geometric depth */}
    <div className="flex items-center space-x-2 mb-10 group cursor-default">
      {/* Icon subtle rotate on hover */}
      <BriefcaseBusiness className="w-8 h-8 text-[#4D734C] transition-transform duration-500 group-hover:rotate-12" />
      {/* Layered text shadow for 3D effect */}
      <span
        className="text-2xl font-extrabold tracking-wider text-white transition-all duration-300"
        style={{ 
          textShadow: `
            1px 1px 0 #172621,
            2px 2px 0 #2A4038,
            3px 3px 0 #3B593F,
            4px 4px 5px rgba(0,0,0,0.5)
          `
        }}
      >
        Berry
      </span>
    </div>

    <nav className="space-y-3">
      {mockNavItems.map(item => (
        <button
          key={item.page}
          onClick={() => setCurrentPage(item.page)}
          className={`
            flex items-center w-full p-3 rounded-xl transition-all duration-300 font-medium transform
            ${currentPage === item.page
              // Active: Stronger shadow for "popping out"
              ? 'bg-[#4D734C] text-white shadow-2xl shadow-[#4D734C]/70' 
              // Hover: Subtle scale for Z-axis depth/lift
              : 'text-gray-400 hover:bg-[#2A4038] hover:text-white hover:scale-[1.01]' 
            }
          `}
        >
          <item.icon className="w-5 h-5 mr-3" />
          {item.name}
        </button>
      ))}
    </nav>
  </div>
);

const Header: React.FC<PageProps> = ({ currentPage, setCurrentPage }) => {
  const pageTitle = useMemo(() => {
    return mockNavItems.find(item => item.page === currentPage)?.name || 'Welcome';
  }, [currentPage]);

  return (
    <header className="bg-[#172621] p-4 border-b border-[#3B593F] flex justify-between items-center sticky top-0 z-10 shadow-lg">
      <h1 className="text-2xl font-semibold text-white tracking-wide">{pageTitle}</h1>

      <div className="flex items-center space-x-4">
        {/* Button depth effect on hover */}
        <button className="p-2 rounded-full bg-[#2A4038] text-gray-300 hover:text-[#4D734C] transition transform hover:scale-110">
          <Bell className="w-5 h-5" />
        </button>
        {/* Button depth effect on hover */}
        <div className="flex items-center space-x-2 cursor-pointer p-1 rounded-full bg-[#2A4038] hover:bg-[#3B593F] transition transform hover:scale-[1.05]">
          <div className="w-8 h-8 rounded-full bg-[#4D734C] flex items-center justify-center text-sm font-bold text-white">
            JD
          </div>
          <span className="text-gray-200 text-sm hidden sm:inline">John Doe</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Mobile Navigation (Bottom Bar) */}
      <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-[#0D0D0D] border-t border-[#3B593F] flex justify-around p-2 z-20">
        {mockNavItems.map(item => (
          <button
            key={item.page}
            onClick={() => setCurrentPage(item.page)}
            className={`
              flex flex-col items-center p-2 rounded-xl transition-all duration-200 text-xs
              ${currentPage === item.page
                ? 'text-[#4D734C]'
                : 'text-gray-400 hover:text-white'
              }
            `}
          >
            <item.icon className="w-5 h-5 mb-0.5" />
            {item.name}
          </button>
        ))}
      </nav>
    </header>
  );
};

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => (
  // Enhanced Card style for more depth and geometric accent
  <div className={`
    bg-[#172621] p-5 rounded-2xl border-2 border-[#3B593F] transition-all duration-300 relative
    shadow-2xl shadow-black/80 hover:shadow-[#4D734C]/40
    ${className}
  `}>
    {/* Geometric Accent Element (Subtle Angled Bar) */}
    <div className="absolute top-0 right-0 w-16 h-1 bg-[#4D734C] rounded-tl-lg rounded-br-lg opacity-70"></div>
    
    {title && <h3 className="text-lg font-semibold text-white mb-4 relative z-10">{title}</h3>}
    {children}
  </div>
);

const StockDisplay: React.FC<StockDisplayProps> = ({ data }) => (
  <div className="space-y-3">
    {data.map(stock => {
      const isPositive = stock.trend === 'up';
      const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
      const arrowIcon = isPositive ? '↑' : '↓';

      return (
        <div key={stock.symbol} className="flex justify-between items-center p-3 bg-[#2A4038]/50 rounded-xl hover:bg-[#2A4038] transition cursor-pointer">
          <div className="flex items-center">
            {/* Kept standard status colors (green/red) for financial trend */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white mr-3 ${isPositive ? 'bg-green-600' : 'bg-red-600'}`}>
              {stock.symbol[0]}
            </div>
            <span className="font-bold text-white">{stock.symbol}</span>
          </div>
          <div className="text-right">
            <span className="block text-white font-medium">${stock.price.toFixed(2)}</span>
            <span className={`text-sm ${changeColor}`}>
              {arrowIcon} {Math.abs(stock.change).toFixed(2)} ({stock.percent.toFixed(2)}%)
            </span>
          </div>
        </div>
      );
    })}
  </div>
);

const UpdatesPanel: React.FC<UpdatesPanelProps> = ({ updates }) => (
  <Card title="Updates" className="h-full max-h-[500px] overflow-y-auto">
    <div className="space-y-4">
      {updates.map((update, index) => (
        <div key={index} className="flex items-start">
          {/* Kept standard status colors */}
          {update.type === 'alert' && <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5 mr-3" />}
          {update.type === 'trade' && <TrendingUp className="w-5 h-5 text-[#4D734C] flex-shrink-0 mt-0.5 mr-3" />}
          {update.type === 'news' && <MessageSquare className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5 mr-3" />}

          <p className="text-gray-300 text-sm">
            <span className="font-bold capitalize">{update.type}:</span> {update.text}
          </p>
        </div>
      ))}
    </div>
  </Card>
);

const ChatInput: React.FC = () => (
  <Card className="p-3">
    <div className="flex items-center space-x-3">
      <input
        type="text"
        placeholder="Ask Berry AI a question about your portfolio..."
        className="flex-grow bg-[#2A4038] text-white placeholder-gray-400 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4D734C]"
      />
      <button className="p-3 rounded-xl bg-[#4D734C] text-white hover:bg-[#3B593F] transition shadow-md">
        <Send className="w-5 h-5" />
      </button>
    </div>
  </Card>
);

const FinancialChart: React.FC<FinancialChartProps> = ({ data, color }) => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
          <stop offset="95%" stopColor={color} stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#3B593F" />
      <XAxis dataKey="name" stroke="#a3b59a" />
      <YAxis stroke="#a3b59a" />
      <Tooltip
        contentStyle={{ backgroundColor: '#172621', border: '1px solid #3B593F', borderRadius: '8px' }}
        labelStyle={{ color: '#fff' }}
      />
      <Area type="monotone" dataKey="uv" stroke={color} fillOpacity={1} fill="url(#colorUv)" />
    </AreaChart>
  </ResponsiveContainer>
);

// --- Page Views ---

const DashboardPage: React.FC = () => (
  <div className="p-6 space-y-6">
    <h2 className="text-4xl font-light text-white mb-6">WELCOME BACK, John!</h2>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Updates Sidebar (Wireframe Left Panel) */}
      <div className="lg:col-span-1">
        <UpdatesPanel updates={mockUpdates} />
      </div>

      <div className="lg:col-span-2 space-y-6">
        {/* Random Stocks Display (Wireframe Top Right Panel) */}
        <Card title="Market Watchlist" className="h-full">
          <StockDisplay data={mockStockData} />
        </Card>

        {/* Chat (Wireframe Bottom Panel) */}
        <ChatInput />
      </div>
    </div>
  </div>
);

const AnalysisPage: React.FC = () => (
  <div className="p-6 space-y-6">
    <h2 className="text-3xl font-semibold text-white">Stock Analysis</h2>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card title="Analysis Summary" className="lg:col-span-2">
        <p className="text-gray-300 mb-4">
          The S\&P 500 shows signs of consolidation after recent gains. Key resistance remains at the 5,500 level. Sector rotation suggests a move towards technology and away from consumer staples in the short term.
        </p>
        <ul className="text-gray-400 space-y-2 text-sm">
          <li>- Technical Indicators: RSI is neutral (52), MACD signals slight bullish momentum.</li>
          <li>- Economic News: Inflation reports due next week may introduce volatility.</li>
          <li>- Key Stocks to Watch: GOOG, APPL, NVDA.</li>
        </ul>
      </Card>

      <Card title="Sector Performance (Last 30 Days)" className="lg:col-span-1">
        <StockDisplay data={[
            { symbol: 'TECH', price: 1.5, change: 1.5, percent: 1.5, trend: 'up' },
            { symbol: 'HEALTH', price: 0.1, change: 0.1, percent: 0.1, trend: 'up' },
            { symbol: 'ENERGY', price: -0.8, change: -0.8, percent: -0.8, trend: 'down' },
        ]} />
      </Card>
    </div>
    <ChatInput />
  </div>
);

const TradingPage: React.FC = () => (
  <div className="p-6 space-y-6">
    <h2 className="text-3xl font-semibold text-white">Live Trading Overview</h2>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Stock Graphs (Wireframe Left/Center) */}
      <Card title="APPL - Daily Performance" className="lg:col-span-2">
        <FinancialChart data={mockChartData} color="#4D734C" /> 
      </Card>

      {/* Trading Panel (Wireframe Bottom Right) */}
      <Card title="Place Trade" className="lg:col-span-1 space-y-4">
        <div className="flex space-x-2">
          <select className="flex-1 p-3 rounded-lg bg-[#2A4038] text-white focus:ring-[#4D734C] focus:border-[#4D734C]">
            <option>Buy</option>
            <option>Sell</option>
          </select>
          <select className="flex-1 p-3 rounded-lg bg-[#2A4038] text-white focus:ring-[#4D734C] focus:border-[#4D734C]">
            <option>APPL</option>
            <option>TSLA</option>
            <option>GOOG</option>
          </select>
        </div>
        <input
          type="number"
          placeholder="Quantity (Shares)"
          className="w-full p-3 rounded-lg bg-[#2A4038] text-white placeholder-gray-400 focus:ring-2 focus:ring-[#4D734C]"
        />
        <div className="flex justify-between text-sm text-gray-400">
          <span>Current Price:</span>
          <span className="text-white">$175.40</span>
        </div>
        <div className="flex justify-between text-sm text-gray-400 border-t border-[#3B593F] pt-2">
          <span>Estimated Total:</span>
          <span className="text-lg font-bold text-[#4D734C]">$877.00</span>
        </div>
        <button className="w-full p-3 bg-[#4D734C] text-white font-bold rounded-lg hover:bg-[#3B593F] transition shadow-lg shadow-[#4D734C]/30 transform hover:scale-[1.01] active:scale-[0.99] duration-150">
          Execute Order
        </button>
      </Card>
    </div>
  </div>
);

const PortfolioPage: React.FC = () => (
  <div className="p-6 space-y-6">
    <h2 className="text-3xl font-semibold text-white">Investment Portfolio</h2>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card title="Portfolio Value: $45,890.32" className="lg:col-span-2">
        {/* Keeping standard green for market gain status */}
        <p className="text-2xl text-green-400 mb-4">+ $450.12 (1.09%) Today</p>
        <FinancialChart data={mockChartData} color="#4D734C" /> 
      </Card>
      <Card title="Asset Allocation" className="lg:col-span-1">
        <div className="space-y-3">
          {['Technology (55%)', 'Finance (20%)', 'Energy (15%)', 'Real Estate (10%)'].map((asset, index) => {
            const parts = asset.split(' ');
            return (
              <div key={index} className="flex justify-between items-center text-gray-300">
                <span>{parts[0]}</span>
                <span className="font-medium text-white">{parts[1]}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
    <Card title="Holdings Summary">
      <table className="min-w-full divide-y divide-[#3B593F]">
        <thead>
          <tr>
            {['Symbol', 'Shares', 'Avg Cost', 'Market Value', 'Gain/Loss'].map(header => (
              <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#3B593F]">
          {mockStockData.map((stock, index) => (
            <tr key={index} className="hover:bg-[#2A4038]/50 transition">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{stock.symbol}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{index * 10 + 50}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${(stock.price - stock.change).toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">${(stock.price * (index * 10 + 50)).toFixed(2)}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm ${stock.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {stock.percent.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </div>
);


const AppContent: React.FC<{ currentPage: Page }> = ({ currentPage }) => {
  switch (currentPage) {
    case 'dashboard':
      return <DashboardPage />;
    case 'analysis':
      return <AnalysisPage />;
    case 'trading':
      return <TradingPage />;
    case 'portfolio':
      return <PortfolioPage />;
    default:
      return <DashboardPage />;
  }
};


// --- Main Application Component (Renamed to Main for routing compatibility) ---
const Main: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  return (
    <div className="min-h-screen bg-[#0D0D0D] font-sans flex text-white">
      {/* Left Sidebar Navigation */}
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

        {/* Main Content Area: Added a subtle geometric pattern and depth effect */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto pb-20 lg:pb-4 relative">
          {/* Custom element for geometric background texture (subtle diamond grid) */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.05]" // Very low opacity
            // Repeating linear gradients create a subtle geometric diamond grid pattern
            style={{ 
              background: `repeating-linear-gradient(
                45deg,
                #3B593F,
                #3B593F 1px,
                transparent 1px,
                transparent 20px
              ),
              repeating-linear-gradient(
                -45deg,
                #3B593F,
                #3B593F 1px,
                transparent 1px,
                transparent 20px
              )`
            }}
          ></div>
          <AppContent currentPage={currentPage} />
        </main>
      </div>
    </div>
  );
};

export default Main;