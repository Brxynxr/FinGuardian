import React from 'react';
import { 
  Building2, 
  Wallet, 
  MessageSquareText, 
  ShieldAlert, 
  Sparkles, 
  Store, 
  Warehouse,
  Coins
} from 'lucide-react';
import { CompanySummary } from '../types';

interface JamarHeaderProps {
  summary: CompanySummary;
  onOpenChat: () => void;
  onTriggerAnalysis: () => void;
  isProcessing: boolean;
}

export const JamarHeader: React.FC<JamarHeaderProps> = ({
  summary,
  onOpenChat,
  onTriggerAnalysis,
  isProcessing,
}) => {
  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <header className="relative bg-gradient-to-r from-obsidian-950 via-obsidian-900 to-obsidian-950 border-b border-slate-800/80 shadow-2xl backdrop-blur-xl sticky top-0 z-40">
      {/* Red accent line at the top */}
      <div className="h-1 w-full bg-gradient-to-r from-jamar-crimson via-red-500 to-credijamar-amber" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Company Identity */}
          <div className="flex items-center space-x-3.5">
            <div className="relative group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-jamar-crimson via-red-600 to-jamar-dark flex items-center justify-center shadow-jamar-glow transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-black text-2xl tracking-tighter drop-shadow-md">
                  J
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-credijamar-amber rounded-full border-2 border-obsidian-900 flex items-center justify-center" title="Credijamar Activo">
                <span className="text-[9px] font-black text-black">C</span>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>MUEBLES</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-jamar-red to-rose-400">JAMAR</span>
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-credijamar-amber/15 text-credijamar-amber border border-credijamar-amber/30">
                  Credijamar S.A.
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span className="italic font-medium">"Hacer familias felices"</span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-slate-300 font-mono text-[11px]">
                  <Store className="w-3 h-3 text-jamar-red" />
                  {summary.active_stores_count} Sedes Showroom
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-slate-300 font-mono text-[11px]">
                  <Warehouse className="w-3 h-3 text-credijamar-amber" />
                  {summary.cendis_count} CENDIS
                </span>
              </p>
            </div>
          </div>

          {/* Real-Time Treasury & Actions */}
          <div className="flex items-center flex-wrap gap-3">
            
            {/* Saldo Consolidado */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2 flex items-center space-x-3 shadow-inner">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                  Caja Consolidada (Bancos)
                </div>
                <div className="text-base sm:text-lg font-bold text-white font-mono tracking-tight">
                  {formatCOP(summary.current_balance)}
                </div>
              </div>
            </div>

            {/* Health Badge */}
            <div className={`px-3 py-2 rounded-xl border flex items-center space-x-2 text-xs font-semibold ${
              summary.has_deficit
                ? 'bg-rose-950/40 border-rose-800/80 text-rose-300'
                : 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
            }`}>
              <ShieldAlert className="w-4 h-4 text-jamar-red animate-pulse" />
              <div>
                <span className="block text-[10px] opacity-75 uppercase">Salud de Caja</span>
                <span>{summary.has_deficit ? 'Alerta Quincenal' : 'Óptima'} ({summary.health_score}/100)</span>
              </div>
            </div>

            {/* CFO Copilot Button */}
            <button
              onClick={onOpenChat}
              className="relative group bg-gradient-to-r from-jamar-crimson via-red-600 to-jamar-dark hover:from-red-600 hover:to-rose-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-jamar-glow transition-all duration-200 flex items-center space-x-2 border border-red-500/30 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-credijamar-amber animate-spin" style={{ animationDuration: '6s' }} />
              <span>Consultar al CFO</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
