# 🛡️ FinGuardian AI — Sistema Operativo Financiero & CFO Autónomo 360°

> **Caso de Estudio Empresarial:** `InnovaCloud Tech SAS` (Consultora Cloud & Agencia de Desarrollo de Software B2B)  
> **Categoría:** Inteligencia Artificial Agentic, Data Warehousing, Finanzas Corporativas y Automatización Human-in-the-Loop  
> **Repositorio Oficial:** [github.com/Brxynxr/FinGuardian](https://github.com/Brxynxr/FinGuardian)

---

## 📖 1. Contexto del Problema y Justificación del Negocio

### El Dolor Crítico: La Trampa de la Liquidez en Empresas de Tecnología
Estudios globales de *CB Insights* y *U.S. Bank* revelan que **el 82% de las empresas que quiebran en el mundo no lo hacen por falta de ventas ni por productos deficientes, sino por quedarse sin efectivo en el banco** (*Cash Flow Timing Mismatch*).

En una empresa de servicios tecnológicos moderna (`InnovaCloud Tech SAS`), este fenómeno es una constante:
1. **Costos Fijos Intocables a Corto Plazo:** Los salarios de los desarrolladores e ingenieros de software deben pagarse rigurosamente en las fechas de corte (días 15 y 30). Los servidores en la nube (AWS/Kubernetes) exigen pagos puntuales para no suspender entornos de producción.
2. **Ciclo de Cobro Desfasado (Net 30 / Net 60):** Los clientes corporativos (bancos, retailers, corporaciones) pagan mediante facturación B2B a 30, 45 o 60 días después de entregados los hitos de software.
3. **El Vacío de las Herramientas Tradicionales:** Los sistemas ERP y hojas de cálculo (Excel, PowerBI) son **pasivos y reactivos**: le muestran al gerente un gráfico en rojo alertando que en 10 días no habrá dinero, pero **no hacen nada para solucionarlo**. El gerente debe dedicar horas a revisar contratos, llamar al banco pidiendo créditos con altas tasas de interés o redactar correos desesperados a clientes.

### La Solución: FinGuardian AI
**FinGuardian AI** transforma la gestión financiera tradicional en un **CFO Autónomo Proactivo con Human-in-the-Loop**:
* **Monitoreo Continuo & Determinismo:** Un motor matemático proyecta día a día el saldo de caja y detecta cualquier riesgo de quiebra técnica con semanas de anticipación.
* **Inteligencia Analítica con Snowflake:** Consulta el comportamiento histórico de clientes (probabilidad de pronto pago) y proveedores (días de gracia contractuales sin penalidad).
* **AI Gateway con Groq 120B Dual-Key:** Razona, simula escenarios probabilísticos y formula la estrategia de contingencia óptima.
* **Supervisión Humana Obligatoria (Human-in-the-Loop):** Envía la alerta push interactiva al celular del administrador vía Telegram con botones de aprobación. **Ningún centavo se mueve ni correo se envía sin visto bueno.**
* **Automatización Ejecutiva Real:** Al recibir la aprobación, reprograma fechas en base de datos, despacha correos corporativos en HTML profesional vía Gmail SMTP y replica la auditoría inmutable en el Data Warehouse de Snowflake.

---

## 🏛️ 2. Arquitectura Global del Sistema

El sistema implementa una **Arquitectura Limpia Desacoplada (Clean Architecture)** separando el procesamiento transaccional rápido (OLTP), el almacenamiento analítico masivo (OLAP), la capa cognitiva (LLMs) y los canales de interacción humana:

```text
                                  ┌──────────────────────────────────────────────┐
                                  │       DASHBOARD WEB (REACT 19 + VITE)        │
                                  │   • Proyección de Caja con Bandas (Recharts) │
                                  │   • Gestión 360° de Nómina y Servicios       │
                                  │   • Ingesta Drag-and-Drop de Facturas (CSV)  │
                                  │   • Copiloto CFO Conversacional en Tiempo Real│
                                  └──────────────────────▲───────────────────────┘
                                                         │ REST / SSE
                                  ┌──────────────────────▼───────────────────────┐
                                  │          BACKEND (FASTAPI + PYTHON)          │
                                  │   • Motor Determinista de Proyección         │
                                  │   • Centro de Reglas de Negocio              │
                                  │   • Parser y Validador Estricto (Pydantic v2)│
                                  └──────────────────────┬───────────────────────┘
                                                         │
            ┌────────────────────────────────────────────┼────────────────────────────────────────────┐
            ▼                                            ▼                                            ▼
 ┌──────────────────────┐                     ┌──────────────────────┐                     ┌──────────────────────┐
 │ ❄️ SNOWFLAKE CLOUD   │                     │ 🤖 AI GATEWAY GROQ   │                     │ 📱 TELEGRAM BOT      │
 │ • Virtual Warehouse: │                     │ • Key 1: Decisiones  │                     │ • Alertas push con   │
 │   FINGUARDIAN_WH     │                     │   y Tool Calling     │                     │   botones interactivos│
 │ • Database:          │                     │ • Key 2: Copiloto    │                     │ • Comandos móviles:  │
 │   FINGUARDIAN_DW     │                     │   CFO en Vivo (120B) │                     │   /saldo, /nomina    │
 │ • Schema: ANALYTICS  │                     │ • Fallback Resiliente│                     │ • Listener en fondo  │
 └──────────────────────┘                     └──────────┬───────────┘                     └──────────────────────┘
                                                         │
                                                         ▼ (Al Recibir Aprobación)
                                              ┌──────────────────────┐
                                              │ 📧 GMAIL SMTP (HTML) │
                                              │ Despacho oficial de  │
                                              │ correos con diseño   │
                                              │ corporativo responsive│
                                              └──────────────────────┘
```

---

## 🧩 3. Explicación Detallada de Módulos y Componentes

### A. Cero Alucinación Matemática (Determinismo en Python)
Una de las Leyes de Hierro de FinGuardian AI es que **los LLMs nunca hacen sumas ni cálculos financieros directos**. 
* Las proyecciones de flujo de caja, saldos diarios, burn rate y días de runway son calculados mediante algoritmos deterministas en código Python (`backend/app/pipeline/forecaster.py`).
* El LLM interpreta estos resultados numéricos, formula hipótesis estratégicas y utiliza la simulación como herramienta (`simulate_plan_solution`) para comprobar matemáticamente que el plan es viable antes de presentarlo al administrador.

### B. El Rol Estratégico de Snowflake (OLAP)
En entornos corporativos reales, la base de datos transaccional (SQLite / PostgreSQL) no debe saturarse con consultas analíticas complejas. Snowflake actúa como el **Data Warehouse de Inteligencia y Auditoría**:
1. **`DIM_VENDORS_RISK`:** Contiene la tolerancia histórica a prórrogas de cada proveedor, su categoría y los días de gracia contractuales.
2. **`DIM_CUSTOMERS_BEHAVIOR`:** Modela el comportamiento de pago de clientes corporativos, su calificación de liquidez y su tasa histórica de aceptación de descuentos por pronto pago (`early_discount_acceptance_rate`).
3. **`FACT_FINANCIAL_DECISIONS`:** Tabla inmutable donde se replica cada decisión aprobada por el administrador, incluyendo ID de decisión, actor, déficit resuelto, saldo protegido y canal de autorización (TELEGRAM o WEB) para cumplimiento y auditoría ante juntas directivas.

### C. AI Gateway Multi-Modelo (Dual Groq + Fallback)
El sistema utiliza dos llaves independientes de Groq para evitar bloqueos por concurrencia y límites de tasa (*rate limits*):
* **Groq Key 1 (Motor Autónomo & Generador de Documentos):** Dedicada a la evaluación de contingencia en segundo plano, la síntesis ejecutiva del plan y la redacción de correos corporativos en HTML.
* **Groq Key 2 (Copiloto CFO en Vivo):** Dedicada exclusivamente a la ventana de chat conversacional del Dashboard web y a las preguntas libres que el usuario envíe por Telegram.
* **Modelo Principal:** `openai/gpt-oss-120b` (120 mil millones de parámetros para razonamiento financiero profundo a más de 500 tokens/segundo).
* **Fallback Automático:** Si la API presenta saturación, conmuta automáticamente a `qwen/qwen3.8-27b` o al motor heurístico determinista local sin interrumpir la operación.

### D. Human-in-the-Loop & Multi-Canal (Telegram + Gmail)
* **Telegram Bot Bidireccional (`@FinGuardia_bot`):**
  * Envía mensajes con formato Markdown y botones inline: `[✅ Aprobar y Ejecutar]` y `[❌ Rechazar Plan]`.
  * Un proceso en segundo plano (*long-polling listener*) captura en tiempo real cuando el administrador presiona un botón en su celular, ejecuta el plan inmediatamente y edita el mensaje en el chat con confirmación visual.
  * Responde a comandos rápidos:
    * `/saldo`: Saldo actual, días de runway, estado de salud de caja y déficit proyectado.
    * `/nomina`: Total comprometido a ingenieros, número de desarrolladores activos y próximo día de corte.
    * `/alertas`: Estado de riesgos de liquidez.
    * *Texto libre:* Cualquier pregunta estratégica financiera es respondida por el Copiloto CFO con datos reales de la empresa.
* **Despacho Oficial de Correos HTML:**
  * Al aprobar un plan, se conecta por SSL (puerto 465) a los servidores SMTP de Gmail (`breynermanga07@gmail.com`).
  * Genera correos multiparte (HTML enriquecido con CSS inline responsive + texto plano de respaldo) con diseño corporativo, tablas de liquidación y firmas ejecutivas de tesorería.

---

## 🗄️ 4. Estructura de Datos del Negocio (InnovaCloud Tech SAS)

### Nómina de Ingenieros (360° Team)
| Empleado | Cargo | Salario Neto | Carga Prestacional | Total Mensual | Día de Corte |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Carlos Mendoza** | Tech Lead & Cloud Architect | $3,200.00 USD | $480.00 USD | $3,680.00 USD | Día 30 |
| **Andrea Silva** | Senior Backend Developer (Python/Go) | $2,400.00 USD | $360.00 USD | $2,760.00 USD | Día 30 |
| **Mateo Rios** | Frontend Developer (React/TS) | $1,800.00 USD | $270.00 USD | $2,070.00 USD | Día 30 |
| **Valentina Gomez** | Product & UI/UX Designer | $1,500.00 USD | $225.00 USD | $1,725.00 USD | Día 30 |
| **Daniel Castro** | QA Engineer & Automation | $1,200.00 USD | $180.00 USD | $1,380.00 USD | Día 30 |
| **TOTALES** | **5 Ingenieros Activos** | **$10,100.00 USD** | **$1,515.00 USD** | **$11,615.00 USD** | Fin de Mes |

### Servicios y Proveedores Fijos (OPEX)
| Proveedor | Concepto | Monto | Vencimiento | Categoría | Flexibilidad / Gracia |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Coworking WeWork** | Canon Arriendo Oficinas | $1,200.00 USD | Día +3 | Facilities | Estricto (3 días gracia) |
| **AWS Cloud Infra** | Clúster Kubernetes & RDS | $2,100.00 USD | Día +7 | Cloud | **Flexible (20 días gracia)** |
| **GrowthPulse Media** | Retainer Agencia Growth | $1,400.00 USD | Día +9 | Marketing | **Flexible (15 días gracia)** |
| **DevTools Suite** | GitHub, Figma & Workspace | $650.00 USD | Día +11 | SaaS | **Flexible (14 días gracia)** |
| **Parafiscales Nómina** | Seguridad Social Ley | $1,515.00 USD | Día +14 | Payroll Tax | Crítico (0 días gracia) |

### Facturación de Clientes (Cuentas por Cobrar)
| Cliente | Factura N° | Importe | Fecha de Cobro | Calificación Liquidez | Probabilidad Pronto Pago |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Banco Digital Latam** | FAC-2026-101 | $14,000.00 USD | Día +26 | Alta (Tier 1) | **88% (Acepta 2% descuento)** |
| **Retail Express** | FAC-2026-102 | $6,500.00 USD | Día +28 | Media | 65% |
| **Fintech Horizons** | FAC-2026-103 | $4,800.00 USD | Día +32 | Alta | 92% |

### El Escenario de Quiebra Demostrativo:
* Saldo inicial en banco: **$5,000.00 USD** (Umbral mínimo seguro: $2,000.00 USD).
* Vencimientos en los primeros 14 días: **$6,865.00 USD** en servicios y parafiscales.
* Cobros de clientes: Llegan a partir del **día 26**.
* **Resultado sin agente:** El día 7 el saldo cae por debajo de la reserva ($1,700), el día 9 a $300, y el día 11 entra en **déficit negativo de -$350 USD, agravándose a -$1,865 USD en el día 14 (quiebra técnica)**.
* **Resultado con agente:** Reprograma AWS (+18 días) y ofrece 2% a Banco Digital Latam. El saldo se mantiene en todo momento por encima de **+$2,124.00 USD sin deudas**.

---

## 🚀 5. Manual de Instalación y Ejecución Multiplataforma

### Variables de Entorno Requeridas (`backend/.env`)
Crear el archivo `backend/.env` basado en `backend/.env.example`:
```env
PROJECT_NAME="FinGuardian AI"
DEBUG=True
DATABASE_URL="sqlite:///./finguardian.db"

# Telegram Bot
TELEGRAM_BOT_TOKEN="tu_bot_token_de_botfather"
TELEGRAM_ADMIN_CHAT_ID="tu_id_de_telegram"

# Gmail SMTP Oficial
GMAIL_SENDER="tu_correo@gmail.com"
GMAIL_APP_PASSWORD="tu_contraseña_de_aplicacion_16_letras"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=465

# Groq Dual API Keys
GROQ_API_KEY_DECISION="gsk_tu_llave_de_decisiones"
GROQ_API_KEY_CHAT="gsk_tu_llave_de_chat"
GROQ_MODEL="openai/gpt-oss-120b"

# Snowflake Cloud
SNOWFLAKE_ACCOUNT="tu_account_identifier"
SNOWFLAKE_USER="tu_usuario_snowflake"
SNOWFLAKE_PASSWORD="tu_password_snowflake"
SNOWFLAKE_ROLE="ACCOUNTADMIN"
SNOWFLAKE_WAREHOUSE="FINGUARDIAN_WH"
SNOWFLAKE_DATABASE="FINGUARDIAN_DW"
SNOWFLAKE_SCHEMA="ANALYTICS"
```

---

### Opción 1: Ejecución en Linux / macOS (1 Clic)

```bash
# Otorgar permisos y ejecutar script unificado:
chmod +x run.sh
./run.sh
```
* Servidor Backend (FastAPI): `http://localhost:8000` (Docs en `/docs`)
* Servidor Frontend (React 19): `http://localhost:5173`

---

### Opción 2: Ejecución en Windows (PowerShell / CMD)

**Mediante el lanzador por lotes:**
```cmd
run.bat
```

**O paso a paso manual:**
```powershell
# 1. Terminal 1: Backend
python -m venv backend\venv
backend\venv\Scripts\activate
pip install -r backend\requirements.txt
uvicorn backend.app.main:app --reload --port 8000

# 2. Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

---

### Opción 3: Ejecución en Contenedores Docker (Producción)

Tanto en Linux como en Windows (con Docker Desktop activo):

```bash
docker compose up --build
```
* **Frontend Web:** `http://localhost:5173`
* **Backend API:** `http://localhost:8000`
* Los datos de la base de datos se conservan en el volumen nombrado `finguardian_data`.

---

## ❄️ 6. Guía de Navegación en la Consola Web de Snowflake

El sistema aprovisiona automáticamente el entorno analítico en tu cuenta de Snowflake. Para mostrárselo a un profesor o evaluador en **Snowflake Snowsight (`app.snowflake.com`)**:

### A. Inspeccionar el Virtual Warehouse
1. En el menú lateral izquierdo de Snowflake, haz clic en **Admin** (icono de engranaje).
2. Haz clic en **Warehouses**.
3. Verás **`FINGUARDIAN_WH`**:
   * **Size:** `X-Small` (adecuado para bajo consumo de créditos).
   * **Auto-suspend:** `60s` (se apaga automáticamente al minuto de inactividad para no gastar presupuesto).
   * **Auto-resume:** `True` (se enciende solo cuando el agente ejecuta una consulta).

### B. Inspeccionar la Base de Datos y Tablas Analíticas
1. En el menú lateral izquierdo, haz clic en **Data** -> **Databases**.
2. Despliega la base de datos **`FINGUARDIAN_DW`**.
3. Abre el esquema **`ANALYTICS`** -> haz clic en **Tables**:
   * **`DIM_VENDORS_RISK`:** Registros de proveedores con sus días de gracia y factor de tolerancia.
   * **`DIM_CUSTOMERS_BEHAVIOR`:** Métricas de comportamiento de pago de clientes.
   * **`FACT_FINANCIAL_DECISIONS`:** Historial inmutable de auditoría donde el agente registra cada contingencia aprobada.

### C. Consultas SQL en Vivo (Worksheet)
Abre un **Worksheet (SQL)** en Snowflake y ejecuta:
```sql
USE WAREHOUSE FINGUARDIAN_WH;
USE DATABASE FINGUARDIAN_DW;
USE SCHEMA ANALYTICS;

-- Ver las decisiones del agente registradas en tiempo real:
SELECT 
    DECISION_ID, 
    DECISION_TIMESTAMP, 
    ACTOR, 
    ACTION_SUMMARY, 
    PROJECTED_DEFICIT, 
    PROTECTED_BALANCE, 
    APPROVED_CHANNEL 
FROM FACT_FINANCIAL_DECISIONS 
ORDER BY DECISION_TIMESTAMP DESC;

-- Ver los datos analíticos de riesgo de proveedores:
SELECT * FROM DIM_VENDORS_RISK;
```

---

## 💬 7. Preguntas de Ejemplo para el Copiloto CFO (Groq 120B)

En la ventana de **"Consultar al CFO"** de la web o directamente en el chat de Telegram con el bot, puedes hacer consultas estratégicas como:

1. *"Quiero contratar a un Desarrollador Backend Senior por $2,500 USD el próximo mes. ¿Nuestra caja lo soporta?"*
   * *El agente analiza la nómina actual ($11,615 USD), el saldo proyectado y te explica cómo impactaría el burn rate y cuántos meses de runway restarían.*
2. *"¿Cuál es nuestro principal riesgo de liquidez en los próximos 15 días?"*
   * *Desglosa los pagos de AWS y arriendo que vencen antes de la recaudación del Banco Digital.*
3. *"¿Cuánto gastamos en total en nómina y cargas prestacionales cada fin de mes?"*
   * *Te entrega el resumen exacto de los 5 desarrolladores.*
4. *"¿Qué pasa si el cliente Banco Digital se retrasa 10 días en pagar la factura?"*
   * *Simula el escenario y te sugiere qué gastos de SaaS o marketing congelar temporalmente.*

---

## 🧪 8. Verificación y Calidad de Código (Quality Gate)

El proyecto cuenta con una suite completa de pruebas unitarias y de integración bajo TDD:

```bash
# Correr tests del backend:
PYTHONPATH=. ./backend/venv/bin/pytest backend/tests -v

# Verificar compilación estricta de TypeScript en frontend:
npm --prefix frontend run build
```

* 100% de tests aprobados (`test_database.py`, `test_seeder.py`, `test_forecaster.py`, `test_document_parser.py`, `test_agent_tools.py`, `test_execution_engine.py`, `test_api.py`).
* Cero advertencias ni credenciales quemadas en el historial de Git.

---

## 🎬 9. Guión Paso a Paso para Demostración en Vivo (Evaluación / Pitch)

Este guión está diseñado para realizar una demostración completa e impactante en menos de 5 minutos:

1. **Paso 1: Demostrar el Diagnóstico en Tiempo Real (La Crisis de Liquidez):**
   * Abre el navegador en `http://localhost:5173`.
   * Muestra la cabecera: Empresa `InnovaCloud Tech SAS`, saldo actual de **$5,000 USD** y estado de salud financiera: **Alerta Crítica (Rojo)**.
   * Señala la gráfica de proyección: Muestra cómo el día +11 la curva desciende a terreno negativo (**-$350 USD**) y empeora a **-$1,865 USD** el día +14 por el pago de nómina/servicios antes de cobrar las facturas de software.
2. **Paso 2: Interactuar con el Copiloto CFO (Groq 120B en Vivo):**
   * Haz clic en el botón superior derecho **"Consultar al CFO"**.
   * Escribe: *"¿Qué pasa si contrato a un programador por $2,500 USD el próximo mes?"*.
   * Muestra cómo el modelo analiza los 5 empleados actuales ($11,615 USD de nómina mensual), advierte que el burn rate subiría a más de $14,000 USD y desaconseja la contratación sin antes cerrar un nuevo cliente recurrente.
3. **Paso 3: Consulta Remota desde el Teléfono Móvil (Telegram Bot):**
   * Abre Telegram en tu celular o en la app de escritorio y escribe a `@FinGuardia_bot`:
     * Envía `/saldo` -> El bot responde con el saldo bancario exacto y los días de reserva.
     * Envía `/nomina` -> El bot desglosa el costo del equipo técnico y fecha de corte.
4. **Paso 4: Activación del Protocolo de Rescate y Decisión Humana (Human-in-the-Loop):**
   * En el Dashboard Web, presiona el botón pulsante **"Activar Protocolo de Rescate Financiero"**.
   * Observa la pantalla: El agente muestra la propuesta calculada:
     * *Acción 1:* Prórroga de 18 días en la factura de AWS ($2,100 USD) aprovechando la ventana de gracia.
     * *Acción 2:* Ofrecer 2% de descuento por pronto pago al Banco Digital Latam para recaudar $13,720 USD el día +8.
   * **¡Revisa tu teléfono celular!** Instantáneamente el bot de Telegram te enviará una notificación push con el resumen del rescate y dos botones interactivos: `[✅ Aprobar y Ejecutar]` y `[❌ Rechazar]`.
5. **Paso 5: Ejecución Automatizada y Evidencia Real:**
   * Presiona **Aprobar** directamente desde tu teléfono móvil en Telegram.
   * Mira la pantalla web: La gráfica se actualiza automáticamente; el déficit desaparece y el saldo mínimo de caja salta a **+$2,124 USD (salvando la empresa)**.
   * Abre tu bandeja de correo Gmail: Verás el correo corporativo oficial en formato HTML despachado con la notificación formal al cliente.
   * Abre Snowflake Snowsight y ejecuta `SELECT * FROM FACT_FINANCIAL_DECISIONS;` para mostrar el registro inmutable de auditoría recién insertado.

---

## 💻 10. Matriz de Compatibilidad & Despliegue Multiplataforma

| Componente | Linux (Ubuntu / Arch / Debian) | Windows 10/11 (PowerShell/CMD) | macOS (Apple Silicon / Intel) | Docker Container |
| :--- | :---: | :---: | :---: | :---: |
| **Backend (FastAPI)** | Nativo (`./run.sh`) | Nativo (`run.bat`) | Nativo (`./run.sh`) | Contenedor Python 3.14-slim |
| **Frontend (React 19)** | Nativo (Node.js 20+) | Nativo (Node.js 20+) | Nativo (Node.js 20+) | Contenedor Nginx Alpine |
| **Persistencia SQLite** | `./finguardian.db` | `.\finguardian.db` | `./finguardian.db` | Volumen `finguardian_data` |
| **Data Warehouse** | Nube (Snowflake Cloud) | Nube (Snowflake Cloud) | Nube (Snowflake Cloud) | Nube (Snowflake Cloud) |
| **Puertos de Red** | Backend: 8000 / Web: 5173 | Backend: 8000 / Web: 5173 | Backend: 8000 / Web: 5173 | Backend: 8000 / Web: 5173 |

### Solución a Problemas Comunes (Troubleshooting):
* **Error de permisos en script shell:** Ejecuta `chmod +x run.sh`.
* **Política de ejecución en PowerShell de Windows:** Si Windows bloquea scripts, ejecuta en PowerShell: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`.
* **Límite de tasa en API de Groq:** El sistema conmuta automáticamente entre la Key 1 y la Key 2 y dispone de fallback heurístico local.
* **Puerto en uso (8000 o 5173):** Si algún puerto está ocupado, puedes especificar otro en uvicorn (`--port 8001`) o en Vite (`--port 5174`).

---

## 🛡️ 11. Leyes de Hierro y Gobernanza de Datos

1. **Human-in-the-Loop Inviolable:** Ningún correo oficial sale ni ningún cronograma de pagos se modifica sin la confirmación explícita del administrador (vía botón en Telegram o confirmación en Dashboard).
2. **Cero Alucinaciones Numéricas:** Toda proyección, cálculo de intereses, descuentos y nómina son ejecutados por algoritmos matemáticos deterministas en Python. El LLM razona y redacta, pero no computa finanzas.
3. **Privacidad y Cero Credenciales en Código:** Las credenciales de Snowflake, Groq, Gmail y Telegram residen exclusivamente en variables de entorno locales protegidas por `.gitignore`.
4. **Auditoría Inmutable:** Toda decisión queda registrada con timestamp, actor y canal en el Data Warehouse corporativo de Snowflake.
