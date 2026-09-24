export type AnomalySeverity = 'INFO' | 'WARNING' | 'CRITICAL';
export type DetectionLevel = 'THRESHOLD' | 'STATISTICAL' | 'BASELINE';
export type AnomalyStatus = 'OPEN' | 'ACKNOWLEDGED' | 'INVESTIGATING' | 'RESOLVED' | 'FALSE_POSITIVE';

export interface Anomaly {
  id: string;
  timestamp: string;
  equipment_id: string;
  asset_code?: string;
  equipment_name?: string;
  measurement_point_id?: string;
  variable_name?: string;
  observed_value: number;
  expected_value: number;
  deviation: number;
  unit?: string;
  detection_level: DetectionLevel;
  severity: AnomalySeverity;
  status: AnomalyStatus;
  explanation: string;
  recommendation?: string;
  resolved_at?: string;
  created_at: string;
}
