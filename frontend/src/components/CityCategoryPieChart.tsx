import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { CategorySales } from '../types';

interface CityCategoryPieChartProps {
  categories: CategorySales[];
  totalSales: number;
}

const JAMAR_PALETTE = ['#D2132C', '#F59E0B', '#1E293B', '#10B981'];

export const CityCategoryPieChart: React.FC<CityCategoryPieChartProps> = ({
  categories,
  totalSales,
}) => {
  const formatCOP = (val: number) => {
    if (Math.abs(val) >= 1000000000) {
      return `$${(val / 1000000000).toFixed(2)}B`;
    }
    if (Math.abs(val) >= 1000000) {
      return `$${(val / 1000000).toFixed(0)}M`;
    }
    return `$${val}`;
  };

  const chartData = categories.map((cat, idx) => ({
    name: cat.category,
    value: cat.amount_cop,
    percentage: cat.percentage,
    units: cat.units_sold,
    color: JAMAR_PALETTE[idx % JAMAR_PALETTE.length],
  }));

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-black text-slate-900">
            Distribución de Ventas por Categoría
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Mobiliario facturado en el mes
          </p>
        </div>
        <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-slate-100 text-slate-700">
          Total: {formatCOP(totalSales)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4 pt-4">
        {/* Donut Chart */}
        <div className="h-56 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                animationDuration={900}
                animationEasing="ease-out"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xl text-xs space-y-1">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block"
                            style={{ backgroundColor: data.color }}
                          />
                          {data.name}
                        </div>
                        <div className="font-mono font-black text-slate-900 text-sm">
                          {formatCOP(data.value)} ({data.percentage}%)
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {data.units} unidades entregadas
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text inside Donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total</span>
            <span className="text-sm font-black text-slate-900 font-mono">
              {formatCOP(totalSales)}
            </span>
          </div>
        </div>

        {/* Visual Legends with progress bars */}
        <div className="space-y-3">
          {chartData.map((item, idx) => (
            <div key={idx} className="group p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="flex items-center gap-2 text-slate-800">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </span>
                <span className="font-mono text-slate-900">
                  {formatCOP(item.value)}{' '}
                  <span className="text-slate-400 font-normal">({item.percentage}%)</span>
                </span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${item.percentage * 2}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
