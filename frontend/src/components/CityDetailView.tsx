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

  const totalCityOutflows = city.total_payroll_cop + city.total_rent_cop + city.local_suppliers_cop;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* City Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBackToNational}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1.5 mb-2 transition-colors"
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
            Departamento: {city.department} • Gestión Financiera, Cartera Credijamar y Costos Operativos
          </p>
        </div>

        {/* Total Monthly Sales & Target */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-right flex flex-col justify-center">
          <div className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">
            Ventas Acumuladas Mes
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono text-red-600">
            {formatCOP(city.monthly_sales_cop)}
          </div>
          <div className="text-xs text-slate-500 font-medium mt-0.5">
            Meta Presupuestada: <span className="font-mono font-bold text-slate-700">{formatCOP(city.sales_target_cop)}</span> (
            <span className="text-emerald-700 font-bold">
              {((city.monthly_sales_cop / city.sales_target_cop) * 100).toFixed(1)}%
            </span>)
          </div>
        </div>
      </div>

      {/* 1. SECCIÓN PRINCIPAL: CRÉDITOS CREDIJAMAR VS DINERO DIRECTO (CONTADO) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-red-600" />
              <span>Composición de Ingresos: Crédito Credijamar vs Dinero Directo (Contado)</span>
            </h3>
            <p className="text-xs text-slate-500">
              En {city.name}, el {city.credit_sales_percentage}% del mobiliario se comercializa mediante financiación directa a cuotas quincenales.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-bold">
            <span className="flex items-center gap-1 text-red-600">
              <span className="w-3 h-3 rounded-full bg-red-600 inline-block" />
              {city.credit_sales_percentage}% Credijamar
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
              {city.cash_sales_percentage}% Contado Directo
            </span>
          </div>
        </div>

        {/* Visual Split Progress Bar */}
        <div className="my-5 space-y-2">
          <div className="w-full bg-slate-100 rounded-2xl h-6 p-1 flex overflow-hidden shadow-inner border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-rose-600 rounded-l-xl transition-all duration-700 flex items-center justify-center text-white text-[11px] font-black"
              style={{ width: `${city.credit_sales_percentage}%` }}
              title={`Crédito Credijamar: ${city.credit_sales_percentage}%`}
            >
              {city.credit_sales_percentage}% Crédito ({formatCOP(city.credit_sales_amount_cop)})
            </div>
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-teal-600 rounded-r-xl transition-all duration-700 flex items-center justify-center text-white text-[11px] font-black"
              style={{ width: `${city.cash_sales_percentage}%` }}
              title={`Dinero Directo / Contado: ${city.cash_sales_percentage}%`}
            >
              {city.cash_sales_percentage}% Contado ({formatCOP(city.cash_sales_amount_cop)})
            </div>
          </div>
        </div>

        {/* 3 Metric cards about Collections & Default */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
              <span>Clientes al Día en Cuotas</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700 mt-2 font-mono">
              {city.on_time_payment_rate}%
            </div>
            <p className="text-[11px] text-emerald-900/80 mt-1">
              Recaudo puntual y sin retrasos en las cuotas quincenales de esta ciudad.
            </p>
          </div>

          <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs font-bold text-amber-800">
              <span>Mora Temprana (1 a 15 días)</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-700 mt-2 font-mono">
              {city.early_arrears_rate}%{' '}
              <span className="text-sm font-semibold text-amber-900">
                ({formatCOP(city.early_arrears_amount_cop)})
              </span>
            </div>
            <p className="text-[11px] text-amber-900/80 mt-1">
              🎯 <strong>Foco del Guardián:</strong> Clientes recuperables con recordatorio o descuento en intereses.
            </p>
          </div>

          <div className="bg-rose-50/60 border border-rose-200 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs font-bold text-rose-800">
              <span>Mora Crítica (&gt; 60 días)</span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-black text-rose-700 mt-2 font-mono">
              {city.late_arrears_rate}%
            </div>
            <p className="text-[11px] text-rose-900/80 mt-1">
              En gestión de cobro prejurídico y bloqueo para nuevos créditos.
            </p>
          </div>

        </div>
      </div>

      {/* 2. OBLIGACIONES & GASTOS DE LA CIUDAD (NÓMINA, ARRIENDOS, PROVEEDORES) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Coins className="w-5 h-5 text-slate-700" />
              <span>Obligaciones y Egresos Operativos de {city.name}</span>
            </h3>
            <p className="text-xs text-slate-500">
              Compromisos fijos que la ciudad debe pagar puntualmente este mes.
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Egresos Ciudad:</span>
            <div className="text-lg font-black text-slate-900 font-mono">
              {formatCOP(totalCityOutflows)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          
          {/* Nómina de la Ciudad */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center space-x-2 text-slate-600 text-xs font-bold">
              <Users className="w-4 h-4 text-red-600" />
              <span>Nómina de Empleados</span>
            </div>
            <div className="text-xl font-black text-slate-900 mt-2 font-mono">
              {formatCOP(city.total_payroll_cop)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Sueldos fijos, prestaciones y comisiones de asesores y operarios de la ciudad.
            </p>
          </div>

          {/* Arriendos de Locales Comerciales */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center space-x-2 text-slate-600 text-xs font-bold">
              <Store className="w-4 h-4 text-amber-600" />
              <span>Cánones de Arriendo</span>
            </div>
            <div className="text-xl font-black text-slate-900 mt-2 font-mono">
              {formatCOP(city.total_rent_cop)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Locales comerciales en centros comerciales y showrooms independientes.
            </p>
          </div>

          {/* Proveedores Locales / Fábrica */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center space-x-2 text-slate-600 text-xs font-bold">
              <Warehouse className="w-4 h-4 text-blue-600" />
              <span>Proveedores Locales</span>
            </div>
            <div className="text-xl font-black text-slate-900 mt-2 font-mono">
              {formatCOP(city.local_suppliers_cop)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {city.id === 'barranquilla' 
                ? 'Maderas del Darién ($240M) y Espumas ($180M) para fábrica Galapa.' 
                : 'Logística de flota, fletes de despacho y cuadrillas de armado.'}
            </p>
          </div>

        </div>
      </div>

      {/* 3. VENTAS POR CATEGORÍA DE PRODUCTO */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="pb-4 border-b border-slate-100">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-red-600" />
            <span>Ventas por Categoría de Producto en {city.name}</span>
          </h3>
          <p className="text-xs text-slate-500">
            Desglose de qué muebles prefieren las familias de esta región (Salas, Cuartos, Comedores y Estudio).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {city.categories_sales.map((cat, idx) => (
            <div
              key={idx}
              className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl p-4 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-black text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                  {cat.percentage}% del total
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-2">
                {cat.category}
              </h4>
              <div className="text-lg font-black text-slate-900 font-mono mt-1">
                {formatCOP(cat.amount_cop)}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">
                {cat.units_sold} unidades facturadas
              </div>

              {/* Mini progress bar */}
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-3 overflow-hidden">
                <div
                  className="h-full bg-red-600 rounded-full"
                  style={{ width: `${cat.percentage * 2}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. LISTADO DETALLADO DE SEDES DE ESTA CIUDAD */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-red-600" />
              <span>Sedes y Tiendas Físicas en {city.name}</span>
            </h3>
            <p className="text-xs text-slate-500">
              Desglose individual por tienda con su porcentaje de venta a crédito, ventas reales y costo de arriendo.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {cityStores.length} Puntos Operativos
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
                className="bg-slate-50 hover:bg-white border border-slate-200 hover:border-red-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 text-[10px] font-black rounded-md font-mono bg-slate-800 text-white">
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

                  <h4 className="text-base font-bold text-slate-900">
                    {store.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {store.address}
                  </p>

                  {/* Ventas y Mix Crédito vs Contado por Sede */}
                  {!isCendis ? (
                    <div className="mt-4 p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-semibold">Ventas del Mes:</span>
                        <span className="font-mono font-bold text-slate-900">
                          {formatCOP(store.actual_sales_cop)}{' '}
                          <span className="text-slate-400 text-[10px]">
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
                    <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                      <strong>Centro Estratégico de Abastecimiento:</strong> Fabricación y ensamble de salas y comedores para toda la región.
                    </div>
                  )}
                </div>

                {/* Footer specs */}
                <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      {isCendis ? 'Operarios' : 'Asesores'}
                    </span>
                    <strong className="text-slate-800">{store.active_advisors_count}</strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Recaudo Cuotas
                    </span>
                    <strong className="text-emerald-700 font-mono">
                      {(store.credijamar_collection_rate * 100).toFixed(1)}%
                    </strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
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
