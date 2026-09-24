import React from 'react';
import { AnomalySeverity } from '../../types/anomaly';

interface SeverityBadgeProps {
  severity: AnomalySeverity;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
  switch (severity) {
    case 'CRITICAL':
      return <span className="badge badge-critical">CRÍTICO</span>;
    case 'WARNING':
      return <span className="badge badge-warning">ADVERTENCIA</span>;
    case 'INFO':
    default:
      return <span className="badge badge-info">INFO</span>;
  }
};
