import React, { useState } from 'react';
import { SimulationScenario, SimulationStatus } from '../types/simulation';

interface SimulationControlPageProps {
  scenarios: SimulationScenario[];
  status: SimulationStatus;
  onStartScenario: (scenarioId: string, intensity: number) => void;
  onStopScenario: () => void;
}

export const SimulationControlPage: React.FC<SimulationControlPageProps> = ({
  scenarios,
  status,
  onStartScenario,
  onStopScenario,
}) => {
  const [selectedIntensity, setSelectedIntensity] = useState<number>(1.2);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filteredScenarios = scenarios.filter((s) => {
    if (filterCategory !== 'ALL' && s.category !== filterCategory) return false;
    return true;
  });

  return (
    <div>
      <div className="panel-header" style={{ marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700 }}>
            🎮 Sala de Control & Inyección de Fallas (Gemelo Digital)
          </h2>
          <p className="panel-subtitle">Modelo Físico Trifásico con Ruido Correlacionado AR(1) y Generación de Telemetría Dinámica</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {status.is_running && status.active_scenario !== 'NORMAL_OPERATION' && (
            <button className="btn btn-danger" onClick={onStopScenario}>
              🛑 Restaurar Operación Normal
            </button>
          )}
        </div>
      </div>

      {/* Active Fault Monitor Banner */}
      <div
        className="panel-card"
        style={{
          borderLeft: `4px solid ${status.is_running && status.active_scenario !== 'NORMAL_OPERATION' ? 'var(--color-crimson)' : 'var(--color-emerald)'}`,
          marginBottom: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className={`pulse-dot ${status.is_running && status.active_scenario !== 'NORMAL_OPERATION' ? 'critical' : 'online'}`}></span>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Estado del Gemelo Digital
            </span>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: 4 }}>
            {status.scenario_name || 'Operación Nominal (IEC 60034)'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>
            {status.injected_fault_description || 'Generando telemetría trifásica balanceada sin fallas activas.'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Intensidad de Falla</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-cyan)' }}>
              {(status.intensity * 100).toFixed(0)}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Tiempo Transcurrido</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 600 }}>
              {status.elapsed_seconds} s
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Controls & Category Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {['ALL', 'ELECTRICAL', 'THERMAL', 'MECHANICAL', 'COMMUNICATION', 'OPERATIONAL'].map((cat) => (
            <button
              key={cat}
              className={`btn ${filterCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
              onClick={() => setFilterCategory(cat)}
            >
              {cat === 'ALL' ? 'Todos los Escenarios (12)' : cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Intensidad:</span>
          <input
            type="range"
            min="0.8"
            max="1.8"
            step="0.1"
            value={selectedIntensity}
            onChange={(e) => setSelectedIntensity(parseFloat(e.target.value))}
            style={{ width: 120, accentColor: 'var(--color-cyan)' }}
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-cyan)' }}>
            {(selectedIntensity * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* 12 Scenarios Grid */}
      <div className="scenarios-grid">
        {filteredScenarios.map((sc) => {
          const isActive = status.active_scenario === sc.id;
          return (
            <div
              key={sc.id}
              className={`scenario-card ${isActive ? 'active' : ''}`}
              onClick={() => onStartScenario(sc.id, selectedIntensity)}
            >
              <div>
                <div className="scenario-header">
                  <span className="scenario-title">{sc.name}</span>
                  <span className={`badge ${sc.severity === 'CRITICAL' ? 'badge-critical' : sc.severity === 'WARNING' ? 'badge-warning' : 'badge-operational'}`}>
                    {sc.severity}
                  </span>
                </div>

                <p className="scenario-desc">{sc.description}</p>
              </div>

              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                  {sc.affected_variables.map((v) => (
                    <span key={v} style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: 4, color: 'var(--color-cyan)' }}>
                      {v}
                    </span>
                  ))}
                </div>

                <div className="scenario-meta">
                  <span>Norma: <strong>{sc.standard_ref || 'Industrial'}</strong></span>
                  <button
                    className={`btn ${isActive ? 'btn-danger' : 'btn-secondary'}`}
                    style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                  >
                    {isActive ? 'Inyectando...' : 'Inyectar Falla ⚡'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
