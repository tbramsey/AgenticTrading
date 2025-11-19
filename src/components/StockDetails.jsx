// src/components/StockDetails.jsx
import React from 'react';

export default function StockDetails({ stock }) {
  return (
    <div className="space-y-6">
      <div className="bg-dark-card rounded-xl border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 bg-gradient-to-br ${stock.color} rounded-xl flex items-center justify-center`}>
              <i className={`fab ${stock.icon} text-white text-2xl`} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{stock.name}</h3>
              <p className="text-gray-400">
                {stock.symbol} &bull; NASDAQ
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">${stock.price}</p>
            <p className={`font-medium ${stock.change > 0 ? 'text-green-light' : 'text-red-400'}`}>
              {stock.change > 0 ? '+' : ''}
              {stock.change}%
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-dark-bg p-4 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-400 mb-1">Market Cap</p>
            <p className="text-lg font-bold text-white">{stock.marketCap}</p>
          </div>
          <div className="bg-dark-bg p-4 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-400 mb-1">P/E Ratio</p>
            <p className="text-lg font-bold text-white">{stock.peRatio}</p>
          </div>
          <div className="bg-dark-bg p-4 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-400 mb-1">52W High</p>
            <p className="text-lg font-bold text-white">{stock.high52w}</p>
          </div>
          <div className="bg-dark-bg p-4 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-400 mb-1">52W Low</p>
            <p className="text-lg font-bold text-white">{stock.low52w}</p>
          </div>
        </div>

        <div className="bg-dark-bg p-4 rounded-lg border border-gray-800">
          <h4 className="font-bold text-white mb-3">AI Analysis</h4>
          <p className="text-sm text-gray-300 mb-3">
            {stock.symbol} shows strong momentum with recent developments driving revenue growth.
            The stock has outperformed its sector with robust fundamentals and expanding market presence.
          </p>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-800 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-primary to-green-light h-2 rounded-full" style={{ width: '85%' }} />
            </div>
            <span className="text-sm font-bold text-green-light">85% Buy</span>
          </div>
        </div>
      </div>

      <div className="bg-dark-card rounded-xl border border-gray-800 p-6">
        <h4 className="font-bold text-white mb-4">Related News</h4>
        <div className="space-y-3">
          <div className="bg-dark-bg p-4 rounded-lg border border-gray-800">
            <p className="text-sm font-medium text-white mb-1">Strong Q4 Earnings Report</p>
            <p className="text-xs text-gray-400 mb-2">Revenue beats expectations with strong growth across all segments.</p>
            <span className="text-xs text-green-light">1 hour ago</span>
          </div>
          <div className="bg-dark-bg p-4 rounded-lg border border-gray-800">
            <p className="text-sm font-medium text-white mb-1">Product Launch Success</p>
            <p className="text-xs text-gray-400 mb-2">New product receives positive reviews and strong pre-order numbers.</p>
            <span className="text-xs text-green-light">3 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}