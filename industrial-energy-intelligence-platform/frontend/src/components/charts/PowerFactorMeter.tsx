import React from 'react';

interface PowerFactorMeterProps {
  pf: number;
}

export const PowerFactorMeter: React.FC<PowerFactorMeterProps> = ({ pf }) => {
  // Power factor usually between 0.50 and 1.00
  const clampedPf = Math.min(Math.max(pf, 0.5), 1.0);
  // Map 0.50 -> -90 deg, 1.00 -> +90 deg
  const angle = -90 + ((clampedPf - 0.5) / 0.5) * 180;

  const isPenalty = pf < 0.90;
  const isExcellent = pf >= 0.92;

  let statusText = 'Inductivo Óptimo';
  let badgeClass = 'badge-operational';
  if (isPenalty) {
    statusText = 'Penalización CREG / Reactiva';
    badgeClass = 'badge-warning';
  } else if (isExcellent) {
    statusText = 'Alta Eficiencia';
  }

  return (
    <div className="panel-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="panel-header" style={{ width: '100%', marginBottom: 12 }}>
        <div>
          <h3 className="panel-title">🎯 Factor de Potencia (PF)</h3>
          <p className="panel-subtitle">Compensación Reactiva & Eficiencia</p>
        </div>
        <span className={`badge ${badgeClass}`}>{isPenalty ? 'PENALIZABLE' : 'CONFORME'}</span>
      </div>

      <svg width="200" height="130" viewBox="0 0 200 130">
        {/* Background Track */}
        <path
          d="M 30 115 A 70 70 0 0 1 170 115"
          fill="none"
          stroke="#1e293b"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Penalty Zone (0.50 to 0.90) */}
        <path
          d="M 30 115 A 70 70 0 0 1 142 52"
          fill="none"
          stroke="rgba(245, 158, 11, 0.4)"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Compliant Zone (0.90 to 1.00) */}
        <path
          d="M 142 52 A 70 70 0 0 1 170 115"
          fill="none"
          stroke="rgba(16, 185, 129, 0.7)"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Target 0.90 Limit Marker */}
        <line
          x1="100"
          y1="32"
          x2="100"
          y2="46"
          stroke="#00f0ff"
          strokeWidth="3"
          transform={`rotate(${ -90 + ((0.90 - 0.5) / 0.5) * 180 } 100 115)`}
        />

        {/* Needle */}
        <g transform={`rotate(${angle} 100 115)`} style={{ transition: 'transform 0.4s ease' }}>
          <polygon points="97,115 103,115 100,50" fill={isPenalty ? 'var(--color-amber)' : 'var(--color-cyan)'} />
          <circle cx="100" cy="115" r="9" fill={isPenalty ? 'var(--color-amber)' : 'var(--color-cyan)'} />
          <circle cx="100" cy="115" r="4" fill="#080c14" />
        </g>
      </svg>

      <div style={{ textAlign: 'center', marginTop: 4 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', fontWeight: 700, color: isPenalty ? 'var(--color-amber)' : 'var(--color-cyan)' }}>
          {pf.toFixed(2)}
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{statusText}</p>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: 4 }}>Límite regulatorio estándar: cos(φ) ≥ 0.90</p>
      </div>
    </div>
  );
};
