import React, { useEffect, useState } from 'react';

interface HeaderProps {
  criticalAlertCount: number;
  openAnomalyCount: number;
  isSimulating: boolean;
  activeScenarioName: string;
}

export const Header: React.FC<HeaderProps> = ({
  criticalAlertCount,
  isSimulating,
  activeScenarioName,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().substring(0, 8) + ' COT');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="topbar">
      <div className="brand-section">
        <div className="brand-icon">⚡</div>
        <div className="brand-titles">
          <h1>IEIP</h1>
          <p>Industrial Energy & Intelligence Platform</p>
        </div>
      </div>

      <div className="status-section">
        {isSimulating && (
          <div className="badge badge-warning" style={{ animation: 'pulse-yellow 2s infinite' }}>
            <span>⚠️</span> SIMULACIÓN: {activeScenarioName}
          </div>
        )}

        <div className="site-badge">
          <span className={`pulse-dot ${criticalAlertCount > 0 ? 'critical' : 'online'}`}></span>
          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Planta Demo Caribe</span>
          <span style={{ color: 'var(--text-dim)' }}>•</span>
          <span style={{ color: 'var(--text-muted)' }}>Barranquilla, CO</span>
        </div>

        <div className="system-clock">
          <span>{timeStr || '12:00:00 COT'}</span>
        </div>
      </div>
    </header>
  );
};
