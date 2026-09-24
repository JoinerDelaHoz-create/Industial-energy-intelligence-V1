import { apiRequest } from './api';
import { PlantKPIs } from '../types/kpi';

export const kpiService = {
  async getPlantKPIs(): Promise<PlantKPIs> {
    const res = await apiRequest<PlantKPIs>('/kpis');
    if (res.success && res.data) {
      return res.data;
    }
    return {
      total_active_power_kw: 216.5,
      total_reactive_power_kvar: 104.2,
      plant_power_factor: 0.90,
      active_assets_count: 5,
      total_assets_count: 6,
      open_anomalies_count: 1,
      critical_alerts_count: 0,
      warning_alerts_count: 2,
      daily_energy_mwh: 4.82,
      estimated_reactive_penalty_usd: 0.0,
    };
  },
};
