# IEIP — Arquitectura del Sistema (ARCHITECTURE.md)

## 1. Principios de Diseño
1. **Desacoplamiento Protocolar**: La lógica de análisis no conoce si los datos provienen de un socket Modbus, un tópico MQTT o una función de simulación física. Todos convergen a `RawTelemetryPayload`.
2. **Escalabilidad Temporal**: Uso de **TimescaleDB** (extensión de PostgreSQL basada en hypertables particionadas por tiempo) para absorber altas tasas de muestreo sin degradar las consultas analíticas.
3. **Determinismo y Resiliencia**: El motor analítico ejecuta tuberías puras en memoria con amortiguación de colas asíncronas para evitar bloqueos por latencia de base de datos.

---

## 2. Diagrama de Capas

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Capa de Presentación                            │
│  - SPA Web Industrial: Tableros en tiempo real, diales analógicos      │
│  - Gráficos de series temporales (Potencia, Fases, Temperatura)        │
│  - Panel de Control de Simulación (Inyección de Escenarios)            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST / WebSocket
┌───────────────────────────────────▼────────────────────────────────────┐
│                        Capa de Servicios y API                         │
│  - FastAPI v1: Autenticación JWT, Endpoints de Flota, KPIs, Alertas    │
│  - Service Layer: Orquestación de reglas de negocio y reportes         │
│  - Repository Pattern: Abstracción de acceso a datos relacionales      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Ingestión / Consultas
┌───────────────────────────────────▼────────────────────────────────────┐
│                   Capa de Inteligencia y Analítica                     │
│  - AnalyticsPipeline: Evaluador paralelo de candidatos de anomalía     │
│  - ThresholdRuleDetector • PhaseImbalanceDetector • PowerFactorDetector│
│  - RollingZScoreDetector • BaselineEnergyDetector                      │
│  - AlertDeduplicator (Cooldown sliding window según ISA 18.2)          │
└───────────────────────────────────▲────────────────────────────────────┘
                                    │ Streams de Telemetría
┌───────────────────────────────────┴────────────────────────────────────┐
│                    Capa de Adquisición de Datos                        │
│  - BaseDataSource (Interface ABC)                                      │
│  - SimulatorDataSource (InductionMotorTwin + AR(1) Noise Engine)       │
│  - MQTTDataSource (aiomqtt subscriber en tópicos jerárquicos)          │
│  - ModbusDataSource (Polling a registros de analizadores de red)       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Persistencia
┌───────────────────────────────────▼────────────────────────────────────┐
│                      Capa de Almacenamiento                            │
│  - TimescaleDB Hypertable (telemetry_readings particionada por día)     │
│  - PostgreSQL Relational Tables (equipment, measurement_points, alerts)│
│  - Mosquitto MQTT Broker                                               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Modelo de Datos y Particionado

### 3.1 Hypertable `telemetry_readings`
- **Partición Primaria**: `time` (TIMESTAMPTZ, intervalo de chunk: 1 día).
- **Clave Primaria Compuesta**: `(time, measurement_point_id)` para garantizar unicidad y compatibilidad con hypertables de TimescaleDB.
- **Índice Secundario**: `(equipment_id, time DESC)` para optimizar la carga de paneles de activos individuales y diales en vivo.

### 3.2 Tabla de Anomalías `anomalies`
- Registra cada detección individual con trazabilidad metrológica:
  - `metric_name` (ej. `current_unbalance_pct`, `temperature_c`)
  - `observed_value`
  - `expected_value`
  - `threshold_value`
  - `deviation_pct`
  - `confidence_score` (0.0 a 1.0)
  - `context_snapshot` (JSONB con valores simultáneos de las 3 fases para análisis de causa raíz).
