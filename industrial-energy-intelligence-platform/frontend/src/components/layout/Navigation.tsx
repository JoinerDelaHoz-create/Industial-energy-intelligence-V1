import React from 'react';

export type TabKey = 'dashboard' | 'fleet' | 'anomalies' | 'alerts' | 'simulation' | 'reports';

interface NavigationProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  openAnomaliesCount: number;
  openAlertsCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  openAnomaliesCount,
  openAlertsCount,
}) => {
  return (
    <nav className="nav-bar">
      <button
        className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
        onClick={() => onTabChange('dashboard')}
      >
        <span>📊</span>
        <span>Diales & Telemetría en Vivo</span>
      </button>

      <button
        className={`nav-item ${activeTab === 'fleet' ? 'active' : ''}`}
        onClick={() => onTabChange('fleet')}
      >
        <span>🏭</span>
        <span>Flota de Activos</span>
      </button>

      <button
        className={`nav-item ${activeTab === 'anomalies' ? 'active' : ''}`}
        onClick={() => onTabChange('anomalies')}
      >
        <span>🔍</span>
        <span>Centro de Anomalías</span>
        {openAnomaliesCount > 0 && <span className="nav-badge">{openAnomaliesCount}</span>}
      </button>

      <button
        className={`nav-item ${activeTab === 'alerts' ? 'active' : ''}`}
        onClick={() => onTabChange('alerts')}
      >
        <span>🔔</span>
        <span>Alarmas ISA 18.2</span>
        {openAlertsCount > 0 && <span className="nav-badge">{openAlertsCount}</span>}
      </button>

      <button
        className={`nav-item ${activeTab === 'simulation' ? 'active' : ''}`}
        onClick={() => onTabChange('simulation')}
      >
        <span>🎮</span>
        <span>Simulador de Fallas</span>
      </button>

      <button
        className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
        onClick={() => onTabChange('reports')}
      >
        <span>📑</span>
        <span>Auditoría & Reportes</span>
      </button>
    </nav>
  );
};
