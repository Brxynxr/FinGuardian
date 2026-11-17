import os
import logging
from typing import Dict, Any, Optional, List
import httpx
from sqlalchemy.orm import Session

from backend.app.config import settings

logger = logging.getLogger(__name__)

class TelegramBotService:
    def __init__(self):
        self.bot_token = settings.TELEGRAM_BOT_TOKEN
        self.admin_chat_id = settings.TELEGRAM_ADMIN_CHAT_ID
        self.base_url = f"https://api.telegram.org/bot{self.bot_token}" if self.bot_token else ""
        self.in_memory_notifications: List[Dict[str, Any]] = []

    def is_configured(self) -> bool:
        return bool(self.bot_token and self.admin_chat_id)

    def send_rescue_alert(
        self,
        proposal_id: int,
        deficit_amount: float,
        deficit_date_str: str,
        actions_list: List[Dict[str, Any]],
        new_min_balance: float,
    ) -> Dict[str, Any]:
        """
        Pushes rich markdown rescue notification with inline keyboard buttons to admin Telegram.
        """
        actions_text = "\n".join([f"• {a.get('reason', '')}" for a in actions_list])

        text = (
            f"🚨 *ALERTA FINANCIERA: RIESGO DE DÉFICIT DE CAJA*\n"
            f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
            f"• *Déficit Proyectado:* -${deficit_amount:,.2f} USD\n"
            f"• *Fecha Crítica:* {deficit_date_str}\n\n"
            f"🤖 *Plan de Rescate FinGuardian AI:*\n"
            f"{actions_text}\n\n"
            f"📊 *Resultado Simulado:* Saldo mínimo protegido en *+${new_min_balance:,.2f} USD* sin deuda bancaria.\n\n"
            f"¿Autorizas la ejecución inmediata de este protocolo?"
        )

        inline_buttons = [
            {"text": "✅ Aprobar y Ejecutar", "callback_data": f"approve:{proposal_id}"},
            {"text": "❌ Rechazar Plan", "callback_data": f"reject:{proposal_id}"},
        ]

        payload = {
            "proposal_id": proposal_id,
            "message": text,
            "inline_buttons": inline_buttons,
        }
        self.in_memory_notifications.append(payload)

        if self.is_configured():
            try:
                url = f"{self.base_url}/sendMessage"
                body = {
                    "chat_id": self.admin_chat_id,
                    "text": text,
                    "parse_mode": "Markdown",
                    "reply_markup": {
                        "inline_keyboard": [
                            [
                                {"text": "✅ Aprobar y Ejecutar", "callback_data": f"approve:{proposal_id}"},
                                {"text": "❌ Rechazar Plan", "callback_data": f"reject:{proposal_id}"},
                            ]
                        ]
                    }
                }
                httpx.post(url, json=body, timeout=6.0)
            except Exception as e:
                logger.warning(f"Could not push to Telegram: {e}")

        return payload

    def send_message(self, text: str) -> bool:
        if not self.is_configured():
            return False
        try:
            url = f"{self.base_url}/sendMessage"
            body = {
                "chat_id": self.admin_chat_id,
                "text": text,
                "parse_mode": "Markdown",
            }
            httpx.post(url, json=body, timeout=5.0)
            return True
        except Exception as e:
            logger.warning(f"Failed sending Telegram text: {e}")
            return False

    def handle_incoming_text_or_command(self, db: Session, user_text: str) -> str:
        """
        Processes quick commands (/saldo, /nomina, /alertas) or chats with CFO Copilot via Groq.
        """
        from backend.app.agent.cfo_copilot import CFOCopilotService
        copilot = CFOCopilotService(db)
        ctx = copilot.get_live_context()

        cmd = user_text.strip().lower()

        if cmd == "/saldo":
            status_emoji = "🟢" if not ctx["has_deficit"] else "🔴"
            return (
                f"💼 *ESTADO DE TESORERÍA*\n\n"
                f"• *Saldo en Banco:* ${ctx['current_balance']:,.2f} USD\n"
                f"• *Umbral de Seguridad:* ${ctx['safe_threshold']:,.2f} USD\n"
                f"• *Índice de Salud:* {ctx['health_score']}/100 {status_emoji}\n"
                f"• *Runway:* {ctx['runway_days']} días de margen\n"
                f"• *Déficit Proyectado:* -${ctx['worst_deficit']:,.2f} USD"
            )

        elif cmd == "/nomina":
            return (
                f"👥 *NÓMINA & EQUIPO DE DESARROLLO*\n\n"
                f"• *Total Nómina Mensual:* ${ctx['total_payroll']:,.2f} USD\n"
                f"• *Equipo Activo:* {ctx['employees_count']} desarrolladores e ingenieros\n"
                f"• *Próximo Día de Corte:* Día 30 del mes"
            )

        elif cmd == "/alertas":
            if ctx["has_deficit"]:
                return (
                    f"🚨 *ALERTA ACTIVA:* Déficit proyectado de -${ctx['worst_deficit']:,.2f} USD. "
                    f"Revisa el plan de contingencia pendiente en Telegram o en el Dashboard web."
                )
            return "✅ *Sin alertas:* La liquidez se encuentra dentro de los márgenes seguros de operación."

        elif cmd == "/ayuda" or cmd == "/help":
            return (
                "🤖 *Comandos de FinGuardian AI CFO:*\n\n"
                "• `/saldo` - Resumen de liquidez y runway en tiempo real\n"
                "• `/nomina` - Total y estado de la nómina del equipo\n"
                "• `/alertas` - Estado de alertas y riesgos de caja\n"
                "• O simplemente *escríbeme tu duda financiera* (ej: '¿Podemos contratar a un dev?')."
            )

        # Delegate free text to CFO Copilot (Groq)
        return copilot.ask(user_text)

telegram_bot_service = TelegramBotService()
