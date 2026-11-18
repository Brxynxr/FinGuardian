import { 
  CityFinancials, 
  StoreLocation, 
  CompanySummary, 
  ProjectionData, 
  AgentProposal 
} from '../types';

export const CITIES_DATA: CityFinancials[] = [
  {
    id: 'barranquilla',
    name: 'Barranquilla & Atlántico',
    department: 'Atlántico',
    stores_count: 5,
    total_payroll_cop: 285000000,
    total_rent_cop: 187000000,
    local_suppliers_cop: 420000000, // Maderas del Darién ($240M) + Espumas del Litoral ($180M) en Galapa
    monthly_sales_cop: 1742000000,
    sales_target_cop: 1700000000,
    credit_sales_percentage: 78,
    cash_sales_percentage: 22,
    credit_sales_amount_cop: 1358760000,
    cash_sales_amount_cop: 383240000,
    on_time_payment_rate: 91.2,
    early_arrears_rate: 6.8,
    late_arrears_rate: 2.0,
    early_arrears_amount_cop: 92400000,
    active_clients_count: 4820,
    categories_sales: [
      { category: 'Salas & Sofás', icon: '🛋️', amount_cop: 766480000, percentage: 44, units_sold: 260 },
      { category: 'Alcobas & Cuartos', icon: '🛏️', amount_cop: 557440000, percentage: 32, units_sold: 340 },
      { category: 'Comedores & Bares', icon: '🪑', amount_cop: 278720000, percentage: 16, units_sold: 125 },
      { category: 'Muebles TV & Estudio', icon: '📺', amount_cop: 139360000, percentage: 8, units_sold: 90 },
    ],
  },
  {
    id: 'bogota',
    name: 'Bogotá & Sabana',
    department: 'Cundinamarca',
    stores_count: 4,
    total_payroll_cop: 240000000,
    total_rent_cop: 170000000,
    local_suppliers_cop: 95000000,
    monthly_sales_cop: 2111000000,
    sales_target_cop: 2050000000,
    credit_sales_percentage: 74,
    cash_sales_percentage: 26,
    credit_sales_amount_cop: 1562140000,
    cash_sales_amount_cop: 548860000,
    on_time_payment_rate: 90.4,
    early_arrears_rate: 7.2,
    late_arrears_rate: 2.4,
    early_arrears_amount_cop: 112500000,
    active_clients_count: 5410,
    categories_sales: [
      { category: 'Salas & Sofás', icon: '🛋️', amount_cop: 802180000, percentage: 38, units_sold: 250 },
      { category: 'Alcobas & Cuartos', icon: '🛏️', amount_cop: 633300000, percentage: 30, units_sold: 370 },
      { category: 'Comedores & Bares', icon: '🪑', amount_cop: 464420000, percentage: 22, units_sold: 185 },
      { category: 'Muebles TV & Estudio', icon: '📺', amount_cop: 211100000, percentage: 10, units_sold: 130 },
    ],
  },
  {
    id: 'medellin',
    name: 'Medellín & Antioquia',
    department: 'Antioquia',
    stores_count: 2,
    total_payroll_cop: 135000000,
    total_rent_cop: 81000000,
    local_suppliers_cop: 45000000,
    monthly_sales_cop: 1020000000,
    sales_target_cop: 980000000,
    credit_sales_percentage: 76,
    cash_sales_percentage: 24,
    credit_sales_amount_cop: 775200000,
    cash_sales_amount_cop: 244800000,
    on_time_payment_rate: 90.2,
    early_arrears_rate: 7.4,
    late_arrears_rate: 2.4,
    early_arrears_amount_cop: 57300000,
    active_clients_count: 2750,
    categories_sales: [
      { category: 'Salas & Sofás', icon: '🛋️', amount_cop: 418200000, percentage: 41, units_sold: 135 },
      { category: 'Alcobas & Cuartos', icon: '🛏️', amount_cop: 336600000, percentage: 33, units_sold: 210 },
      { category: 'Comedores & Bares', icon: '🪑', amount_cop: 183600000, percentage: 18, units_sold: 80 },
      { category: 'Muebles TV & Estudio', icon: '📺', amount_cop: 81600000, percentage: 8, units_sold: 50 },
    ],
  },
  {
    id: 'regionales',
    name: 'Costa & Oriente',
    department: 'Bolívar / Magdalena / Santander',
    stores_count: 3,
    total_payroll_cop: 120000000,
    total_rent_cop: 93000000,
    local_suppliers_cop: 38000000,
    monthly_sales_cop: 1268000000,
    sales_target_cop: 1230000000,
    credit_sales_percentage: 81,
    cash_sales_percentage: 19,
    credit_sales_amount_cop: 1027080000,
    cash_sales_amount_cop: 240920000,
    on_time_payment_rate: 88.5,
    early_arrears_rate: 8.6,
    late_arrears_rate: 2.9,
    early_arrears_amount_cop: 88300000,
    active_clients_count: 3320,
    categories_sales: [
      { category: 'Salas & Sofás', icon: '🛋️', amount_cop: 583280000, percentage: 46, units_sold: 190 },
      { category: 'Alcobas & Cuartos', icon: '🛏️', amount_cop: 431120000, percentage: 34, units_sold: 270 },
      { category: 'Comedores & Bares', icon: '🪑', amount_cop: 177520000, percentage: 14, units_sold: 75 },
      { category: 'Muebles TV & Estudio', icon: '📺', amount_cop: 76080000, percentage: 6, units_sold: 45 },
    ],
  },
];

