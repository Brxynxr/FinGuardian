import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx

from backend.app.database import engine, Base, SessionLocal
from backend.app.api.routes import router
from backend.app.api.jamar_routes import jamar_router
from backend.app.services.seeder import seed_demo_data
from backend.app.services.seeder_jamar import seed_jamar_database
from backend.app.services.telegram_bot import telegram_bot_service
from backend.app.services.execution_engine import ExecutionEngine
from backend.app.config import settings

logger = logging.getLogger("finguardian")

async def telegram_polling_worker():
    """
    Background worker that listens for Telegram updates (clicks on buttons or chat questions).
    """
    if not telegram_bot_service.is_configured():
        logger.info("Telegram bot not configured. Polling skipped.")
        return

    offset = 0
    client = httpx.AsyncClient(timeout=25.0)
    logger.info("Telegram background polling worker started.")

    while True:
        try:
            url = f"{telegram_bot_service.base_url}/getUpdates"
            params = {"offset": offset, "timeout": 20}
            resp = await client.get(url, params=params)
            if resp.status_code == 200:
                data = resp.json()
                for update in data.get("result", []):
                    offset = update["update_id"] + 1

                    # 1. Handle Callback Query (Buttons [Aprobar] / [Rechazar])
                    if "callback_query" in update:
                        cb = update["callback_query"]
                        cb_data = cb.get("data", "")
                        cb_id = cb.get("id")

                        db = SessionLocal()
                        try:
                            engine_exec = ExecutionEngine(db)
                            if cb_data.startswith("approve:"):
                                prop_id = int(cb_data.split(":")[1])
                                engine_exec.approve_proposal(prop_id, approved_by="ADMIN_TELEGRAM")
                            elif cb_data.startswith("reject:"):
                                prop_id = int(cb_data.split(":")[1])
                                engine_exec.reject_proposal(prop_id, reason="Rechazado vía Telegram", rejected_by="ADMIN_TELEGRAM")
                        finally:
                            db.close()

                        # Acknowledge callback
                        try:
                            await client.post(f"{telegram_bot_service.base_url}/answerCallbackQuery", json={"callback_query_id": cb_id})
                        except Exception:
                            pass

                    # 2. Handle Text Message (/saldo, /nomina, or chat with CFO Copilot)
                    elif "message" in update and "text" in update["message"]:
                        msg = update["message"]
                        user_text = msg.get("text", "")
                        from_user = str(msg.get("from", {}).get("id", ""))

                        # Only respond to authorized admin
                        if from_user == str(settings.TELEGRAM_ADMIN_CHAT_ID):
                            db = SessionLocal()
                            try:
                                reply = telegram_bot_service.handle_incoming_text_or_command(db, user_text)
                                telegram_bot_service.send_message(reply)
                            finally:
                                db.close()

        except asyncio.CancelledError:
            break
        except Exception as e:
            await asyncio.sleep(4)

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        from backend.app.models.financial import CompanyProfile
        if not db.query(CompanyProfile).first():
            seed_demo_data(db, reset_existing=False)
        # Asegurar inicialización de Muebles Jamar en la base de datos local
        seed_jamar_database(db)
    finally:
        db.close()

    # Launch Telegram background listener
    polling_task = asyncio.create_task(telegram_polling_worker())
    yield
    polling_task.cancel()

app = FastAPI(
    title="FinGuardian AI — Autonomous CFO & Financial Operating System",
    description="360° Financial Runway, Payroll Optimization & Autonomous Agent for Muebles Jamar S.A. & Credijamar",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")
app.include_router(jamar_router, prefix="/api/jamar")

@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "FinGuardian AI",
        "version": "2.0.0",
        "company": "InnovaCloud Tech SAS",
    }
