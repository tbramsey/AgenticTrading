import React, { useEffect } from 'react';
import './Berry.css';
import { TrendingUp, Cpu, Shield, ChevronRight } from 'lucide-react';

const BerryHome = () => {
  
  // Simple scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));
  }, []);

  return (
    <div className="berry-container">
      {/* Background Elements */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>


      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content hidden">
          <div className="badge">Agentic Trading v1.0</div>
          <h1>
            The Future of <br />
            <span className="text-gradient">Autonomous Wealth</span>
          </h1>
          <p>
            Berry deploys intelligent agents to analyze, predict, and execute trades 
            with zero latency. Smarter markets start here.
          </p>
          <div className="cta-group">
            <button className="btn-primary">
              Launch Terminal <ChevronRight size={18} />
            </button>
            <button className="btn-outline">View Documentation</button>
          </div>
        </div>
        
        <div className="hero-visual hidden">
          <div className="glass-card card-floating">
            <div className="card-header">
              <span>Berry Agent #04</span>
              <span className="status-active">Active</span>
            </div>
            <div className="card-body">
              <div className="stat-row">
                <span>P&L (24h)</span>
                <span className="profit">+14.2%</span>
              </div>
              <div className="stat-row">
                <span>Volume</span>
                <span>$4.2M</span>
              </div>
              <div className="graph-line"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="features">
        <h2 className="hidden">Why Berry?</h2>
        <div className="feature-grid">
          <div className="feature-card glass-panel hidden">
            <Cpu className="icon" size={32} />
            <h3>AI-Driven Logic</h3>
            <p>Our neural networks adapt to market volatility in milliseconds, executing strategies humans can't catch.</p>
          </div>
          <div className="feature-card glass-panel hidden">
            <TrendingUp className="icon" size={32} />
            <h3>Predictive Modeling</h3>
            <p>Berry doesn't just react. It forecasts trend reversals using historical sentiment analysis.</p>
          </div>
          <div className="feature-card glass-panel hidden">
            <Shield className="icon" size={32} />
            <h3>Risk Guardrails</h3>
            <p>Autonomous doesn't mean reckless. Hard-coded stop-losses and exposure limits keep capital safe.</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="team">
        <h2 className="hidden">Architects of Berry</h2>
        <p className="subtitle hidden">The minds behind the machine.</p>
        
        <div className="team-grid">
          {['Lahari', 'Artin', 'Tagan', 'Navya'].map((name, index) => (
            <div key={index} className="member-card hidden">
              <div className="avatar-placeholder">{name.charAt(0)}</div>
              <h3>{name}</h3>
              <p>Co-Founder</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <h3>Berry.</h3>
          <p>© 2025 Berry Trading Systems. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default BerryHome;