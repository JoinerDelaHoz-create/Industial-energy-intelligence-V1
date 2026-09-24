import React, { useState } from 'react';
import { Anomaly } from '../types/anomaly';
import { SeverityBadge } from '../components/status/SeverityBadge';

interface AnomalyCenterPageProps {
  anomalies: Anomaly[];
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
}

export const AnomalyCenterPage: React.FC<AnomalyCenterPageProps> = ({
  anomalies,
  onAcknowledge,
  onResolve,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filtered = anomalies.filter((a) => {
    if (filterSeverity !== 'ALL' && a.severity !== filterSeverity) return false;
    if (searchTerm && !a.explanation.toLowerCase().includes(searchTerm.toLowerCase()) && !a.asset_code?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div>
      <div className="panel-header" style={{ marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700 }}>
            🔍 Centro de Detección de Anomalías Explicables
          </h2>
          <p className="panel-subtitle">Pipeline Analítico de 3 Niveles: Umbrales, Z-Score Estadístico y NEMA MG-1</p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <select
            className="btn btn-secondary"
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            style={{ cursor: 'pointer' }}
          >
            <option value="ALL">Todas las Severidades</option>
            <option value="CRITICAL">Solo Críticas</option>
            <option value="WARNING">Solo Advertencias</option>
            <option value="INFO">Informativas</option>
          </select>

          <input
            type="text"
            placeholder="Buscar por equipo o causa raíz..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 14px',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              outline: 'none',
              minWidth: 260
            }}
          />
        </div>
      </div>

      <div className="panel-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="industrial-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Activo</th>
              <th>Nivel Detección</th>
              <th>Severidad</th>
              <th>Obs. vs Exp.</th>
              <th>Desviación</th>
              <th>Diagnóstico Explicable & Causa Raíz</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-dim)' }}>
                  ✅ No hay anomalías activas bajo los filtros seleccionados.
                </td>
              </tr>
            ) : (
              filtered.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(a.timestamp).toLocaleTimeString()}
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-cyan)' }}>
                      {a.asset_code || 'MTR-305'}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>
                      {a.detection_level}
                    </span>
                  </td>
                  <td>
                    <SeverityBadge severity={a.severity} />
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                    <strong>{a.observed_value.toFixed(1)}</strong> <span style={{ color: 'var(--text-dim)' }}>/ {a.expected_value.toFixed(1)} {a.unit}</span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: a.deviation > 0 ? 'var(--color-crimson)' : 'var(--color-amber)', fontWeight: 600 }}>
                    {a.deviation > 0 ? `+${a.deviation.toFixed(1)}%` : `${a.deviation.toFixed(1)}%`}
                  </td>
                  <td style={{ maxWidth: 380 }}>
                    <div style={{ fontWeight: 500, color: 'var(--text-main)' }}>{a.explanation}</div>
                    {a.recommendation && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                        🛠️ <em>{a.recommendation}</em>
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {a.status === 'OPEN' ? (
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                          onClick={() => onAcknowledge(a.id)}
                        >
                          ACK
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary"
                          style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                          onClick={() => onResolve(a.id)}
                        >
                          Resolver
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
