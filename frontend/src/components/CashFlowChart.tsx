import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { TimelinePoint } from '../types';

interface Props {
  timeline: TimelinePoint[];
  safeThreshold: number;
}

export const CashFlowChart: React.FC<Props> = ({ timeline, safeThreshold }) => {
  const chartData = timeline.map((p) => ({
    name: p.day_offset === 0 ? 'Hoy' : `+${p.day_offset}d`,
    date: p.date,
    balance: p.balance,
    pessimistic: p.pessimistic_balance,
    optimistic: p.optimistic_balance,
    events: p.events,
    isDeficit: p.is_deficit,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3.5 rounded-lg shadow-xl text-xs max-w-xs">
          <p className="font-bold text-slate-200">
            Día {data.name} ({data.date})
          </p>
          <div className="mt-2 space-y-1">
            <p className={`font-semibold ${data.balance < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              Saldo proyectado: ${data.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
            </p>
            <p className="text-slate-400">Banda probabilística: ${data.pessimistic.toLocaleString()} - ${data.optimistic.toLocaleString()} USD</p>
          </div>
          {data.events && data.events.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-slate-800 space-y-1">
              <span className="font-semibold text-slate-400">Movimientos:</span>
              {data.events.map((ev: string, idx: number) => (
                <p key={idx} className="text-slate-300 font-mono text-[11px] leading-tight">
                  {ev}
                </p>
              ))}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-800/60 backdrop-blur border border-slate-700/60 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <h2 className="text-base font-bold text-white">Proyección Determinista de Flujo de Caja (40 Días)</h2>
          <p className="text-xs text-slate-400">Evolución diaria del saldo considerando nómina, servicios Cloud y facturas de clientes.</p>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-0.5 bg-emerald-400 inline-block"></span>
            <span className="text-slate-300">Saldo Diario</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-0.5 bg-rose-500/80 inline-block border-b border-dashed border-rose-500"></span>
            <span className="text-slate-400">Zona de Riesgo ($0)</span>
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              tickFormatter={(val) => `$${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#f43f5e" strokeWidth={1.5} strokeDasharray="4 4" label={{ value: 'Quiebra ($0)', fill: '#f43f5e', fontSize: 10, position: 'right' }} />
            <ReferenceLine y={safeThreshold} stroke="#3b82f6" strokeWidth={1} strokeDasharray="3 3" label={{ value: 'Reserva ($2k)', fill: '#60a5fa', fontSize: 10, position: 'insideTopRight' }} />
            <Area type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#balanceGradient)" />
            <Line type="monotone" dataKey="pessimistic" stroke="#64748b" strokeWidth={1} strokeDasharray="2 2" dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
