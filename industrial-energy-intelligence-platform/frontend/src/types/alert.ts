export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL';
export type AlertStatus = 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED' | 'SUPPRESSED';

export interface Alert {
  id: string;
  title: string;
  description: string;
  equipment_id: string;
  asset_code?: string;
  measurement_point_id?: string;
  observed_value: number;
  threshold_value: number;
  severity: AlertSeverity;
  status: AlertStatus;
  fingerprint: string;
  last_seen: string;
  count: number;
  cooldown_until?: string;
  acknowledged_at?: string;
  acknowledged_by?: string;
  resolved_at?: string;
  resolution_notes?: string;
}
