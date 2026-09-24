import { useState, useEffect, useRef } from 'react';
import { Header } from './components/layout/Header';
import { Navigation, TabKey } from './components/layout/Navigation';
import { DashboardPage } from './pages/DashboardPage';
import { FleetPage } from './pages/FleetPage';
import { AnomalyCenterPage } from './pages/AnomalyCenterPage';
import { AlertCenterPage } from './pages/AlertCenterPage';
import { SimulationControlPage } from './pages/SimulationControlPage';
import { ReportsPage } from './pages/ReportsPage';

import { equipmentService } from './services/equipmentService';
import { anomalyService } from './services/anomalyService';
import { alertService } from './services/alertService';
import { simulationService } from './services/simulationService';
import { kpiService } from './services/kpiService';

import { Equipment, EquipmentRealtimeSummary } from './types/equipment';
import { Anomaly } from './types/anomaly';
import { Alert } from './types/alert';
import { SimulationScenario, SimulationStatus } from './types/simulation';
import { PlantKPIs } from './types/kpi';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<string>('e0000000-0000-0000-0000-000000000305');

  // Real-time telemetry snapshot
  const [telemetry, setTelemetry] = useState<EquipmentRealtimeSummary>({
    equipment_id: 'e0000000-0000-0000-0000-000000000305',
    asset_code: 'MTR-305',
    name: 'Motor Principal Molino de Crudo',
    active_power_kw: 65.4,
    current_avg: 92.8,
    current_l1: 93.1,
    current_l2: 92.5,
    current_l3: 92.9,
    voltage_l1_l2: 460.2,
    voltage_l2_l3: 459.7,
    voltage_l3_l1: 460.5,
    power_factor: 0.88,
    temperature_c: 67.4,
    current_imbalance_pct: 0.6,
    voltage_imbalance_pct: 0.2,
    frequency: 60.0,
    status: 'OPERATIONAL',
    timestamp: new Date().toISOString(),
  });

  const [historyBuffer, setHistoryBuffer] = useState<{ time: string; power: number; current: number }[]>([]);

  // Plant state
  const [kpis, setKpis] = useState<PlantKPIs>({
    total_active_power_kw: 216.5,
    total_reactive_power_kvar: 104.2,
    plant_power_factor: 0.89,
    active_assets_count: 5,
    total_assets_count: 6,
    open_anomalies_count: 0,
    critical_alerts_count: 0,
    warning_alerts_count: 0,
    daily_energy_mwh: 4.82,
    estimated_reactive_penalty_usd: 0.0,
  });

  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [scenarios, setScenarios] = useState<SimulationScenario[]>([]);
  const [simStatus, setSimStatus] = useState<SimulationStatus>({
    is_running: false,
    active_scenario: 'NORMAL_OPERATION',
    scenario_name: 'Operación Nominal',
    elapsed_seconds: 0,
    intensity: 1.0,
    affected_asset: 'MTR-305',
    injected_fault_description: 'Generando telemetría trifásica balanceada sin fallas activas.',
  });

  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'warning' | 'critical' }[]>([]);
  const lastAlertCount = useRef<number>(0);

  // Initial load
  useEffect(() => {
    const loadInitialData = async () => {
      const [eqs, scs] = await Promise.all([
        equipmentService.getAll(),
        simulationService.getScenarios(),
      ]);
      setEquipmentList(eqs);
      setScenarios(scs);
    };
    loadInitialData();
  }, []);

  // 1 Hz High-Frequency Telemetry Loop
  useEffect(() => {
    let tickCount = 0;
    const telemetryInterval = setInterval(async () => {
      tickCount++;
      const data = await equipmentService.getRealtime(selectedAsset);
      if (data) {
        setTelemetry(data);
        setHistoryBuffer((prev) => {
          const next = [...prev, { time: new Date().toLocaleTimeString(), power: data.active_power_kw, current: data.current_avg }];
          return next.slice(-30);
        });
      } else {
        // Fallback smooth oscillation when backend connection is pending
        setTelemetry((prev) => {
          const noise = (Math.random() - 0.5) * 0.8;
          const newPower = Math.max(50, prev.active_power_kw + noise);
          const newCurrent = (newPower * 1000) / (Math.sqrt(3) * 460 * prev.power_factor);
          setHistoryBuffer((buf) => {
            const next = [...buf, { time: new Date().toLocaleTimeString(), power: newPower, current: newCurrent }];
            return next.slice(-30);
          });
          return {
            ...prev,
            active_power_kw: newPower,
            current_avg: newCurrent,
            current_l1: newCurrent + (Math.random() - 0.5) * 0.4,
            current_l2: newCurrent + (Math.random() - 0.5) * 0.4,
            current_l3: newCurrent + (Math.random() - 0.5) * 0.4,
            timestamp: new Date().toISOString(),
          };
        });
      }
    }, 1000);

    return () => clearInterval(telemetryInterval);
  }, [selectedAsset]);

  // Periodic Polling (every 3 seconds) for alerts, anomalies, KPIs, simStatus
  useEffect(() => {
    const pollSecondary = async () => {
      const [newKpis, newAnomalies, newAlerts, newSim] = await Promise.all([
        kpiService.getPlantKPIs(),
        anomalyService.getAll(),
        alertService.getAll(),
        simulationService.getStatus(),
      ]);

      setKpis(newKpis);
      setAnomalies(newAnomalies);
      setAlerts(newAlerts);
      setSimStatus(newSim);

      // Notification detection for new alerts
      const critCount = newAlerts.filter((a) => a.severity === 'CRITICAL' && a.status === 'OPEN').length;
      if (critCount > lastAlertCount.current) {
        const id = Math.random().toString();
        setToasts((prev) => [
          ...prev,
          { id, message: `⚠️ Nueva alarma crítica detectada por ISA 18.2 (${newSim.scenario_name})`, type: 'critical' },
        ]);
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
      }
      lastAlertCount.current = critCount;
    };

    pollSecondary();
    const interval = setInterval(pollSecondary, 2500);
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleAcknowledgeAnomaly = async (id: string) => {
    await anomalyService.acknowledge(id);
    setAnomalies((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'ACKNOWLEDGED' } : a)));
  };

  const handleResolveAnomaly = async (id: string) => {
    await anomalyService.resolve(id);
    setAnomalies((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAcknowledgeAlert = async (id: string) => {
    await alertService.acknowledge(id);
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'ACKNOWLEDGED' } : a)));
  };

  const handleResolveAlert = async (id: string) => {
    await alertService.resolve(id);
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleStartScenario = async (scenarioId: string, intensity: number) => {
    await simulationService.startScenario(scenarioId, selectedAsset, intensity);
    const updated = await simulationService.getStatus();
    setSimStatus(updated);
    setActiveTab('dashboard'); // Switch to live dials to see the effect immediately
  };

  const handleStopScenario = async () => {
    await simulationService.stopScenario();
    const updated = await simulationService.getStatus();
    setSimStatus(updated);
  };

  const openAlertsCount = alerts.filter((a) => a.status === 'OPEN').length;
  const openAnomaliesCount = anomalies.filter((a) => a.status === 'OPEN').length;

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header
        criticalAlertCount={kpis.critical_alerts_count}
        openAnomalyCount={kpis.open_anomalies_count}
        isSimulating={simStatus.is_running && simStatus.active_scenario !== 'NORMAL_OPERATION'}
        activeScenarioName={simStatus.scenario_name}
      />

      {/* Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        openAnomaliesCount={openAnomaliesCount}
        openAlertsCount={openAlertsCount}
      />

      {/* Main Workspace */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <DashboardPage
            telemetry={telemetry}
            kpis={kpis}
            historyBuffer={historyBuffer}
            onOpenSimulation={() => setActiveTab('simulation')}
            onOpenAlerts={() => setActiveTab('alerts')}
          />
        )}

        {activeTab === 'fleet' && (
          <FleetPage
            equipmentList={equipmentList}
            onSelectEquipment={(eq) => {
              setSelectedAsset(eq.id);
              setActiveTab('dashboard');
            }}
          />
        )}

        {activeTab === 'anomalies' && (
          <AnomalyCenterPage
            anomalies={anomalies}
            onAcknowledge={handleAcknowledgeAnomaly}
            onResolve={handleResolveAnomaly}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertCenterPage
            alerts={alerts}
            onAcknowledge={handleAcknowledgeAlert}
            onResolve={handleResolveAlert}
          />
        )}

        {activeTab === 'simulation' && (
          <SimulationControlPage
            scenarios={scenarios}
            status={simStatus}
            onStartScenario={handleStartScenario}
            onStopScenario={handleStopScenario}
          />
        )}

        {activeTab === 'reports' && <ReportsPage kpis={kpis} />}
      </main>

      {/* Floating Notifications */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <span style={{ fontSize: '1.2rem' }}>⚠️</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
