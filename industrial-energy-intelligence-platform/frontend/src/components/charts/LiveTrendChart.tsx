import React from 'react';

interface DataPoint {
  time: string;
  power: number;
  current: number;
}

interface LiveTrendChartProps {
  data: DataPoint[];
  title?: string;
}

export const LiveTrendChart: React.FC<LiveTrendChartProps> = ({
  data,
  title = 'Tendencia Dinámica de Telemetría (Últimos 30s)',
}) => {
  const width = 800;
  const height = 220;
  const padding = { top: 20, right: 30, bottom: 30, left: 50 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Find min/max for scaling
  const powerValues = data.map((d) => d.power);
  const currentValues = data.map((d) => d.current);

  const maxVal = Math.max(120, ...powerValues, ...currentValues);
  const minVal = 0;

  const pointsCount = Math.max(data.length, 2);

  const getX = (index: number) => padding.left + (index / (pointsCount - 1)) * chartWidth;
  const getY = (val: number) => padding.top + chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;

  const powerPolyline = data.map((d, i) => `${getX(i)},${getY(d.power)}`).join(' ');
  const currentPolyline = data.map((d, i) => `${getX(i)},${getY(d.current)}`).join(' ');

  return (
    <div className="panel-card" style={{ width: '100%' }}>
      <div className="panel-header">
        <div>
          <h3 className="panel-title">📈 {title}</h3>
          <p className="panel-subtitle">Muestreo en tiempo real @ 1 Hz</p>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 3, background: 'var(--color-cyan)', display: 'inline-block' }}></span>
            <span>Potencia (kW)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 3, background: 'var(--color-amber)', display: 'inline-block' }}></span>
            <span>Corriente Media (A)</span>
          </div>
        </div>
      </div>

      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
        {/* Horizontal gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
          const y = padding.top + chartHeight * (1 - pct);
          const labelVal = Math.round(minVal + pct * (maxVal - minVal));
          return (
            <g key={pct}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#1e293b" strokeDasharray="3 3" />
              <text x={padding.left - 8} y={y + 4} fill="#64748b" fontSize="10" fontFamily="var(--font-mono)" textAnchor="end">
                {labelVal}
              </text>
            </g>
          );
        })}

        {/* Lines */}
        {data.length > 1 && (
          <>
            <polyline
              fill="none"
              stroke="var(--color-cyan)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={powerPolyline}
            />
            <polyline
              fill="none"
              stroke="var(--color-amber)"
              strokeWidth="2"
              strokeDasharray="4 2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={currentPolyline}
            />
          </>
        )}

        {/* Latest Points Marker */}
        {data.length > 0 && (
          <>
            <circle
              cx={getX(data.length - 1)}
              cy={getY(data[data.length - 1].power)}
              r="4"
              fill="var(--color-cyan)"
              stroke="#080c14"
              strokeWidth="2"
            />
            <circle
              cx={getX(data.length - 1)}
              cy={getY(data[data.length - 1].current)}
              r="4"
              fill="var(--color-amber)"
              stroke="#080c14"
              strokeWidth="2"
            />
          </>
        )}
      </svg>
    </div>
  );
};
