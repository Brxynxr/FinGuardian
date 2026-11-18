from sqlalchemy.orm import Session
from datetime import datetime, timezone
from backend.app.database import engine, Base
from backend.app.models.jamar_models import (
    CityRegion, CategorySalesRecord, JamarStore, CredijamarLoanRecord, JamarSupplier, LocalAuditLog
)
from backend.app.models.financial import CompanyProfile, AgentProposal

def seed_jamar_database(db: Session):
    """
    Puebla la base de datos local SQLite con toda la infraestructura
    empresarial de Muebles Jamar & Credijamar (sin necesidad de Snowflake).
    """
    # 1. Asegurar creación de tablas locales
    Base.metadata.create_all(bind=engine)

    # Si ya hay sedes cargadas, no duplicar
    if db.query(CityRegion).first():
        return {"status": "ALREADY_SEEDED", "message": "Datos de Muebles Jamar ya existen en la base de datos."}

    # 2. Perfil Corporativo de Muebles Jamar S.A.
    profile = db.query(CompanyProfile).first()
    if not profile:
        profile = CompanyProfile(
            name="Muebles Jamar S.A. & Credijamar",
            current_cash_balance=1420000000.0, # $1.420M COP
            safe_cash_threshold=600000000.0,   # $600M COP
            monthly_burn_rate=780000000.0,
        )
        db.add(profile)
    else:
        profile.name = "Muebles Jamar S.A. & Credijamar"
        profile.current_cash_balance = 1420000000.0
        profile.safe_cash_threshold = 600000000.0

    # 3. Las 4 Regionales de Jamar en Colombia
    cities_data = [
        {
            "id": "barranquilla",
            "name": "Barranquilla & Atlántico",
            "department": "Atlántico",
            "stores_count": 5,
            "total_payroll_cop": 285000000.0,
            "total_rent_cop": 187000000.0,
            "local_suppliers_cop": 420000000.0,
            "monthly_sales_cop": 1742000000.0,
            "sales_target_cop": 1700000000.0,
            "credit_sales_percentage": 78.0,
            "cash_sales_percentage": 22.0,
            "credit_sales_amount_cop": 1358760000.0,
            "cash_sales_amount_cop": 383240000.0,
            "on_time_payment_rate": 91.2,
            "early_arrears_rate": 6.8,
            "late_arrears_rate": 2.0,
            "early_arrears_amount_cop": 92400000.0,
            "active_clients_count": 4820,
            "categories": [
                {"category": "Salas & Sofás", "icon": "🛋️", "amount": 766480000.0, "pct": 44.0, "units": 260},
                {"category": "Alcobas & Cuartos", "icon": "🛏️", "amount": 557440000.0, "pct": 32.0, "units": 340},
                {"category": "Comedores & Bares", "icon": "🪑", "amount": 278720000.0, "pct": 16.0, "units": 125},
                {"category": "Muebles TV & Estudio", "icon": "📺", "amount": 139360000.0, "pct": 8.0, "units": 90},
            ]
        },
        {
            "id": "bogota",
            "name": "Bogotá & Sabana",
            "department": "Cundinamarca",
            "stores_count": 4,
            "total_payroll_cop": 240000000.0,
            "total_rent_cop": 170000000.0,
            "local_suppliers_cop": 95000000.0,
            "monthly_sales_cop": 2111000000.0,
            "sales_target_cop": 2050000000.0,
            "credit_sales_percentage": 74.0,
            "cash_sales_percentage": 26.0,
            "credit_sales_amount_cop": 1562140000.0,
            "cash_sales_amount_cop": 548860000.0,
            "on_time_payment_rate": 90.4,
            "early_arrears_rate": 7.2,
            "late_arrears_rate": 2.4,
            "early_arrears_amount_cop": 112500000.0,
            "active_clients_count": 5410,
            "categories": [
                {"category": "Salas & Sofás", "icon": "🛋️", "amount": 802180000.0, "pct": 38.0, "units": 250},
                {"category": "Alcobas & Cuartos", "icon": "🛏️", "amount": 633300000.0, "pct": 30.0, "units": 370},
                {"category": "Comedores & Bares", "icon": "🪑", "amount": 464420000.0, "pct": 22.0, "units": 185},
                {"category": "Muebles TV & Estudio", "icon": "📺", "amount": 211100000.0, "pct": 10.0, "units": 130},
            ]
        },
        {
            "id": "medellin",
            "name": "Medellín & Antioquia",
            "department": "Antioquia",
            "stores_count": 2,
            "total_payroll_cop": 135000000.0,
            "total_rent_cop": 81000000.0,
            "local_suppliers_cop": 45000000.0,
            "monthly_sales_cop": 1020000000.0,
            "sales_target_cop": 980000000.0,
            "credit_sales_percentage": 76.0,
            "cash_sales_percentage": 24.0,
            "credit_sales_amount_cop": 775200000.0,
            "cash_sales_amount_cop": 244800000.0,
            "on_time_payment_rate": 90.2,
            "early_arrears_rate": 7.4,
            "late_arrears_rate": 2.4,
            "early_arrears_amount_cop": 57300000.0,
            "active_clients_count": 2750,
            "categories": [
                {"category": "Salas & Sofás", "icon": "🛋️", "amount": 418200000.0, "pct": 41.0, "units": 135},
                {"category": "Alcobas & Cuartos", "icon": "🛏️", "amount": 336600000.0, "pct": 33.0, "units": 210},
                {"category": "Comedores & Bares", "icon": "🪑", "amount": 183600000.0, "pct": 18.0, "units": 80},
                {"category": "Muebles TV & Estudio", "icon": "📺", "amount": 81600000.0, "pct": 8.0, "units": 50},
            ]
        },
        {
            "id": "regionales",
            "name": "Costa & Oriente",
            "department": "Bolívar / Magdalena / Santander",
            "stores_count": 3,
            "total_payroll_cop": 120000000.0,
            "total_rent_cop": 93000000.0,
            "local_suppliers_cop": 38000000.0,
            "monthly_sales_cop": 1268000000.0,
            "sales_target_cop": 1230000000.0,
            "credit_sales_percentage": 81.0,
            "cash_sales_percentage": 19.0,
            "credit_sales_amount_cop": 1027080000.0,
            "cash_sales_amount_cop": 240920000.0,
            "on_time_payment_rate": 88.5,
            "early_arrears_rate": 8.6,
            "late_arrears_rate": 2.9,
            "early_arrears_amount_cop": 88300000.0,
            "active_clients_count": 3320,
            "categories": [
                {"category": "Salas & Sofás", "icon": "🛋️", "amount": 583280000.0, "pct": 46.0, "units": 190},
                {"category": "Alcobas & Cuartos", "icon": "🛏️", "amount": 431120000.0, "pct": 34.0, "units": 270},
                {"category": "Comedores & Bares", "icon": "🪑", "amount": 177520000.0, "pct": 14.0, "units": 75},
                {"category": "Muebles TV & Estudio", "icon": "📺", "amount": 76080000.0, "pct": 6.0, "units": 45},
            ]
        },
    ]

    for c in cities_data:
        city = CityRegion(
            id=c["id"],
            name=c["name"],
            department=c["department"],
            stores_count=c["stores_count"],
            total_payroll_cop=c["total_payroll_cop"],
            total_rent_cop=c["total_rent_cop"],
            local_suppliers_cop=c["local_suppliers_cop"],
            monthly_sales_cop=c["monthly_sales_cop"],
            sales_target_cop=c["sales_target_cop"],
            credit_sales_percentage=c["credit_sales_percentage"],
            cash_sales_percentage=c["cash_sales_percentage"],
            credit_sales_amount_cop=c["credit_sales_amount_cop"],
            cash_sales_amount_cop=c["cash_sales_amount_cop"],
            on_time_payment_rate=c["on_time_payment_rate"],
            early_arrears_rate=c["early_arrears_rate"],
            late_arrears_rate=c["late_arrears_rate"],
            early_arrears_amount_cop=c["early_arrears_amount_cop"],
            active_clients_count=c["active_clients_count"],
        )
        db.add(city)

        for cat in c["categories"]:
            cat_rec = CategorySalesRecord(
                city_id=c["id"],
                category=cat["category"],
                icon=cat["icon"],
                amount_cop=cat["amount"],
                percentage=cat["pct"],
                units_sold=cat["units"],
            )
            db.add(cat_rec)

    # 4. Las 14 Tiendas Físicas de Jamar
    stores_data = [
        # Barranquilla
        {"code": "BAQ-BOL", "name": "Showroom Paseo Bolívar (Insignia)", "city_id": "barranquilla", "address": "Paseo Bolívar # 40-52", "type": "SHOWROOM", "area": 2400, "rent": 32000000, "target": 450000000, "sales": 462000000, "credit_pct": 82, "cash_pct": 18, "advisors": 22},
        {"code": "BAQ-72", "name": "Showroom Norte Calle 72", "city_id": "barranquilla", "address": "Calle 72 # 48-15", "type": "SHOWROOM", "area": 1800, "rent": 38000000, "target": 500000000, "sales": 524000000, "credit_pct": 72, "cash_pct": 28, "advisors": 18},
        {"code": "BAQ-MUR", "name": "Showroom Murillo (Sur)", "city_id": "barranquilla", "address": "Av. Murillo # 21-40", "type": "SHOWROOM", "area": 1500, "rent": 24000000, "target": 350000000, "sales": 342000000, "credit_pct": 84, "cash_pct": 16, "advisors": 15},
        {"code": "BAQ-SOL", "name": "Showroom Soledad (Gran Plaza)", "city_id": "barranquilla", "address": "C.C. Gran Plaza del Sol", "type": "SHOWROOM", "area": 1600, "rent": 28000000, "target": 400000000, "sales": 414000000, "credit_pct": 85, "cash_pct": 15, "advisors": 16},
        {"code": "CEN-GAL", "name": "CENDIS & CILA Clúster Galapa", "city_id": "barranquilla", "address": "Km 3 Vía Galapa - Fábrica", "type": "CENDIS_FABRICA", "area": 14500, "rent": 65000000, "target": 0, "sales": 0, "credit_pct": 0, "cash_pct": 0, "advisors": 120},

        # Bogotá
        {"code": "BOG-PAL", "name": "Megatienda Paloquemao (Insignia)", "city_id": "bogota", "address": "Cra 22 # 17-45", "type": "SHOWROOM", "area": 3200, "rent": 52000000, "target": 750000000, "sales": 785000000, "credit_pct": 71, "cash_pct": 29, "advisors": 28},
        {"code": "BOG-134", "name": "Showroom Autopista Norte 134", "city_id": "bogota", "address": "Autopista Norte # 134-20", "type": "SHOWROOM", "area": 2100, "rent": 44000000, "target": 580000000, "sales": 615000000, "credit_pct": 68, "cash_pct": 32, "advisors": 20},
        {"code": "BOG-SUB", "name": "Showroom Suba Plaza", "city_id": "bogota", "address": "Av. Suba # 115-30", "type": "SHOWROOM", "area": 1400, "rent": 26000000, "target": 360000000, "sales": 351000000, "credit_pct": 82, "cash_pct": 18, "advisors": 14},
        {"code": "CEN-SIB", "name": "CENDIS Logístico Siberia", "city_id": "bogota", "address": "Autopista Medellín Km 2.5", "type": "CENDIS_FABRICA", "area": 8500, "rent": 48000000, "target": 0, "sales": 0, "credit_pct": 0, "cash_pct": 0, "advisors": 65},

        # Medellín
        {"code": "MED-MAY", "name": "Showroom Mayorca MegaPlaza", "city_id": "medellin", "address": "Cra 48 # 50 Sur-128", "type": "SHOWROOM", "area": 2200, "rent": 46000000, "target": 560000000, "sales": 582000000, "credit_pct": 75, "cash_pct": 25, "advisors": 20},
        {"code": "MED-MOL", "name": "Showroom Los Molinos", "city_id": "medellin", "address": "Calle 30A # 82A-26", "type": "SHOWROOM", "area": 1700, "rent": 35000000, "target": 420000000, "sales": 438000000, "credit_pct": 77, "cash_pct": 23, "advisors": 16},

        # Regionales
        {"code": "CTG-PLZ", "name": "Showroom Cartagena La Plazuela", "city_id": "regionales", "address": "Diag. 31 # 71-20", "type": "SHOWROOM", "area": 1800, "rent": 32000000, "target": 410000000, "sales": 425000000, "credit_pct": 83, "cash_pct": 17, "advisors": 17},
        {"code": "SMR-LIB", "name": "Showroom Santa Marta Libertador", "city_id": "regionales", "address": "Av. Libertador # 19-35", "type": "SHOWROOM", "area": 1500, "rent": 25000000, "target": 340000000, "sales": 348000000, "credit_pct": 80, "cash_pct": 20, "advisors": 14},
        {"code": "BUC-CAB", "name": "Showroom Bucaramanga Cabecera", "city_id": "regionales", "address": "Cra 33 # 48-110", "type": "SHOWROOM", "area": 1900, "rent": 36000000, "target": 480000000, "sales": 495000000, "credit_pct": 79, "cash_pct": 21, "advisors": 18},
    ]

    for s in stores_data:
        credit_amount = s["sales"] * (s["credit_pct"] / 100.0)
        cash_amount = s["sales"] * (s["cash_pct"] / 100.0)
        store = JamarStore(
            code=s["code"],
            name=s["name"],
            city_id=s["city_id"],
            address=s["address"],
            type=s["type"],
            area_sqm=s["area"],
            monthly_rent_cop=s["rent"],
            monthly_sales_target_cop=s["target"],
            actual_sales_cop=s["sales"],
            credit_percentage=s["credit_pct"],
            cash_percentage=s["cash_pct"],
            monthly_credit_revenue_cop=credit_amount,
            monthly_cash_revenue_cop=cash_amount,
            credijamar_collection_rate=0.91 if s["type"] == "SHOWROOM" else 1.0,
            active_advisors_count=s["advisors"],
            is_profitable=True,
            status="OPERATIVA",
        )
        db.add(store)

    # 5. Proveedores Industriales de Jamar Park en Galapa
    suppliers_data = [
        {"name": "Maderas del Darién S.A.S.", "city": "barranquilla", "cat": "MADERA", "inv": "MAD-8891", "amount": 240000000.0, "due": "2026-11-29", "grace": 20},
        {"name": "Espumas del Litoral S.A.", "city": "barranquilla", "cat": "ESPUMA", "inv": "ESP-4412", "amount": 180000000.0, "due": "2026-11-30", "grace": 15},
        {"name": "Logística & Flota Siberia", "city": "bogota", "cat": "FLETES", "inv": "LOG-1029", "amount": 95000000.0, "due": "2026-11-28", "grace": 10},
    ]

    for sup in suppliers_data:
        sp = JamarSupplier(
            vendor_name=sup["name"],
            city_id=sup["city"],
            category=sup["cat"],
            invoice_number=sup["inv"],
            amount_due_cop=sup["amount"],
            original_due_date=sup["due"],
            effective_due_date=sup["due"],
            grace_period_days=sup["grace"],
            status="PROGRAMADO",
        )
        db.add(sp)

    # 6. Muestra representativa de Créditos Credijamar
    sample_loans = [
        {"code": "CREDI-1001", "name": "Familia Navarro Gómez", "doc": "CC 72.190.231", "city": "barranquilla", "store": "BAQ-72", "cat": "Salas & Sofás", "loan": 3200000.0, "inst": 135000.0, "status": "AL_DIA", "days": 0},
        {"code": "CREDI-1002", "name": "Familia Orozco Cantillo", "doc": "CC 1.045.289.112", "city": "barranquilla", "store": "BAQ-SOL", "cat": "Alcobas & Cuartos", "loan": 2800000.0, "inst": 120000.0, "status": "MORA_1_15", "days": 8},
        {"code": "CREDI-1003", "name": "Carlos Julio Peñaranda", "doc": "CC 19.458.712", "city": "bogota", "store": "BOG-PAL", "cat": "Comedores & Bares", "loan": 4100000.0, "inst": 180000.0, "status": "AL_DIA", "days": 0},
        {"code": "CREDI-1004", "name": "Martha Lucia Restrepo", "doc": "CC 43.190.450", "city": "medellin", "store": "MED-MAY", "cat": "Salas & Sofás", "loan": 2500000.0, "inst": 110000.0, "status": "MORA_1_15", "days": 6},
        {"code": "CREDI-1005", "name": "Familia Angulo Puerta", "doc": "CC 8.790.312", "city": "regionales", "store": "CTG-PLZ", "cat": "Alcobas & Cuartos", "loan": 1900000.0, "inst": 85000.0, "status": "MORA_1_15", "days": 11},
    ]

    for loan in sample_loans:
        rec = CredijamarLoanRecord(
            loan_code=loan["code"],
            customer_name=loan["name"],
            customer_id_doc=loan["doc"],
            city_id=loan["city"],
            store_code=loan["store"],
            product_category=loan["cat"],
            total_loan_amount_cop=loan["loan"],
            installment_amount_cop=loan["inst"],
            due_date="2026-11-20",
            status=loan["status"],
            days_overdue=loan["days"],
            interest_waive_offered=False,
        )
        db.add(rec)

    # 7. Propuesta de Rescate Inicial
    from datetime import date
    initial_proposal = AgentProposal(
        title="Plan de Contingencia y Protección de Nómina Jamar Park",
        projected_deficit=390000000.0,
        deficit_date=date(2026, 11, 28),
        status="PENDING_APPROVAL",
        confidence_score=96.0,
        action_summary="Campaña flash de recaudo Credijamar a 2.450 clientes en mora temprana (1-15 días) + Prórroga de 18 días en factura de madera con Maderas del Darién en Galapa sin mora.",
        actions_payload=[
            {
                "type": "CREDIJAMAR_FLASH_CAMPAIGN",
                "description": "Campaña relámpago vía WhatsApp a clientes con cuotas vencidas entre 1 y 15 días.",
                "target_clients_count": 2450,
                "estimated_recovery_cop": 340000000.0,
                "discount_percentage": 100,
                "reason": "Inyectar $340M COP de liquidez en 72 horas para asegurar el corte de nómina de 1.200 trabajadores.",
            },
            {
                "type": "DELAY_PAYMENT_GRACE_PERIOD",
                "vendor_name": "Maderas del Darién S.A.S. (Galapa)",
                "description": "Pospone factura N° MAD-8891 de insumos de madera.",
                "amount": 240000000.0,
                "days_delayed": 18,
                "reason": "El contrato en CENDIS Galapa estipula 20 días de gracia sin recargo de mora.",
            }
        ]
    )
    db.add(initial_proposal)

    # 8. Registro de Auditoría Local
    audit = LocalAuditLog(
        actor="SISTEMA_LOCAL",
        action_type="INICIALIZACION_JAMAR",
        action_summary="Se inicializó el entorno operativo local de Muebles Jamar S.A. con 14 sedes, 4 regionales y cartera Credijamar.",
        protected_balance_cop=1420000000.0,
        details={"stores_seeded": 14, "cities_seeded": 4}
    )
    db.add(audit)

    db.commit()
    return {"status": "SUCCESS", "message": "Base de datos local de Muebles Jamar creada y poblada exitosamente."}
