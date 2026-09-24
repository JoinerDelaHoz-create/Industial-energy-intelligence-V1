import React from 'react';
import { Equipment } from '../types/equipment';
import { StatusBadge } from '../components/status/StatusBadge';

interface FleetPageProps {
  equipmentList: Equipment[];
  onSelectEquipment: (equipment: Equipment) => void;
}

export const FleetPage: React.FC<FleetPageProps> = ({ equipmentList, onSelectEquipment }) => {
  return (
    <div>
      <div className="panel-header" style={{ marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700 }}>
            🏭 Parque de Maquinaria y Motores Críticos
          </h2>
          <p className="panel-subtitle">Monitoreo de 6 Activos Industriales en Planta Demo Caribe</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
        {equipmentList.map((eq) => (
          <div
            key={eq.id}
            className="panel-card"
            style={{ cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            onClick={() => onSelectEquipment(eq)}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-cyan)', fontWeight: 700 }}>
                    {eq.asset_code}
                  </span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: 2 }}>
                    {eq.name}
                  </h3>
                </div>
                <StatusBadge status={eq.operating_status} />
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 16 }}>
                📍 {eq.location || 'Área Principal'}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, background: 'var(--bg-secondary)', padding: 12, borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Potencia Nominal</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.95rem' }}>{eq.rated_power_kw} kW</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Corriente FLA</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.95rem' }}>{eq.rated_current} A</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Tensión de Red</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.95rem' }}>{eq.rated_voltage} V</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Factor de Pot. Nom.</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.95rem' }}>{eq.nominal_power_factor}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Fabricante: <strong>{eq.manufacturer} {eq.model}</strong>
              </span>
              <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                Ver Telemetría ➔
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
