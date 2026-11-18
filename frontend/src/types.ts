export interface StoreLocation {
  id: number;
  code: string;
  name: string;
  city: 'Barranquilla' | 'Bogotá' | 'Medellín' | 'Regionales';
  address: string;
  type: 'SHOWROOM' | 'CENDIS_FABRICA' | 'EXPRESS';
  area_sqm: number;
  monthly_rent_cop: number;
  monthly_sales_target_cop: number;
  actual_sales_cop: number;
  credijamar_collection_rate: number; // e.g. 0.92 = 92%
  active_advisors_count: number;
  is_profitable: boolean;
  status: 'OPERATIVA' | 'EN_EXPANSION';
}

export interface CredijamarPortfolio {
  total_active_loans_cop: number;
  on_time_loans_cop: number;
  on_time_rate: number;
  early_arrears_cop: number; // Mora 1-15 días
  early_arrears_clients_count: number;
  mid_arrears_cop: number; // Mora 16-60 días
  late_arrears_cop: number; // Mora > 60 días
  potential_rescue_injection_cop: number;
}

export interface CompanySummary {
  name: string;
  currency?: string;
  current_balance: number;
  safe_threshold: number;
  has_deficit: boolean;
  first_deficit_date: string | null;
  days_until_deficit: number | null;
  worst_deficit: number;
  minimum_balance: number;
  health_score: number;
  runway_days: number;
  burn_rate_daily: number;
  total_payroll: number;
  active_stores_count?: number;
  cendis_count?: number;
}

export interface TimelinePoint {
  date: string;
  day_offset: number;
  inflow: number;
  outflow: number;
  net_change: number;
  balance: number;
  pessimistic_balance: number;
  expected_balance: number;
  optimistic_balance: number;
  is_deficit: boolean;
  events: string[];
}

export interface ProjectionData {
  has_deficit: boolean;
  minimum_balance: number;
  health_score: number;
  timeline: TimelinePoint[];
}

export interface Employee {
  id: number;
  full_name: string;
  role_title: string;
  email: string;
  monthly_salary: number;
  benefits_cost: number;
  payment_cutoff_day: number;
  is_active: boolean;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  customer_name: string;
  amount: number;
  effective_due_date: string;
  status: string;
  discount_offered: number;
}

export interface ScheduledPayment {
  id: number;
  description: string;
  vendor_name: string;
  amount: number;
  scheduled_date: string;
  status: string;
  category: string;
  store_code?: string;
}

export interface ActionPayload {
  type: string;
  description?: string;
  vendor_name?: string;
  customer_name?: string;
  amount?: number;
  days_delayed?: number;
  discount_percentage?: number;
  target_clients_count?: number;
  estimated_recovery_cop?: number;
  reason: string;
  html_email_preview?: string;
}

export interface AgentProposal {
  id: number;
  title: string;
  projected_deficit: number;
  deficit_date: string;
  status: string;
  confidence_score: number;
  action_summary: string;
  actions_payload: ActionPayload[];
  simulated_minimum_balance: number;
}

export interface AuditLog {
  id: number;
  actor: string;
  action_type: string;
  details: string;
  meta: any;
  snowflake_synced?: boolean;
  created_at: string;
}

export interface OutboxEmail {
  id: number;
  recipient_email?: string;
  to_email?: string;
  recipient_name?: string;
  subject: string;
  html_body?: string;
  body_html?: string;
  status: string;
  created_at: string;
}
