# 🛡️ FinGuardian AI — Sistema Operativo Financiero & CFO Autónomo 360°

> **Empresa de Demostración:** `InnovaCloud Tech SAS`  
> Plataforma de tesorería y finanzas autónomas con Human-in-the-Loop, Data Warehouse OLAP en Snowflake Cloud, AI Gateway con Groq 120B Dual-Key, bot bidireccional de Telegram y despacho oficial de correos corporativos en HTML vía Gmail.

---

## 🏛️ Arquitectura del Sistema

```text
                                  ┌─────────────────────────────────────────┐
                                  │   DASHBOARD WEB (REACT 19 + VITE)       │
                                  │   • Curvas Flujo de Caja (Recharts)     │
                                  │   • Nómina 360° & Costos de Servicios   │
                                  │   • Ingesta de Facturas (CSV / JSON)    │
                                  │   • Chatbot Copiloto CFO con Groq       │
                                  └────────────────────▲────────────────────┘
                                                       │ REST / SSE
                                  ┌────────────────────▼────────────────────┐
                                  │        BACKEND (FASTAPI + PYTHON)       │
                                  └────────────────────┬────────────────────┘
                                                       │
            ┌──────────────────────────────────────────┼──────────────────────────────────────────┐
            ▼                                          ▼                                          ▼
 ┌──────────────────────┐                   ┌──────────────────────┐                   ┌──────────────────────┐
 │ ❄️ SNOWFLAKE CLOUD   │                   │ 🤖 AI GATEWAY GROQ   │                   │ 📱 TELEGRAM BOT      │
 │ • WAREHOUSE:         │                   │ • Key 1: Decisiones  │                   │ • Alertas push       │
 │   FINGUARDIAN_WH     │                   │   y Tool Calling     │                   │ • Botones inline     │
 │ • DATABASE:          │                   │ • Key 2: Copiloto    │                   │   [Aprobar]/[Rechazo]│
 │   FINGUARDIAN_DW     │                   │   Chatbot en vivo    │                   │ • Comandos móviles:  │
 │ • SCHEMA: ANALYTICS  │                   │ • Fallback Heurístico│                   │   /saldo, /nomina    │
 └──────────────────────┘                   └──────────┬───────────┘                   └──────────────────────┘
                                                       │
                                                       ▼ (Al Aprobar)
                                            ┌──────────────────────┐
                                            │ 📧 GMAIL SMTP (HTML) │
                                            │ Despacho oficial de  │
                                            │ correos con diseño   │
                                            │ corporativo responsive│
                                            └──────────────────────┘
```

---

## 🚀 Inicio Rápido Multiplataforma

### Opción A: En Linux / macOS

```bash
# Dar permisos y ejecutar en 1 comando:
chmod +x run.sh
./run.sh
```
* Dashboard Web: `http://localhost:5173`
* Swagger API Docs: `http://localhost:8000/docs`

---

### Opción B: En Windows (PowerShell o CMD)

```cmd
# Doble clic o ejecutar en terminal CMD:
run.bat
```
O manualmente:
```powershell
# 1. Backend
python -m venv backend\venv
backend\venv\Scripts\activate
pip install -r backend\requirements.txt
uvicorn backend.app.main:app --reload --port 8000

# 2. Frontend (en otra terminal)
cd frontend
npm install
npm run dev
```

---

### Opción C: Con Docker & Docker Compose (Producción)

Tanto en Windows (con Docker Desktop) como en Linux:

```bash
docker compose up --build
```
* **Frontend Web:** `http://localhost:5173`
* **Backend API:** `http://localhost:8000`
* Los datos de la base de datos se conservan en el volumen `finguardian_data`.

---

## ❄️ Guía de Exploración en Snowflake (Paso a Paso en la Interfaz)

El sistema ya aprovisionó y sincronizó tu entorno en la nube de Snowflake. Para inspeccionarlo y mostrárselo a tu profesor o evaluador en **Snowsight**:

