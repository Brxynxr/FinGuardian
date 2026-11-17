# FinGuardian AI: Plan Maestro de Implementación por Fases

**Meta del Proyecto:** Construir un Sistema Operativo Financiero y CFO Autónomo 360° para `InnovaCloud Tech SAS`. Integra predicción probabilística de flujo de caja, gestión de nómina/servicios, aprovisionamiento analítico en Snowflake, AI Gateway multi-modelo (Groq Llama 3.3 + Gemini fallback), bot bidireccional de Telegram con comandos móviles, despacho de correos corporativos en HTML vía Gmail y Dashboard web interactivo en React 19 + Vite.

---

## 🏛️ Fases de Ejecución

### 📦 Fase 1: Estructura, Entorno y Configuración de Reglas
- [ ] **1.1 Repositorio y Directrices:**
  - Configurar `.gitignore`, `AGENTS.md` y estructura de carpetas modular (`backend/`, `frontend/`, `docs/plans/`).
- [ ] **1.2 Variables de Entorno Seguras:**
  - Crear `.env.example` y `.env` con las credenciales validadas (Telegram Bot, Gmail SMTP, Snowflake Account, Groq Keys 1 y 2).
- [ ] **1.3 Entorno Virtual Python y Dependencias:**
  - Path: `backend/requirements.txt`
  - Instalar `fastapi`, `uvicorn`, `sqlalchemy`, `pydantic`, `snowflake-connector-python`, `groq`, `google-genai`, `pytest`, `pytest-asyncio`, `httpx`, `python-dotenv`.
  - Commit: `chore(env): setup project structure and python dependencies`

---

### 💾 Fase 2: Base de Datos Transaccional (OLTP) y Snowflake Data Warehouse (OLAP)
- [ ] **2.1 Modelos Financieros 360° (SQLAlchemy):**
  - Path: `backend/app/models/financial.py`
  - Test: `backend/tests/test_database.py`
  - Entidades:
    * `CompanyProfile`: Saldo de caja, umbral de seguridad, burn rate.
    * `Employee` & `Payroll`: Nómina, cargos (Tech Lead, Backend, etc.), salarios, fechas de corte.
    * `Vendor` & `ScheduledPayment`: Proveedores (AWS, SaaS, Arriendo), categorías, periodos de gracia y penalidades.
    * `Customer` & `Invoice`: Clientes corporativos, facturas por cobrar, scoring de liquidez.
    * `AgentProposal`, `AuditLog`, `OutboxEmail`.
- [ ] **2.2 Aprovisionador Automatizado de Snowflake:**
  - Path: `backend/app/services/snowflake_provisioner.py`
  - Test: `backend/tests/test_snowflake.py`
  - Ejecuta DDL en Snowflake para crear:
    * Virtual Warehouse: `FINGUARDIAN_WH` (XSMALL, auto-suspend 60s).
    * Database: `FINGUARDIAN_DW`
    * Schema: `ANALYTICS`
    * Tablas: `DIM_VENDORS_RISK`, `DIM_CUSTOMERS_BEHAVIOR`, `FACT_FINANCIAL_DECISIONS`.
    * Carga inicial de métricas históricas de clientes y proveedores.
- [ ] **2.3 Seeder de Demostración 360°:**
  - Path: `backend/app/services/seeder.py`
  - Pobla el escenario inicial de `InnovaCloud Tech SAS` con 5 empleados, 3 servicios fijos, 3 clientes y la tensión de liquidez en el día 9.
  - Commit: `feat(database): implement 360 financial models, seeder and snowflake provisioner`

---

### ⚙️ Fase 3: Motor de Flujo de Caja & Centro de Reglas de Negocio
- [ ] **3.1 Motor Determinista de Proyección y Salud Financiera:**
  - Path: `backend/app/pipeline/forecaster.py`
  - Test: `backend/tests/test_forecaster.py`
  - Calcula:
    * Proyección diaria a 30 y 60 días.
    * Índice de Salud Financiera (Health Score 0-100).
    * Runway (días de vida de caja).
    * Detección preventiva temprana y detección de déficit crítico.
- [ ] **3.2 Ingestor de Reglas de Negocio y Facturas (Parser CSV/JSON):**
  - Path: `backend/app/pipeline/document_parser.py`
  - Test: `backend/tests/test_document_parser.py`
  - Permite cargar nuevas facturas o empleados desde archivos CSV/JSON con validación estricta y sincronización automática.
  - Commit: `feat(pipeline): add cash flow forecasting engine and document ingestion parser`

---

### 🧠 Fase 4: AI Gateway Multi-Modelo & Agente Autónomo
- [ ] **4.1 AI Gateway con Fallback (Groq + Gemini + Local Heuristic):**
  - Path: `backend/app/agent/ai_gateway.py`
  - Test: `backend/tests/test_ai_gateway.py`
  - Enrutador que envía inferencias críticas a Groq (Llama-3.3-70B) y conmuta a Gemini si hay error o rate limit.
