import { apiRequest } from './api';
import { Equipment, EquipmentRealtimeSummary } from '../types/equipment';

export const equipmentService = {
  async getAll(): Promise<Equipment[]> {
    const res = await apiRequest<Equipment[]>('/equipment');
    if (res.success && res.data) {
      return res.data;
    }
    // Fallback default assets if offline
    return [
      {
        id: 'e0000000-0000-0000-0000-000000000305',
        asset_code: 'MTR-305',
        name: 'Motor Principal Molino de Crudo',
        equipment_type: 'MOTOR',
        manufacturer: 'WEG',
        model: 'W22 Premium IE3',
        serial_number: 'WEG-2024-8849',
        location: 'Planta Demo Caribe - Molienda',
        rated_power_kw: 75.0,
        rated_voltage: 460.0,
        rated_current: 115.0,
        phases: 3,
        frequency: 60.0,
        nominal_power_factor: 0.88,
        operating_status: 'OPERATIONAL',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'e0000000-0000-0000-0000-000000000102',
        asset_code: 'PMP-102',
        name: 'Bomba de Alimentación Enfriamiento',
        equipment_type: 'PUMP',
        manufacturer: 'KSB',
        model: 'Meganorm 125-250',
        location: 'Planta Demo Caribe - Servicios Auxiliares',
        rated_power_kw: 37.0,
        rated_voltage: 460.0,
        rated_current: 58.0,
        phases: 3,
        frequency: 60.0,
        nominal_power_factor: 0.86,
        operating_status: 'OPERATIONAL',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'e0000000-0000-0000-0000-000000000201',
        asset_code: 'CMP-201',
        name: 'Compresor de Aire Tornillo',
        equipment_type: 'COMPRESSOR',
        manufacturer: 'Atlas Copco',
        model: 'GA 55 VSD',
        location: 'Planta Demo Caribe - Casa de Fuerza',
        rated_power_kw: 55.0,
        rated_voltage: 460.0,
        rated_current: 88.0,
        phases: 3,
        frequency: 60.0,
        nominal_power_factor: 0.90,
        operating_status: 'WARNING',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'e0000000-0000-0000-0000-000000000104',
        asset_code: 'FAN-104',
        name: 'Extractor Forzado Horno 1',
        equipment_type: 'FAN',
        manufacturer: 'FläktGroup',
        model: 'JMv 1000/4',
        location: 'Planta Demo Caribe - Piroprocesamiento',
        rated_power_kw: 45.0,
        rated_voltage: 460.0,
        rated_current: 72.0,
        phases: 3,
        frequency: 60.0,
        nominal_power_factor: 0.85,
        operating_status: 'OPERATIONAL',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  },

  async getRealtime(equipmentId: string): Promise<EquipmentRealtimeSummary | null> {
    const res = await apiRequest<EquipmentRealtimeSummary>(`/equipment/${equipmentId}/realtime`);
    if (res.success && res.data) {
      return res.data;
    }
    return null;
  },
};
