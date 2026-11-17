import React, { useState } from 'react';
import { Bot, Check, X, Mail, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { AgentProposal, ActionPayload } from '../types';

interface Props {
  hasDeficit: boolean;
  pendingProposal: AgentProposal | null;
  onTriggerAnalysis: () => void;
  onApprove: (proposalId: number) => void;
  onReject: (proposalId: number, reason: string) => void;
  isProcessing: boolean;
  onPreviewEmail: (emailHtml: string, title: string) => void;
}

export const RescueActionCenter: React.FC<Props> = ({
  hasDeficit,
  pendingProposal,
  onTriggerAnalysis,
  onApprove,
  onReject,
  isProcessing,
  onPreviewEmail,
}) => {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  return (
    <div className="bg-slate-800/60 backdrop-blur border border-slate-700/60 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Centro de Contingencia Human-in-the-Loop</h2>
            <p className="text-xs text-slate-400">El agente propone y simula; tú autorizas la ejecución oficial.</p>
          </div>
        </div>

        {/* Status indicator */}
        {pendingProposal ? (
          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold animate-pulse">
            Pendiente de Aprobación
          </span>
        ) : hasDeficit ? (
          <button
            onClick={onTriggerAnalysis}
            disabled={isProcessing}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold transition"
          >
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span>{isProcessing ? 'Analizando...' : 'Activar Protocolo de Rescate'}</span>
          </button>
        ) : (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            Flujo de Caja Estable
          </span>
        )}
      </div>

      {pendingProposal ? (
        <div className="space-y-4">
          {/* Executive Reasoning Box */}
          <div className="bg-slate-900/80 border border-slate-700/80 rounded-lg p-4 text-xs text-slate-300 leading-relaxed">
            <div className="flex items-center space-x-2 mb-2 text-emerald-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Diagnóstico Financiero Autónomo (Groq 120B)</span>
            </div>
            <p className="whitespace-pre-line">{pendingProposal.action_summary}</p>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingProposal.actions_payload.map((action: ActionPayload, idx: number) => (
              <div
                key={idx}
                className="bg-slate-900/50 border border-slate-700/60 rounded-lg p-3.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-200">
                      {action.type === 'RESCHEDULE_PAYMENT' ? '🗓️ Reprogramación de Pago' : '💰 Pronto Pago Preferencial'}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {action.vendor_name || action.customer_name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-normal">{action.reason}</p>
                </div>

                {action.html_email_preview && (
                  <button
                    onClick={() => onPreviewEmail(action.html_email_preview!, `Vista Previa: ${action.vendor_name || action.customer_name}`)}
                    className="mt-3 inline-flex items-center space-x-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Ver Correo HTML a Despachar</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Simulated Recovery Banner */}
          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs gap-2">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-slate-200 font-medium">
                Impacto Simulado: Saldo protegido en <strong>+${pendingProposal.simulated_minimum_balance.toLocaleString()} USD</strong>.
              </span>
            </div>
            <span className="text-emerald-400 font-medium">
              💡 También puedes aprobar desde tu celular en Telegram.
            </span>
          </div>

          {/* Approval Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
            {showRejectInput ? (
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Motivo del rechazo (para aprendizaje)..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500 flex-1 sm:w-72"
                />
                <button
                  onClick={() => onReject(pendingProposal.id, rejectReason)}
                  disabled={isProcessing}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition"
                >
                  Confirmar Rechazo
                </button>
                <button
                  onClick={() => setShowRejectInput(false)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowRejectInput(true)}
                  disabled={isProcessing}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-rose-400 hover:text-rose-300 transition"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Rechazar Plan</span>
                </button>

                <button
                  onClick={() => onApprove(pendingProposal.id)}
                  disabled={isProcessing}
                  className="flex items-center space-x-2 px-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition transform active:scale-95"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{isProcessing ? 'Ejecutando...' : 'Aprobar y Ejecutar Plan'}</span>
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-slate-400">
          <p>
            {hasDeficit
              ? 'Se ha detectado un déficit de caja en la proyección. Haz clic en "Activar Protocolo de Rescate" para que el agente formule la estrategia.'
              : 'El flujo de caja se encuentra saludable y la nómina está garantizada para el corte de fin de mes.'}
          </p>
        </div>
      )}
    </div>
  );
};
