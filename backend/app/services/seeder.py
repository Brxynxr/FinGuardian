from datetime import date, timedelta
from sqlalchemy.orm import Session
from backend.app.models.financial import (
    CompanyProfile,
    Employee,
    Vendor,
    Customer,
    ScheduledPayment,
    Invoice,
    AuditLog,
    AgentProposal,
    BusinessRule,
)

def seed_demo_data(db: Session, reset_existing: bool = True):
    if reset_existing:
        db.query(AuditLog).delete()
        db.query(AgentProposal).delete()
        db.query(ScheduledPayment).delete()
        db.query(Invoice).delete()
        db.query(Vendor).delete()
        db.query(Customer).delete()
        db.query(Employee).delete()
        db.query(BusinessRule).delete()
        db.query(CompanyProfile).delete()
        db.commit()

    # 1. Company Profile
    company = CompanyProfile(
        name="InnovaCloud Tech SAS",
        current_cash_balance=5000.0,
        safe_cash_threshold=2000.0,
        monthly_burn_rate=14050.0,
    )
    db.add(company)
    db.flush()

    # 2. Employees (360 Tech Team)
    employees = [
        Employee(
            full_name="Carlos Mendoza",
            role_title="Tech Lead & Cloud Architect",
            email="carlos.mendoza@innovacloud.tech",
            monthly_salary=3200.0,
            benefits_cost=480.0,
            payment_cutoff_day=30,
        ),
        Employee(
            full_name="Andrea Silva",
            role_title="Senior Backend Developer (Python/Go)",
            email="andrea.silva@innovacloud.tech",
            monthly_salary=2400.0,
            benefits_cost=360.0,
            payment_cutoff_day=30,
        ),
        Employee(
            full_name="Mateo Rios",
            role_title="Frontend Developer (React/TS)",
            email="mateo.rios@innovacloud.tech",
            monthly_salary=1800.0,
            benefits_cost=270.0,
            payment_cutoff_day=30,
        ),
        Employee(
            full_name="Valentina Gomez",
            role_title="Product & UI/UX Designer",
            email="valentina.gomez@innovacloud.tech",
            monthly_salary=1500.0,
            benefits_cost=225.0,
            payment_cutoff_day=30,
        ),
        Employee(
            full_name="Daniel Castro",
            role_title="QA Engineer & Test Automation",
            email="daniel.castro@innovacloud.tech",
            monthly_salary=1200.0,
            benefits_cost=180.0,
            payment_cutoff_day=30,
        ),
    ]
    db.add_all(employees)
    db.flush()

    # 3. Vendors (Services & Fixed Operational Costs)
    vendor_aws = Vendor(
        name="AWS Cloud Infrastructure",
        email="billing@amazon.com",
        category="CLOUD_INFRASTRUCTURE",
        relationship_status="FLEXIBLE",
        grace_period_days=20,
        daily_penalty_rate=0.0,
    )
    vendor_growth = Vendor(
        name="GrowthPulse Media Retainer",
        email="facturacion@growthpulse.agency",
        category="SAAS",
        relationship_status="FLEXIBLE",
        grace_period_days=15,
        daily_penalty_rate=0.0003,
    )
    vendor_wework = Vendor(
        name="Coworking WeWork Spaces (Sede Principal)",
        email="billing@wework.com",
        category="FACILITIES",
        relationship_status="STRICT",
        grace_period_days=3,
        daily_penalty_rate=0.002,
    )
    vendor_saas = Vendor(
        name="DevTools SaaS Suite (GitHub, Figma, Google)",
        email="sales@devtools.io",
        category="SAAS",
        relationship_status="FLEXIBLE",
        grace_period_days=14,
        daily_penalty_rate=0.0,
    )
    vendor_taxes = Vendor(
        name="Seguridad Social y Parafiscales Nómina",
        email="aportes@seguridadsocial.gov",
        category="GENERAL",
        relationship_status="CRITICAL",
        grace_period_days=0,
        daily_penalty_rate=0.005,
    )
    db.add_all([vendor_aws, vendor_growth, vendor_wework, vendor_saas, vendor_taxes])
    db.flush()

    # 4. Customers (Receivables arriving late in month)
    cust_banco = Customer(
        name="Banco Digital Latam",
        email="tesoreria@bancodigitallatam.com",
        contact_person="Marta Restrepo (Directora de Compras)",
        liquidity_rating="HIGH",
        discount_responsiveness=0.88,
    )
    cust_retail = Customer(
        name="Retail Express Latam",
        email="finanzas@retailexpress.com",
        contact_person="Jorge Silva (Contralor)",
        liquidity_rating="MEDIUM",
        discount_responsiveness=0.65,
    )
    cust_fintech = Customer(
        name="Fintech Horizons Inc",
        email="accounts@fintechhorizons.com",
        contact_person="Elena Diaz (VP Engineering)",
        liquidity_rating="HIGH",
        discount_responsiveness=0.92,
    )
    db.add_all([cust_banco, cust_retail, cust_fintech])
    db.flush()

    today = date.today()

    # 5. Invoices (Receivables)
    inv_banco = Invoice(
        customer_id=cust_banco.id,
        invoice_number="FAC-2026-101",
        amount=14000.0,
        issue_date=today - timedelta(days=12),
        original_due_date=today + timedelta(days=26),
        effective_due_date=today + timedelta(days=26),
        status="PENDING",
        discount_offered=0.0,
    )
    inv_retail = Invoice(
        customer_id=cust_retail.id,
        invoice_number="FAC-2026-102",
        amount=6500.0,
        issue_date=today - timedelta(days=5),
        original_due_date=today + timedelta(days=28),
        effective_due_date=today + timedelta(days=28),
        status="PENDING",
        discount_offered=0.0,
    )
    inv_fintech = Invoice(
        customer_id=cust_fintech.id,
        invoice_number="FAC-2026-103",
        amount=4800.0,
        issue_date=today - timedelta(days=2),
        original_due_date=today + timedelta(days=32),
        effective_due_date=today + timedelta(days=32),
        status="PENDING",
        discount_offered=0.0,
    )
    db.add_all([inv_banco, inv_retail, inv_fintech])

    # 6. Scheduled Payments (Payables in next 14 days)
    pay_wework = ScheduledPayment(
        vendor_id=vendor_wework.id,
        description="Canon Arrendamiento Oficinas y Puestos Coworking",
        amount=1200.0,
        scheduled_date=today + timedelta(days=3),
        original_scheduled_date=today + timedelta(days=3),
        status="SCHEDULED",
        category="FACILITIES",
    )
    pay_aws = ScheduledPayment(
        vendor_id=vendor_aws.id,
        description="Servidores AWS Cloud (Kubernetes & RDS Producción)",
        amount=2100.0,
        scheduled_date=today + timedelta(days=7),
        original_scheduled_date=today + timedelta(days=7),
        status="SCHEDULED",
        category="CLOUD_INFRASTRUCTURE",
    )
    pay_growth = ScheduledPayment(
        vendor_id=vendor_growth.id,
        description="Retainer Agencia Growth y Campañas de Adquisición",
        amount=1400.0,
        scheduled_date=today + timedelta(days=9),
        original_scheduled_date=today + timedelta(days=9),
        status="SCHEDULED",
        category="SAAS",
    )
    pay_saas = ScheduledPayment(
        vendor_id=vendor_saas.id,
        description="Licencias de Desarrollo (GitHub Enterprise + Figma + Workspace)",
        amount=650.0,
        scheduled_date=today + timedelta(days=11),
        original_scheduled_date=today + timedelta(days=11),
        status="SCHEDULED",
        category="SAAS",
    )
    pay_taxes = ScheduledPayment(
        vendor_id=vendor_taxes.id,
        description="Aportes Parafiscales y Seguridad Social Nómina Desarrolladores",
        amount=1515.0,
        scheduled_date=today + timedelta(days=14),
        original_scheduled_date=today + timedelta(days=14),
        status="SCHEDULED",
        category="PAYROLL",
    )
    db.add_all([pay_wework, pay_aws, pay_growth, pay_saas, pay_taxes])

    # 7. Business Rules
    rule_payroll = BusinessRule(
        rule_name="PAYROLL_CUTOFF_DAY",
        rule_category="PAYROLL",
        rule_value_json={"cutoff_day": 30, "currency": "USD", "auto_payout": False},
        description="Día de pago de nómina de los ingenieros de software.",
    )
    rule_reserve = BusinessRule(
        rule_name="MINIMUM_CASH_RESERVE",
        rule_category="TREASURY",
        rule_value_json={"safe_threshold": 2000.0, "currency": "USD"},
        description="Saldo mínimo en cuenta antes de activar el protocolo de alerta.",
    )
    db.add_all([rule_payroll, rule_reserve])

    # Audit initialization
    audit = AuditLog(
        actor="SYSTEM",
        action_type="INITIALIZE_COMPANY_DATABASE",
        details="Base de datos de InnovaCloud Tech SAS inicializada con 5 empleados, 5 pagos de servicios y 3 facturas de clientes.",
        meta={"initial_cash": 5000.0, "employees_count": 5},
        snowflake_synced=True,
    )
    db.add(audit)
    db.commit()
