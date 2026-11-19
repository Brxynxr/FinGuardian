@echo off
echo ========================================================
echo   FinGuardian AI - Modo Desarrollo (Windows)
echo ========================================================

REM 1. Backend Python Virtualenv
if not exist "backend\venv" (
    echo [1/3] Creando entorno virtual Python...
    python -m venv backend\venv
    call backend\venv\Scripts\pip install --upgrade pip
    call backend\venv\Scripts\pip install -r backend\requirements.txt
)

REM 2. Frontend Node dependencies
if not exist "frontend\node_modules" (
    echo [2/3] Instalando dependencias de frontend...
    cd frontend && npm install && cd ..
)

echo [3/3] Levantando servidores...
start "FinGuardian Backend" cmd /k "backend\venv\Scripts\activate && uvicorn backend.app.main:app --reload --port 8000"
start "FinGuardian Frontend" cmd /k "cd frontend && npm run dev -- --port 5173"

echo.
echo ========================================================
echo   Plataforma disponible en: http://localhost:5173
echo   API Swagger en:           http://localhost:8000/docs
echo ========================================================
pause
