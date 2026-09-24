[README.md](https://github.com/user-attachments/files/32625106/README.md)
# IEIP — Industrial Energy & Intelligence Platform

[![Python 3.12+](https://img.shields.io/badge/Python-3.12%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![TimescaleDB](https://img.shields.io/badge/TimescaleDB-PostgreSQL%2016-yellowgreen.svg)](https://www.timescale.com/)
[![MQTT](https://img.shields.io/badge/MQTT-Mosquitto%202.0-red.svg)](https://mosquitto.org/)
[![Industrial Standards](https://img.shields.io/badge/Standards-NEMA%20MG1%20%7C%20IEEE%20519%20%7C%20ISO%2010816--3-brightgreen.svg)]()
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **IEIP (Industrial Energy & Intelligence Platform)** es una plataforma de software industrial para el monitoreo energético continuo, análisis de calidad de potencia y detección temprana de anomalías en activos electromecánicos críticos (motores de inducción, bombas centrífugas, compresores y ventiladores de tiro inducido).

Diseñada bajo estándares de ingeniería eléctrica y mantenimiento predictivo (**NEMA MG-1**, **IEEE 519**, **ISO 10816-3**, **ISA 18.2**), la plataforma combina adquisición multi-protocolo (Digital Twin físico, MQTT, Modbus TCP), series temporales particionadas en **TimescaleDB**, y un motor analítico en tiempo real que traduce desbalances y sobrecalentamientos en **acciones de mantenimiento prescriptivo** y **estimación de pérdidas en kWh/USD**.

---

## 🏭 Características Principales

1. **Gemelo Digital Físico (Induction Motor Twin)**:
   - Modela analíticamente el comportamiento trifásico de tensión ($V_{L1}, V_{L2}, V_{L3}$), corriente ($I_{L1}, I_{L2}, I_{L3}$), potencia activa ($P$), reactiva ($Q$), factor de potencia dependiente de la carga $\beta$, dinámica térmica de primer orden y vibraciones según velocidad y acople mecánico.
   - Incluye generador de ruido autorregresivo AR(1) para emular la inercia de red y jitter de instrumentación real.

2. **Catálogo de 12 Escenarios Operacionales y Fallas Industriales**:
   - `NORMAL_OPERATION`: Operación nominal al 80% de carga.
   - `OVERCURRENT`: Sobrecarga mecánica sostenida (>110% FLA).
   - `PHASE_IMBALANCE`: Desbalance de fases NEMA (>10%) y detección de monofasismo (pérdida de fase).
   - `LOW_POWER_FACTOR`: Operación en vacío/baja carga con cálculo de penalización tarifaria y dimensionamiento de banco de condensadores en kVAR.
   - `VOLTAGE_SAG` y `VOLTAGE_SWELL`: Huecos y sobretensiones transitorias de barra.
   - `THERMAL_RUNAWAY`: Sobrecalentamiento por aletas obstruidas según límites de aislamiento Clase B.
   - `BEARING_VIBRATION`: Falla en pista externa de rodamientos según norma ISO 10816-3 (>4.5 mm/s RMS).
   - `OFF_HOURS_CONSUMPTION`: Detección de consumos fantasma nocturnos o en fines de semana no operativos.
   - `HARMONIC_DISTORTION`: Inyección de armónicos 5º y 7º por variadores (THD-I > 15%).
   - `UNEXPECTED_STOP`: Disparo intempestivo de relé de sobrecarga.
   - `SENSOR_DRIFT`: Deriva metrológica en transformadores de corriente.

3. **Arquitectura de Adquisición Abstraída**:
   - `DataSource` genérico desacoplado de la lógica de procesamiento.
   - Conectores nativos para **Simulador Digital**, **Broker MQTT Mosquitto** y **Modbus TCP Gateway**.

4. **Motor de Inteligencia & Gestión de Alarmas (ISA 18.2)**:
   - Detección determinística por umbrales de placa (FLA, límites térmicos).
   - Detección estadística dinámica por Z-Score móvil (ventana deslizante sin umbrales estáticos).
   - Supresión de avalancha de alarmas (*alarm fatigue*) mediante deduplicación y ventana de enfriamiento (*cooldown*).
   - Flujo de vida estricto: `OPEN` $\rightarrow$ `ACKNOWLEDGED` $\rightarrow$ `RESOLVED`.

5. **Recomendaciones de Mantenimiento Prescriptivo**:
   - No es un simple gestor de tickets; genera diagnósticos técnicos basados en física (ej. desbalance persistente $\rightarrow$ inspección de bornes y contactor en CCM; bajo FP $\rightarrow$ cálculo de compensación reactiva; vibración $\rightarrow$ análisis FFT de frecuencias de rodamientos).

---

## 🏛️ Arquitectura del Sistema

```
                  ┌────────────────────────────────────────────────────────┐
                  │                   FUENTES DE DATOS                     │
                  │  ┌──────────────┐  ┌─────────────┐  ┌───────────────┐  │
                  │  │ Digital Twin │  │ MQTT Broker │  │ Modbus TCP/IP │  │
                  │  │ Motor Model  │  │  Mosquitto  │  │ Field Gateway │  │
                  │  └──────┬───────┘  └──────┬──────┘  └───────┬───────┘  │
                  └─────────┼─────────────────┼─────────────────┼──────────┘
                            ▼                 ▼                 ▼
                  ┌────────────────────────────────────────────────────────┐
                  │          ACQUISITION LAYER (AcquisitionManager)        │
                  │      Normalización a RawTelemetryPayload estándar      │
                  └───────────────────────────┬────────────────────────────┘
                                              ▼
                  ┌────────────────────────────────────────────────────────┐
                  │                 TELEMETRY PIPELINE                     │
                  │                                                        │
                  │   ┌────────────────────────────────────────────────┐   │
                  │   │      TimescaleDB Ingestion (Hypertables)       │   │
                  │   │      Particionado diario, índices compuestos   │   │
                  │   └───────────────────────┬────────────────────────┘   │
                  │                           ▼                            │
                  │   ┌────────────────────────────────────────────────┐   │
                  │   │         Multi-Detector Analytics Engine        │   │
                  │   │  • Threshold Limits (FLA, ISO 10816, IEEE 519) │   │
                  │   │  • NEMA MG-1 Phase Imbalance & Derating        │   │
                  │   │  • Power Factor & kVAR Sizing Calculator       │   │
                  │   │  • Rolling Z-Score Statistical Outlier Engine  │   │
                  │   │  • Baseline & Phantom Off-Hours Consumption    │   │
                  │   └───────────────────────┬────────────────────────┘   │
                  │                           ▼                            │
                  │   ┌────────────────────────────────────────────────┐   │
                  │   │        Alert Deduplication & ISA 18.2          │   │
                  │   │       Cooldown Window & Occurrence Counters    │   │
                  │   └───────────────────────┬────────────────────────┘   │
                  │                           ▼                            │
                  │   ┌────────────────────────────────────────────────┐   │
                  │   │     Prescriptive Maintenance Synthesizer       │   │
                  │   │        kWh Loss & Financial Penalty USD        │   │
                  │   └────────────────────────────────────────────────┘   │
                  └───────────────────────────┬────────────────────────────┘
                                              ▼
                  ┌────────────────────────────────────────────────────────┐
                  │                 FASTAPI REST API (v1)                  │
                  │  /equipment  •  /telemetry  •  /anomalies  •  /alerts  │
                  │  /kpis       •  /simulation •  /reports    •  /auth    │
                  └───────────────────────────┬────────────────────────────┘
                                              ▼
                  ┌────────────────────────────────────────────────────────┐
                  │                INTERFAZ WEB INDUSTRIAL                 │
                  │     Diales en vivo, tendencias, control de fallas      │
                  └────────────────────────────────────────────────────────┘
```

---

## ⚡ Estándares Industriales Aplicados

| Estándar | Aplicación en la Plataforma |
|---|---|
| **NEMA MG-1 (Part 14.35)** | Cálculo de desbalance de corrientes trifásicas: $\% \text{Unbalance} = \frac{\max(\|I_{phase} - I_{avg}\|)}{I_{avg}} \times 100\%$. Derating automático por calentamiento inducido. |
| **IEEE 519** | Monitoreo de Distorsión Armónica Total ($THD_V < 5\%$, $THD_I < 12\%$). |
| **ISO 10816-3** | Clasificación de severidad de vibración para máquinas industriales rígidas/flexibles (Zona A: Bueno $<2.3$ mm/s; Zona D: Peligro $>4.5$ mm/s RMS). |
| **ISA 18.2** | Gestión de ciclo de vida de alarmas, deduplicación con cooldown y prevención de fatiga de operador. |

---

## 🚀 Puesta en Marcha Rápida (Quickstart)

### Opción 1: Ejecución con Docker Compose (Recomendada)

Requiere Docker y Docker Compose:

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/industrial-energy-intelligence-platform.git
cd industrial-energy-intelligence-platform

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Iniciar todos los servicios (Base de datos TimescaleDB, MQTT, Backend y Frontend)
docker compose up --build -d

# 4. Verificar salud de contenedores
docker compose ps
```

- **Interfaz de Usuario Web**: `http://localhost` (o `http://localhost:8000`)
- **Documentación Interactiva Swagger / OpenAPI**: `http://localhost:8000/docs`
- **Broker MQTT Mosquitto**: `localhost:1883`

**Credenciales Iniciales de Demostración:**
- Administrador: `admin@ieip.local` / `admin12345`
- Operador: `operator@ieip.local` / `operator12345`
- Ingeniero: `engineer@ieip.local` / `engineer12345`

---

### Opción 2: Ejecución Local en Desarrollo (Python 3.12+)

```bash
# 1. Crear y activar entorno virtual
python -m venv .venv
source .venv/bin/activate  # En Windows: .venv\Scripts\activate

# 2. Instalar dependencias del backend
cd backend
pip install -e .

# 3. Iniciar servidor FastAPI
uvicorn app.main:app --reload --port 8000
```

---

## 🧪 Pruebas Unitarias

La plataforma incluye suites de pruebas unitarias que validan la matemática de los modelos físicos y las reglas de detección:

```bash
cd backend
pytest tests/unit -v
```

---

## 📊 Endpoints de la API RESTful (v1)

- `POST /api/v1/auth/login`: Autenticación JWT y generación de Bearer tokens.
- `GET /api/v1/equipment`: Listado de flota con métricas en tiempo real y alarmas activas.
- `GET /api/v1/equipment/{id}/realtime`: Instantánea de variables eléctricas instantáneas para diales.
- `GET /api/v1/equipment/{id}/telemetry`: Histórico de lecturas para gráficos de tendencia.
- `GET /api/v1/anomalies`: Listado de anomalías detectadas con evidencia algorítmica y contexto.
- `POST /api/v1/alerts/{id}/acknowledge`: Reconocimiento de alarma por operador.
- `POST /api/v1/alerts/{id}/resolve`: Resolución de alarma con registro de causa raíz.
- `GET /api/v1/kpis/plant`: Balances globales de energía, costo en USD y potencia activa total.
- `POST /api/v1/simulation/trigger`: Inyección interactiva de escenarios de falla.
- `POST /api/v1/simulation/reset`: Restauración de flota a operación nominal.
- `GET /api/v1/reports/telemetry.csv`: Descarga de series temporales en formato CSV RFC 4180.

---

## 📜 Licencia

Este proyecto está licenciado bajo los términos de la Licencia MIT.
