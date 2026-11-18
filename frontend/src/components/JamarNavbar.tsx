import React from 'react';
import { 
  Building2, 
  Wallet, 
  MessageSquareText, 
  Sparkles, 
  ChevronRight, 
  ArrowLeft, 
  Store, 
  Warehouse, 
  CreditCard, 
  ShieldCheck, 
  Coins 
} from 'lucide-react';
import { CompanySummary, CityFinancials } from '../types';

interface JamarNavbarProps {
  summary: CompanySummary;
  selectedCity: CityFinancials | null;
  onSelectCity: (city: CityFinancials | null) => void;
  onOpenChat: () => void;
}

export const JamarNavbar: React.FC<JamarNavbarProps> = ({
  summary,
  selectedCity,
  onSelectCity,
  onOpenChat,
}) => {
  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-sm backdrop-blur-md">
      {/* Top Jamar Red Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-jamar-crimson to-red-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Breadcrumb Navigation */}
          <div className="flex items-center space-x-3.5">
            <div 
              onClick={() => onSelectCity(null)}
              className="cursor-pointer flex items-center space-x-3 group"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-600 to-jamar-dark flex items-center justify-center shadow-md shadow-red-200 transition-transform group-hover:scale-105">
                <span className="text-white font-black text-2xl tracking-tighter">J</span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                    <span>MUEBLES</span>
                    <span className="text-red-600 font-black">JAMAR</span>
                  </h1>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                    Credijamar S.A.
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Panel Financiero y Control de Cartera
                </p>
              </div>
            </div>

            {/* Breadcrumb if a City is selected */}
            {selectedCity && (
              <div className="flex items-center space-x-2 pl-3 border-l border-slate-200">
                <button
                  onClick={() => onSelectCity(null)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
                  <span>Nacional</span>
                </button>
                <ChevronRight className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-black text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
                  {selectedCity.name}
                </span>
              </div>
            )}
          </div>

          {/* Quick Financial Indicators & Actions */}
          <div className="flex items-center flex-wrap gap-2.5">
            
            {/* Saldo en Bancos */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-1.5 flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 font-bold">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase text-slate-500 tracking-wider">
                  Caja Bancos
                </div>
                <div className="text-sm font-bold text-slate-900 font-mono">
                  {formatCOP(summary.current_balance)}
                </div>
              </div>
            </div>

            {/* Split Crédito vs Contado Nacional */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-1.5 hidden sm:flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-red-100 text-red-700 font-bold">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase text-slate-500 tracking-wider">
                  Mix Ventas Nacional
                </div>
                <div className="text-xs font-bold text-slate-900">
                  <span className="text-red-600">{summary.national_credit_ratio}% Crédito</span>
                  <span className="text-slate-400 mx-1">/</span>
                  <span className="text-emerald-700">{summary.national_cash_ratio}% Contado</span>
                </div>
              </div>
            </div>

            {/* Copilot CFO Button */}
            <button
              onClick={onOpenChat}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-red-200 transition-all flex items-center space-x-1.5 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Copiloto CFO Jamar</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
