export interface PlantKPIs {
  total_active_power_kw: number;
  total_reactive_power_kvar: number;
  plant_power_factor: number;
  active_assets_count: number;
  total_assets_count: number;
  open_anomalies_count: number;
  critical_alerts_count: number;
  warning_alerts_count: number;
  daily_energy_mwh: number;
  estimated_reactive_penalty_usd: number;
}