### 1. Ver el Virtual Warehouse (`FINGUARDIAN_WH`)
1. Inicia sesión en tu cuenta de Snowflake (`app.snowflake.com`).
2. En el menú lateral izquierdo, haz clic en **Admin** (icono de engranaje o administración).
3. Selecciona **Warehouses**.
4. Verás listado **`FINGUARDIAN_WH`**:
   * **Size:** `X-Small` (optimizado para consumo mínimo de créditos).
   * **Auto-suspend:** `60 segundos`.
   * **Status:** Se suspende solo cuando no hay consultas para no gastar saldo.

### 2. Ver la Base de Datos, Esquema y Tablas
1. En el menú lateral izquierdo, haz clic en **Data** -> **Databases**.
2. Verás la base de datos **`FINGUARDIAN_DW`**.
3. Despliégala y entra al esquema **`ANALYTICS`**.
4. Haz clic en **Tables**. Verás las 3 tablas del sistema:
   * **`DIM_VENDORS_RISK`:** Historial de tolerancia a prórrogas y días de gracia de proveedores.
   * **`DIM_CUSTOMERS_BEHAVIOR`:** Historial de clientes con su probabilidad de pronto pago (`early_discount_acceptance_rate`).
   * **`FACT_FINANCIAL_DECISIONS`:** Tabla analítica inmutable donde el agente inserta cada rescate aprobado con su ID, actor, déficit resuelto y saldo protegido.

### 3. Consultar los Datos en Vivo desde Worksheets (SQL)
1. Ve a **Projects** -> **Worksheets** (o abre una nueva pestaña SQL).
2. Ejecuta:
```sql
USE WAREHOUSE FINGUARDIAN_WH;
USE DATABASE FINGUARDIAN_DW;
USE SCHEMA ANALYTICS;

-- Ver las decisiones tomadas por el agente y aprobadas por el administrador:
SELECT * FROM FACT_FINANCIAL_DECISIONS ORDER BY DECISION_TIMESTAMP DESC;

-- Ver los perfiles analíticos de clientes:
SELECT * FROM DIM_CUSTOMERS_BEHAVIOR;
```

---

## 🧪 Verificación & Pruebas Automatizadas (TDD)

```bash
# Ejecutar suite de pruebas completa:
PYTHONPATH=. ./backend/venv/bin/pytest backend/tests -v
```
* Todas las pruebas unitarias y de integración (bases de datos, motor de proyección, herramientas del agente, API REST y ejecución multi-canal) aprueban con `exit code 0`.

---

## 🎬 Guión de Demostración para Presentación en Vivo

1. **Estado Inicial de Riesgo:**
   * Abre `http://localhost:5173`. Verás la empresa `InnovaCloud Tech SAS` con **$5,000 USD** en caja, pero con un **Déficit Inminente en 11 días** (la curva en rojo cae por debajo de cero debido a los pagos de servidores AWS y arriendo antes del cobro de clientes).
2. **Copiloto CFO Inteligente:**
   * Haz clic en **"Consultar al CFO"** y pregunta: *"¿Podemos contratar a un Senior Backend por $2,500 USD?"*. Groq 120B analiza en vivo la nómina de los 5 ingenieros y te responde con el impacto exacto en el runway y burn rate.
3. **El Bot de Telegram en Acción:**
   * Abre Telegram en tu celular y escribe `/saldo` o `/nomina` a tu bot `@FinGuardia_bot`. Te responderá al instante.
4. **Activación y Aprobación Human-in-the-Loop:**
   * Haz clic en **"Activar Protocolo de Rescate"** en la web.
   * **Revisa tu celular:** El bot te enviará la alerta con los botones interactivos `[✅ Aprobar y Ejecutar]` y `[❌ Rechazar]`.
   * Presiona **Aprobar** desde tu teléfono.
   * **Observa la pantalla de tu computadora:** La web se actualiza sola en vivo, la curva de caja rebota a **+$2,124 USD**, se despachan los correos oficiales en formato HTML corporativo desde tu Gmail (`breynermanga07@gmail.com`) y se sincroniza la transacción inmutable a Snowflake.
