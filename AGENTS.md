# Directrices del Proyecto (`AGENTS.md`) — FinGuardian AI

> Reglas locales del repositorio. Complementan las directrices de **Zen 2.1**.

---

## 🏛️ Propósito y Visión del Sistema
**FinGuardian AI** es un Sistema Operativo Financiero y CFO Autónomo 360° para empresas de servicios tecnológicos (`InnovaCloud Tech SAS`). 
Integra:
1. **Analítica en Tiempo Real & OLTP:** SQLite / SQLAlchemy para transacciones operativas inmediatas.
2. **Data Warehouse OLAP:** Snowflake (`FINGUARDIAN_WH` / `FINGUARDIAN_DW.ANALYTICS`) para scoring de riesgo y auditoría inmutable.
3. **AI Gateway Multi-Modelo:** Groq (Llama-3.3-70B) para decisiones y chat conversacional ultrarrápido + Gemini para fallback de razonamiento.
4. **Human-in-the-Loop Multi-Canal:** Telegram Bot bidireccional (alertas + botones + chat) + Despacho real de correos corporativos HTML vía Gmail SMTP.
5. **Frontend Web:** Vite + React 19 + TypeScript + Tailwind CSS + Recharts.

---

## 🛠️ Stack Tecnológico y Comandos Clave

- **Backend**: Python 3.14 + FastAPI + SQLAlchemy 2.0 + SQLite + Pydantic v2 + `httpx`
- **Frontend**: Vite + React 19 + TypeScript + Tailwind CSS + Recharts + Lucide Icons
- **Data Warehouse**: Snowflake (`snowflake-connector-python`)
- **LLM Engine**: Groq API (`groq`) + Google GenAI (`google-genai` / fallback)
- **Mensajería & Notificaciones**: Telegram Bot API (`python-telegram-bot` / HTTP) + Gmail SMTP (`smtplib` + HTML MIME)
- **Contenedores**: Dockerfile multi-stage + Docker Compose

### Comandos de Verificación:
- Tests Backend: `PYTHONPATH=. ./backend/venv/bin/pytest backend/tests -v`
- Servidor Backend: `./backend/venv/bin/uvicorn backend.app.main:app --reload --port 8000`
- Frontend Build: `npm --prefix frontend run build`
- Frontend Dev: `npm --prefix frontend run dev`
- Docker Compose: `docker compose up --build`

---

## 🛡️ Leyes de Hierro del Proyecto

1. **Human-in-the-Loop Inquebrantable:** Ningún pago se reprograma ni se despacha correo oficial a clientes/proveedores sin la autorización explícita del administrador (vía Telegram o Dashboard).
2. **Cero Alucinaciones en Cálculos:** Las proyecciones de caja, sumatorias de nómina y burn rate son **100% deterministas en código Python**. El LLM interpreta, razona y propone; el motor matemático ejecuta.
3. **Seguridad y Secretos:** Cero credenciales quemadas en el código fuente. Todo secreto se inyecta por `.env` y se documenta en `.env.example`.
4. **Trazabilidad y Auditoría en Snowflake:** Cada decisión tomada por el agente y aprobada por el admin se replica como un registro inmutable en Snowflake (`FACT_FINANCIAL_DECISIONS`).
5. **Commits con Fundamentos:** Todo commit sigue Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `chore:`) con descripción clara de lo que resuelve.
