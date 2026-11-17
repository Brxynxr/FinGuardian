import React from 'react';
import { ShieldCheck, Cpu, RefreshCw, MessageSquare, UploadCloud } from 'lucide-react';

interface Props {
  companyName: string;
  onOpenChat: () => void;
  onOpenUpload: () => void;
  onResetDemo: () => void;
  isResetting: boolean;
}

export const FinancialHeader: React.FC<Props> = ({
  companyName,
  onOpenChat,
  onOpenUpload,
  onResetDemo,
  isResetting,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand & Company */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                FinGuardian AI
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                CFO v2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">{companyName} • Operación Tecnológica 360°</p>
          </div>
        </div>

        {/* AI Engine & Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Groq Active Badge */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
            <Cpu className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="text-slate-300 font-medium">Groq 120B Dual-Key</span>
            <span className="text-emerald-400 font-semibold">• Activo</span>
          </div>

          {/* Snowflake Badge */}
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sky-950/40 border border-sky-800/50 text-xs text-sky-300">
            <span>❄️ Snowflake DW</span>
          </div>

          {/* Ingest Button */}
          <button
            onClick={onOpenUpload}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition"
          >
            <UploadCloud className="w-4 h-4 text-emerald-400" />
            <span>Cargar Facturas</span>
          </button>

          {/* CFO Chat Button */}
          <button
            onClick={onOpenChat}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-600/25 transition transform active:scale-95"
          >
            <MessageSquare className="w-4 h-4 fill-slate-950" />
            <span>Consultar al CFO</span>
          </button>

          {/* Reset Demo Button */}
          <button
            onClick={onResetDemo}
            disabled={isResetting}
            title="Restablece la empresa a su estado inicial de déficit para demostración"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition"
          >
            <RefreshCw className={`w-4 h-4 ${isResetting ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
