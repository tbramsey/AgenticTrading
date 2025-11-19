// src/components/Login.jsx
import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const success = onLogin(email, password);
    if (!success) {
      setLoginError(true);
      setPassword('');
    }
  }

  function togglePassword() {
    setShowPassword((v) => !v);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute top-20 left-20 w-96 h-96 bg-green-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-dark/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="bg-dark-card rounded-2xl border border-gray-800 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-primary to-green-dark rounded-2xl mb-4">
              <i className="fas fa-leaf text-white text-3xl" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to Berry</h1>
            <p className="text-gray-400">Sign in to access your fintech dashboard</p>
          </div>

          {loginError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 flex items-center space-x-2">
              <i className="fas fa-exclamation-circle text-red-400" />
              <p className="text-sm text-red-400">Invalid email or password. Please try again.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-envelope text-gray-500" />
                </div>
                <input
                  type="email"
                  id="email"
                  placeholder="john.doe@example.com"
                  className="w-full bg-dark-bg border border-gray-800 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-primary transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-gray-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Enter your password"
                  className="w-full bg-dark-bg border border-gray-800 rounded-lg pl-12 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-primary transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <i
                    className={`fas ${
                      showPassword ? 'fa-eye-slash' : 'fa-eye'
                    } text-gray-500 hover:text-green-primary transition-colors`}
                  />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-primary to-green-dark px-6 py-3 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-green-primary/20 transition-all"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-500 mb-4">Demo Credentials</p>
            <div className="bg-dark-bg rounded-lg p-4 border border-gray-800 inline-block text-left min-w-[280px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Email:</span>
                <span className="text-xs text-green-light font-mono">demo@berry.com</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Password:</span>
                <span className="text-xs text-green-light font-mono">demo123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}