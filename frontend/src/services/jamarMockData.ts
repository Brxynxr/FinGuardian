import { StoreLocation, CredijamarPortfolio, CompanySummary, ProjectionData, AgentProposal, ScheduledPayment, AuditLog } from '../types';

export const JAMAR_STORES: StoreLocation[] = [
  // BARRANQUILLA & ATLÁNTICO (5)
  {
    id: 1,
    code: 'BAQ-BOL',
    name: 'Showroom Paseo Bolívar (Insignia Histórica)',
    city: 'Barranquilla',
    address: 'Paseo Bolívar # 40-52, Centro',
    type: 'SHOWROOM',
    area_sqm: 2400,
    monthly_rent_cop: 32000000,
    monthly_sales_target_cop: 450000000,
    actual_sales_cop: 462000000,
    credijamar_collection_rate: 0.912,
    active_advisors_count: 22,
    is_profitable: true,
    status: 'OPERATIVA',
  },
  {
    id: 2,
    code: 'BAQ-72',
    name: 'Showroom Norte Calle 72',
    city: 'Barranquilla',
    address: 'Calle 72 # 48-15, Alto Prado',
    type: 'SHOWROOM',
    area_sqm: 1800,
    monthly_rent_cop: 38000000,
    monthly_sales_target_cop: 500000000,
    actual_sales_cop: 524000000,
    credijamar_collection_rate: 0.941,
    active_advisors_count: 18,
    is_profitable: true,
    status: 'OPERATIVA',
  },
  {
    id: 3,
    code: 'BAQ-MUR',
    name: 'Showroom Murillo (Sur)',
    city: 'Barranquilla',
    address: 'Av. Murillo # 21-40',
    type: 'SHOWROOM',
    area_sqm: 1500,
    monthly_rent_cop: 24000000,
    monthly_sales_target_cop: 350000000,
    actual_sales_cop: 342000000,
    credijamar_collection_rate: 0.878,
    active_advisors_count: 15,
    is_profitable: true,
    status: 'OPERATIVA',
  },
  {
    id: 4,
    code: 'BAQ-SOL',
    name: 'Showroom Soledad (Gran Plaza)',
    city: 'Barranquilla',
    address: 'C.C. Gran Plaza del Sol, Local 140',
    type: 'SHOWROOM',
    area_sqm: 1600,
    monthly_rent_cop: 28000000,
    monthly_sales_target_cop: 400000000,
    actual_sales_cop: 412000000,
    credijamar_collection_rate: 0.865,
    active_advisors_count: 16,
    is_profitable: true,
    status: 'OPERATIVA',
  },
  {
    id: 5,
    code: 'CEN-GAL',
    name: 'CENDIS & CILA Clúster Industrial Galapa',
    city: 'Barranquilla',
    address: 'Km 3 Vía Galapa - Parque Industrial',
    type: 'CENDIS_FABRICA',
    area_sqm: 14500,
    monthly_rent_cop: 65000000,
    monthly_sales_target_cop: 0,
    actual_sales_cop: 0,
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
    city: 'Bogotá',
    address: 'Cra 22 # 17-45, Paloquemao',
    type: 'SHOWROOM',
    area_sqm: 3200,
    monthly_rent_cop: 52000000,
    monthly_sales_target_cop: 750000000,
    actual_sales_cop: 785000000,
    credijamar_collection_rate: 0.904,
    active_advisors_count: 28,
    is_profitable: true,
    status: 'OPERATIVA',
  },
  {
    id: 7,
    code: 'BOG-134',
    name: 'Showroom Autopista Norte (Calle 134)',
    city: 'Bogotá',
    address: 'Autopista Norte # 134-20',
    type: 'SHOWROOM',
    area_sqm: 2100,
    monthly_rent_cop: 44000000,
    monthly_sales_target_cop: 580000000,
    actual_sales_cop: 615000000,
    credijamar_collection_rate: 0.923,
    active_advisors_count: 20,
    is_profitable: true,
    status: 'OPERATIVA',
  },
  {
    id: 8,
    code: 'BOG-SUB',
    name: 'Showroom Suba Plaza',
    city: 'Bogotá',
    address: 'Av. Suba # 115-30',
    type: 'SHOWROOM',
    area_sqm: 1400,
    monthly_rent_cop: 26000000,
    monthly_sales_target_cop: 360000000,
    actual_sales_cop: 351000000,
    credijamar_collection_rate: 0.862,
    active_advisors_count: 14,
    is_profitable: true,
    status: 'OPERATIVA',
  },
  {
    id: 9,
    code: 'CEN-SIB',
    name: 'CENDIS Logístico Siberia',
    city: 'Bogotá',
    address: 'Autopista Medellín Km 2.5, Cota',
    type: 'CENDIS_FABRICA',
    area_sqm: 8500,
    monthly_rent_cop: 48000000,
    monthly_sales_target_cop: 0,
    actual_sales_cop: 0,
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
    city: 'Medellín',
    address: 'Cra 48 # 50 Sur-128, Sabaneta',
    type: 'SHOWROOM',
    area_sqm: 2200,
    monthly_rent_cop: 46000000,
    monthly_sales_target_cop: 560000000,
    actual_sales_cop: 582000000,
    credijamar_collection_rate: 0.915,
    active_advisors_count: 20,
    is_profitable: true,
    status: 'OPERATIVA',
  },
  {
    id: 11,
    code: 'MED-MOL',
    name: 'Showroom Los Molinos',
    city: 'Medellín',
    address: 'Calle 30A # 82A-26, Belén',
    type: 'SHOWROOM',
    area_sqm: 1700,
    monthly_rent_cop: 35000000,
    monthly_sales_target_cop: 420000000,
    actual_sales_cop: 438000000,
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
    city: 'Regionales',
    address: 'Diag. 31 # 71-20, La Plazuela',
    type: 'SHOWROOM',
    area_sqm: 1800,
    monthly_rent_cop: 32000000,
    monthly_sales_target_cop: 410000000,
    actual_sales_cop: 425000000,
    credijamar_collection_rate: 0.881,
    active_advisors_count: 17,
    is_profitable: true,
    status: 'OPERATIVA',
  },
  {
    id: 13,
    code: 'SMR-LIB',
    name: 'Showroom Santa Marta (Av. Libertador)',
    city: 'Regionales',
    address: 'Av. del Libertador # 19-35',
    type: 'SHOWROOM',
    area_sqm: 1500,
    monthly_rent_cop: 25000000,
    monthly_sales_target_cop: 340000000,
    actual_sales_cop: 348000000,
    credijamar_collection_rate: 0.874,
    active_advisors_count: 14,
    is_profitable: true,
    status: 'OPERATIVA',
  },
  {
    id: 14,
    code: 'BUC-CAB',
    name: 'Showroom Bucaramanga (Cabecera)',
    city: 'Regionales',
    address: 'Cra 33 # 48-110, Cabecera',
    type: 'SHOWROOM',
    area_sqm: 1900,
    monthly_rent_cop: 36000000,
    monthly_sales_target_cop: 480000000,
    actual_sales_cop: 495000000,
    credijamar_collection_rate: 0.902,
    active_advisors_count: 18,
    is_profitable: true,
    status: 'OPERATIVA',
  },
];

