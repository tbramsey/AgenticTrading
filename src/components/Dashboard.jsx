// src/components/Dashboard.jsx
import React from 'react';

export default function Dashboard({ newsData }) {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back to your fintech dashboard</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-dark-card rounded-lg border border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Balance</p>
              <p className="text-2xl font-bold text-white">$125,432.50</p>
            </div>
            <div className="w-12 h-12 bg-green-primary/10 rounded-lg flex items-center justify-center">
              <i className="fas fa-wallet text-green-primary text-xl" />
            </div>
          </div>
          <p className="text-green-primary text-sm mt-4">
            <i className="fas fa-arrow-up mr-1" />
            +2.5% this month
          </p>
        </div>

        <div className="bg-dark-card rounded-lg border border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Portfolio Value</p>
              <p className="text-2xl font-bold text-white">$98,750.00</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <i className="fas fa-chart-pie text-blue-500 text-xl" />
            </div>
          </div>
          <p className="text-green-primary text-sm mt-4">
            <i className="fas fa-arrow-up mr-1" />
            +5.2% this year
          </p>
        </div>

        <div className="bg-dark-card rounded-lg border border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Daily Change</p>
              <p className="text-2xl font-bold text-white">+$2,145.32</p>
            </div>
            <div className="w-12 h-12 bg-green-primary/10 rounded-lg flex items-center justify-center">
              <i className="fas fa-chart-line text-green-primary text-xl" />
            </div>
          </div>
          <p className="text-green-primary text-sm mt-4">
            <i className="fas fa-arrow-up mr-1" />
            +1.8% today
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-dark-card rounded-lg border border-gray-800 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Market News</h2>
          <div className="space-y-4">
            {newsData && newsData.length > 0 ? (
              newsData.map((news) => (
                <div key={news.id} className="border-b border-gray-800 pb-4 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white">{news.title}</h3>
                    <span className={`text-xs font-medium px-2 py-1 rounded text-${news.impactColor} bg-${news.impactColor}/10`}>
                      {news.impact}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{news.description}</p>
                  <p className="text-xs text-gray-500">{news.time}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No news available</p>
            )}
          </div>
        </div>

        <div className="bg-dark-card rounded-lg border border-gray-800 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Quick Stats</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm mb-2">Account Health</p>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-green-primary h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <p className="text-gray-500 text-xs mt-1">Excellent</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Risk Level</p>
              <p className="text-white font-semibold">Low</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Active Positions</p>
              <p className="text-white font-semibold">12</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
