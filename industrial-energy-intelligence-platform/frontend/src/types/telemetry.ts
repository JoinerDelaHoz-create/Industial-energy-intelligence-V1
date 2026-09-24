export type SignalQuality = 'GOOD' | 'BAD' | 'UNCERTAIN';
export type TelemetrySource = 'SIMULATOR' | 'MQTT' | 'MODBUS' | 'MANUAL';

export interface TelemetryReading {
  time: string;
  equipment_id: string;
  measurement_point_id: string;
  value: number;
  unit: string;
  quality: SignalQuality;
  source: TelemetrySource;
}

export interface TelemetryPointHistory {
  timestamp: string;
  power_kw: number;
  current_l1: number;
  current_l2: number;
  current_l3: number;
  voltage_avg: number;
  power_factor: number;
  temperature: number;
}
