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
  Clock, 
  ArrowLeft,
  DollarSign,
  PieChart
} from 'lucide-react';
import { CityFinancials, StoreLocation } from '../types';
import { CityCategoryPieChart } from './CityCategoryPieChart';
import { CityCreditVsCashChart } from './CityCreditVsCashChart';

interface CityDetailViewProps {
  city: CityFinancials;
  stores: StoreLocation[];
  onBackToNational: () => void;
}

export const CityDetailView: React.FC<CityDetailViewProps> = ({
  city,
  stores,
  onBackToNational,
}) => {
  const cityStores = stores.filter((s) => s.city_id === city.id);

  const formatCOP = (val: number) => {
    if (Math.abs(val) >= 1000000000) {
      return `$${(val / 1000000000).toFixed(2)}B`;
    }
    if (Math.abs(val) >= 1000000) {
      return `$${(val / 1000000).toFixed(0)}M`;
    }
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalCityOutflows = city.total_payroll_cop + city.total_rent_cop + city.local_suppliers_cop;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. City Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBackToNational}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1.5 mb-2 transition-colors active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la Vista Consolidada Nacional</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {city.name}
            </h2>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
              {city.stores_count} Sedes Activas
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            Departamento: {city.department} • Cartera Credijamar: {city.active_clients_count.toLocaleString('es-CO')} Familias Financiadas
          </p>
        </div>

        {/* Total Monthly Sales & Target */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 text-right flex flex-col justify-center">
          <div className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">
            Ventas Acumuladas Mes
          </div>
          <div className="text-2xl font-black text-red-600 font-mono">
            {formatCOP(city.monthly_sales_cop)}
          </div>
          <div className="text-xs text-slate-600 font-medium mt-0.5">
            Meta: <span className="font-mono font-bold text-slate-800">{formatCOP(city.sales_target_cop)}</span> (
            <span className="text-emerald-700 font-bold">
              {((city.monthly_sales_cop / city.sales_target_cop) * 100).toFixed(1)}%
            </span>)
          </div>
        </div>
      </div>

      {/* 2. Visual Charts Row: Credit vs Cash Bar Chart + Donut Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Diagram 1: Credit vs Cash Breakdown & Collection Quality */}
        <CityCreditVsCashChart
          creditPercentage={city.credit_sales_percentage}
          cashPercentage={city.cash_sales_percentage}
          creditAmount={city.credit_sales_amount_cop}
          cashAmount={city.cash_sales_amount_cop}
          onTimeRate={city.on_time_payment_rate}
          earlyArrearsRate={city.early_arrears_rate}
          lateArrearsRate={city.late_arrears_rate}
          earlyArrearsAmount={city.early_arrears_amount_cop}
        />

        {/* Diagram 2: Category Sales Donut Chart */}
        <CityCategoryPieChart
          categories={city.categories_sales}
          totalSales={city.monthly_sales_cop}
        />

      </div>

      {/* 3. City Obligations Overview Cards (Payroll, Rent, Local Suppliers) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Nómina de Empleados</span>
            <div className="p-2 rounded-xl bg-red-50 text-red-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 mt-2 font-mono">
            {formatCOP(city.total_payroll_cop)}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-medium">
            Asesores comerciales y operarios locales
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Cánones de Arriendo</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 mt-2 font-mono">
            {formatCOP(city.total_rent_cop)}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-medium">
            Locales comerciales y showrooms
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Proveedores Locales</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <Warehouse className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 mt-2 font-mono">
            {formatCOP(city.local_suppliers_cop)}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-medium">
            {city.id === 'barranquilla' ? 'Maderas y espumas fábrica Galapa' : 'Fletes logísticos y cuadrillas'}
          </div>
        </div>

      </div>

      {/* 4. List of Physical Stores in this City */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-red-600" />
              <span>Sedes y Tiendas Físicas en {city.name}</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Ventas mes, mix crédito vs contado y costo de arriendo por tienda
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {cityStores.length} Tiendas Operativas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          {cityStores.map((store) => {
            const isCendis = store.type === 'CENDIS_FABRICA';
            const salesProgress = store.monthly_sales_target_cop > 0 
              ? Math.round((store.actual_sales_cop / store.monthly_sales_target_cop) * 100) 
              : 0;

            return (
              <div
                key={store.id}
                className="bg-slate-50/80 hover:bg-white border border-slate-200 hover:border-red-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 text-[10px] font-black rounded-md font-mono bg-slate-900 text-white">
                        {store.code}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase border ${
                          isCendis
                            ? 'bg-amber-100 text-amber-800 border-amber-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {isCendis ? 'CENDIS & Fábrica' : 'Showroom'}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-slate-600">
                      {store.area_sqm.toLocaleString('es-CO')} m²
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">
                    {store.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {store.address}
                  </p>

                  {/* Ventas y Mix Crédito vs Contado por Sede */}
                  {!isCendis ? (
                    <div className="mt-3.5 p-3 rounded-xl bg-white border border-slate-200/90 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-semibold">Ventas Mes:</span>
                        <span className="font-mono font-bold text-slate-900">
                          {formatCOP(store.actual_sales_cop)}{' '}
                          <span className="text-slate-400 text-[10px] font-normal">
                            / {formatCOP(store.monthly_sales_target_cop)} ({salesProgress}%)
                          </span>
                        </span>
                      </div>

                      {/* Bar Crédito vs Contado de la Sede */}
                      <div className="pt-2 border-t border-slate-100">
                        <div className="flex justify-between text-[11px] font-bold mb-1">
                          <span className="text-red-600">{store.credit_percentage}% Crédito ({formatCOP(store.monthly_credit_revenue_cop)})</span>
                          <span className="text-emerald-700">{store.cash_percentage}% Contado ({formatCOP(store.monthly_cash_revenue_cop)})</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 flex overflow-hidden">
                          <div 
                            className="bg-red-600 h-full"
                            style={{ width: `${store.credit_percentage}%` }}
                          />
                          <div 
                            className="bg-emerald-600 h-full"
                            style={{ width: `${store.cash_percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
                      <strong>Centro Logístico & Manufactura:</strong> Fabricación y ensamble de muebles para toda la regional.
                    </div>
                  )}
                </div>

                {/* Footer specs */}
                <div className="mt-3.5 pt-3 border-t border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      {isCendis ? 'Operarios' : 'Asesores'}
                    </span>
                    <strong className="text-slate-800">{store.active_advisors_count}</strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Recaudo Cuotas
                    </span>
                    <strong className="text-emerald-700 font-mono">
                      {(store.credijamar_collection_rate * 100).toFixed(1)}%
                    </strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Arriendo Local
                    </span>
                    <strong className="text-slate-800 font-mono">
                      {formatCOP(store.monthly_rent_cop)}
                    </strong>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
