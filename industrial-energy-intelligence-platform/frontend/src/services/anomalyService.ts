import { apiRequest } from './api';
import { Anomaly } from '../types/anomaly';

let mockAnomalies: Anomaly[] = [
  {
    id: 'anom-101',
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
    equipment_id: 'e0000000-0000-0000-0000-000000000305',
    asset_code: 'MTR-305',
    equipment_name: 'Motor Principal Molino de Crudo',
    variable_name: 'current_unbalance_pct',
    observed_value: 6.82,
    expected_value: 0.85,
    deviation: 5.97,
    unit: '%',
    detection_level: 'THRESHOLD',
    severity: 'WARNING',
    status: 'OPEN',
    explanation: 'Desbalance de corriente L1-L2-L3 excede el límite NEMA MG-1 de 5.0%. Produce calentamiento adicional en devanados estatóricos.',
    recommendation: 'Verificar balance de tensión en alimentador de 480V y resistencia de aislamiento en bornes de conexión.',
    created_at: new Date(Date.now() - 25 * 60000).toISOString(),
  },
  {
    id: 'anom-102',
    timestamp: new Date(Date.now() - 110 * 60000).toISOString(),
    equipment_id: 'e0000000-0000-0000-0000-000000000201',
    asset_code: 'CMP-201',
    equipment_name: 'Compresor de Aire Tornillo',
    variable_name: 'active_power_kw',
    observed_value: 18.4,
    expected_value: 0.2,
    deviation: 18.2,
    unit: 'kW',
    detection_level: 'BASELINE',
    severity: 'WARNING',
    status: 'INVESTIGATING',
    explanation: 'Consumo residual detectado fuera del turno de producción (02:15 AM). Posible fuga en línea neumática o ciclo de desahogo trabado.',
    recommendation: 'Revisar presostato y válvulas de purga automática en cabezal de distribución.',
    created_at: new Date(Date.now() - 110 * 60000).toISOString(),
  },
  {
    id: 'anom-103',
    timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
    equipment_id: 'e0000000-0000-0000-0000-000000000104',
    asset_code: 'FAN-104',
    equipment_name: 'Extractor Forzado Horno 1',
    variable_name: 'vibration_rms_mms',
    observed_value: 8.42,
    expected_value: 2.1,
    deviation: 6.32,
    unit: 'mm/s',
    detection_level: 'STATISTICAL',
    severity: 'CRITICAL',
    status: 'OPEN',
    explanation: 'Pico z-score = 4.2σ respecto a la media móvil de 7 días. Severidad clasificada en zona D según ISO 10816-3 Grupo 1.',
    recommendation: 'Inspeccionar holgura mecánica en rodamiento de empuje y estado de lubricación antes del próximo cambio de turno.',
    created_at: new Date(Date.now() - 12 * 60000).toISOString(),
  },
];

export const anomalyService = {
  async getAll(equipmentId?: string): Promise<Anomaly[]> {
    const endpoint = equipmentId ? `/anomalies?equipment_id=${equipmentId}` : '/anomalies';
    const res = await apiRequest<Anomaly[]>(endpoint);
    if (res.success && res.data) {
      return res.data;
    }
    if (equipmentId) {
      return mockAnomalies.filter(a => a.equipment_id === equipmentId);
    }
    return mockAnomalies;
  },

  async acknowledge(id: string): Promise<boolean> {
    const res = await apiRequest(`/anomalies/${id}/acknowledge`, { method: 'POST' });
    if (res.success) return true;
    mockAnomalies = mockAnomalies.map(a =>
      a.id === id ? { ...a, status: 'ACKNOWLEDGED' } : a
    );
    return true;
  },

  async resolve(id: string, notes?: string): Promise<boolean> {
    const res = await apiRequest(`/anomalies/${id}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
    if (res.success) return true;
    mockAnomalies = mockAnomalies.filter(a => a.id !== id);
    return true;
  },

  async markFalsePositive(id: string): Promise<boolean> {
    const res = await apiRequest(`/anomalies/${id}/false-positive`, { method: 'POST' });
    if (res.success) return true;
    mockAnomalies = mockAnomalies.map(a =>
      a.id === id ? { ...a, status: 'FALSE_POSITIVE' } : a
    );
    return true;
  },
};
