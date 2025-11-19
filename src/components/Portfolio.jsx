// src/components/Portfolio.jsx
import React from 'react';
import BerryChat from './BerryChat';

export default function Portfolio() {
  const assetAllocations = [
    { name: 'Technology Stocks', percent: '45%', checked: true },
    { name: 'Healthcare', percent: '20%', checked: true },
    { name: 'Financial Services', percent: '15%', checked: true },
    { name: 'Energy Sector', percent: '10%', checked: false },
    { name: 'Real Estate', percent: '10%', checked: false },
  ];

  const stats = [
    { label: 'Total Value', value: '$124,580', change: '+18.5% YTD', positive: true },
    { label: 'Total Gain', value: '+$19,450', change: 'Since inception', positive: true },
    { label: "Today's Change", value: '+$2,340', change: '+1.92%', positive: true },
    { label: 'ROI Target', value: '74%', change: 'of 25% goal', positive: false },
  ];

  return (
    <div>
      <div className="p-6 sm:p-8 border-b border-gray-800">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Portfolio Management</h2>
        <p className="text-gray-400 mt-1">Customize your investment preferences and track progress</p>
      </div>

      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-dark-card rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Investment Preferences</h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">Risk Tolerance</label>
                  <span className="text-sm text-green-light font-bold">Moderate</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="50"
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-green-primary"
                  aria-label="Risk Tolerance"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-3 block">Asset Allocation</label>
                <div className="space-y-3">
                  {assetAllocations.map(({ name, percent, checked }) => (
                    <div key={name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          defaultChecked={checked}
                          className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-green-primary"
                          id={`asset-${name}`}
                        />
                        <label htmlFor={`asset-${name}`} className="text-sm text-white cursor-pointer select-none">
                          {name}
                        </label>
                      </div>
                      <span className="text-sm text-gray-400">{percent}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-green-primary to-green-dark px-6 py-3 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-green-primary/20 transition-all">
                Save Preferences
              </button>
            </div>
          </div>

          <div className="bg-dark-card rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Portfolio Performance</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {stats.map(({ label, value, change, positive }) => (
                <div key={label} className="bg-dark-bg p-4 rounded-lg border border-gray-800">
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <p className={`text-xl font-bold ${positive ? 'text-green-light' : 'text-white'}`}>{value}</p>
                  <p className={`text-xs mt-1 ${positive ? 'text-green-light' : 'text-gray-400'}`}>{change}</p>
                </div>
              ))}
            </div>

            <div className="bg-green-primary/10 border border-green-primary/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <i className="fas fa-trophy text-green-light text-xl mt-1" />
                <div>
                  <p className="text-sm font-bold text-green-light mb-1">Achievement Unlocked!</p>
                  <p className="text-xs text-gray-300">You've reached 74% of your annual ROI target!</p>
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">Progress to Goal</span>
                      <span className="text-xs text-green-light font-bold">74%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-primary to-green-light h-2 rounded-full" style={{ width: '74%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-dark-card rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Asset Allocation</h3>
            <div className="h-64 overflow-hidden">
              <canvas id="allocationChart" />
            </div>
          </div>

          <div className="bg-dark-card rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Top Holdings Performance</h3>
            <div className="h-64 overflow-hidden">
              <canvas id="holdingsChart" />
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