export const JAMAR_CREDIJAMAR_PORTFOLIO: CredijamarPortfolio = {
  total_active_loans_cop: 14250000000, // $14.250M COP
  on_time_loans_cop: 12696000000,      // $12.696M COP (89.1%)
  on_time_rate: 0.891,
  early_arrears_cop: 895000000,        // $895M COP (Mora 1 a 15 días - Objetivo Rescate)
  early_arrears_clients_count: 2450,
  mid_arrears_cop: 420000000,          // $420M COP (Mora 16 a 60 días)
  late_arrears_cop: 239000000,         // $239M COP (Mora > 60 días)
  potential_rescue_injection_cop: 340000000, // Recaudo en 72h con descuento de mora
};

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
  health_score: 54,            // Alerta Amarilla/Roja
  runway_days: 14,
  burn_rate_daily: 48500000,
  total_payroll: 780000000,    // $780M COP nómina de asesores y planta
  active_stores_count: 12,
  cendis_count: 2,
};

// Generador de línea de tiempo con la caída en día 30 (nómina de tiendas + pago de madera/espuma)
export const JAMAR_PROJECTION: ProjectionData = {
  has_deficit: true,
  minimum_balance: -390000000,
  health_score: 54,
  timeline: Array.from({ length: 40 }, (_, i) => {
    const day = i + 1;
    const baseDate = new Date(2026, 10, 17); // Nov 17 2026
    baseDate.setDate(baseDate.getDate() + i);
    const dateStr = baseDate.toISOString().split('T')[0];

    // Recaudo diario normal de Credijamar (~$65M COP promedio)
    let inflow = 65000000 + (Math.sin(i) * 12000000);
    let outflow = 38000000;
    const events: string[] = [];

    // Día 5: Pago de servicios públicos de tiendas ($85M COP)
    if (day === 5) {
      outflow += 85000000;
      events.push('⚡ Servicios Públicos Sedes');
    }
    // Día 10: Arriendos comerciales de centros comerciales ($290M COP)
    if (day === 10) {
      outflow += 290000000;
      events.push('🏢 Arriendos Centros Comerciales');
    }
    // Día 12: Factura de Maderas del Darién ($240M COP)
    if (day === 12) {
      outflow += 240000000;
      events.push('🪵 Proveedor Maderas Jamar Park');
    }
    // Día 13: Factura de Espumas del Litoral ($180M COP)
    if (day === 13) {
      outflow += 180000000;
      events.push('🛋️ Proveedor Espumas y Tapicería');
    }
    // Día 14: Nómina masiva de tiendas y operarios CILA ($780M COP)
    if (day === 14) {
      outflow += 780000000;
      events.push('👥 Nómina 1.200 Trabajadores Jamar');
    }

    // Cálculo acumulado simulado
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
  action_summary: 'Campaña flash de recaudo Credijamar a 2.450 clientes en mora temprana (1-15 días) + Prórroga de 18 días en factura de madera con Maderas del Darién aprovechando días de gracia contractuales sin mora.',
  simulated_minimum_balance: 195000000, // Pasa de -$390M a +$195M COP protegidos
  actions_payload: [
    {
      type: 'CREDIJAMAR_FLASH_CAMPAIGN',
      description: 'Campaña relámpago vía WhatsApp a clientes con cuotas vencidas entre 1 y 15 días.',
      target_clients_count: 2450,
      estimated_recovery_cop: 340000000,
      discount_percentage: 100, // 100% de condonación de intereses moratorios si pagan en 72h
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
