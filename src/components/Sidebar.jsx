// src/components/Sidebar.jsx
import React from 'react';

const links = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
  { id: 'analysis', label: 'Stock Analysis', icon: 'fa-chart-bar' },
  { id: 'market', label: 'Market', icon: 'fa-globe' },
  { id: 'portfolio', label: 'Portfolio', icon: 'fa-briefcase' },
];

export default function Sidebar({ currentPage, navigateTo, onLogout }) {
  return (
    <aside className="w-64 bg-dark-card flex flex-col border-r border-gray-800 min-h-screen">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-primary to-green-dark rounded-lg flex items-center justify-center">
            <i className="fas fa-leaf text-white text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-green-light">Berry</h1>
            <p className="text-xs text-gray-400">Fintech Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map(({ id, label, icon }) => {
          const isActive = currentPage === id;
          return (
            <button
              key={id}
              onClick={() => {
                navigateTo(id);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all cursor-pointer select-none ${
                isActive
                  ? 'bg-green-primary/10 text-green-light border border-green-primary/20'
                  : 'hover:bg-gray-800 text-gray-400 hover:text-green-light'
              }`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  navigateTo(id);
                }
              }}
            >
              <i className={`fas ${icon} w-5`} />
              <span className="font-medium">{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-3 px-4 py-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-primary to-green-dark rounded-full flex items-center justify-center">
            <span className="text-white font-bold select-none">JD</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-gray-400">Premium Member</p>
          </div>
          <button
            onClick={onLogout}
            className="text-gray-400 hover:text-red-400 cursor-pointer transition-colors focus:outline-none"
            title="Logout"
            aria-label="Logout"
          >
            <i className="fas fa-sign-out-alt" />
          </button>
        </div>
      </div>
    </aside>
  );
}