import React from 'react';
import { 
  Building2, 
  MapPin, 
  CreditCard, 
  Coins, 
  Users, 
  Store, 
  Warehouse, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Zap,
  Mail,
  Clock
} from 'lucide-react';
import { 
  CompanySummary, 
  CityFinancials, 
  ProjectionData, 
  AgentProposal 
} from '../types';
import { JamarLiquidityChart } from './JamarLiquidityChart';
import { NationalComparisonBarChart } from './NationalComparisonBarChart';

interface NationalViewProps {
  summary: CompanySummary;
  cities: CityFinancials[];
  projection: ProjectionData;
  proposal: AgentProposal | null;
  onSelectCity: (city: CityFinancials) => void;
  onApproveProposal: (id: number) => void;
  onRejectProposal: (id: number, reason: string) => void;
  onPreviewEmail: (title: string, html: string) => void;
  isProcessing: boolean;
}

export const NationalView: React.FC<NationalViewProps> = ({
  summary,
  cities,
  projection,
  proposal,
  onSelectCity,
  onApproveProposal,
  onRejectProposal,
  onPreviewEmail,
  isProcessing,
}) => {
  const formatCOP = (val: number) => {
    if (Math.abs(val) >= 1000000000) {
      return `$${(val / 1000000000).toFixed(2)}B COP`;
    }
    if (Math.abs(val) >= 1000000) {
      return `$${(val / 1000000).toFixed(0)}M COP`;
    }
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. National Executive KPI Cards (White & Jamar Red Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Caja en Bancos */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Caja Consolidada (Bancos)</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 font-mono">
            {formatCOP(summary.current_balance)}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            Reserva Mínima Segura: <strong className="text-slate-700 font-mono">{formatCOP(summary.safe_threshold)}</strong>
          </div>
        </div>

        {/* Ventas Totales del Mes (Crédito vs Contado) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Ventas Consolidadas Mes</span>
            <div className="p-2 rounded-xl bg-red-50 text-red-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 font-mono">
            {formatCOP(summary.total_sales_cop)}
          </div>
          <div className="text-xs text-slate-600 mt-1 flex items-center justify-between font-bold">
            <span className="text-red-600">{summary.national_credit_ratio}% Credijamar</span>
            <span className="text-emerald-700">{summary.national_cash_ratio}% Contado</span>
          </div>
        </div>

        {/* Nómina Consolidada Nacional */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Nómina Quincenal Nacional</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 font-mono">
            {formatCOP(summary.total_payroll)}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-medium">
            1.200 trabajadores (Asesores + Planta CILA Galapa)
          </div>
        </div>

        {/* Red de Cobertura */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Red Física Nacional</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 font-mono">
            14 Sedes
          </div>
          <div className="text-xs text-slate-500 mt-1 font-medium">
            12 Showrooms + 2 CENDIS en 4 Regionales
          </div>
        </div>

      </div>

      {/* 2. Rescate de Caja (Human-in-the-Loop) Si hay Déficit */}
      {proposal && (
        <div className="bg-gradient-to-r from-red-50 via-white to-amber-50 border-2 border-red-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-red-100">
            <div className="flex items-start space-x-3.5">
              <div className="p-3 rounded-2xl bg-red-600 text-white shadow-md shadow-red-200 shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 text-[10px] font-black uppercase rounded-md bg-red-100 text-red-800">
                    Protocolo de Rescate Activo
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    Confianza del Agente: {proposal.confidence_score}%
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  {proposal.title}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 max-w-2xl font-medium">
                  {proposal.action_summary}
                </p>
              </div>
            </div>

            {/* Before / After Simulation */}
            <div className="flex items-center space-x-3 bg-white border border-red-200 p-3.5 rounded-2xl shadow-sm shrink-0">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Déficit sin Agente:</span>
                <span className="text-base font-black text-red-600 font-mono">
                  -{formatCOP(proposal.projected_deficit)}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-600 block">Saldo Protegido:</span>
                <span className="text-base font-black text-emerald-700 font-mono">
                  +{formatCOP(proposal.simulated_minimum_balance)}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-500 flex items-center gap-2 font-medium">
              <Clock className="w-4 h-4 text-red-600" />
              <span>Human-in-the-Loop: Autoriza la campaña flash y la prórroga de proveedores.</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <button
                onClick={() => onRejectProposal(proposal.id, 'Cancelado')}
                disabled={isProcessing}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all disabled:opacity-50 active:scale-95"
              >
                Rechazar
              </button>
              <button
                onClick={() => onApproveProposal(proposal.id)}
                disabled={isProcessing}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-200 transition-all flex items-center gap-1.5 disabled:opacity-50 active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Aprobar y Ejecutar Rescate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. DIAGRAMA COMPARATIVO DE REGIONALES (BAR CHART VISUAL) */}
      <NationalComparisonBarChart cities={cities} />

      {/* 4. GRID DE CIUDADES / REGIONALES (INTERACTIVO) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              <span>Regionales Jamar en Colombia (Exploración Detallada)</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Haz clic en cualquier ciudad para auditar sus ventas por categoría (Salas, Cuartos) y tiendas
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
            4 Ciudades Activas
          </span>
        </div>

        {/* 4 Regional City Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-5">
          {cities.map((city) => (
            <div
              key={city.id}
              onClick={() => onSelectCity(city)}
              className="group cursor-pointer bg-slate-50/80 hover:bg-white border border-slate-200 hover:border-red-400 rounded-3xl p-5 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold text-sm">
                      {city.name.substring(0, 3).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900 group-hover:text-red-600 transition-colors">
                        {city.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {city.stores_count} Sedes • {city.department}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {city.on_time_payment_rate}% al día
                  </span>
                </div>

                {/* Key Numbers */}
                <div className="grid grid-cols-2 gap-3 my-4">
                  <div className="bg-white p-3 rounded-2xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Ventas Mes</span>
                    <strong className="text-sm font-black text-slate-900 font-mono">
                      {formatCOP(city.monthly_sales_cop)}
                    </strong>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Nómina Ciudad</span>
                    <strong className="text-sm font-black text-slate-900 font-mono">
                      {formatCOP(city.total_payroll_cop)}
                    </strong>
                  </div>
                </div>

                {/* Crédito vs Contado Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-red-600">{city.credit_sales_percentage}% Credijamar</span>
                    <span className="text-emerald-700">{city.cash_sales_percentage}% Contado</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 flex overflow-hidden">
                    <div
                      className="bg-red-600 h-full transition-all duration-700"
                      style={{ width: `${city.credit_sales_percentage}%` }}
                    />
                    <div
                      className="bg-emerald-600 h-full transition-all duration-700"
                      style={{ width: `${city.cash_sales_percentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Link Button */}
              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-red-600 group-hover:text-red-700">
                <span>Ver Detalle de {city.name}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Curva de Liquidez Nacional a 40 Días */}
      <JamarLiquidityChart
        projection={projection}
        safeThreshold={summary.safe_threshold}
      />

    </div>
  );
};
