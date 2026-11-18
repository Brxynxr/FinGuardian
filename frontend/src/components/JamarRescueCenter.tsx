import React from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  ArrowRight, 
  Clock, 
  FileText, 
  Sparkles, 
  Mail, 
  Users 
} from 'lucide-react';
import { AgentProposal } from '../types';

interface JamarRescueCenterProps {
  proposal: AgentProposal | null;
  onApprove: (id: number) => void;
  onReject: (id: number, reason: string) => void;
  onPreviewEmail: (title: string, html: string) => void;
  isProcessing: boolean;
}

export const JamarRescueCenter: React.FC<JamarRescueCenterProps> = ({
  proposal,
  onApprove,
  onReject,
  onPreviewEmail,
  isProcessing,
}) => {
  if (!proposal) {
    return (
      <div className="bg-obsidian-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-white">
          Posición de Caja Protegida y Estable
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          El motor determinista de FinGuardian no detecta riesgos de déficit para la próxima quincena. El recaudo de Credijamar y los pagos a planta están en equilibrio.
        </p>
      </div>
    );
  }

  const formatCOP = (val: number) => {
    return `$${(val / 1000000).toFixed(0)}M COP`;
  };

  return (
    <div className="bg-gradient-to-br from-obsidian-900 via-obsidian-900/90 to-red-950/20 border-2 border-jamar-crimson/50 rounded-2xl p-5 shadow-jamar-glow-lg backdrop-blur-xl relative overflow-hidden">
      
      {/* Red accent indicator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-jamar-crimson via-red-500 to-credijamar-amber" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-xl bg-jamar-crimson text-white shadow-jamar-glow shrink-0 animate-jamar-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-md bg-rose-950 text-rose-300 border border-rose-800">
                Protocolo de Rescate Activo
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ID #{proposal.id} • Confianza: {proposal.confidence_score}%
              </span>
            </div>
            <h2 className="text-lg font-black text-white tracking-tight mt-1">
              {proposal.title}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
              {proposal.action_summary}
            </p>
          </div>
        </div>

        {/* Before / After Simulation Card */}
        <div className="flex items-center space-x-3 bg-slate-950/80 border border-slate-800 p-3 rounded-xl shadow-inner shrink-0">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">
              Déficit sin Agente
            </div>
            <div className="text-base font-black text-rose-400 font-mono">
              -{formatCOP(proposal.projected_deficit)}
            </div>
          </div>

          <ArrowRight className="w-5 h-5 text-credijamar-amber" />

          <div>
            <div className="text-[10px] text-emerald-400 uppercase font-semibold">
              Saldo Protegido
            </div>
            <div className="text-base font-black text-emerald-400 font-mono">
              +{formatCOP(proposal.simulated_minimum_balance)}
            </div>
          </div>
        </div>
      </div>

      {/* Actions Breakdown */}
      <div className="py-4 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-credijamar-amber" />
          Acciones de Contingencia Formuladas por el Guardián:
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {proposal.actions_payload.map((act, idx) => (
            <div
              key={idx}
              className="bg-slate-950/60 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Acción {idx + 1}: {act.type.replace(/_/g, ' ')}
                  </span>
                  {act.html_email_preview && (
                    <button
                      onClick={() =>
                        onPreviewEmail(
                          `Vista Previa Oficial: ${act.vendor_name || 'Campaña Credijamar'}`,
                          act.html_email_preview || ''
                        )
                      }
                      className="text-[11px] text-credijamar-amber hover:text-amber-300 font-semibold flex items-center gap-1"
                    >
                      <Mail className="w-3 h-3" />
                      Ver Notificación HTML
                    </button>
                  )}
                </div>

                <h5 className="text-xs font-bold text-white mb-1">
                  {act.description || act.vendor_name}
                </h5>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {act.reason}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                {act.target_clients_count && (
                  <span className="text-slate-300 flex items-center gap-1 text-[11px]">
                    <Users className="w-3 h-3 text-credijamar-amber" />
                    <strong>{act.target_clients_count.toLocaleString('es-CO')}</strong> familias
                  </span>
                )}
                {act.estimated_recovery_cop && (
                  <span className="font-mono font-bold text-emerald-400">
                    +{formatCOP(act.estimated_recovery_cop)}
                  </span>
                )}
                {act.days_delayed && (
                  <span className="font-semibold text-credijamar-amber text-[11px]">
                    Prórroga: +{act.days_delayed} días
                  </span>
                )}
                {act.amount && (
                  <span className="font-mono font-bold text-white">
                    {formatCOP(act.amount)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Human-in-the-Loop Approval Bar */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <Clock className="w-4 h-4 text-jamar-red" />
          <span>
            Supervisión <strong>Human-in-the-Loop</strong>: Ningún mensaje sale ni pago se pospone sin autorización explícita.
          </span>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => onReject(proposal.id, 'Cancelado por el Administrador')}
            disabled={isProcessing}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
          >
            Rechazar
          </button>

          <button
            onClick={() => onApprove(proposal.id)}
            disabled={isProcessing}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-jamar-crimson via-red-600 to-jamar-dark hover:from-red-600 hover:to-rose-700 text-white text-xs font-bold shadow-jamar-glow transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Aprobar y Ejecutar Rescate</span>
          </button>
        </div>
      </div>

    </div>
  );
};