- [ ] **4.2 Herramientas de Decisión del Agente:**
  - Path: `backend/app/agent/tools.py`
  - Herramientas:
    * `consult_snowflake_historical_risk(entity_type, entity_id)`
    * `reschedule_vendor_payment(payment_id, days)`
    * `generate_early_discount_offer(invoice_id, discount_pct)`
    * `simulate_probabilistic_scenarios(actions)` (Pesimista vs Esperado)
- [ ] **4.3 Orquestador de Rescate y Generador de Correos HTML:**
  - Path: `backend/app/agent/orchestrator.py`
  - Genera plantillas HTML corporativas responsive con botones y firma ejecutiva.
- [ ] **4.4 Copiloto CFO Conversacional (Chatbot):**
  - Path: `backend/app/agent/cfo_copilot.py`
  - Asesor estratégico que evalúa contrataciones, recortes y presupuestos.
  - Commit: `feat(agent): implement multi-model AI gateway, financial tools and CFO copilot`

---

### 📱 Fase 5: Integración Multi-Canal (Telegram Bot + Gmail Real)
- [ ] **5.1 Bot Bidireccional de Telegram en Segundo Plano:**
  - Path: `backend/app/services/telegram_bot.py`
  - Test: `backend/tests/test_telegram_bot.py`
  - Funcionalidades:
    * Alertas de liquidez con botones interactivos `[✅ Aprobar]` / `[❌ Rechazar]`.
    * Comandos rápidos: `/saldo`, `/nomina`, `/alertas`, `/ayuda`.
    * Chat libre con el CFO Copilot desde Telegram usando Groq.
    * Listener asíncrono para ejecutar el plan apenas se presiona el botón.
- [ ] **5.2 Servicio de Correo Oficial Gmail (HTML MIME):**
  - Path: `backend/app/services/email_service.py`
  - Envía los correos reales en formato HTML estilizado desde `breynermanga07@gmail.com`.
- [ ] **5.3 Motor de Ejecución y Sincronización en Snowflake:**
  - Path: `backend/app/services/execution_engine.py`
  - Consolida cambios en SQLite, inserta auditoría en Snowflake y despacha correos.
  - Commit: `feat(channels): add bidirectional telegram bot and HTML email dispatcher`

---

### 🌐 Fase 6: API REST (FastAPI) & Frontend Web (React 19 + Vite + Tailwind)
- [ ] **6.1 Endpoints REST de FastAPI:**
  - Path: `backend/app/api/routes.py`
  - Endpoints para: resumen de métricas, proyección gráfica, nómina, carga de facturas, chat CFO, aprobación de planes y auditoría.
- [ ] **6.2 Inicialización de Frontend:**
  - Path: `frontend/` (Vite, React 19, TypeScript, Tailwind CSS, Recharts, Lucide Icons).
- [ ] **6.3 Componentes Web:**
  * `FinancialHeader`: Estado de modelos AI, saldo y switch de modo preventivo/crisis.
  * `CashFlowAreaChart`: Curvas comparativas de saldo (Rojo sin rescate vs Verde con rescate + banda de probabilidad).
  * `PayrollTable`: Módulo 360° con nómina, empleados y cargos.
  * `InvoiceUploader`: Zona de drag-and-drop para subir CSV/JSON de facturas.
  * `ActionApprovalCenter`: Tarjetas de decisión del agente con botón de 1 clic.
  * `CFOChatModal`: Ventana flotante de chat conversacional con Groq.
  * `EmailAuditModal`: Previsualización interactiva de los correos HTML enviados.
  - Commit: `feat(frontend): build modern executive dashboard with charts and CFO chat`

---

### 🐳 Fase 7: Dockerización y Orquestación Completa
- [ ] **7.1 Dockerfile Multi-Stage para Backend:**
  - Imagen optimizada, usuario no root, capa de cache de dependencias.
- [ ] **7.2 Dockerfile Multi-Stage para Frontend:**
  - Build con Node + Nginx alpine ligero para servir la SPA.
- [ ] **7.3 Docker Compose:**
  - Path: `docker-compose.yml`
  - Orquesta backend (puerto 8000) y frontend (puerto 5173 / 80) con healthchecks y variables seguras.
  - Commit: `feat(devops): add production multi-stage dockerfiles and docker compose`

---

### 🛡️ Fase 8: Quality Gate & Verificación Integral
- [ ] **8.1 Ejecución Completa de Pruebas Automatizadas:**
  - Correr `pytest` en backend asegurando 100% de tests aprobados.
  - Correr `npm run build` en frontend asegurando cero errores de tipos TypeScript.
- [ ] **8.2 Prueba de Humo en Vivo (End-to-End Smoke Test):**
  - Disparar alerta a Telegram -> presionar botón en celular -> verificar correo recibido en Gmail -> verificar registro en Snowflake.
- [ ] **8.3 Documentación de Presentación:**
  - Crear `README.md` ejecutivo con guía de ejecución rápida en 1 comando (`docker compose up`).
  - Commit: `docs: complete architecture documentation and presentation runbook`
