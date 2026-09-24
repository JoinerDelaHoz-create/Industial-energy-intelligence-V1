import React, { useState } from 'react';
import { PlantKPIs } from '../types/kpi';

interface ReportsPageProps {
  kpis: PlantKPIs;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ kpis }) => {
  const [reportType, setReportType] = useState<'energy' | 'anomalies' | 'events'>('energy');
  const [period, setPeriod] = useState<'24h' | '7d' | '30d'>('24h');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleExportCsv = () => {
    setIsExporting(true);
    // Trigger download from backend API or build RFC 4180 CSV locally
    setTimeout(() => {
      const headers = 'timestamp,asset_code,active_power_kw,current_avg_a,voltage_avg_v,power_factor,status\n';
      const sampleRow = `${new Date().toISOString()},MTR-305,${kpis.total_active_power_kw.toFixed(1)},92.4,460.2,${kpis.plant_power_factor.toFixed(2)},OPERATIONAL\n`;
      const blob = new Blob([headers + sampleRow], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `IEIP_${reportType}_report_${period}_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
    }, 600);
  };

  return (
    <div>
      <div className="panel-header" style={{ marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700 }}>
            📑 Módulo de Auditoría Energética & Cumplimiento ISO 50001
          </h2>
          <p className="panel-subtitle">Exportación de Trazabilidad Metrológica en Formato CSV (RFC 4180)</p>
        </div>

        <button className="btn btn-primary" onClick={handleExportCsv} disabled={isExporting}>
          <span>📥</span> {isExporting ? 'Generando CSV...' : 'Descargar Reporte CSV'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 24 }}>
        <div className="panel-card">
          <h3 className="panel-title" style={{ fontSize: '1rem', marginBottom: 12 }}>⚙️ Parámetros de Extracción</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Tipo de Reporte</label>
              <select
                className="btn btn-secondary"
                style={{ width: '100%', marginTop: 4, cursor: 'pointer' }}
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
              >
                <option value="energy">Consumo Energético & Potencia (kW / MWh)</option>
                <option value="anomalies">Bitácora de Anomalías & Desbalances</option>
                <option value="events">Historial de Alarmas ISA 18.2</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Rango Temporal</label>
              <select
                className="btn btn-secondary"
                style={{ width: '100%', marginTop: 4, cursor: 'pointer' }}
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
              >
                <option value="24h">Últimas 24 Horas (Muestreo 1 Hz)</option>
                <option value="7d">Últimos 7 Días (Ventanas de 15 min)</option>
                <option value="30d">Últimos 30 Días (Agrupación Horaria)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="panel-card">
          <h3 className="panel-title" style={{ fontSize: '1rem', marginBottom: 12 }}>📊 Indicadores Energéticos (EnPI)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="voltage-row">
              <span className="voltage-label">Energía Total</span>
              <span className="voltage-val">{kpis.daily_energy_mwh.toFixed(2)} MWh</span>
            </div>
            <div className="voltage-row">
              <span className="voltage-label">Reactiva kVARh</span>
              <span className="voltage-val">{(kpis.daily_energy_mwh * 0.45).toFixed(2)} kVARh</span>
            </div>
            <div className="voltage-row">
              <span className="voltage-label">PF Ponderado</span>
              <span className="voltage-val">{kpis.plant_power_factor.toFixed(2)}</span>
            </div>
            <div className="voltage-row">
              <span className="voltage-label">Penalización Est.</span>
              <span className="voltage-val">$0.00 USD</span>
            </div>
          </div>
        </div>
      </div>

      <div className="panel-card">
        <div className="panel-header">
          <h3 className="panel-title">Vista Previa de Datos de Auditoría (Top 5 Registros)</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>MTR-305 • Sensor de Entrada PM5350</span>
        </div>

        <table className="industrial-table">
          <thead>
            <tr>
              <th>Timestamp UTC</th>
              <th>Activo</th>
              <th>P. Activa (kW)</th>
              <th>Corriente Media (A)</th>
              <th>Tensión Prom. (V)</th>
              <th>Factor Potencia</th>
              <th>Calidad Señal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontFamily: 'var(--font-mono)' }}>{new Date().toISOString().substring(0, 19)}Z</td>
              <td style={{ color: 'var(--color-cyan)', fontWeight: 700 }}>MTR-305</td>
              <td style={{ fontFamily: 'var(--font-mono)' }}>64.8 kW</td>
              <td style={{ fontFamily: 'var(--font-mono)' }}>92.4 A</td>
              <td style={{ fontFamily: 'var(--font-mono)' }}>460.1 V</td>
              <td style={{ fontFamily: 'var(--font-mono)' }}>0.88</td>
              <td><span className="badge badge-operational">GOOD (0x00)</span></td>
            </tr>
            <tr>
              <td style={{ fontFamily: 'var(--font-mono)' }}>{new Date(Date.now() - 1000).toISOString().substring(0, 19)}Z</td>
              <td style={{ color: 'var(--color-cyan)', fontWeight: 700 }}>MTR-305</td>
              <td style={{ fontFamily: 'var(--font-mono)' }}>64.5 kW</td>
              <td style={{ fontFamily: 'var(--font-mono)' }}>92.1 A</td>
              <td style={{ fontFamily: 'var(--font-mono)' }}>460.3 V</td>
              <td style={{ fontFamily: 'var(--font-mono)' }}>0.88</td>
              <td><span className="badge badge-operational">GOOD (0x00)</span></td>
            </tr>
            <tr>
              <td style={{ fontFamily: 'var(--font-mono)' }}>{new Date(Date.now() - 2000).toISOString().substring(0, 19)}Z</td>
              <td style={{ color: 'var(--color-cyan)', fontWeight: 700 }}>MTR-305</td>
              <td style={{ fontFamily: 'var(--font-mono)' }}>65.1 kW</td>
              <td style={{ fontFamily: 'var(--font-mono)' }}>92.7 A</td>
              <td style={{ fontFamily: 'var(--font-mono)' }}>459.8 V</td>
              <td style={{ fontFamily: 'var(--font-mono)' }}>0.89</td>
              <td><span className="badge badge-operational">GOOD (0x00)</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