export const JAMAR_STORES: StoreLocation[] = [
  // BARRANQUILLA & ATLÁNTICO (5)
  {
    id: 1,
    code: 'BAQ-BOL',
    name: 'Showroom Paseo Bolívar (Insignia Histórica)',
    city_id: 'barranquilla',
    city_name: 'Barranquilla & Atlántico',
    address: 'Paseo Bolívar # 40-52, Centro',
    type: 'SHOWROOM',
    area_sqm: 2400,
    monthly_rent_cop: 32000000,
    monthly_sales_target_cop: 450000000,
    actual_sales_cop: 462000000,
    credit_percentage: 82,
    cash_percentage: 18,
    monthly_credit_revenue_cop: 378840000,
    monthly_cash_revenue_cop: 83160000,
    credijamar_collection_rate: 0.912,
    active_advisors_count: 22,
    is_profitable: true,
    status: 'OPERATIVA',
  },
  {
    id: 2,
    code: 'BAQ-72',
    name: 'Showroom Norte Calle 72',
    city_id: 'barranquilla',
    city_name: 'Barranquilla & Atlántico',
    address: 'Calle 72 # 48-15, Alto Prado',
    type: 'SHOWROOM',
    area_sqm: 1800,
    monthly_rent_cop: 38000000,
    monthly_sales_target_cop: 500000000,
    actual_sales_cop: 524000000,
    credit_percentage: 72,
    cash_percentage: 28,
    monthly_credit_revenue_cop: 377280000,
    monthly_cash_revenue_cop: 146720000,
    credijamar_collection_rate: 0.941,
    active_advisors_count: 18,
    is_profitable: true,
    status: 'OPERATIVA',
  },
  {
    id: 3,
    code: 'BAQ-MUR',
    name: 'Showroom Murillo (Sur)',
    city_id: 'barranquilla',
    city_name: 'Barranquilla & Atlántico',
    address: 'Av. Murillo # 21-40',
    type: 'SHOWROOM',
    area_sqm: 1500,
    monthly_rent_cop: 24000000,
    monthly_sales_target_cop: 350000000,
    actual_sales_cop: 342000000,
    credit_percentage: 84,
    cash_percentage: 16,
    monthly_credit_revenue_cop: 287280000,
    monthly_cash_revenue_cop: 54720000,
    credijamar_collection_rate: 0.878,
    active_advisors_count: 15,
    is_profitable: true,
    status: 'OPERATIVA',
  },
  {
    id: 4,
    code: 'BAQ-SOL',
    name: 'Showroom Soledad (Gran Plaza)',
    city_id: 'barranquilla',
    city_name: 'Barranquilla & Atlántico',
    address: 'C.C. Gran Plaza del Sol, Local 140',
    type: 'SHOWROOM',
    area_sqm: 1600,
    monthly_rent_cop: 28000000,
    monthly_sales_target_cop: 400000000,
    actual_sales_cop: 414000000,
    credit_percentage: 85,
    cash_percentage: 15,
    monthly_credit_revenue_cop: 351900000,
    monthly_cash_revenue_cop: 62100000,
    credijamar_collection_rate: 0.865,
    active_advisors_count: 16,
    is_profitable: true,
    status: 'OPERATIVA',
  },
  {
    id: 5,
    code: 'CEN-GAL',
    name: 'CENDIS & CILA Clúster Industrial Galapa',
    city_id: 'barranquilla',
    city_name: 'Barranquilla & Atlántico',
    address: 'Km 3 Vía Galapa - Parque Industrial',
    type: 'CENDIS_FABRICA',
    area_sqm: 14500,
    monthly_rent_cop: 65000000,
    monthly_sales_target_cop: 0,
    actual_sales_cop: 0,
    credit_percentage: 0,
    cash_percentage: 0,
    monthly_credit_revenue_cop: 0,
    monthly_cash_revenue_cop: 0,
    credijamar_collection_rate: 1.0,
    active_advisors_count: 120, // Operarios de ensamble y corte
    is_profitable: true,
    status: 'OPERATIVA',
  },

  // BOGOTÁ & CUNDINAMARCA (4)
  {
    id: 6,
    code: 'BOG-PAL',
    name: 'Megatienda Paloquemao (Insignia Capital)',
    city_id: 'bogota',
    city_name: 'Bogotá & Sabana',
    address: 'Cra 22 # 17-45, Paloquemao',
    type: 'SHOWROOM',
    area_sqm: 3200,
    monthly_rent_cop: 52000000,
    monthly_sales_target_cop: 750000000,
    actual_sales_cop: 785000000,
    credit_percentage: 71,
    cash_percentage: 29,
    monthly_credit_revenue_cop: 557350000,
    monthly_cash_revenue_cop: 227650000,
    credijamar_collection_rate: 0.904,
    active_advisors_count: 28,
    is_profitable: true,
    status: 'OPERATIVA',
  },
  {
    id: 7,
    code: 'BOG-134',
    name: 'Showroom Autopista Norte (Calle 134)',
    city_id: 'bogota',
    city_name: 'Bogotá & Sabana',
    address: 'Autopista Norte # 134-20',
    type: 'SHOWROOM',
    area_sqm: 2100,
    monthly_rent_cop: 44000000,
    monthly_sales_target_cop: 580000000,
    actual_sales_cop: 615000000,
    credit_percentage: 68,
    cash_percentage: 32,
    monthly_credit_revenue_cop: 418200000,
    monthly_cash_revenue_cop: 196800000,
    credijamar_collection_rate: 0.923,
    active_advisors_count: 20,
    is_profitable: true,
    status: 'OPERATIVA',
  },
  {
    id: 8,
    code: 'BOG-SUB',
    name: 'Showroom Suba Plaza',
    city_id: 'bogota',
    city_name: 'Bogotá & Sabana',
    address: 'Av. Suba # 115-30',
    type: 'SHOWROOM',
    area_sqm: 1400,
    monthly_rent_cop: 26000000,
    monthly_sales_target_cop: 360000000,
    actual_sales_cop: 351000000,
    credit_percentage: 82,
    cash_percentage: 18,
    monthly_credit_revenue_cop: 287820000,
    monthly_cash_revenue_cop: 63180000,
    credijamar_collection_rate: 0.862,
    active_advisors_count: 14,
    is_profitable: true,
    status: 'OPERATIVA',
  },
  {
    id: 9,
    code: 'CEN-SIB',
    name: 'CENDIS Logístico Siberia',
    city_id: 'bogota',
    city_name: 'Bogotá & Sabana',
    address: 'Autopista Medellín Km 2.5, Cota',
    type: 'CENDIS_FABRICA',
    area_sqm: 8500,
    monthly_rent_cop: 48000000,
    monthly_sales_target_cop: 0,
    actual_sales_cop: 0,
    credit_percentage: 0,
    cash_percentage: 0,
    monthly_credit_revenue_cop: 0,
    monthly_cash_revenue_cop: 0,
    credijamar_collection_rate: 1.0,
    active_advisors_count: 65,
    is_profitable: true,
    status: 'OPERATIVA',
  },

  // MEDELLÍN & ANTIOQUIA (2)
  {
    id: 10,
    code: 'MED-MAY',
    name: 'Showroom Mayorca MegaPlaza',
    city_id: 'medellin',
    city_name: 'Medellín & Antioquia',
    address: 'Cra 48 # 50 Sur-128, Sabaneta',
    type: 'SHOWROOM',
    area_sqm: 2200,
    monthly_rent_cop: 46000000,
    monthly_sales_target_cop: 560000000,
    actual_sales_cop: 582000000,
    credit_percentage: 75,
    cash_percentage: 25,
    monthly_credit_revenue_cop: 436500000,
    monthly_cash_revenue_cop: 145500000,
    credijamar_collection_rate: 0.915,
    active_advisors_count: 20,
    is_profitable: true,
    status: 'OPERATIVA',
  },
  {
    id: 11,
    code: 'MED-MOL',
    name: 'Showroom Los Molinos',
    city_id: 'medellin',
    city_name: 'Medellín & Antioquia',
    address: 'Calle 30A # 82A-26, Belén',
    type: 'SHOWROOM',
    area_sqm: 1700,
    monthly_rent_cop: 35000000,
    monthly_sales_target_cop: 420000000,
    actual_sales_cop: 438000000,
    credit_percentage: 77,
    cash_percentage: 23,
    monthly_credit_revenue_cop: 337260000,
    monthly_cash_revenue_cop: 100740000,
    credijamar_collection_rate: 0.889,
    active_advisors_count: 16,
    is_profitable: true,
    status: 'OPERATIVA',
  },

  // REGIONALES (3)
  {
    id: 12,
    code: 'CTG-PLZ',
    name: 'Showroom Cartagena (La Plazuela)',
    city_id: 'regionales',
    city_name: 'Costa & Oriente',
    address: 'Diag. 31 # 71-20, La Plazuela',
    type: 'SHOWROOM',
    area_sqm: 1800,
    monthly_rent_cop: 32000000,
    monthly_sales_target_cop: 410000000,
    actual_sales_cop: 425000000,
    credit_percentage: 83,
    cash_percentage: 17,
    monthly_credit_revenue_cop: 352750000,
    monthly_cash_revenue_cop: 72250000,
    credijamar_collection_rate: 0.881,
    active_advisors_count: 17,
    is_profitable: true,
    status: 'OPERATIVA',
  },
  {
    id: 13,
    code: 'SMR-LIB',
    name: 'Showroom Santa Marta (Av. Libertador)',
    city_id: 'regionales',
    city_name: 'Costa & Oriente',
    address: 'Av. del Libertador # 19-35',
    type: 'SHOWROOM',
    area_sqm: 1500,
    monthly_rent_cop: 25000000,
    monthly_sales_target_cop: 340000000,
    actual_sales_cop: 348000000,
    credit_percentage: 80,
    cash_percentage: 20,
    monthly_credit_revenue_cop: 278400000,
    monthly_cash_revenue_cop: 69600000,
    credijamar_collection_rate: 0.874,
    active_advisors_count: 14,
    is_profitable: true,
    status: 'OPERATIVA',
  },
  {
    id: 14,
    code: 'BUC-CAB',
    name: 'Showroom Bucaramanga (Cabecera)',
    city_id: 'regionales',
    city_name: 'Costa & Oriente',
    address: 'Cra 33 # 48-110, Cabecera',
    type: 'SHOWROOM',
    area_sqm: 1900,
    monthly_rent_cop: 36000000,
    monthly_sales_target_cop: 480000000,
    actual_sales_cop: 495000000,
    credit_percentage: 79,
    cash_percentage: 21,
    monthly_credit_revenue_cop: 391050000,
    monthly_cash_revenue_cop: 103950000,
    credijamar_collection_rate: 0.902,
    active_advisors_count: 18,
    is_profitable: true,
    status: 'OPERATIVA',
  },
];

