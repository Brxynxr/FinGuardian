import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { ProjectionData } from '../types';
import { TrendingDown, Calendar, AlertCircle } from 'lucide-react';

interface JamarLiquidityChartProps {
  projection: ProjectionData;
  safeThreshold?: number;
}

export const JamarLiquidityChart: React.FC<JamarLiquidityChartProps> = ({
  projection,
  safeThreshold = 600000000, // $600M COP
}) => {
  const formatCOP = (val: number) => {
    if (Math.abs(val) >= 1000000000) {
      return `$${(val / 1000000000).toFixed(1)}B`;
    }
    if (Math.abs(val) >= 1000000) {
      return `$${(val / 1000000).toFixed(0)}M`;
    }
    return `$${val}`;
  };

  const chartData = projection.timeline.map((point) => ({
    ...point,
    displayDate: `Día ${point.day_offset}`,
  }));

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span>Curva de Liquidez y Proyección de Caja (40 Días)</span>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-red-50 text-red-700 border border-red-200">
              Moneda: COP
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Ingresos diarios por recaudo de cuotas Credijamar vs egresos por nómina de tiendas, arriendos y maderas en Galapa.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center flex-wrap gap-3 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-1.5 rounded-full bg-red-600" />
            <span className="text-slate-700 font-bold">Saldo Proyectado</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-amber-600" />
            <span className="text-amber-700 font-bold">Reserva Segura ($600M)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-rose-600" />
            <span className="text-rose-700 font-bold">Límite de Quiebra ($0)</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="jamarRedLightGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D2132C" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#D2132C" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />

            <XAxis
              dataKey="displayDate"
              stroke="#94A3B8"
              fontSize={11}
              tickLine={false}
              interval={4}
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
                    <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xl text-xs space-y-1.5 max-w-xs">
                      <div className="font-bold text-slate-900 flex items-center justify-between border-b border-slate-100 pb-1">
                        <span>{data.date} ({data.displayDate})</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                          data.balance < safeThreshold
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {data.balance < safeThreshold ? 'DÉFICIT EN CAJA' : 'SALUDABLE'}
                        </span>
                      </div>

                      <div className="flex justify-between text-slate-700">
                        <span>Saldo en Bancos:</span>
                        <strong className={`font-mono ${data.balance < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                          {formatCOP(data.balance)}
                        </strong>
                      </div>

                      <div className="flex justify-between text-emerald-700 text-[11px] font-semibold">
                        <span>Entradas Credijamar:</span>
                        <span className="font-mono">+{formatCOP(data.inflow)}</span>
                      </div>

                      <div className="flex justify-between text-rose-700 text-[11px] font-semibold">
                        <span>Salidas / Pagos:</span>
                        <span className="font-mono">-{formatCOP(data.outflow)}</span>
                      </div>

                      {data.events && data.events.length > 0 && (
                        <div className="pt-1.5 border-t border-slate-100 mt-1">
                          <span className="text-[10px] text-red-600 font-bold block mb-0.5">
                            Compromisos del Día:
                          </span>
                          {data.events.map((ev: string, idx: number) => (
                            <div key={idx} className="text-[11px] text-slate-600 flex items-center gap-1 font-medium">
                              • {ev}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Threshold Line at $600M COP */}
            <ReferenceLine
              y={safeThreshold}
              stroke="#D97706"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />

            {/* Zero Line */}
            <ReferenceLine
              y={0}
              stroke="#DC2626"
              strokeWidth={1.5}
            />

            {/* Area Fill */}
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#D2132C"
              strokeWidth={3}
              fill="url(#jamarRedLightGradient)"
            />

            {/* Optimistic Line */}
            <Line
              type="monotone"
              dataKey="optimistic_balance"
              stroke="#15803D"
              strokeWidth={1}
              strokeDasharray="2 2"
              dot={false}
            />

            {/* Pessimistic Line */}
            <Line
              type="monotone"
              dataKey="pessimistic_balance"
              stroke="#E11D48"
              strokeWidth={1}
              strokeDasharray="2 2"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
