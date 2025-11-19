// src/components/Market.jsx
import React from 'react';

export default function Market({ stockData }) {
  const stocks = Object.values(stockData);

  return (
    <div>
      <div className="p-6 sm:p-8 border-b border-gray-800">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Market Overview</h2>
        <p className="text-gray-400 mt-1">Real-time market conditions and stock prices</p>
      </div>

      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-dark-card rounded-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">S&P 500</span>
              <i className="fas fa-arrow-up text-green-light" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">4,567.89</p>
            <p className="text-sm text-green-light">+105.23 (2.36%)</p>
          </div>
          <div className="bg-dark-card rounded-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">NASDAQ</span>
              <i className="fas fa-arrow-up text-green-light" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">14,234.56</p>
            <p className="text-sm text-green-light">+234.12 (1.67%)</p>
          </div>
          <div className="bg-dark-card rounded-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">DOW JONES</span>
              <i className="fas fa-arrow-down text-red-400" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">35,678.90</p>
            <p className="text-sm text-red-400">-45.67 (-0.13%)</p>
          </div>
        </div>

        <div className="bg-dark-card rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Top Stocks</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Company</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Price</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Change</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Volume</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Market Cap</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => (
                  <tr
                    key={stock.symbol}
                    className="border-b border-gray-800 hover:bg-dark-bg transition-all cursor-default"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${stock.color} rounded-lg flex items-center justify-center`}>
                          <i className={`fab ${stock.icon} text-white`} />
                        </div>
                        <div>
                          <p className="font-medium text-white">{stock.name}</p>
                          <p className="text-xs text-gray-400">{stock.symbol}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-4 px-4 font-bold text-white">${stock.price}</td>
                    <td className={`text-right py-4 px-4 ${stock.change > 0 ? 'text-green-light' : 'text-red-400'}`}>
                      {stock.change > 0 ? '+' : ''}
                      {stock.change}%
                    </td>
                    <td className="text-right py-4 px-4 text-gray-400">52.3M</td>
                    <td className="text-right py-4 px-4 text-gray-400">{stock.marketCap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}