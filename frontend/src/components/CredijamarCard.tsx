import React from 'react';
import { 
  CreditCard, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  Zap, 
  ShieldCheck, 
  ArrowUpRight 
} from 'lucide-react';
import { CredijamarPortfolio } from '../types';

interface CredijamarCardProps {
  portfolio: CredijamarPortfolio;
  onTargetEarlyArrears?: () => void;
}

export const CredijamarCard: React.FC<CredijamarCardProps> = ({ 
  portfolio, 
  onTargetEarlyArrears 
}) => {
  const formatCOP = (val: number) => {
    return `$${(val / 1000000).toFixed(0)}M COP`;
  };

  const onTimePercent = (portfolio.on_time_loans_cop / portfolio.total_active_loans_cop) * 100;
  const earlyPercent = (portfolio.early_arrears_cop / portfolio.total_active_loans_cop) * 100;
  const midPercent = (portfolio.mid_arrears_cop / portfolio.total_active_loans_cop) * 100;
  const latePercent = (portfolio.late_arrears_cop / portfolio.total_active_loans_cop) * 100;

  return (
    <div className="bg-obsidian-900/80 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      
      {/* Decorative gradient glow in the corner */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-credijamar-amber/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-credijamar-amber/20 to-amber-600/10 text-credijamar-amber border border-credijamar-amber/30">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                Cartera de Financiación Credijamar
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-emerald-950/50 text-emerald-300 border border-emerald-800/50">
                {(portfolio.on_time_rate * 100).toFixed(1)}% al día
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Créditos directos a familias para compra de salas, alcobas y comedores a plazos.
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">
            Cartera Total Vigente
          </div>
          <div className="text-xl font-black text-white font-mono text-credijamar-amber">
            {formatCOP(portfolio.total_active_loans_cop)}
          </div>
        </div>
      </div>

      {/* Multi-Segment Distribution Bar */}
      <div className="py-4 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400 font-medium">Distribución de Estados de Pago:</span>
          <span className="text-slate-400 text-[11px]">Meta de Cobro: 92.0%</span>
        </div>

        <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden flex p-0.5 border border-slate-800">
          {/* Al día */}
          <div
            className="h-full bg-emerald-500 rounded-l-full transition-all duration-500"
            style={{ width: `${onTimePercent}%` }}
            title={`Al día: ${onTimePercent.toFixed(1)}%`}
          />
          {/* Mora 1 a 15 */}
          <div
            className="h-full bg-amber-500 transition-all duration-500"
            style={{ width: `${earlyPercent}%` }}
            title={`Mora Temprana (1-15d): ${earlyPercent.toFixed(1)}%`}
          />
          {/* Mora 16 a 60 */}
          <div
            className="h-full bg-orange-600 transition-all duration-500"
            style={{ width: `${midPercent}%` }}
            title={`Mora Media (16-60d): ${midPercent.toFixed(1)}%`}
          />
          {/* Mora > 60 */}
          <div
            className="h-full bg-rose-600 rounded-r-full transition-all duration-500"
            style={{ width: `${latePercent}%` }}
            title={`Mora Tardía (>60d): ${latePercent.toFixed(1)}%`}
          />
        </div>
      </div>

      {/* 4 Cards breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        
        {/* 1. Al día */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Cuotas al Día
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-base font-black text-white font-mono">
              {formatCOP(portfolio.on_time_loans_cop)}
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
              {onTimePercent.toFixed(1)}% de la cartera
            </div>
          </div>
        </div>

        {/* 2. Mora Temprana (Target del Guardián) */}
        <div className="bg-gradient-to-br from-amber-950/20 to-slate-950/60 border border-amber-600/40 rounded-xl p-3 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-amber-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              Mora 1-15 días
            </span>
            <Zap className="w-3.5 h-3.5 text-credijamar-amber" />
          </div>
          <div className="mt-2">
            <div className="text-base font-black text-amber-200 font-mono">
              {formatCOP(portfolio.early_arrears_cop)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              <strong className="text-white">{portfolio.early_arrears_clients_count.toLocaleString('es-CO')}</strong> familias
            </div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-amber-800/40 text-[10px] text-amber-300/90 font-medium">
            🎯 Objetivo Rescate de Caja
          </div>
        </div>

        {/* 3. Mora Media (16-60d) */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              Mora 16-60 días
            </span>
            <Clock className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div className="mt-2">
            <div className="text-base font-black text-white font-mono">
              {formatCOP(portfolio.mid_arrears_cop)}
            </div>
            <div className="text-[10px] text-orange-400 font-semibold mt-0.5">
              {midPercent.toFixed(1)}% en gestión
            </div>
          </div>
        </div>

        {/* 4. Mora Castigada (>60d) */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Mora &gt;60 días
            </span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="mt-2">
            <div className="text-base font-black text-white font-mono">
              {formatCOP(portfolio.late_arrears_cop)}
            </div>
            <div className="text-[10px] text-rose-400 font-semibold mt-0.5">
              {latePercent.toFixed(1)}% cobro pre-jurídico
            </div>
          </div>
        </div>

      </div>

      {/* Banner de Oportunidad de Inyección */}
      <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-credijamar-amber/10 via-amber-950/20 to-jamar-crimson/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-credijamar-amber text-black font-black">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">
              Potencial de Inyección en 72h con Campaña Flash:
            </div>
            <p className="text-[11px] text-slate-400">
              Condonar intereses de mora a los 2.450 clientes recaudaría{' '}
              <strong className="text-credijamar-amber font-mono">
                {formatCOP(portfolio.potential_rescue_injection_cop)}
              </strong>{' '}
              de liquidez inmediata.
            </p>
          </div>
        </div>

        {onTargetEarlyArrears && (
          <button
            onClick={onTargetEarlyArrears}
            className="px-3 py-1.5 rounded-lg bg-credijamar-amber hover:bg-amber-400 text-black text-xs font-black transition-all shadow-credijamar-glow shrink-0 flex items-center gap-1"
          >
            <span>Ver Simulación</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

    </div>
  );
};
