import React from 'react';
import { Alert } from '../types/alert';
import { SeverityBadge } from '../components/status/SeverityBadge';

interface AlertCenterPageProps {
  alerts: Alert[];
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
}

export const AlertCenterPage: React.FC<AlertCenterPageProps> = ({
  alerts,
  onAcknowledge,
  onResolve,
}) => {
  return (
    <div>
      <div className="panel-header" style={{ marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700 }}>
            🔔 Consola de Gestión de Alarmas (Norma ISA 18.2)
          </h2>
          <p className="panel-subtitle">Deduplicación por Fingerprint, Supresión por Cooldown y Flujo de Reconocimiento</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {alerts.length === 0 ? (
          <div className="panel-card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
            <span style={{ fontSize: '2rem' }}>🎉</span>
            <p style={{ marginTop: 10 }}>No hay alarmas activas en la planta. Todos los equipos dentro de límites seguros.</p>
          </div>
        ) : (
          alerts.map((al) => {
            const isCrit = al.severity === 'CRITICAL';
            return (
              <div
                key={al.id}
                className="panel-card"
                style={{
                  borderLeft: `4px solid ${isCrit ? 'var(--color-crimson)' : 'var(--color-amber)'}`,
                  background: isCrit ? 'rgba(239, 68, 68, 0.03)' : 'var(--bg-card)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 16
                }}
              >
                <div style={{ flex: 1, minWidth: 300 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <SeverityBadge severity={al.severity} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-cyan)', fontWeight: 700 }}>
                      {al.asset_code || 'MTR-305'}
                    </span>
                    <span className="badge badge-info" style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)' }}>
                      Incidencias: x{al.count}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      Última detección: {new Date(al.last_seen).toLocaleTimeString()}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: 4 }}>
                    {al.title}
                  </h3>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {al.description}
                  </p>

                  <div style={{ display: 'flex', gap: 14, fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginTop: 8 }}>
                    <span>Valor Medido: <strong>{al.observed_value.toFixed(1)}</strong></span>
                    <span>Umbral Disparo: <strong>{al.threshold_value.toFixed(1)}</strong></span>
                    <span>Hash ISA 18.2: <code>{al.fingerprint ? al.fingerprint.substring(0, 10) : '0x8f2a...'}</code></span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {al.status === 'OPEN' ? (
                    <button
                      className="btn btn-secondary"
                      onClick={() => onAcknowledge(al.id)}
                    >
                      <span>👁️</span> Reconocer (ACK)
                    </button>
                  ) : (
                    <span className="badge badge-operational" style={{ marginRight: 8 }}>
                      RECONOCIDO
                    </span>
                  )}

                  <button
                    className="btn btn-primary"
                    onClick={() => onResolve(al.id)}
                  >
                    <span>✅</span> Resolver Ticket
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