export const JAMAR_SUMMARY: CompanySummary = {
  name: 'Muebles Jamar S.A. & Credijamar',
  currency: 'COP',
  current_balance: 1420000000, // $1.420M COP en bancos
  safe_threshold: 600000000,   // $600M COP umbral mínimo de seguridad
  has_deficit: true,
  first_deficit_date: '2026-11-28',
  days_until_deficit: 11,
  worst_deficit: -390000000,   // -$390M COP en quincena día 30
  minimum_balance: -390000000,
  health_score: 54,
  runway_days: 14,
  burn_rate_daily: 48500000,
  total_payroll: 780000000,    // $780M COP nómina consolidada nacional (1.200 trabajadores)
  total_sales_cop: 6141000000, // $6.141M COP ventas consolidadas
  national_credit_ratio: 77.2, // 77.2% Credijamar
  national_cash_ratio: 22.8,   // 22.8% Contado
  active_stores_count: 12,
  cendis_count: 2,
};

export const JAMAR_PROJECTION: ProjectionData = {
  has_deficit: true,
  minimum_balance: -390000000,
  health_score: 54,
  timeline: Array.from({ length: 40 }, (_, i) => {
    const day = i + 1;
    const baseDate = new Date(2026, 10, 17);
    baseDate.setDate(baseDate.getDate() + i);
    const dateStr = baseDate.toISOString().split('T')[0];

    let inflow = 65000000 + (Math.sin(i) * 12000000);
    let outflow = 38000000;
    const events: string[] = [];

    if (day === 5) {
      outflow += 85000000;
      events.push('⚡ Servicios Públicos Sedes');
    }
    if (day === 10) {
      outflow += 290000000;
      events.push('🏢 Arriendos Centros Comerciales');
    }
    if (day === 12) {
      outflow += 240000000;
      events.push('🪵 Proveedor Maderas Jamar Park');
    }
    if (day === 13) {
      outflow += 180000000;
      events.push('🛋️ Proveedor Espumas y Tapicería');
    }
    if (day === 14) {
      outflow += 780000000;
      events.push('👥 Nómina 1.200 Trabajadores Jamar');
    }

    let balance = 1420000000;
    for (let j = 0; j <= i; j++) {
      let dayInf = 65000000;
      let dayOut = 38000000;
      if (j + 1 === 5) dayOut += 85000000;
      if (j + 1 === 10) dayOut += 290000000;
      if (j + 1 === 12) dayOut += 240000000;
      if (j + 1 === 13) dayOut += 180000000;
      if (j + 1 === 14) dayOut += 780000000;
      balance += (dayInf - dayOut);
    }

    const isDeficit = balance < 600000000;

    return {
      date: dateStr,
      day_offset: day,
      inflow: Math.round(inflow),
      outflow: Math.round(outflow),
      net_change: Math.round(inflow - outflow),
      balance: Math.round(balance),
      pessimistic_balance: Math.round(balance * 0.91),
      expected_balance: Math.round(balance),
      optimistic_balance: Math.round(balance * 1.08),
      is_deficit: isDeficit,
      events,
    };
  }),
};

