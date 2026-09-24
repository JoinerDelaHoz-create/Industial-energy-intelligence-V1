export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  category: 'ELECTRICAL' | 'THERMAL' | 'MECHANICAL' | 'COMMUNICATION' | 'OPERATIONAL';
  affected_variables: string[];
  severity: 'NORMAL' | 'WARNING' | 'CRITICAL';
  standard_ref?: string;
}

export interface SimulationStatus {
  is_running: boolean;
  active_scenario: string;
  scenario_name: string;
  elapsed_seconds: number;
  intensity: number;
  affected_asset: string;
  injected_fault_description: string;
}
