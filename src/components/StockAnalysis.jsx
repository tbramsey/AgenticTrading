// src/components/StockAnalysis.jsx
import React from 'react';
import StockDetails from './StockDetails.jsx';
import BerryChat from './BerryChat';

export default function StockAnalysis({ stockData, selectedStock, onSelectStock }) {
  const stocks = Object.values(stockData);

  return (
    <div>
      <div className="p-6 sm:p-8 border-b border-gray-800">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Stock Analysis</h2>
        <p className="text-gray-400 mt-1">Deep dive into your holdings</p>
      </div>

      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-dark-card rounded-xl border border-gray-800 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Your Holdings</h3>
              <div className="space-y-3">
                {stocks.map((stock) => {
                  const isSelected = selectedStock === stock.symbol;
                  return (
                    <div
                      key={stock.symbol}
                      onClick={() => onSelectStock(stock.symbol)}
                      className={`bg-dark-bg p-4 rounded-lg border border-gray-800 hover:border-green-primary/30 cursor-pointer transition-all ${
                        isSelected ? 'border-green-primary/50' : ''
                      }`}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          onSelectStock(stock.symbol);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 bg-gradient-to-br ${stock.color} rounded-lg flex items-center justify-center`}
                          >
                            <i className={`fab ${stock.icon} text-white`} />
                          </div>
                          <div>
                            <p className="font-bold text-white">{stock.symbol}</p>
                            <p className="text-xs text-gray-400">{stock.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-white">${stock.price}</p>
                          <p className={`text-xs ${stock.change > 0 ? 'text-green-light' : 'text-red-400'}`}>
                            {stock.change > 0 ? '+' : ''}
                            {stock.change}%
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{stock.shares} shares</span>
                        <span>${(stock.price * stock.shares).toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div id="stock-details">
              {selectedStock ? (
                <StockDetails stock={stockData[selectedStock]} />
              ) : (
                <div className="bg-dark-card rounded-xl border border-gray-800 p-6">
                  <div className="text-center py-12">
                    <i className="fas fa-chart-line text-6xl text-gray-700 mb-4" />
                    <p className="text-gray-400">Select a stock to view detailed analysis</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <BerryChat />
        </div>
      </div>
    </div>
  );
}