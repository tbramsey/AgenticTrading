// src/components/BerryChat.jsx
import React from 'react';

export default function BerryChat() {
  return (
    <div className="bg-dark-card rounded-xl border border-gray-800 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-green-primary to-green-dark rounded-full flex items-center justify-center">
          <i className="fas fa-robot text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Berry AI Assistant</h3>
          <p className="text-xs text-gray-400">Get instant answers to your financial questions</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <input
          type="text"
          placeholder="Ask Berry a question"
          className="flex-1 bg-dark-bg border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-primary transition-all"
          aria-label="Ask Berry a question"
        />
        <button className="bg-gradient-to-r from-green-primary to-green-dark px-6 py-3 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-green-primary/20 transition-all" aria-label="Send question">
          <i className="fas fa-paper-plane" />
        </button>
      </div>
    </div>
  );
}