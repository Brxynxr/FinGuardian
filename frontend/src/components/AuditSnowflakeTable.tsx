import React from 'react';
import { History, Mail, ExternalLink, ShieldCheck } from 'lucide-react';
import { AuditLog, OutboxEmail } from '../types';

interface Props {
  auditLogs: AuditLog[];
  emails: OutboxEmail[];
  onPreviewEmail: (html: string, title: string) => void;
}

export const AuditSnowflakeTable: React.FC<Props> = ({ auditLogs, emails, onPreviewEmail }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 1. Snowflake & Audit Trail */}
      <div className="bg-slate-800/60 backdrop-blur border border-slate-700/60 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Auditoría & Trazabilidad Inmutable</h2>
              <p className="text-xs text-slate-400">Registro replicado a Snowflake FACT_FINANCIAL_DECISIONS.</p>
            </div>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-sky-950/60 text-sky-400 border border-sky-800/60 font-semibold">
            ❄️ Snowflake DW
          </span>
        </div>

        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 text-xs">
          {auditLogs.length > 0 ? (
            auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg bg-slate-900/60 border border-slate-700/50 flex flex-col space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{log.action_type}</span>
                  <span className="text-[10px] text-slate-400">
                    {log.created_at ? new Date(log.created_at).toLocaleTimeString() : 'Reciente'}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">{log.details}</p>
                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                  <span>Actor: <strong className="text-slate-300">{log.actor}</strong></span>
                  {log.snowflake_synced && (
                    <span className="text-sky-400 font-medium flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Sincronizado en Snowflake</span>
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-6 text-slate-500">No hay registros de auditoría aún.</p>
          )}
        </div>
      </div>

      {/* 2. Official Corporate Emails Dispatched */}
      <div className="bg-slate-800/60 backdrop-blur border border-slate-700/60 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Bandeja de Salida Oficial (Gmail SMTP)</h2>
              <p className="text-xs text-slate-400">Correos despachados en HTML corporativo desde breynermanga07@gmail.com.</p>
            </div>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-semibold">
            Gmail SSL 465
          </span>
        </div>

        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 text-xs">
          {emails.length > 0 ? (
            emails.map((e) => (
              <div
                key={e.id}
                className="p-3 rounded-lg bg-slate-900/60 border border-slate-700/50 flex items-center justify-between"
              >
                <div className="flex-1 mr-3">
                  <p className="font-semibold text-slate-200 text-xs truncate">{e.subject}</p>
                  <p className="text-[11px] text-slate-400">Destinatario: {e.to_email}</p>
                </div>
                <button
                  onClick={() => onPreviewEmail(e.body_html, e.subject)}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 border border-slate-700 text-[11px] font-semibold transition flex-shrink-0"
                >
                  <span>Ver HTML</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-center py-6 text-slate-500">Aún no se han despachado correos oficiales.</p>
          )}
        </div>
      </div>
    </div>
  );
};
