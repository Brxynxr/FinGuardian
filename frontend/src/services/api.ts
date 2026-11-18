import {
  CompanySummary,
  ProjectionData,
  Employee,
  ScheduledPayment,
  Invoice,
  AgentProposal,
  AuditLog,
  OutboxEmail,
  CityFinancials,
  StoreLocation,
  CredijamarPortfolio,
} from '../types';

const API_BASE = '/api';

export const api = {
  // --- ENDPOINTS MUEBLES JAMAR (NUEVO MODELO RETAIL & CREDIJAMAR) ---
  async getJamarSummary(): Promise<CompanySummary> {
    const res = await fetch(`${API_BASE}/jamar/summary`);
    return res.json();
  },

  async getJamarCities(): Promise<CityFinancials[]> {
    const res = await fetch(`${API_BASE}/jamar/cities`);
    const data = await res.json();
    return data.cities || [];
  },

  async getJamarStores(cityId?: string): Promise<StoreLocation[]> {
    const url = cityId ? `${API_BASE}/jamar/stores?city_id=${cityId}` : `${API_BASE}/jamar/stores`;
    const res = await fetch(url);
    const data = await res.json();
    return data.stores || [];
  },

  async getJamarCredijamar(): Promise<CredijamarPortfolio> {
    const res = await fetch(`${API_BASE}/jamar/credijamar`);
    return res.json();
  },

  async getJamarPendingProposal(): Promise<{ has_pending: boolean; proposal: AgentProposal | null }> {
    const res = await fetch(`${API_BASE}/jamar/proposal/pending`);
    return res.json();
  },

  async approveJamarProposal(proposalId: number, approvedBy: string = 'ADMIN_WEB'): Promise<any> {
    const res = await fetch(`${API_BASE}/jamar/approve/${proposalId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved_by: approvedBy }),
    });
    return res.json();
  },

  async rejectJamarProposal(proposalId: number, reason: string): Promise<any> {
    const res = await fetch(`${API_BASE}/jamar/reject/${proposalId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason, rejected_by: 'ADMIN_WEB' }),
    });
    return res.json();
  },

  async chatJamarCFO(message: string): Promise<string> {
    const res = await fetch(`${API_BASE}/jamar/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    return data.answer || data.response;
  },

  // --- ENDPOINTS HISTÓRICOS (INNOVACLOUD TECH SAS) ---
  async getSummary(): Promise<CompanySummary> {
    const res = await fetch(`${API_BASE}/financial/summary`);
    return res.json();
  },

  async getProjection(days: number = 40): Promise<ProjectionData> {
    const res = await fetch(`${API_BASE}/financial/projection?days=${days}`);
    return res.json();
  },

  async getEmployees(): Promise<Employee[]> {
    const res = await fetch(`${API_BASE}/employees`);
    const data = await res.json();
    return data.employees || [];
  },

  async createEmployee(payload: { full_name: string; role_title: string; email: string; monthly_salary: number }): Promise<Employee> {
    const res = await fetch(`${API_BASE}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async getPayments(): Promise<ScheduledPayment[]> {
    const res = await fetch(`${API_BASE}/payments`);
    const data = await res.json();
    return data.payments || [];
  },

  async getInvoices(): Promise<Invoice[]> {
    const res = await fetch(`${API_BASE}/invoices`);
    const data = await res.json();
    return data.invoices || [];
  },

  async getPendingProposal(): Promise<{ has_pending: boolean; proposal: AgentProposal | null }> {
    const res = await fetch(`${API_BASE}/agent/proposals/pending`);
    return res.json();
  },

  async triggerAnalysis(): Promise<{ success: boolean; proposal?: AgentProposal; message?: string }> {
    const res = await fetch(`${API_BASE}/agent/analyze-and-propose`, { method: 'POST' });
    return res.json();
  },

  async approveProposal(proposalId: number, approvedBy: string = 'ADMIN_WEB'): Promise<any> {
    const res = await fetch(`${API_BASE}/agent/approve/${proposalId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved_by: approvedBy }),
    });
    return res.json();
  },

  async rejectProposal(proposalId: number, reason: string): Promise<any> {
    const res = await fetch(`${API_BASE}/agent/reject/${proposalId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason, rejected_by: 'ADMIN_WEB' }),
    });
    return res.json();
  },

  async chatCFO(message: string): Promise<string> {
    const res = await fetch(`${API_BASE}/chat/cfo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    return data.response;
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    const res = await fetch(`${API_BASE}/audit/logs`);
    const data = await res.json();
    return data.logs || [];
  },

  async getEmails(): Promise<OutboxEmail[]> {
    const res = await fetch(`${API_BASE}/outbox/emails`);
    const data = await res.json();
    return data.emails || [];
  },

  async uploadCSV(file: File, docType: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/ingest/csv?doc_type=${docType}`, {
      method: 'POST',
      body: formData,
    });
    return res.json();
  },

  async resetDemo(): Promise<any> {
    const res = await fetch(`${API_BASE}/demo/reset`, { method: 'POST' });
    return res.json();
  },
};
