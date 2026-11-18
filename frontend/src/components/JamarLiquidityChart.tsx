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
    <div className="bg-obsidian-900/80 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
              Proyección de Liquidez y Curva de Caja (40 Días)
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-jamar-crimson/20 text-rose-300 border border-jamar-crimson/30">
                Moneda: COP
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Ingresos diarios por recaudo de cuotas Credijamar vs egresos por nómina de tiendas, arriendos y maderas en Galapa.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center flex-wrap gap-3 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-1.5 rounded-full bg-jamar-red" />
            <span className="text-slate-300 font-medium">Saldo Proyectado</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-credijamar-amber" />
            <span className="text-credijamar-amber font-medium">Reserva Segura ($600M)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-rose-500" />
            <span className="text-rose-400 font-medium">Déficit Quincenal</span>
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
              <linearGradient id="jamarRedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D2132C" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#D2132C" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.6} />

            <XAxis
              dataKey="displayDate"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              interval={4}
            />

            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              tickFormatter={formatCOP}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-obsidian-950 border border-slate-700 rounded-xl p-3 shadow-2xl text-xs space-y-1.5 max-w-xs">
                      <div className="font-bold text-white flex items-center justify-between border-b border-slate-800 pb-1">
                        <span>{data.date} ({data.displayDate})</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                          data.balance < safeThreshold
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}>
                          {data.balance < safeThreshold ? 'RIESGO DE CAJA' : 'SALUDABLE'}
                        </span>
                      </div>

                      <div className="flex justify-between text-slate-300">
                        <span>Saldo en Bancos:</span>
                        <strong className={`font-mono ${data.balance < 0 ? 'text-rose-400' : 'text-white'}`}>
                          {formatCOP(data.balance)}
                        </strong>
                      </div>

                      <div className="flex justify-between text-emerald-400 text-[11px]">
                        <span>Entradas Credijamar:</span>
                        <span className="font-mono">+{formatCOP(data.inflow)}</span>
                      </div>

                      <div className="flex justify-between text-rose-400 text-[11px]">
                        <span>Salidas / Pagos:</span>
                        <span className="font-mono">-{formatCOP(data.outflow)}</span>
                      </div>

                      {data.events && data.events.length > 0 && (
                        <div className="pt-1.5 border-t border-slate-800 mt-1">
                          <span className="text-[10px] text-credijamar-amber font-semibold block mb-0.5">
                            Eventos Críticos:
                          </span>
                          {data.events.map((ev: string, idx: number) => (
                            <div key={idx} className="text-[11px] text-slate-300 flex items-center gap-1">
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
              stroke="#F59E0B"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />

            {/* Zero Line */}
            <ReferenceLine
              y={0}
              stroke="#EF4444"
              strokeWidth={1.5}
            />

            {/* Area Fill */}
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#D2132C"
              strokeWidth={2.5}
              fill="url(#jamarRedGradient)"
            />

            {/* Optimistic Line */}
            <Line
              type="monotone"
              dataKey="optimistic_balance"
              stroke="#10B981"
              strokeWidth={1}
              strokeDasharray="2 2"
              dot={false}
            />

            {/* Pessimistic Line */}
            <Line
              type="monotone"
              dataKey="pessimistic_balance"
              stroke="#F43F5E"
              strokeWidth={1}
              strokeDasharray="2 2"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Critical Deficit Alert Banner */}
      {projection.has_deficit && (
        <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-rose-950/40 via-red-950/20 to-obsidian-950 border border-rose-800/60 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-jamar-red text-white">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">
                Déficit Proyectado para el Día 14 (Pago de Nómina 1.200 Empleados):
              </span>
              <span className="text-slate-400">
                La caja descenderá a <strong className="text-rose-400 font-mono">-$390M COP</strong> tras pagar arriendos comerciales y compras de madera antes del recaudo quincenal de Credijamar.
              </span>
            </div>
          </div>

          <div className="px-3 py-1 rounded-lg bg-rose-900/60 text-rose-200 border border-rose-700 font-mono font-bold shrink-0">
            Déficit: -$390M COP
          </div>
        </div>
      )}

    </div>
  );
};
