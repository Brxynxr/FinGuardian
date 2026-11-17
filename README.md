# 🛡️ FinGuardian AI — Sistema Operativo Financiero & CFO Autónomo 360°

> **Empresa de Demostración:** `InnovaCloud Tech SAS`  
> Sistema de tesorería autónoma con Human-in-the-Loop, Data Warehouse en Snowflake, AI Gateway multi-modelo (Groq Llama 3.3 / GPT-OSS 120B), notificaciones interactivas por Telegram y despacho de correos corporativos HTML vía Gmail.

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

## 🚀 Inicio Rápido (Local)

### 1. Requisitos Previos
* Python 3.12+ o 3.14
* Node.js v20+ o v22+
* Archivo `.env` configurado en `backend/.env` (ver `.env.example`).

### 2. Iniciar el Backend
```bash
# Activar entorno virtual
source backend/venv/bin/activate

# Iniciar servidor FastAPI (puerto 8000)
uvicorn backend.app.main:app --reload --port 8000
```
* API Documentation (Swagger): `http://localhost:8000/docs`

### 3. Iniciar el Frontend
```bash
cd frontend
npm run dev
```
* Dashboard Web: `http://localhost:5173`

---

## 🐳 Despliegue con Docker Compose (Producción)

Para levantar la infraestructura completa en contenedores optimizados multi-stage:

```bash
docker compose up --build
```
* Frontend Web: `http://localhost:5173`
* Backend API: `http://localhost:8000`

---

## 🧪 Pruebas Automatizadas (TDD)

```bash
PYTHONPATH=. ./backend/venv/bin/pytest backend/tests -v
```

---

## 🎬 Guía de Demostración para Presentación en Vivo

1. **El Diagnóstico Inicial:**
   * Entra a `http://localhost:5173`. Verás la empresa con **$5,000 USD** en caja, pero con un **Déficit Inminente en 11 días** debido a que los pagos de servidores AWS y alquiler vencen antes de que los clientes paguen sus facturas.
2. **Consultar al Copiloto CFO:**
   * Presiona el botón verde **"Consultar al CFO"** y pregunta: *"¿Podemos contratar a un Senior Backend por $2,500 USD?"*. Observa cómo Groq analiza la nómina de los 5 desarrolladores y responde con cálculo de burn rate y runway en tiempo real.
3. **Activar el Protocolo de Rescate (Human-in-the-Loop):**
   * Haz clic en **"Activar Protocolo de Rescate"**.
   * El agente evalúa la flexibilidad de AWS en Snowflake y prepara un descuento del 2% al cliente Banco Digital.
   * **Revisa tu celular:** Tu bot de Telegram `@FinGuardia_bot` te enviará la alerta con botones interactivos.
4. **Aprobación Multi-Canal:**
   * Presiona **[✅ Aprobar y Ejecutar]** desde tu celular en Telegram (o en el botón verde del Dashboard).
   * Verás la pantalla de la computadora actualizarse automáticamente: el saldo proyectado rebota a **+$2,124 USD**.
   * Revisa tu bandeja de salida: se habrán despachado los correos oficiales en formato HTML corporativo.
   * Entra a tu consola de Snowflake: la decisión y el impacto financiero quedan guardados en `FACT_FINANCIAL_DECISIONS`.
