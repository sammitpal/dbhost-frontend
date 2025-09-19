import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [servers, setServers] = useState([
    {
      id: 1,
      name: 'Production Database',
      status: 'online',
      type: 'PostgreSQL',
      cpu: 45,
      ram: 67,
      storage: 23,
      connections: 127,
      uptime: '15 days 4h 32m',
      location: 'US East'
    },
    {
      id: 2,
      name: 'Staging Environment',
      status: 'online',
      type: 'MySQL',
      cpu: 23,
      ram: 41,
      storage: 56,
      connections: 34,
      uptime: '8 days 12h 15m',
      location: 'EU West'
    },
    {
      id: 3,
      name: 'Development Server',
      status: 'maintenance',
      type: 'MongoDB',
      cpu: 12,
      ram: 28,
      storage: 71,
      connections: 5,
      uptime: '2 days 6h 45m',
      location: 'Asia Pacific'
    },
    {
      id: 4,
      name: 'Analytics Database',
      status: 'offline',
      type: 'Redis',
      cpu: 0,
      ram: 15,
      storage: 89,
      connections: 0,
      uptime: 'Offline',
      location: 'US West'
    }
  ]);

  const [stats, setStats] = useState({
    totalServers: 12,
    onlineServers: 9,
    totalConnections: 1247,
    dataTransfer: '2.4 TB',
    uptime: '99.9%',
    alerts: 3
  });

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'online': return '#10b981';
      case 'offline': return '#ef4444';
      case 'maintenance': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      'PostgreSQL': '🐘',
      'MySQL': '🐬',
      'MongoDB': '🍃',
      'Redis': '📦'
    };
    return icons[type] || '💾';
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">
            <span className="gradient-text">Database Dashboard</span>
          </h1>
          <p className="dashboard-subtitle">
            Monitor and manage your database infrastructure
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add Server
          </button>
          <button className="btn btn-secondary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 3v5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
              <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/>
              <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Total Servers</h3>
            <div className="stat-value">{stats.totalServers}</div>
            <div className="stat-change positive">+2 this month</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Online Servers</h3>
            <div className="stat-value">{stats.onlineServers}</div>
            <div className="stat-change positive">+1 from yesterday</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="2"/>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Active Connections</h3>
            <div className="stat-value">{stats.totalConnections.toLocaleString()}</div>
            <div className="stat-change positive">+156 today</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Data Transfer</h3>
            <div className="stat-value">{stats.dataTransfer}</div>
            <div className="stat-change neutral">This month</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Uptime</h3>
            <div className="stat-value">{stats.uptime}</div>
            <div className="stat-change positive">Last 30 days</div>
          </div>
        </div>

        <div className="stat-card alert-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2"/>
              <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2"/>
              <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Active Alerts</h3>
            <div className="stat-value">{stats.alerts}</div>
            <div className="stat-change negative">Requires attention</div>
          </div>
        </div>
      </div>

      <div className="servers-section">
        <div className="section-header">
          <h2>Server Overview</h2>
          <div className="view-toggles">
            <button className="btn btn-ghost btn-sm active">Grid View</button>
            <button className="btn btn-ghost btn-sm">List View</button>
          </div>
        </div>

        <div className="servers-grid">
          {servers.map(server => (
            <div key={server.id} className="server-card">
              <div className="server-header">
                <div className="server-info">
                  <div className="server-icon">
                    {getTypeIcon(server.type)}
                  </div>
                  <div className="server-details">
                    <h3 className="server-name">{server.name}</h3>
                    <span className="server-type">{server.type} • {server.location}</span>
                  </div>
                </div>
                <div 
                  className={`status status-${server.status.toLowerCase()}`}
                  style={{ color: getStatusColor(server.status) }}
                >
                  {server.status}
                </div>
              </div>

              <div className="server-metrics">
                <div className="metric">
                  <div className="metric-header">
                    <span className="metric-label">CPU</span>
                    <span className="metric-value">{server.cpu}%</span>
                  </div>
                  <div className="progress">
                    <div 
                      className="progress-bar"
                      style={{ width: `${server.cpu}%` }}
                    />
                  </div>
                </div>

                <div className="metric">
                  <div className="metric-header">
                    <span className="metric-label">RAM</span>
                    <span className="metric-value">{server.ram}%</span>
                  </div>
                  <div className="progress">
                    <div 
                      className="progress-bar"
                      style={{ width: `${server.ram}%` }}
                    />
                  </div>
                </div>

                <div className="metric">
                  <div className="metric-header">
                    <span className="metric-label">Storage</span>
                    <span className="metric-value">{server.storage}%</span>
                  </div>
                  <div className="progress">
                    <div 
                      className="progress-bar"
                      style={{ width: `${server.storage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="server-stats">
                <div className="stat">
                  <span className="stat-label">Connections</span>
                  <span className="stat-value">{server.connections}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Uptime</span>
                  <span className="stat-value">{server.uptime}</span>
                </div>
              </div>

              <div className="server-actions">
                <button className="btn btn-primary btn-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Manage
                </button>
                <button className="btn btn-secondary btn-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 19c-5 0-8-3-8-8s3-8 8-8 8 3 8 8-3 8-8 8Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8.5 8.5 15 2l7 7-6.5 6.5L8.5 8.5Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 15h.01" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Monitor
                </button>
                <button className="btn btn-ghost btn-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="1" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="5" r="1" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="19" r="1" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="recent-activity">
        <div className="section-header">
          <h2>Recent Activity</h2>
          <button className="btn btn-ghost btn-sm">View All</button>
        </div>
        
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="activity-content">
              <p><strong>Production Database</strong> backup completed successfully</p>
              <span className="activity-time">2 minutes ago</span>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon warning">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className="activity-content">
              <p><strong>Development Server</strong> entered maintenance mode</p>
              <span className="activity-time">15 minutes ago</span>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon info">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 16v-4" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8h.01" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className="activity-content">
              <p><strong>Staging Environment</strong> CPU usage spike detected</p>
              <span className="activity-time">1 hour ago</span>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="activity-content">
              <p><strong>Analytics Database</strong> maintenance completed</p>
              <span className="activity-time">3 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;