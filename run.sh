#!/usr/bin/env bash
set -e

echo "🚀 Iniciando FinGuardian AI (Modo Desarrollo)..."

# 1. Backend setup
if [ ! -d "backend/venv" ]; then
    echo "📦 Creando entorno virtual Python..."
    python3 -m venv backend/venv
    ./backend/venv/bin/pip install --upgrade pip
    ./backend/venv/bin/pip install -r backend/requirements.txt
fi

# 2. Frontend setup
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Instalando dependencias de frontend..."
    npm --prefix frontend install
fi

echo "🟢 Levantando Backend FastAPI (puerto 8000)..."
./backend/venv/bin/uvicorn backend.app.main:app --reload --port 8000 &
BACKEND_PID=$!

echo "🟢 Levantando Frontend Vite (puerto 5173)..."
npm --prefix frontend run dev &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT

echo "✨ FinGuardian AI activo en http://localhost:5173"
wait
