# 🛡️ FinGuardian AI — CFO Autónomo 360° & Sistema Operativo Retail

> **Caso de Estudio Empresarial:** `Muebles Jamar S.A. & Credijamar` (Cadena líder de muebles para el hogar y autofinanciación en Colombia)  
> **Rama de Trabajo:** `feature/muebles-jamar`  
> **Categoría:** AI Gateway Multi-Modelo, Inteligencia Financiera Retail, Data Warehousing y Automatización Human-in-the-Loop  
> **Repositorio Oficial:** [github.com/Brxynxr/FinGuardian](https://github.com/Brxynxr/FinGuardian)

---

## 📖 1. Contexto del Negocio: Retail de Muebles & Financiación Credijamar

**Muebles Jamar** (fundada en Barranquilla en 1951) opera bajo un modelo de negocio híbrido de alto volumen:
1. **Comercio Retail de Muebles:** Venta física y digital de mobiliario organizado en 4 categorías: *Salas & Sofás*, *Alcobas & Cuartos (Camas y Colchones)*, *Comedores & Bares* y *Muebles TV & Estudio*.
2. **Financiadora Propia (Credijamar):** Entre el **75% y el 80%** de las ventas se realizan a crédito en cuotas quincenales (de 6 a 24 meses).
3. **Red Nacional Físcia:** 14 tiendas showroom y centros de distribución distribuidos en 4 regionales estratégicas:
   - *Barranquilla & Atlántico* (5 sedes + CENDIS Industrial Galapa)
   - *Bogotá & Sabana* (4 sedes insignia: Paloquemao, Autonorte, Américas, Suba)
   - *Medellín & Antioquia* (2 sedes: Mayorca MegaPlaza, Los Molinos)
   - *Costa & Oriente* (3 sedes: Bucaramanga Cabecera, Cartagena, Santa Marta)
4. **El Desafío de Liquidez Quincenal:**
   - La nómina fija de más de **1.200 colaboradores** (asesores de tienda, armadores, logística y operarios de fábrica en CILA Galapa) y los arriendos comerciales deben pagarse rigurosamente en las quincenas.
   - El flujo de caja depende del recaudo puntual de Credijamar. Si surge un desfase quincenal, FinGuardian AI interviene activando una campaña flash de condonación de intereses moratorios a clientes en mora temprana (1 a 15 días) y negociando prórrogas con proveedores industriales de madera en Galapa sin tocar nómina ni endeudarse con bancos.

---

## 🚀 2. Guía Rápida de Despliegue y Puertos

El aplicativo está configurado para operar en puertos estándar fijos:
* **Frontend Web (React 19 + Vite / Nginx):** `http://localhost:5173`
* **Backend API (FastAPI + Python):** `http://localhost:8000`
* **Documentación Interactiva (Swagger / OpenAPI):** `http://localhost:8000/docs`

---

### Opción A: Despliegue con Docker Compose (Recomendado)

Ideal para levantar todo el sistema (Frontend Nginx + Backend FastAPI + Base de datos) en contenedores optimizados multi-stage con health checks automáticos:

```bash
# 1. Construir las imágenes y levantar los contenedores en segundo plano:
docker compose up --build -d

# 2. Verificar que ambos contenedores se encuentren en estado 'healthy':
docker ps

# 3. Acceder en el navegador:
#    Frontend: http://localhost:5173
#    Backend:  http://localhost:8000/docs

# 4. Ver logs en tiempo real (opcional):
docker compose logs -f

# 5. Detener los contenedores y liberar los puertos 5173 y 8000:
docker compose down
```

---

### Opción B: Despliegue Local Nativo (Desarrollo Rápido)

Si prefieres ejecutar el código directamente en tu máquina con recarga en caliente (*Hot-Reload*):

#### En Linux / macOS (Un Solo Comando):
```bash
# Otorgar permisos y ejecutar script de arranque:
chmod +x run.sh
./run.sh
```
El script verifica entornos, instala dependencias faltantes si no existen, libera puertos previamente ocupados y levanta automáticamente el Backend en `8000` y el Frontend en `5173`.

#### En Windows (CMD o PowerShell):
```cmd
run.bat
```

#### O Manualmente en 2 Terminales Separadas:

**Terminal 1 — Backend (FastAPI):**
```bash
# 1. Activar entorno virtual
source backend/venv/bin/activate    # En Windows: backend\venv\Scripts\activate

# 2. Instalar dependencias (solo primera vez)
pip install -r backend/requirements.txt

# 3. Iniciar servidor FastAPI
PYTHONPATH=. uvicorn backend.app.main:app --reload --port 8000
```

**Terminal 2 — Frontend (Vite + React 19):**
```bash
# 1. Entrar al directorio y levantar Vite en puerto 5173
cd frontend
npm install                         # Solo primera vez
npm run dev -- --port 5173
```

---

### 🔧 3. Cómo Liberar Puertos Ocupados (Troubleshooting)

Si al intentar iniciar el servidor recibes el mensaje de que el puerto `5173` o `8000` está ocupado (*EADDRINUSE*):

**1. Si tenías Docker corriendo:**
```bash
docker compose down
```

**2. En Linux / macOS:**
```bash
# Ver qué proceso está escuchando:
ss -tulpn | grep -E ':5173|:8000'

# Liberar los puertos inmediatamente:
fuser -k 5173/tcp 8000/tcp 2>/dev/null
```

**3. En Windows:**
```cmd
REM Buscar el PID que ocupa el puerto:
netstat -ano | findstr :5173
netstat -ano | findstr :8000

REM Terminar el proceso:
taskkill /PID <PID_NUMERO> /F
```

---

## 🏛️ 4. Arquitectura y Componentes Clave

```text
                                  ┌──────────────────────────────────────────────┐
                                  │      DASHBOARD WEB (REACT 19 + TAILWIND)     │
                                  │   • Identidad Blanco & Rojo Carmesí Jamar    │
                                  │   • Vista Nacional & Drill-down por Ciudad   │
                                  │   • Diagrama Donut: Categorías (Salas/Cuartos)│
                                  │   • Barras: Credijamar (77%) vs Contado (23%)│
                                  │   • Curva de Liquidez COP a 40 Días          │
                                  └──────────────────────▲───────────────────────┘
                                                         │ REST API (Proxied /api)
                                  ┌──────────────────────▼───────────────────────┐
                                  │          BACKEND (FASTAPI + PYTHON)          │
                                  │   • Endpoints /api/jamar/*                   │
                                  │   • Motor de Proyección Financiera COP       │
                                  │   • Base de Datos SQLite Transaccional Local │
                                  │   • Auditoría Inmutable (LocalAuditLog)      │
                                  └──────────────────────┬───────────────────────┘
                                                         │
            ┌────────────────────────────────────────────┼────────────────────────────────────────────┐
            ▼                                            ▼                                            ▼
 ┌──────────────────────┐                     ┌──────────────────────┐                     ┌──────────────────────┐
 │ 🤖 AI GATEWAY GROQ   │                     │ 📱 TELEGRAM BOT      │                     │ 🌲 GALAPA & RETAIL   │
 │ • Llama-3.3-70B      │                     │ • Notificaciones push│                     │ • Prórroga compras de│
 │ • Análisis Break-Even│                     │   con botones inline │                     │   madera (Galapa)    │
 │   de nuevas sedes    │                     │ • Comandos móviles:  │                     │ • Condonación de mora│
 │   (Montería, etc.)   │                     │   /sedes, /credijamar│                     │   flash Credijamar   │
 └──────────────────────┘                     └──────────────────────┘                     └──────────────────────┘
```

---

## 📱 5. Telegram Bot & Comandos Móviles (`@FinGuardia_bot`)

El asistente financiero se conecta bidireccionalmente con el administrador o asesor mediante Telegram.

### Comandos Rápidos Disponibles:
* `/saldo`: Saldo disponible en bancos en COP, umbral de seguridad y ventas totales.
* `/nomina`: Resumen de nómina quincenal por regional y total de 1.200 trabajadores protegidos.
* `/sedes`: Ranking de ventas mensuales y ratio de crédito de las 14 tiendas.
* `/credijamar`: Cartera activa ($14.250M COP), porcentaje al día (89.1%) y mora temprana ($895M COP).
* `/ciudades` / `/regionales`: Desglose detallado de las 4 regionales comerciales.
* `/alertas`: Monitoreo de riesgos de liquidez y planes de contingencia pendientes.
* `/ayuda`: Menú de ayuda y guía de uso.
* **Lenguaje Natural:** Cualquier pregunta de negocio (ej. *"¿Podemos abrir una nueva sede en Montería?"*) es respondida con análisis financiero por el CFO Autónomo.

### Protocolo de Rescate Human-in-the-Loop:
Cuando el sistema proyecta un déficit para el corte de quincena, envía una alerta push con botones inline:
`[✅ Aprobar Rescate Jamar]` | `[❌ Rechazar Plan]`.
Al presionar el botón en el celular:
1. Se activa la condonación de intereses a 2.450 clientes de Credijamar en mora temprana (recaudo proyectado: **+$340M COP**).
2. Se aplica la prórroga de 18 días en la factura del proveedor de maderas en Galapa.
3. Se registra la auditoría inmutable localmente en `jamar_local_audit_logs`.
4. El Dashboard web se actualiza al instante reflejando la caja protegida.

---

## 🧪 6. Verificación y Suite de Pruebas

Tanto el backend como el frontend cuentan con verificación estricta:

```bash
# 1. Ejecutar las 23 pruebas automatizadas de Backend (100% de éxito):
PYTHONPATH=. ./backend/venv/bin/pytest backend/tests -v

# 2. Probar específicamente los módulos de Muebles Jamar:
PYTHONPATH=. ./backend/venv/bin/pytest backend/tests/test_jamar_backend.py -v

# 3. Verificar compilación estricta de TypeScript y empaquetado de Frontend:
npm --prefix frontend run build
```

---

## 🛡️ 7. Leyes de Hierro del Proyecto

1. **Human-in-the-Loop Obligatorio:** Ninguna prórroga de proveedor ni beneficio a clientes se ejecuta sin la autorización explícita del administrador (vía Telegram o Dashboard).
2. **Cero Alucinaciones Matemáticas:** Las proyecciones de caja, sumatorias de nómina y burn rate son **100% deterministas en código Python**. El LLM interpreta y propone; el algoritmo numérico ejecuta.
3. **Seguridad y Secretos:** Cero credenciales quemadas en el código fuente. Todo secreto se inyecta por `.env` y se documenta en `.env.example`.
4. **Desacoplamiento en Pruebas:** Almacenamiento local SQLite (`finguardian_jamar.db` / `LocalAuditLog`) para pruebas inmediatas sin consumo de créditos de nube.
