import React, { useState } from 'react';
import { Users, UserPlus, Server, CheckCircle2 } from 'lucide-react';
import { Employee, ScheduledPayment } from '../types';

interface Props {
  employees: Employee[];
  payments: ScheduledPayment[];
  onAddEmployee: (employee: { full_name: string; role_title: string; email: string; monthly_salary: number }) => Promise<void>;
}

export const PayrollSection: React.FC<Props> = ({ employees, payments, onAddEmployee }) => {
  const [showModal, setShowModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [email, setEmail] = useState('');
  const [salary, setSalary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !roleTitle || !salary) return;
    setIsSubmitting(true);
    await onAddEmployee({
      full_name: fullName,
      role_title: roleTitle,
      email: email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@innovacloud.tech`,
      monthly_salary: parseFloat(salary),
    });
    setFullName('');
    setRoleTitle('');
    setEmail('');
    setSalary('');
    setIsSubmitting(false);
    setShowModal(false);
  };

  const totalPayroll = employees.reduce((sum, e) => sum + e.monthly_salary + e.benefits_cost, 0);

  return (
    <div className="bg-slate-800/60 backdrop-blur border border-slate-700/60 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Equipo, Nómina & Costos Fijos 360°</h2>
            <p className="text-xs text-slate-400">Control salarial de ingenieros y pagos recurrentes de infraestructura.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">Total Nómina Mensual</span>
            <span className="text-xs font-bold text-emerald-400">${totalPayroll.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Añadir Empleado</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Employees Table (2 cols) */}
        <div className="lg:col-span-2 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-2.5 px-3">Ingeniero / Cargo</th>
                <th className="py-2.5 px-3">Salario Neto</th>
                <th className="py-2.5 px-3">Carga Prestacional</th>
                <th className="py-2.5 px-3">Día Corte</th>
                <th className="py-2.5 px-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-white">{emp.full_name}</div>
                    <div className="text-[11px] text-slate-400">{emp.role_title}</div>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-medium text-slate-200">
                    ${emp.monthly_salary.toLocaleString()} USD
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">
                    +${emp.benefits_cost.toLocaleString()} USD
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">Día {emp.payment_cutoff_day}</td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-medium border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Activo</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fixed Services Card (1 col) */}
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-lg p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-200 mb-2">
              <Server className="w-4 h-4 text-sky-400" />
              <span>Servicios & OPEX Comprometidos</span>
            </div>
            <div className="space-y-2 text-xs mt-3">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-1 border-b border-slate-800/80">
                  <div>
                    <p className="font-medium text-slate-200 text-[11px] leading-tight">{p.description}</p>
                    <p className="text-[10px] text-slate-400">{p.vendor_name} • Vence {p.scheduled_date}</p>
                  </div>
                  <span className="font-mono text-slate-300 font-semibold text-xs ml-2">
                    ${p.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[10px] text-slate-500 mt-3 italic">
            *Regla del Negocio: Servicios de Cloud y SaaS se pagan antes del día 15; la nómina el día 30.
          </p>
        </div>
      </div>

      {/* Modal Add Employee */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Añadir Nuevo Desarrollador al Equipo</h3>
            <p className="text-xs text-slate-400 mb-4">Se integrará automáticamente en los cálculos de burn rate y flujo de caja.</p>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Laura Sanchez"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Cargo / Especialidad</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Senior DevOps / SRE"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Salario Neto Mensual (USD)</label>
                <input
                  type="number"
                  required
                  placeholder="2500"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar y Recalcular'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
