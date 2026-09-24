import { apiRequest } from './api';
import { SimulationScenario, SimulationStatus } from '../types/simulation';

export const simulationService = {
  async getScenarios(): Promise<SimulationScenario[]> {
    const res = await apiRequest<SimulationScenario[]>('/simulation/scenarios');
    if (res.success && res.data) {
      return res.data;
    }
    // Fallback list of 12 scenarios
    return [
      { id: 'NORMAL_OPERATION', name: 'Operación Nominal', description: 'Motor trifásico en punto de máxima eficiencia con ruido AR(1) ±1.5%.', category: 'ELECTRICAL', affected_variables: ['Todas'], severity: 'NORMAL', standard_ref: 'IEC 60034-1' },
      { id: 'OVERCURRENT', name: 'Sobrecarga Mecánica Severa', description: 'Atascamiento de rotor/molino incrementando corriente al 155% FLA.', category: 'ELECTRICAL', affected_variables: ['I_L1', 'I_L2', 'I_L3', 'kW'], severity: 'CRITICAL', standard_ref: 'NEMA MG-1' },
      { id: 'PHASE_IMBALANCE', name: 'Desbalance de Fases Severo', description: 'Caída de tensión asimétrica provocando desbalance de corriente > 9.5%.', category: 'ELECTRICAL', affected_variables: ['I_L1', 'I_L2', 'V_diff'], severity: 'CRITICAL', standard_ref: 'NEMA MG-1 (Derating)' },
      { id: 'LOW_POWER_FACTOR', name: 'Factor de Potencia Degradado', description: 'Operación en vacío/subcarga con factor de potencia descendiendo a 0.68.', category: 'OPERATIONAL', affected_variables: ['PF', 'kVAR'], severity: 'WARNING', standard_ref: 'CREG 015 / IEEE 1459' },
      { id: 'OVERTEMPERATURE', name: 'Sobretemperatura por Ventilación', description: 'Obstrucción de aletas del estator elevando carcasa sobre 95 °C.', category: 'THERMAL', affected_variables: ['Temp_C'], severity: 'CRITICAL', standard_ref: 'IEC 60085 Class F' },
      { id: 'VOLTAGE_SAG', name: 'Hueco de Tensión (Sag 18%)', description: 'Perturbación transitoria en red eléctrica reduciendo tensión a 378 V.', category: 'ELECTRICAL', affected_variables: ['V_12', 'V_23', 'V_31'], severity: 'WARNING', standard_ref: 'IEEE 1159' },
      { id: 'HARMONIC_DISTORTION', name: 'Distorsión Armónica por VFD', description: 'THD de corriente superando el 12% por conmutación no filtrada.', category: 'ELECTRICAL', affected_variables: ['THD_I', 'kVAR'], severity: 'WARNING', standard_ref: 'IEEE 519' },
      { id: 'VIBRATION_BEARING_SPIKE', name: 'Falla Mecánica de Rodamiento', description: 'Pico de vibración en rodamiento lado acople superando 7.2 mm/s RMS.', category: 'MECHANICAL', affected_variables: ['Vib_RMS'], severity: 'CRITICAL', standard_ref: 'ISO 10816-3' },
      { id: 'OFF_HOURS_CONSUMPTION', name: 'Fuga de Energía en Horario Inactivo', description: 'Consumo no autorizado a las 02:00 AM durante parada de producción.', category: 'OPERATIONAL', affected_variables: ['kW', 'kWh'], severity: 'WARNING', standard_ref: 'ISO 50001 EnPI' },
      { id: 'COMMUNICATION_LOSS', name: 'Pérdida de Enlace Gateway MQTT', description: 'Pérdida de tramas de telemetría e inserción de calidad UNCERTAIN/BAD.', category: 'COMMUNICATION', affected_variables: ['Quality', 'Heartbeat'], severity: 'WARNING', standard_ref: 'MQTT LWT' },
      { id: 'SENSOR_DRIFT', name: 'Deriva Metrológica de Sensor', description: 'Calibración desfasada del transformador de corriente fase L3.', category: 'ELECTRICAL', affected_variables: ['I_L3'], severity: 'WARNING', standard_ref: 'Metrología Legal' },
      { id: 'SOFT_STARTER_FAULT', name: 'Falla de Bypass en Arrancador Suave', description: 'Tiristores conduciendo permanentemente generando armónicos y sobrecalentamiento.', category: 'ELECTRICAL', affected_variables: ['Temp', 'THD'], severity: 'CRITICAL', standard_ref: 'IEEE 519' },
    ];
  },

  async startScenario(scenarioId: string, equipmentId?: string, intensity: number = 1.0): Promise<boolean> {
    const res = await apiRequest('/simulation/start', {
      method: 'POST',
      body: JSON.stringify({
        scenario: scenarioId,
        equipment_id: equipmentId || 'e0000000-0000-0000-0000-000000000305',
        intensity,
        duration_seconds: 120,
      }),
    });
    return res.success;
  },

  async stopScenario(): Promise<boolean> {
    const res = await apiRequest('/simulation/stop', { method: 'POST' });
    return res.success;
  },

  async getStatus(): Promise<SimulationStatus> {
    const res = await apiRequest<SimulationStatus>('/simulation/status');
    if (res.success && res.data) {
      return res.data;
    }
    return {
      is_running: false,
      active_scenario: 'NORMAL_OPERATION',
      scenario_name: 'Operación Nominal',
      elapsed_seconds: 0,
      intensity: 1.0,
      affected_asset: 'MTR-305',
      injected_fault_description: 'Comportamiento en régimen estacionario balanceado.',
    };
  },
};
