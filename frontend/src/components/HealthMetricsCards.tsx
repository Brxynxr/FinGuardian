import React from 'react';
import { Wallet, AlertTriangle, TrendingDown, Users, CheckCircle2 } from 'lucide-react';
import { CompanySummary } from '../types';

interface Props {
  summary: CompanySummary;
}

export const HealthMetricsCards: React.FC<Props> = ({ summary }) => {
  const isHealthy = !summary.has_deficit && summary.minimum_balance >= summary.safe_threshold;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Cash Balance */}
      <div className="bg-slate-800/60 backdrop-blur border border-slate-700/60 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Saldo Disponible</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold text-white">
            ${summary.current_balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            <span className="text-xs text-slate-400 ml-1 font-normal">USD</span>
          </div>
          <div className="flex items-center space-x-1.5 mt-1 text-xs text-slate-400">
            <span>Umbral de reserva:</span>
            <span className="text-slate-300 font-semibold">${summary.safe_threshold.toLocaleString()} USD</span>
          </div>
        </div>
      </div>

      {/* 2. Liquidity Status & Deficit Risk */}
      <div className={`backdrop-blur border rounded-xl p-5 shadow-sm ${
        summary.has_deficit
          ? 'bg-rose-950/20 border-rose-500/30'
          : 'bg-emerald-950/20 border-emerald-500/30'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Estado de Liquidez</span>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            summary.has_deficit ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
          }`}>
            {summary.has_deficit ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          </div>
        </div>
        <div className="mt-3">
          <div className={`text-2xl font-bold ${summary.has_deficit ? 'text-rose-400' : 'text-emerald-400'}`}>
            {summary.has_deficit
              ? `-$${summary.worst_deficit.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD`
              : '🟢 Protegido'}
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {summary.has_deficit
              ? `Quiebra técnica en ${summary.days_until_deficit || 11} días`
              : `Saldo mínimo: +$${summary.minimum_balance.toLocaleString()} USD`}
          </p>
        </div>
      </div>

      {/* 3. Runway & Health Score */}
      <div className="bg-slate-800/60 backdrop-blur border border-slate-700/60 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Runway & Salud</span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold text-white">
            {summary.runway_days} <span className="text-sm font-normal text-slate-400">días</span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <div className="flex-1 bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  summary.health_score > 70 ? 'bg-emerald-500' : summary.health_score > 40 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${summary.health_score}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-300">{summary.health_score}/100</span>
          </div>
        </div>
      </div>

      {/* 4. Total Monthly Payroll */}
      <div className="bg-slate-800/60 backdrop-blur border border-slate-700/60 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Nómina Mensual (Devs)</span>
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold text-white">
            ${summary.total_payroll.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            <span className="text-xs text-slate-400 ml-1 font-normal">USD</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">5 ingenieros • Próximo corte: día 30</p>
        </div>
      </div>
    </div>
  );
};
