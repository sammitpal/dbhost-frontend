import React from 'react';
import '../styles/globals.css';

const Header = () => {
  return (
    <header className="main-header">
      <div className="header-content">
        <div className="logo">
          <h2>DBHost</h2>
        </div>
        <nav className="main-nav">
          <a href="/dashboard" className="active">Dashboard</a>
          <a href="/servers">Servers</a>
          <a href="/databases">Databases</a>
          <a href="/analytics">Analytics</a>
          <a href="/settings">Settings</a>
        </nav>
        <div className="header-actions">
          <button className="btn btn-ghost">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Notifications</span>
          </button>
          <div className="user-menu">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format" 
              alt="User Avatar" 
              className="avatar" 
            />
            <span>Admin</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;