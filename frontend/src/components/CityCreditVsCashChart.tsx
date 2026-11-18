import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from 'recharts';
import { CreditCard, Coins, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

interface CityCreditVsCashChartProps {
  creditPercentage: number;
  cashPercentage: number;
  creditAmount: number;
  cashAmount: number;
  onTimeRate: number;
  earlyArrearsRate: number;
  lateArrearsRate: number;
  earlyArrearsAmount: number;
}

export const CityCreditVsCashChart: React.FC<CityCreditVsCashChartProps> = ({
  creditPercentage,
  cashPercentage,
  creditAmount,
  cashAmount,
  onTimeRate,
  earlyArrearsRate,
  lateArrearsRate,
  earlyArrearsAmount,
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

  const mixData = [
    {
      category: 'Financiación Credijamar',
      amount: creditAmount,
      percentage: creditPercentage,
      color: '#D2132C',
    },
    {
      category: 'Dinero Directo / Contado',
      amount: cashAmount,
      percentage: cashPercentage,
      color: '#10B981',
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-red-600" />
            <span>Mix de Financiación & Calidad de Cartera</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Proporción de ventas a crédito vs recaudo inmediato
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-bold">
          <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
            {creditPercentage}% Crédito
          </span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            {cashPercentage}% Contado
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 items-center">
        
        {/* Horizontal Bar Chart for Credit vs Cash */}
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={mixData}
              margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
            >
              <XAxis
                type="number"
                tickFormatter={formatCOP}
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="category"
                stroke="#475569"
                fontSize={11}
                tickLine={false}
                width={140}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xl text-xs space-y-1">
                        <div className="font-bold text-slate-900">{data.category}</div>
                        <div className="font-mono font-black text-sm" style={{ color: data.color }}>
                          {formatCOP(data.amount)} ({data.percentage}%)
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="amount" radius={[0, 8, 8, 0]} animationDuration={800}>
                {mixData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 3 Circular / Gauge Status Bars */}
        <div className="space-y-3.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
          
          {/* Cuotas al Día */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold mb-1">
              <span className="flex items-center gap-1.5 text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Clientes al Día ({onTimeRate}%)
              </span>
              <span className="text-emerald-700 font-mono">Cobro Normal</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-700"
                style={{ width: `${onTimeRate}%` }}
              />
            </div>
          </div>

          {/* Mora Temprana (1-15 días) */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold mb-1">
              <span className="flex items-center gap-1.5 text-amber-800">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                Mora 1 a 15 días ({earlyArrearsRate}%)
              </span>
              <span className="text-amber-700 font-mono">{formatCOP(earlyArrearsAmount)}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${earlyArrearsRate * 5}%` }}
              />
            </div>
          </div>

          {/* Mora Crítica (>60 días) */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold mb-1">
              <span className="flex items-center gap-1.5 text-rose-800">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                Mora Crítica &gt; 60 días ({lateArrearsRate}%)
              </span>
              <span className="text-rose-700 font-mono">Cobro Prejurídico</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-rose-600 h-full rounded-full transition-all duration-700"
                style={{ width: `${lateArrearsRate * 10}%` }}
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
