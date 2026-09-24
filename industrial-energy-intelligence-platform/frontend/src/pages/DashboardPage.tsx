import React from 'react';
import { EquipmentRealtimeSummary } from '../types/equipment';
import { PlantKPIs } from '../types/kpi';
import { ThreePhaseDial } from '../components/charts/ThreePhaseDial';
import { PowerFactorMeter } from '../components/charts/PowerFactorMeter';
import { LiveTrendChart } from '../components/charts/LiveTrendChart';
import { StatusBadge } from '../components/status/StatusBadge';

interface DashboardPageProps {
  telemetry: EquipmentRealtimeSummary;
  kpis: PlantKPIs;
  historyBuffer: { time: string; power: number; current: number }[];
  onOpenSimulation: () => void;
  onOpenAlerts: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  telemetry,
  kpis,
  historyBuffer,
  onOpenSimulation,
  onOpenAlerts,
}) => {
  const isHighImbalance = telemetry.current_imbalance_pct > 5.0;

  return (
    <div>
      {/* KPI Ribbon */}
      <section className="kpi-grid">
        <div className="kpi-card cyan">
          <div className="kpi-icon-box" style={{ color: 'var(--color-cyan)' }}>⚡</div>
          <div className="kpi-details">
            <span className="kpi-title">Potencia Activa Total</span>
            <div className="kpi-number">
              {kpis.total_active_power_kw.toFixed(1)} <span className="kpi-unit">kW</span>
            </div>
            <span className="kpi-subtext">5 Activos en Carga Continua</span>
          </div>
        </div>

        <div className="kpi-card emerald">
          <div className="kpi-icon-box" style={{ color: 'var(--color-emerald)' }}>🔋</div>
          <div className="kpi-details">
            <span className="kpi-title">Energía Diaria Consumida</span>
            <div className="kpi-number">
              {kpis.daily_energy_mwh.toFixed(2)} <span className="kpi-unit">MWh</span>
            </div>
            <span className="kpi-subtext">Turno Actual (Ciclo 24h)</span>
          </div>
        </div>

        <div className="kpi-card amber">
          <div className="kpi-icon-box" style={{ color: 'var(--color-amber)' }}>🎯</div>
          <div className="kpi-details">
            <span className="kpi-title">Factor de Potencia Planta</span>
            <div className="kpi-number">
              {kpis.plant_power_factor.toFixed(2)}
            </div>
            <span className="kpi-subtext">Compensación Banco kVAR</span>
          </div>
        </div>

        <div className="kpi-card crimson" onClick={onOpenAlerts} style={{ cursor: 'pointer' }}>
          <div className="kpi-icon-box" style={{ color: 'var(--color-crimson)' }}>🔔</div>
          <div className="kpi-details">
            <span className="kpi-title">Alarmas Activas ISA 18.2</span>
            <div className="kpi-number" style={{ color: kpis.critical_alerts_count > 0 ? 'var(--color-crimson)' : 'var(--text-main)' }}>
              {kpis.critical_alerts_count + kpis.warning_alerts_count}
            </div>
            <span className="kpi-subtext">{kpis.critical_alerts_count} Críticas • {kpis.warning_alerts_count} Advertencias</span>
          </div>
        </div>
      </section>

      {/* Asset Focus Banner */}
      <section className="asset-banner">
        <div className="asset-title-group">
          <h2>Motor Principal Molino de Crudo (MTR-305)</h2>
          <p>WEG W22 Premium IE3 • 75 kW • 460 V • 115 A FLA • 60 Hz • IP55</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <StatusBadge status={telemetry.status} />
          <button className="btn btn-secondary" onClick={onOpenSimulation}>
            <span>🎮</span> Probar Falla en Gemelo
          </button>
        </div>
      </section>

      {/* Main Telemetry & Dials Section */}
      <div className="telemetry-dashboard-grid">
        {/* Left: 3-Phase Dials & Imbalance Warning */}
        <div className="panel-card">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">⚡ Monitoreo Trifásico de Corriente</h3>
              <p className="panel-subtitle">Amperios RMS por Fase y Derating NEMA MG-1</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge" style={{
                background: isHighImbalance ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                color: isHighImbalance ? 'var(--color-crimson)' : 'var(--color-emerald)',
                border: `1px solid ${isHighImbalance ? 'var(--color-crimson)' : 'var(--color-emerald)'}`
              }}>
                Desbalance NEMA: {telemetry.current_imbalance_pct.toFixed(1)}%
              </span>
            </div>
          </div>

          {isHighImbalance && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--color-crimson)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              marginBottom: 16,
              fontSize: '0.8rem',
              color: '#fca5a5',
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}>
              <span style={{ fontSize: '1.2rem' }}>⚠️</span>
              <span>
                <strong>ADVERTENCIA NEMA MG-1:</strong> Desbalance de corriente superior al 5.0% genera sobrecalentamiento en devanados del estator y reducción de vida útil del aislamiento Clase F.
              </span>
            </div>
          )}

          <div className="dials-row">
            <ThreePhaseDial
              label="Fase L1 (R)"
              value={telemetry.current_l1}
              nominalValue={115}
              unit="A"
              phaseColor="var(--color-cyan)"
            />
            <ThreePhaseDial
              label="Fase L2 (S)"
              value={telemetry.current_l2}
              nominalValue={115}
              unit="A"
              phaseColor="var(--color-amber)"
            />
            <ThreePhaseDial
              label="Fase L3 (T)"
              value={telemetry.current_l3}
              nominalValue={115}
              unit="A"
              phaseColor="var(--color-purple)"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 20 }}>
            <div className="voltage-row">
              <span className="voltage-label">V_L1-L2</span>
              <span className="voltage-val">{telemetry.voltage_l1_l2.toFixed(1)} V</span>
            </div>
            <div className="voltage-row">
              <span className="voltage-label">V_L2-L3</span>
              <span className="voltage-val">{telemetry.voltage_l2_l3.toFixed(1)} V</span>
            </div>
            <div className="voltage-row">
              <span className="voltage-label">V_L3-L1</span>
              <span className="voltage-val">{telemetry.voltage_l3_l1.toFixed(1)} V</span>
            </div>
            <div className="voltage-row">
              <span className="voltage-label">Frecuencia</span>
              <span className="voltage-val">{telemetry.frequency.toFixed(2)} Hz</span>
            </div>
          </div>
        </div>

        {/* Right: Power Factor Gauge & Casing Temp */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <PowerFactorMeter pf={telemetry.power_factor} />

          <div className="panel-card" style={{ flex: 1 }}>
            <div className="panel-header" style={{ marginBottom: 12 }}>
              <div>
                <h3 className="panel-title">🌡️ Estado Térmico</h3>
                <p className="panel-subtitle">Sensor RTD PT100 Estator</p>
              </div>
              <span className={`badge ${telemetry.temperature_c > 85 ? 'badge-critical' : 'badge-operational'}`}>
                {telemetry.temperature_c > 85 ? 'SOBRECALENTAMIENTO' : 'ESTABLE'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 700, color: telemetry.temperature_c > 85 ? 'var(--color-crimson)' : 'var(--text-main)' }}>
                  {telemetry.temperature_c.toFixed(1)} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>°C</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Límite térmico clase F: 105 °C</p>
              </div>

              <div style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: telemetry.temperature_c > 85 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                border: `2px solid ${telemetry.temperature_c > 85 ? 'var(--color-crimson)' : 'var(--color-emerald)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                {telemetry.temperature_c > 85 ? '🔥' : '❄️'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Real-time Trend Graph */}
      <LiveTrendChart data={historyBuffer} />
    </div>
  );
};
