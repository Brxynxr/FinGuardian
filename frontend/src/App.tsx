import React, { useState, useEffect } from 'react';
import { FinancialHeader } from './components/FinancialHeader';
import { HealthMetricsCards } from './components/HealthMetricsCards';
import { CashFlowChart } from './components/CashFlowChart';
import { RescueActionCenter } from './components/RescueActionCenter';
import { PayrollSection } from './components/PayrollSection';
import { InvoiceUploaderModal } from './components/InvoiceUploaderModal';
import { CFOChatModal } from './components/CFOChatModal';
import { AuditSnowflakeTable } from './components/AuditSnowflakeTable';
import { api } from './services/api';
import {
  CompanySummary,
  ProjectionData,
  Employee,
  ScheduledPayment,
  AgentProposal,
  AuditLog,
  OutboxEmail,
} from './types';
import { X } from 'lucide-react';

export function App() {
  const [summary, setSummary] = useState<CompanySummary | null>(null);
  const [projection, setProjection] = useState<ProjectionData | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payments, setPayments] = useState<ScheduledPayment[]>([]);
  const [pendingProposal, setPendingProposal] = useState<AgentProposal | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [emails, setEmails] = useState<OutboxEmail[]>([]);

  // Modals
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [emailPreviewHtml, setEmailPreviewHtml] = useState<string | null>(null);
  const [emailPreviewTitle, setEmailPreviewTitle] = useState('');

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isActionProcessing, setIsActionProcessing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const loadData = async () => {
    try {
      const [sum, proj, emps, pays, propData, logs, ems] = await Promise.all([
        api.getSummary(),
        api.getProjection(40),
        api.getEmployees(),
        api.getPayments(),
        api.getPendingProposal(),
        api.getAuditLogs(),
        api.getEmails(),
      ]);

      setSummary(sum);
      setProjection(proj);
      setEmployees(emps);
      setPayments(pays);
      setPendingProposal(propData.has_pending ? propData.proposal : null);
      setAuditLogs(logs);
      setEmails(ems);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Live polling every 4 seconds to sync Telegram approvals in real time
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerAnalysis = async () => {
    setIsActionProcessing(true);
    try {
      await api.triggerAnalysis();
      await loadData();
    } finally {
      setIsActionProcessing(false);
    }
  };

  const handleApprove = async (proposalId: number) => {
    setIsActionProcessing(true);
    try {
      await api.approveProposal(proposalId, 'ADMIN_WEB');
      await loadData();
    } finally {
      setIsActionProcessing(false);
    }
  };

  const handleReject = async (proposalId: number, reason: string) => {
    setIsActionProcessing(true);
    try {
      await api.rejectProposal(proposalId, reason);
      await loadData();
    } finally {
      setIsActionProcessing(false);
    }
  };

  const handleAddEmployee = async (employeeData: any) => {
    await api.createEmployee(employeeData);
    await loadData();
  };

  const handleResetDemo = async () => {
    setIsResetting(true);
    try {
      await api.resetDemo();
      await loadData();
    } finally {
      setIsResetting(false);
    }
  };

  const handlePreviewEmail = (html: string, title: string) => {
    setEmailPreviewHtml(html);
    setEmailPreviewTitle(title);
  };

  if (isLoading || !summary || !projection) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold">Cargando FinGuardian AI...</p>
        <p className="text-xs text-slate-500 mt-1">Conectando a base de datos y Snowflake DW</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Header */}
      <FinancialHeader
        companyName={summary.name}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenUpload={() => setIsUploadOpen(true)}
        onResetDemo={handleResetDemo}
        isResetting={isResetting}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* KPI Cards */}
        <HealthMetricsCards summary={summary} />

        {/* Cash Flow Projection Chart */}
        <CashFlowChart
          timeline={projection.timeline}
          safeThreshold={summary.safe_threshold}
        />

        {/* Human-in-the-Loop Rescue Center */}
        <RescueActionCenter
          hasDeficit={summary.has_deficit}
          pendingProposal={pendingProposal}
          onTriggerAnalysis={handleTriggerAnalysis}
          onApprove={handleApprove}
          onReject={handleReject}
          isProcessing={isActionProcessing}
          onPreviewEmail={handlePreviewEmail}
        />

        {/* 360 Team, Payroll & Services */}
        <PayrollSection
          employees={employees}
          payments={payments}
          onAddEmployee={handleAddEmployee}
        />

        {/* Audit & Emails */}
        <AuditSnowflakeTable
          auditLogs={auditLogs}
          emails={emails}
          onPreviewEmail={handlePreviewEmail}
        />
      </main>

      {/* Modals */}
      <CFOChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <InvoiceUploaderModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={loadData}
      />

      {/* Corporate Email Preview Modal */}
      {emailPreviewHtml && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl relative overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">{emailPreviewTitle}</h3>
                <p className="text-xs text-slate-400">Previsualización exacta del correo HTML corporativo enviado vía Gmail</p>
              </div>
              <button
                onClick={() => setEmailPreviewHtml(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-slate-950">
              <div
                className="bg-white rounded-lg shadow p-2"
                dangerouslySetInnerHTML={{ __html: emailPreviewHtml }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
