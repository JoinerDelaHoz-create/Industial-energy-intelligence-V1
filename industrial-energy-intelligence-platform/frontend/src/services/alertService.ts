import { apiRequest } from './api';
import { Alert } from '../types/alert';

// In-memory demo store for client-side offline/Vercel visual testing
let mockAlerts: Alert[] = [
  {
    id: 'alt-001',
    equipment_id: 'e0000000-0000-0000-0000-000000000305',
    asset_code: 'MTR-305',
    title: 'Desbalance de corriente en estator (> 5%)',
    description: 'Desbalance de corriente en fases del estator superior al 5% (NEMA MG-1 derating activo)',
    threshold_value: 5.0,
    observed_value: 6.8,
    severity: 'WARNING',
    status: 'OPEN',
    fingerprint: 'MTR-305:current_unbalance_pct:HIGH',
    last_seen: new Date(Date.now() - 14 * 60000).toISOString(),
    count: 3,
  },
  {
    id: 'alt-002',
    equipment_id: 'e0000000-0000-0000-0000-000000000201',
    asset_code: 'CMP-201',
    title: 'Bajo Factor de Potencia (< 0.90)',
    description: 'Factor de potencia por debajo del límite regulatorio CREG 015 (< 0.90 inductivo)',
    threshold_value: 0.90,
    observed_value: 0.74,
    severity: 'WARNING',
    status: 'ACKNOWLEDGED',
    fingerprint: 'CMP-201:power_factor:LOW',
    last_seen: new Date(Date.now() - 42 * 60000).toISOString(),
    count: 8,
    acknowledged_by: 'Operador Sala Control',
    acknowledged_at: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: 'alt-003',
    equipment_id: 'e0000000-0000-0000-0000-000000000104',
    asset_code: 'FAN-104',
    title: 'Vibración RMS Crítica en Rodamiento',
    description: 'Vibración RMS en rodamiento lado acople en zona D (Daño inminente según ISO 10816-3)',
    threshold_value: 7.1,
    observed_value: 8.4,
    severity: 'CRITICAL',
    status: 'OPEN',
    fingerprint: 'FAN-104:vibration_rms_mms:CRITICAL',
    last_seen: new Date(Date.now() - 3 * 60000).toISOString(),
    count: 12,
  },
];

export const alertService = {
  async getAll(equipmentId?: string): Promise<Alert[]> {
    const endpoint = equipmentId ? `/alerts?equipment_id=${equipmentId}` : '/alerts';
    const res = await apiRequest<Alert[]>(endpoint);
    if (res.success && res.data) {
      return res.data;
    }
    if (equipmentId) {
      return mockAlerts.filter(a => a.equipment_id === equipmentId);
    }
    return mockAlerts;
  },

  async acknowledge(id: string): Promise<boolean> {
    const res = await apiRequest(`/alerts/${id}/acknowledge`, { method: 'POST' });
    if (res.success) return true;
    mockAlerts = mockAlerts.map(a =>
      a.id === id ? { ...a, status: 'ACKNOWLEDGED', acknowledged_by: 'Operador Demo', acknowledged_at: new Date().toISOString() } : a
    );
    return true;
  },

  async resolve(id: string, notes?: string): Promise<boolean> {
    const res = await apiRequest(`/alerts/${id}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
    if (res.success) return true;
    mockAlerts = mockAlerts.filter(a => a.id !== id);
    return true;
  },
};
