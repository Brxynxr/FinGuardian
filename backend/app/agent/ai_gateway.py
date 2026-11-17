import logging
from typing import Dict, Any, Optional
from groq import Groq
from backend.app.config import settings

logger = logging.getLogger(__name__)

class AIGateway:
    def __init__(self):
        self.decision_client = Groq(api_key=settings.GROQ_API_KEY_DECISION) if settings.GROQ_API_KEY_DECISION else None
        self.chat_client = Groq(api_key=settings.GROQ_API_KEY_CHAT) if settings.GROQ_API_KEY_CHAT else None
        self.primary_model = settings.GROQ_MODEL
        self.fallback_model = "qwen/qwen3.8-27b"

    def generate_decision_reasoning(self, plan_context: Dict[str, Any]) -> str:
        """
        Uses Groq Decision Key to synthesize an executive explanation of the rescue plan.
        """
        prompt = (
            f"Eres FinGuardian AI, el CFO Autónomo de InnovaCloud Tech SAS. "
            f"Se ha detectado un déficit de liquidez de -${plan_context.get('projected_deficit', 0):,.2f} USD "
            f"con fecha crítica el {plan_context.get('deficit_date', '')}.\n"
            f"Las acciones de rescate son:\n"
            f"{plan_context.get('actions_summary', '')}\n\n"
            f"Redacta un resumen ejecutivo de 3 párrafos concisos y contundentes para el Administrador, "
            f"justificando por qué estas acciones salvan la caja sin pedir deuda bancaria y protegen la nómina."
        )

        if self.decision_client:
            for model_name in [self.primary_model, self.fallback_model]:
                try:
                    response = self.decision_client.chat.completions.create(
                        messages=[
                            {"role": "system", "content": "Eres un CFO Senior experto en finanzas corporativas y tesorería."},
                            {"role": "user", "content": prompt}
                        ],
                        model=model_name,
                        temperature=0.3,
                        max_tokens=600,
                    )
                    return response.choices[0].message.content
                except Exception as e:
                    logger.warning(f"Groq decision error on {model_name}: {e}")

        # Deterministic heuristic fallback
        return (
            f"FinGuardian AI Protocolo Activo: Se detectó un déficit proyectado de "
            f"-${plan_context.get('projected_deficit', 0):,.2f} USD. "
            f"Para blindar la operación, se reprograman pagos con proveedores flexibles amparados en sus días de gracia "
            f"y se activa el incentivo de pronto pago del 2% con clientes de alta liquidez. "
            f"Esto asegura la nómina de los 5 desarrolladores y estabiliza el saldo mínimo de seguridad."
        )

    def chat_with_copilot(self, user_message: str, financial_context: Dict[str, Any]) -> str:
        """
        Uses dedicated Groq Chat Key to answer financial, budget, and hiring questions.
        """
        system_prompt = (
            "Eres el Copiloto CFO Inteligente de InnovaCloud Tech SAS (empresa de desarrollo de software y servicios Cloud). "
            "Responde con criterio financiero senior, números precisos, tono analítico pero claro y empático. "
            "Usa el siguiente estado financiero en tiempo real para respaldar todas tus respuestas:\n\n"
            f"• Saldo en Banco: ${financial_context.get('current_balance', 5000):,.2f} USD\n"
            f"• Umbral Mínimo Seguro: ${financial_context.get('safe_threshold', 2000):,.2f} USD\n"
            f"• Nómina Mensual Total: ${financial_context.get('total_payroll', 10100):,.2f} USD (5 desarrolladores)\n"
            f"• Días de Runway de Caja: {financial_context.get('runway_days', 14)} días\n"
            f"• Índice de Salud Financiera: {financial_context.get('health_score', 45)}/100\n"
            f"• Déficit Proyectado: -${financial_context.get('worst_deficit', 0):,.2f} USD\n\n"
            "Si te preguntan por contrataciones (ej: contratar a alguien por X monto), calcula cómo afectaría al burn rate, "
            "al runway de meses y si es recomendable o riesgoso según las facturas por cobrar. "
            "Mantén la respuesta en 2 o 3 párrafos con viñetas claras."
        )

        client = self.chat_client or self.decision_client
        if client:
            for model_name in [self.primary_model, self.fallback_model]:
                try:
                    response = client.chat.completions.create(
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_message}
                        ],
                        model=model_name,
                        temperature=0.4,
                        max_tokens=650,
                    )
                    return response.choices[0].message.content
                except Exception as e:
                    logger.warning(f"Groq chat copilot error on {model_name}: {e}")

        return (
            f"CFO Copilot (Modo Autónomo Local): Saldo actual en ${financial_context.get('current_balance', 5000):,.2f} USD "
            f"con un runway estimado de {financial_context.get('runway_days', 14)} días. "
            f"Nómina mensual comprometida de ${financial_context.get('total_payroll', 10100):,.2f} USD. "
            f"Cualquier gasto extraordinario mayor a $1,000 USD debe esperar la recaudación de las facturas de fin de mes."
        )

ai_gateway = AIGateway()
