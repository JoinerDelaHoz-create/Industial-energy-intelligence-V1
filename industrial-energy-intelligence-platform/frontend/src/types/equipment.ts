export type OperatingStatus = 'OPERATIONAL' | 'WARNING' | 'CRITICAL' | 'OFFLINE' | 'MAINTENANCE';

export type EquipmentType = 'MOTOR' | 'PUMP' | 'COMPRESSOR' | 'FAN' | 'CONVEYOR' | 'GENERATOR' | 'OTHER';

export interface Equipment {
  id: string;
  asset_code: string;
  name: string;
  equipment_type: EquipmentType;
  manufacturer?: string;
  model?: string;
  serial_number?: string;
  location?: string;
  rated_power_kw: number;
  rated_voltage: number;
  rated_current: number;
  phases: number;
  frequency: number;
  nominal_power_factor: number;
  operating_status: OperatingStatus;
  installation_date?: string;
  created_at: string;
  updated_at: string;
}

export interface EquipmentRealtimeSummary {
  equipment_id: string;
  asset_code: string;
  name: string;
  active_power_kw: number;
  current_avg: number;
  current_l1: number;
  current_l2: number;
  current_l3: number;
  voltage_l1_l2: number;
  voltage_l2_l3: number;
  voltage_l3_l1: number;
  power_factor: number;
  temperature_c: number;
  current_imbalance_pct: number;
  voltage_imbalance_pct: number;
  frequency: number;
  status: OperatingStatus;
  timestamp: string;
}
