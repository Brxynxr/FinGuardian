#!/usr/bin/env bash
set -e

echo "🚀 Iniciando FinGuardian AI (Muebles Jamar & Credijamar)..."

# 1. Liberar puertos si hubiera procesos previos ocupándolos
if ss -tulpn 2>/dev/null | grep -q ':8000'; then
    echo "⚠️ Puerto 8000 en uso. Liberando proceso..."
    fuser -k 8000/tcp 2>/dev/null || true
fi
if ss -tulpn 2>/dev/null | grep -q ':5173'; then
    echo "⚠️ Puerto 5173 en uso. Liberando proceso..."
    fuser -k 5173/tcp 2>/dev/null || true
fi

# 2. Backend setup
if [ ! -d "backend/venv" ]; then
    echo "📦 Creando entorno virtual Python..."
    python3 -m venv backend/venv
    ./backend/venv/bin/pip install --upgrade pip
    ./backend/venv/bin/pip install -r backend/requirements.txt
fi

# 3. Frontend setup
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Instalando dependencias de frontend..."
    npm --prefix frontend install
fi

echo "🟢 Levantando Backend FastAPI (puerto 8000)..."
PYTHONPATH=. ./backend/venv/bin/uvicorn backend.app.main:app --reload --port 8000 &
BACKEND_PID=$!

echo "🟢 Levantando Frontend Vite (puerto 5173)..."
npm --prefix frontend run dev -- --port 5173 &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true" EXIT

echo "✨ FinGuardian AI activo:"
echo "   • Frontend: http://localhost:5173"
echo "   • Backend API: http://localhost:8000"
echo "   • Documentación Swagger: http://localhost:8000/docs"
wait
