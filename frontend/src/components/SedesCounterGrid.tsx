import React, { useState, useMemo } from 'react';
import { 
  Store, 
  Warehouse, 
  MapPin, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Percent, 
  Search, 
  CheckCircle2, 
  Building 
} from 'lucide-react';
import { StoreLocation } from '../types';

interface SedesCounterGridProps {
  stores: StoreLocation[];
}

export const SedesCounterGrid: React.FC<SedesCounterGridProps> = ({ stores }) => {
  const [selectedCity, setSelectedCity] = useState<string>('TODAS');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Conteo dinámico de sedes por ciudad
  const cityCounts = useMemo(() => {
    const counts: Record<string, number> = {
      TODAS: stores.length,
      Barranquilla: 0,
      Bogotá: 0,
      Medellín: 0,
      Regionales: 0,
    };
    stores.forEach((s) => {
      if (counts[s.city] !== undefined) {
        counts[s.city]++;
      }
    });
    return counts;
  }, [stores]);

  // Filtrado reactivo
  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const matchesCity = selectedCity === 'TODAS' || store.city === selectedCity;
      const matchesSearch =
        searchQuery === '' ||
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCity && matchesSearch;
    });
  }, [stores, selectedCity, searchQuery]);

  const formatCOP = (val: number) => {
    if (val >= 1000000) {
      return `$${(val / 1000000).toFixed(0)}M COP`;
    }
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-obsidian-900/80 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
      
      {/* Header & City Counter Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-jamar-crimson/15 text-jamar-red border border-jamar-crimson/30">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                Red Nacional de Sedes Jamar
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {stores.length} Centros Activos
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Supervisión de ventas, costos de arriendo y efectividad de recaudo Credijamar por tienda.
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por sede, ciudad o código..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-jamar-red/60 focus:ring-1 focus:ring-jamar-red/60 transition-all"
          />
        </div>
      </div>

      {/* City Filter Pills with Exact Counters */}
      <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none">
        {[
          { key: 'TODAS', label: 'Todas las Sedes', count: cityCounts.TODAS },
          { key: 'Barranquilla', label: 'Barranquilla & Atlántico', count: cityCounts.Barranquilla },
          { key: 'Bogotá', label: 'Bogotá & Sabana', count: cityCounts.Bogotá },
          { key: 'Medellín', label: 'Medellín & Antioquia', count: cityCounts.Medellín },
          { key: 'Regionales', label: 'Costa & Oriente', count: cityCounts.Regionales },
        ].map((tab) => {
          const isSelected = selectedCity === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setSelectedCity(tab.key)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap border ${
                isSelected
                  ? 'bg-gradient-to-r from-jamar-crimson to-red-600 text-white border-red-500 shadow-jamar-glow'
                  : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                  isSelected
                    ? 'bg-black/30 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid of Stores */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pt-2">
        {filteredStores.map((store) => {
          const isCendis = store.type === 'CENDIS_FABRICA';
          const salesRatio = store.monthly_sales_target_cop > 0 
            ? Math.round((store.actual_sales_cop / store.monthly_sales_target_cop) * 100) 
            : 0;
          const isTargetMet = salesRatio >= 100;

          return (
            <div
              key={store.id}
              className={`group relative rounded-2xl p-4 transition-all duration-300 border backdrop-blur-md flex flex-col justify-between ${
                isCendis
                  ? 'bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-obsidian-950/90 border-credijamar-amber/30 hover:border-credijamar-amber/60 hover:shadow-credijamar-glow'
                  : 'bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-obsidian-950/90 border-slate-800 hover:border-jamar-red/50 hover:shadow-jamar-glow'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 text-[10px] font-black rounded-md font-mono bg-slate-800 text-slate-300 border border-slate-700">
                      {store.code}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase border ${
                        isCendis
                          ? 'bg-amber-950/40 text-credijamar-amber border-amber-800/40'
                          : 'bg-red-950/40 text-rose-300 border-red-800/40'
                      }`}
                    >
                      {isCendis ? 'CENDIS & Fábrica' : 'Showroom'}
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                    <Building className="w-3 h-3 text-slate-500" />
                    {store.area_sqm.toLocaleString('es-CO')} m²
                  </span>
                </div>

                {/* Name & Address */}
                <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1">
                  {store.name}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 line-clamp-1">
                  <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                  {store.address} ({store.city})
                </p>

                {/* Main Metrics (Sales & Target or Production) */}
                {!isCendis ? (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Ventas Mes / Meta:</span>
                      <span className="font-mono font-bold text-white">
                        {formatCOP(store.actual_sales_cop)}{' '}
                        <span className="text-[10px] text-slate-400">
                          / {formatCOP(store.monthly_sales_target_cop)}
                        </span>
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isTargetMet
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            : 'bg-gradient-to-r from-jamar-red to-credijamar-amber'
                        }`}
                        style={{ width: `${Math.min(salesRatio, 100)}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="text-[11px] text-credijamar-amber font-semibold flex items-center gap-1.5">
                      <Warehouse className="w-3.5 h-3.5" />
                      Centro de Ensamble y Distribución Masiva
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Abastece la red con maderas certificadas, tapicería y colchones.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer details */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs">
                
                {/* Asesores / Operarios */}
                <div className="bg-slate-950/50 rounded-lg p-1.5 border border-slate-800/50">
                  <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                    <Users className="w-3 h-3 text-slate-500" />
                    {isCendis ? 'Operarios' : 'Asesores'}
                  </div>
                  <div className="font-bold text-white text-xs mt-0.5">
                    {store.active_advisors_count}
                  </div>
                </div>

                {/* Recaudo Credijamar */}
                <div className="bg-slate-950/50 rounded-lg p-1.5 border border-slate-800/50">
                  <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                    <Percent className="w-3 h-3 text-credijamar-amber" />
                    Recaudo
                  </div>
                  <div className={`font-bold text-xs mt-0.5 ${
                    store.credijamar_collection_rate >= 0.90
                      ? 'text-emerald-400'
                      : store.credijamar_collection_rate >= 0.87
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}>
                    {(store.credijamar_collection_rate * 100).toFixed(1)}%
                  </div>
                </div>

                {/* Arriendo */}
                <div className="bg-slate-950/50 rounded-lg p-1.5 border border-slate-800/50">
                  <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                    <DollarSign className="w-3 h-3 text-slate-500" />
                    Arriendo
                  </div>
                  <div className="font-bold text-white text-xs mt-0.5 font-mono">
                    {formatCOP(store.monthly_rent_cop)}
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
