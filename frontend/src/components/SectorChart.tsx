import React, { useState, useEffect, useCallback } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector } from 'recharts';

// --- Configuration ---
const USE_MOCK_DATA = false;

// Define the shape of our data
interface SectorData {
  name: string;
  value: number;
  total_amount?: number;
}

const MOCK_DATA: SectorData[] = [
  { name: 'Technology', value: 35.5, total_amount: 35500 },
  { name: 'Healthcare', value: 20.0, total_amount: 20000 },
  { name: 'Finance', value: 15.0, total_amount: 15000 },
  { name: 'Consumer Discretionary', value: 10.5, total_amount: 10500 },
  { name: 'Energy', value: 8.0, total_amount: 8000 },
  { name: 'Industrials', value: 6.0, total_amount: 6000 },
  { name: 'Utilities', value: 5.0, total_amount: 5000 },
];

const COLORS = [
  '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', 
  '#ef4444', '#6366f1', '#ec4899', '#64748b'
];

const RADIAN = Math.PI / 180;

// Interface for the custom shape props (extends standard Recharts props)
interface RenderActiveShapeProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: SectorData;
  percent: number;
  value: number;
}

const renderActiveShape = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props as RenderActiveShapeProps;
  
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className="chart-active-percent">{`${value}%`}</text>
    </g>
  );
};

// Interface for Custom Tooltip
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as SectorData;
    return (
      <div className="tooltip-container">
        <p className="tooltip-title">{data.name}</p>
        <p className="tooltip-value">
          Allocation: {data.value}%
        </p>
        {data.total_amount && (
           <p className="tooltip-sub">
             Est. Value: ${data.total_amount.toLocaleString()}
           </p>
        )}
      </div>
    );
  }
  return null;
};

export default function SectorChart() {
  const [data, setData] = useState<SectorData[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Wrap the function in useCallback
  const fetchData = useCallback(async () => {
      try {
        setLoading(true);
        
        let result: SectorData[];

        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 800));
          result = MOCK_DATA;
        } else {
          const response = await fetch('http://127.0.0.1:5000/sectors');
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          result = await response.json();
        }

        const sortedData = result.sort((a: SectorData, b: SectorData) => b.value - a.value);
        setData(sortedData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch sector data:", err);
        setError("Unable to load portfolio data. Ensure backend is running.");
      } finally {
        setLoading(false);
      }
    }, []); // Empty dependency array (unless you have props that change)

  // 3. Update useEffect dependencies
  useEffect(() => {
    fetchData();

    const handleUpdate = () => {
      // I increased this to 500ms to match your other chart
      // 50ms might be too fast for the database to finish writing!
      setTimeout(() => {
        fetchData();
      }, 1000);
    };

    window.addEventListener("portfolioUpdated", handleUpdate);

    return () => window.removeEventListener("portfolioUpdated", handleUpdate);
  }, [fetchData]);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <>
      <style>{`
        .dashboard-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: transparent;
          padding: 24px;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        .card {
          max-width: 56rem;
          width: 100%;
          background-color: transparent;
          border-radius: 1rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          overflow: hidden;
        }
        .header {
          background-color: white;
          border-bottom: 1px solid #f1f5f9;
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }
        .subtitle {
          color: #64748b;
          font-size: 0.875rem;
          margin-top: 0.25rem;
          margin-bottom: 0;
        }
        .badge {
          background-color: #fef3c7;
          color: #92400e;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.125rem 0.625rem;
          border-radius: 0.25rem;
          border: 1px solid #fde68a;
        }
        .content {
          padding: 24px;
        }
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
        }
        .spinner {
          width: 48px;
          border: 4px solid #c7d2fe;
          border-top: 4px solid #4f46e5;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }
        .loading-text {
          color: #94a3b8;
          font-weight: 500;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          background-color: #fef2f2;
          border-radius: 0.75rem;
          border: 1px solid #fee2e2;
        }
        .error-icon {
          height: 40px;
          width: 40px;
          color: #f87171;
          margin-bottom: 8px;
        }
        .error-text {
          color: #ef4444;
          font-weight: 500;
        }
        .retry-button {
          margin-top: 16px;
          padding: 8px 16px;
          background-color: white;
          color: #ef4444;
          border: 1px solid #fecaca;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .retry-button:hover {
          background-color: #fef2f2;
        }
        .empty-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          background-color: #f8fafc;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
        }
        .empty-text {
          color: #94a3b8;
        }
        .chart-container {
          width: 100%;
          height: 300px;
          padding: 0;
          margin: 0;
        }
        .tooltip-container {
          background-color: white;
          padding: 12px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          border-radius: 0.5rem;
          z-index: 50;
        }
        .tooltip-title {
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }
        .tooltip-value {
          color: #4f46e5;
          font-weight: 500;
          margin: 0;
        }
        .tooltip-sub {
          color: #64748b;
          font-size: 0.75rem;
          margin-top: 4px;
          margin-bottom: 0;
        }
        .chart-active-label {
          font-size: 1.125rem;
          font-weight: 700;
        }
        .chart-active-percent {
          font-size: 0.875rem;
          font-weight: 600;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>
      <div className="dashboard-container">
        
              {!loading && !error && data.length === 0 && (
                  <div className="empty-container">
                  <div className="empty-text">No sector data available.</div>
                  </div>
              )}

              {!loading && !error && data.length > 0 && (
              <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      fill="#8884d8"
                      dataKey="value"
                      paddingAngle={3}
                    >
                      {data.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                          stroke="rgba(255,255,255,1)"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={<CustomTooltip />} 
                      cursor={{ fill: 'transparent' }}
                      wrapperStyle={{ outline: 'none' }}
                    />
                    <Legend 
                      layout="horizontal" 
                      verticalAlign="bottom" 
                      align="center"
                      iconType="circle"
                      wrapperStyle={{ paddingTop: '20px', fontSize: '14px', fontWeight: '500', color: '#64748b' }}
                    />
                  </PieChart>
                  </ResponsiveContainer>
              </div>
              )}

      </div>
    </>
  );
}