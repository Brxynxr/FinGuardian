export interface CategorySales {
  category: 'Salas & Sofás' | 'Alcobas & Cuartos' | 'Comedores & Bares' | 'Muebles TV & Estudio';
  icon: string;
  amount_cop: number;
  percentage: number;
  units_sold: number;
}

export interface CityFinancials {
  id: string;
  name: string;
  department: string;
  stores_count: number;
  total_payroll_cop: number;
  total_rent_cop: number;
  local_suppliers_cop: number;
  monthly_sales_cop: number;
  sales_target_cop: number;
  // Desglose de ingresos (Crédito vs Contado directo)
  credit_sales_percentage: number; // e.g. 78 = 78%
  cash_sales_percentage: number;   // e.g. 22 = 22%
  credit_sales_amount_cop: number;
  cash_sales_amount_cop: number;
  // Cartera Credijamar de la ciudad
  on_time_payment_rate: number;    // e.g. 91.2%
  early_arrears_rate: number;      // Mora 1-15 días (e.g. 6.8%)
  late_arrears_rate: number;       // Mora > 60 días (e.g. 2.0%)
  early_arrears_amount_cop: number;
  active_clients_count: number;
  // Ventas por categoría
  categories_sales: CategorySales[];
}

export interface StoreLocation {
  id: number;
  code: string;
  name: string;
  city_id: string;
  city_name: string;
  city?: string;
  address: string;
  type: 'SHOWROOM' | 'CENDIS_FABRICA';
  area_sqm: number;
  monthly_rent_cop: number;
  monthly_sales_target_cop: number;
  actual_sales_cop: number;
  credit_percentage: number;
  cash_percentage: number;
  monthly_credit_revenue_cop: number;
  monthly_cash_revenue_cop: number;
  credijamar_collection_rate: number;
  active_advisors_count: number;
  is_profitable: boolean;
  status: 'OPERATIVA' | 'EN_EXPANSION';
}

export interface CredijamarPortfolio {
  total_active_loans_cop: number;
  on_time_loans_cop: number;
  on_time_rate: number;
  early_arrears_cop: number;
  early_arrears_clients_count: number;
  mid_arrears_cop: number;
  late_arrears_cop: number;
  potential_rescue_injection_cop: number;
}

export interface CompanySummary {
  name: string;
  currency: string;
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
  total_sales_cop: number;
  national_credit_ratio: number;
  national_cash_ratio: number;
  active_stores_count: number;
  cendis_count: number;
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
