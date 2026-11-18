import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { CityFinancials } from '../types';
import { BarChart3 } from 'lucide-react';

interface NationalComparisonBarChartProps {
  cities: CityFinancials[];
}

export const NationalComparisonBarChart: React.FC<NationalComparisonBarChartProps> = ({ cities }) => {
  const formatCOP = (val: number) => {
    if (Math.abs(val) >= 1000000000) {
      return `$${(val / 1000000000).toFixed(1)}B`;
    }
    if (Math.abs(val) >= 1000000) {
      return `$${(val / 1000000).toFixed(0)}M`;
    }
    return `$${val}`;
  };

  const chartData = cities.map((c) => ({
    name: c.name.split(' ')[0], // 'Barranquilla', 'Bogotá', etc.
    fullName: c.name,
    ventas: c.monthly_sales_cop,
    egresos: c.total_payroll_cop + c.total_rent_cop,
    credito: c.credit_sales_amount_cop,
    contado: c.cash_sales_amount_cop,
  }));

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-red-600" />
            <span>Comparativa Comercial y Operativa por Regional</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Relación de Ventas Facturadas vs Compromisos Fijos (Nómina + Arriendos)
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-bold">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-md bg-red-600 inline-block shadow-sm" />
            <span className="text-slate-700">Ventas Mes</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-md bg-slate-700 inline-block shadow-sm" />
            <span className="text-slate-700">Costos (Nómina + Arriendo)</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis
              dataKey="name"
              stroke="#64748B"
              fontSize={11}
              fontWeight={600}
              tickLine={false}
            />
            <YAxis
              stroke="#94A3B8"
              fontSize={11}
              tickLine={false}
              tickFormatter={formatCOP}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xl text-xs space-y-1.5 min-w-[200px]">
                      <div className="font-bold text-slate-900 border-b border-slate-100 pb-1">
                        {data.fullName}
                      </div>
                      <div className="flex justify-between text-red-600 font-semibold">
                        <span>Ventas Totales:</span>
                        <strong className="font-mono">{formatCOP(data.ventas)}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Costos Fijos:</span>
                        <strong className="font-mono">{formatCOP(data.egresos)}</strong>
                      </div>
                      <div className="pt-1 border-t border-slate-100 flex justify-between text-[11px] text-slate-500">
                        <span>Crédito Credijamar:</span>
                        <span className="font-mono">{formatCOP(data.credito)}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="ventas"
              fill="#D2132C"
              radius={[6, 6, 0, 0]}
              animationDuration={800}
            />
            <Bar
              dataKey="egresos"
              fill="#334155"
              radius={[6, 6, 0, 0]}
              animationDuration={900}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