export const JAMAR_PENDING_PROPOSAL: AgentProposal = {
  id: 101,
  title: 'Plan de Contingencia y Protección de Nómina Jamar Park',
  projected_deficit: 390000000,
  deficit_date: '2026-11-28 (Día +11)',
  status: 'PENDING_APPROVAL',
  confidence_score: 96,
  action_summary: 'Campaña flash de recaudo Credijamar a 2.450 clientes en mora temprana (1-15 días) + Prórroga de 18 días en factura de madera con Maderas del Darién en Galapa sin penalidad.',
  simulated_minimum_balance: 195000000,
  actions_payload: [
    {
      type: 'CREDIJAMAR_FLASH_CAMPAIGN',
      description: 'Campaña relámpago vía WhatsApp a clientes con cuotas vencidas entre 1 y 15 días.',
      target_clients_count: 2450,
      estimated_recovery_cop: 340000000,
      discount_percentage: 100,
      reason: 'Inyectar $340M COP de liquidez fresca en 72 horas para asegurar el corte de nómina de los 1.200 empleados sin acudir a sobregiros bancarios.',
      html_email_preview: `
        <div style="font-family: Arial, sans-serif; padding: 24px; background: #fff1f2; border-left: 6px solid #D2132C;">
          <h2 style="color: #D2132C; margin: 0 0 10px;">Muebles Jamar & Credijamar: ¡Oportunidad de Condonación Especial!</h2>
          <p>Estimado cliente de la familia Jamar: Durante las próximas <strong>72 horas</strong>, te condonamos el <strong>100% de los intereses moratorios</strong> de tu cuota de muebles. Paga ahora por PSE o en tiendas y mantén tu crédito al día.</p>
        </div>
      `,
    },
    {
      type: 'DELAY_PAYMENT_GRACE_PERIOD',
      vendor_name: 'Maderas del Darién S.A.S. (Galapa)',
      description: 'Pospone factura N° MAD-8891 de insumos de pino y roble para salas.',
      amount: 240000000,
      days_delayed: 18,
      reason: 'El contrato en el CENDIS Galapa estipula 20 días de gracia sin recargo de mora ni suspensión de despachos de madera.',
      html_email_preview: `
        <div style="font-family: Arial, sans-serif; padding: 24px; background: #f8fafc; border-left: 6px solid #1E293B;">
          <h2 style="color: #1E293B; margin: 0 0 10px;">Tesorería Muebles Jamar: Notificación de Programación de Pago</h2>
          <p>Apreciados aliados de <strong>Maderas del Darién</strong>: Notificamos que la factura N° MAD-8891 por $240.000.000 COP queda agendada para desembolso el <strong>16 de Diciembre</strong>, en conformidad con la cláusula de gracia contractual de Jamar Park.</p>
        </div>
      `,
    },
  ],
};
