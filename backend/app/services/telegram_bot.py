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
        currency: str = "COP",
    ) -> Dict[str, Any]:
        """
        Pushes rich markdown rescue notification with inline keyboard buttons to admin Telegram.
        Supports both COP (Muebles Jamar) and USD formatting.
        """
        actions_text = "\n".join([f"• {a.get('reason', a.get('action_type', ''))}" for a in actions_list])

        if currency == "COP" or deficit_amount > 1_000_000:
            text = (
                f"🚨 *ALERTA FINANCIERA: MUEBLES JAMAR & CREDIJAMAR*\n"
                f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
                f"• *Déficit Proyectado:* -${deficit_amount:,.0f} COP\n"
                f"• *Fecha Crítica:* {deficit_date_str}\n\n"
                f"🤖 *Plan de Rescate FinGuardian AI:*\n"
                f"{actions_text}\n\n"
                f"📊 *Resultado Simulado:* Saldo mínimo protegido en *+${new_min_balance:,.0f} COP* sin endeudamiento bancario.\n\n"
                f"¿Autorizas la ejecución inmediata de este protocolo?"
            )
            inline_buttons = [
                {"text": "✅ Aprobar Rescate Jamar", "callback_data": f"approve_jamar:{proposal_id}"},
                {"text": "❌ Rechazar Plan", "callback_data": f"reject_jamar:{proposal_id}"},
            ]
        else:
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
                            inline_buttons
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
        Processes quick commands (/saldo, /nomina, /sedes, /credijamar, /ciudades, /alertas)
        or chats with Jamar CFO Copilot via Groq.
        """
        from backend.app.agent.jamar_copilot import JamarCFOCopilotService
        copilot = JamarCFOCopilotService(db)
        ctx = copilot.get_live_context()

        cmd = user_text.strip().lower()

        if cmd == "/saldo":
            status_emoji = "🔴" if ctx["projected_deficit_day_14_cop"] < 0 else "🟢"
            return (
                f"💼 *ESTADO DE TESORERÍA — MUEBLES JAMAR S.A.*\n"
                f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
                f"• *Caja en Bancos:* ${ctx['current_balance_cop']:,.0f} COP\n"
                f"• *Umbral de Seguridad:* ${ctx['safe_threshold_cop']:,.0f} COP\n"
                f"• *Ventas del Mes:* ${ctx['total_monthly_sales_cop']:,.0f} COP\n"
                f"  - *Credijamar:* {ctx['credit_sales_ratio']}%\n"
                f"  - *Contado / Directo:* {ctx['cash_sales_ratio']}%\n"
                f"• *Déficit Proyectado (Día 14):* -${abs(ctx['projected_deficit_day_14_cop']):,.0f} COP {status_emoji}\n"
                f"• *Sedes Activas:* {ctx['stores_count']} tiendas en {ctx['cities_count']} ciudades"
            )

        elif cmd == "/nomina":
            from backend.app.models.jamar_models import CityRegion
            cities = db.query(CityRegion).all()
            city_lines = "\n".join([f"  • *{c.name}:* ${c.total_payroll_cop:,.0f} COP ({c.stores_count} sedes)" for c in cities])
            return (
                f"👥 *NÓMINA NACIONAL — MUEBLES JAMAR*\n"
                f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
                f"• *Total Nómina Nacional:* ${ctx['total_payroll_cop']:,.0f} COP\n"
                f"• *Colaboradores:* 1.200 trabajadores (asesores, armadores, logística y planta Galapa)\n"
                f"• *Desglose por Regional:*\n{city_lines}\n\n"
                f"🛡️ *Garantía de Caja:* La nómina de las sedes tiene prioridad absoluta y nunca se posterga."
            )

        elif cmd == "/sedes":
            from backend.app.models.jamar_models import JamarStore
            stores = db.query(JamarStore).order_by(JamarStore.actual_sales_cop.desc()).all()
            if not stores:
                return "🏬 No hay sedes registradas en este momento."

            top_lines = []
            for idx, s in enumerate(stores[:7], 1):
                city_name = s.city.name if s.city else s.city_id
                top_lines.append(
                    f"{idx}. *{s.name}* ({city_name}):\n"
                    f"   Ventas: ${s.actual_sales_cop:,.0f} COP | Crédito Credijamar: {s.credit_percentage:.0f}%"
                )

            return (
                f"🏬 *RED DE TIENDAS MUEBLES JAMAR (14 SEDES)*\n"
                f"Top tiendas por volumen de ventas:\n\n"
                + "\n\n".join(top_lines) +
                f"\n\n_Para ver todas las 14 sedes y desglose de arriendos, ingresa al Dashboard web._"
            )

        elif cmd == "/credijamar":
            return (
                f"💳 *ESTADO DE CARTERA — CREDIJAMAR*\n"
                f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
                f"• *Cartera Activa Total:* $14.250.000.000 COP\n"
                f"• *Tasa de Cumplimiento al Día:* {ctx['collection_on_time_rate']}%\n"
                f"• *Mora Temprana (1-15 días):* ${ctx['early_arrears_cop']:,.0f} COP (2.450 clientes)\n"
                f"• *Potencial Rescate Inmediato:* +$340.000.000 COP mediante campaña flash de condonación de intereses moratorios."
            )

        elif cmd in ["/ciudades", "/regionales"]:
            from backend.app.models.jamar_models import CityRegion
            cities = db.query(CityRegion).all()
            lines = []
            for c in cities:
                lines.append(
                    f"📍 *{c.name}* ({c.stores_count} sedes):\n"
                    f"  - Ventas: ${c.monthly_sales_cop:,.0f} COP (Meta: ${c.sales_target_cop:,.0f})\n"
                    f"  - Mix: {c.credit_sales_percentage:.1f}% Credijamar / {c.cash_sales_percentage:.1f}% Contado\n"
                    f"  - Costos Fijos: Nómina ${c.total_payroll_cop:,.0f} | Arriendos ${c.total_rent_cop:,.0f}"
                )
            return "🗺️ *REGIONALES MUEBLES JAMAR:*\n\n" + "\n\n".join(lines)

        elif cmd == "/alertas":
            from backend.app.models.financial import AgentProposal
            prop = db.query(AgentProposal).filter(AgentProposal.status == "PENDING_APPROVAL").first()
            if prop:
                return (
                    f"🚨 *ALERTA ACTIVA DE TESORERÍA:*\n\n"
                    f"• *Déficit Proyectado:* -${prop.projected_deficit:,.0f} COP para el corte del día 14.\n"
                    f"• *Plan Propuesto:* Condonación moratoria Credijamar + Prórroga proveedor madera en Galapa.\n"
                    f"• *Saldo Mínimo Simulado:* +$195.000.000 COP.\n\n"
                    f"Usa los botones del mensaje de alerta o el Dashboard para autorizar la ejecución."
                )
            return "✅ *Sin alertas pendientes:* La liquidez se encuentra dentro de los márgenes seguros y la nómina está cubierta."

        elif cmd in ["/ayuda", "/help"]:
            return (
                "🤖 *Comandos de FinGuardian AI — Muebles Jamar CFO:*\n\n"
                "• `/saldo` - Tesorería, saldo en bancos y ventas Credijamar vs Contado\n"
                "• `/nomina` - Nómina por regional y 1.200 colaboradores protegidos\n"
                "• `/sedes` - Ranking de ventas y % de crédito en las 14 tiendas\n"
                "• `/credijamar` - Cartera activa, tasa de cobro y mora temprana\n"
                "• `/ciudades` - Desglose de las 4 regionales (Barranquilla, Bogotá, Medellín, Bucaramanga)\n"
                "• `/alertas` - Estado de contingencia y propuestas de rescate\n"
                "• O *escribe cualquier consulta en lenguaje natural* (ej: '¿Podemos abrir una sede en Montería?', '¿Cómo va la mora en Bogotá?')."
            )

        # Delegate open query to Jamar CFO Copilot
        return copilot.ask(user_text)

telegram_bot_service = TelegramBotService()
