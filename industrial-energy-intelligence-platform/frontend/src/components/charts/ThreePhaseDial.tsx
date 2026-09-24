import React from 'react';

interface ThreePhaseDialProps {
  label: string;
  value: number;
  nominalValue?: number;
  maxScale?: number;
  unit?: string;
  phaseColor?: string;
}

export const ThreePhaseDial: React.FC<ThreePhaseDialProps> = ({
  label,
  value,
  nominalValue = 115.0,
  maxScale = 180.0,
  unit = 'A',
  phaseColor = 'var(--color-cyan)',
}) => {
  // Angle range: -120 deg (0) to +120 deg (maxScale)
  const clampedValue = Math.min(Math.max(value, 0), maxScale);
  const angle = -120 + (clampedValue / maxScale) * 240;

  const isWarning = value > nominalValue * 1.05 && value <= nominalValue * 1.25;
  const isCritical = value > nominalValue * 1.25;

  let readoutColor = 'var(--text-main)';
  if (isCritical) readoutColor = 'var(--color-crimson)';
  else if (isWarning) readoutColor = 'var(--color-amber)';

  return (
    <div className="dial-box">
      <div className="dial-phase-label" style={{ color: phaseColor }}>
        {label}
      </div>

      <svg width="150" height="110" viewBox="0 0 160 120">
        {/* Background Arc */}
        <path
          d="M 25 105 A 65 65 0 1 1 135 105"
          fill="none"
          stroke="#1e293b"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* Normal Zone (Green) */}
        <path
          d="M 25 105 A 65 65 0 0 1 108 42"
          fill="none"
          stroke="rgba(16, 185, 129, 0.4)"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* Warning Zone (Yellow) */}
        <path
          d="M 108 42 A 65 65 0 0 1 126 68"
          fill="none"
          stroke="rgba(245, 158, 11, 0.6)"
          strokeWidth="10"
        />

        {/* Critical Zone (Red) */}
        <path
          d="M 126 68 A 65 65 0 0 1 135 105"
          fill="none"
          stroke="rgba(239, 68, 68, 0.8)"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* Nominal Tick Marker */}
        <line
          x1="80"
          y1="10"
          x2="80"
          y2="22"
          stroke="#94a3b8"
          strokeWidth="2"
          transform={`rotate(${ -120 + (nominalValue / maxScale) * 240 } 80 80)`}
        />

        {/* Animated Needle */}
        <g transform={`rotate(${angle} 80 80)`} style={{ transition: 'transform 0.4s cubic-bezier(0.1, 0.9, 0.2, 1)' }}>
          <polygon points="77,80 83,80 80,24" fill={phaseColor} />
          <circle cx="80" cy="80" r="7" fill={phaseColor} />
          <circle cx="80" cy="80" r="3" fill="#080c14" />
        </g>
      </svg>

      <div className="dial-digital-readout" style={{ color: readoutColor }}>
        {value.toFixed(1)} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{unit}</span>
      </div>

      <div className="dial-sub-readout">
        {((value / nominalValue) * 100).toFixed(0)}% FLA ({nominalValue} A nom)
      </div>
    </div>
  );
};
