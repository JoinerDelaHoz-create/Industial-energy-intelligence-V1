import React from 'react';
import { OperatingStatus } from '../../types/equipment';

interface StatusBadgeProps {
  status: OperatingStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'OPERATIONAL':
      return <span className="badge badge-operational"><span className="pulse-dot online"></span> Operacional</span>;
    case 'WARNING':
      return <span className="badge badge-warning"><span className="pulse-dot warning"></span> Advertencia</span>;
    case 'CRITICAL':
      return <span className="badge badge-critical"><span className="pulse-dot critical"></span> Crítico</span>;
    case 'MAINTENANCE':
      return <span className="badge badge-info">🛠️ Mantenimiento</span>;
    case 'OFFLINE':
    default:
      return <span className="badge" style={{ background: '#334155', color: '#94a3b8' }}>⚪ Fuera de Línea</span>;
  }
};
