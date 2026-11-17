import csv
import io
import json
from datetime import date, datetime, timezone
from typing import Dict, Any, List
from sqlalchemy.orm import Session

from backend.app.models.financial import (
    Customer,
    Vendor,
    Invoice,
    ScheduledPayment,
    AuditLog,
)

def parse_and_ingest_csv(db: Session, csv_content: str, doc_type: str = "INVOICE") -> Dict[str, Any]:
    reader = csv.DictReader(io.StringIO(csv_content.strip()))
    inserted = 0
    errors = []

    for row in reader:
        try:
            if doc_type == "INVOICE":
                cust_name = row.get("customer_name", "Cliente Desconocido").strip()
                inv_num = row.get("invoice_number", f"INV-{int(datetime.now(timezone.utc).timestamp())}").strip()
                amt = float(row.get("amount", 0.0))
                due_str = row.get("due_date", date.today().isoformat()).strip()
                due_d = date.fromisoformat(due_str)

                customer = db.query(Customer).filter(Customer.name == cust_name).first()
                if not customer:
                    customer = Customer(name=cust_name, email="contacto@cliente.com")
                    db.add(customer)
                    db.flush()

                invoice = Invoice(
                    customer_id=customer.id,
                    invoice_number=inv_num,
                    amount=amt,
                    issue_date=date.today(),
                    original_due_date=due_d,
                    effective_due_date=due_d,
                    status="PENDING",
                )
                db.add(invoice)
                inserted += 1

            elif doc_type == "PAYMENT":
                ven_name = row.get("vendor_name", "Proveedor General").strip()
                desc = row.get("description", "Pago de servicio").strip()
                amt = float(row.get("amount", 0.0))
                sched_str = row.get("scheduled_date", date.today().isoformat()).strip()
                sched_d = date.fromisoformat(sched_str)
                category = row.get("category", "GENERAL").strip()

                vendor = db.query(Vendor).filter(Vendor.name == ven_name).first()
                if not vendor:
                    vendor = Vendor(name=ven_name, email="billing@vendor.com", category=category)
                    db.add(vendor)
                    db.flush()

                payment = ScheduledPayment(
                    vendor_id=vendor.id,
                    description=desc,
                    amount=amt,
                    scheduled_date=sched_d,
                    original_scheduled_date=sched_d,
                    status="SCHEDULED",
                    category=category,
                )
                db.add(payment)
                inserted += 1

        except Exception as e:
            errors.append(f"Error procesando fila {row}: {e}")

    if inserted > 0:
        audit = AuditLog(
            actor="ADMIN_INGESTION",
            action_type=f"INGEST_CSV_{doc_type}",
            details=f"Ingresados {inserted} registros de tipo {doc_type} mediante carga de archivo CSV.",
            meta={"errors": errors},
        )
        db.add(audit)
        db.commit()

    return {"success": True, "inserted_count": inserted, "errors": errors}

def parse_and_ingest_json(db: Session, json_items: List[Dict[str, Any]], doc_type: str = "INVOICE") -> Dict[str, Any]:
    inserted = 0
    errors = []

    for item in json_items:
        try:
            if doc_type == "INVOICE":
                cust_name = item.get("customer_name", "Cliente General").strip()
                inv_num = item.get("invoice_number", f"INV-{int(datetime.now(timezone.utc).timestamp())}").strip()
                amt = float(item.get("amount", 0.0))
                due_d = date.fromisoformat(str(item.get("due_date", date.today().isoformat())))

                customer = db.query(Customer).filter(Customer.name == cust_name).first()
                if not customer:
                    customer = Customer(name=cust_name, email="contacto@cliente.com")
                    db.add(customer)
                    db.flush()

                invoice = Invoice(
                    customer_id=customer.id,
                    invoice_number=inv_num,
                    amount=amt,
                    issue_date=date.today(),
                    original_due_date=due_d,
                    effective_due_date=due_d,
                    status="PENDING",
                )
                db.add(invoice)
                inserted += 1

            elif doc_type == "PAYMENT":
                ven_name = item.get("vendor_name", "Proveedor General").strip()
                desc = item.get("description", "Pago de servicio").strip()
                amt = float(item.get("amount", 0.0))
                sched_d = date.fromisoformat(str(item.get("scheduled_date", date.today().isoformat())))
                category = item.get("category", "GENERAL").strip()

                vendor = db.query(Vendor).filter(Vendor.name == ven_name).first()
                if not vendor:
                    vendor = Vendor(name=ven_name, email="billing@vendor.com", category=category)
                    db.add(vendor)
                    db.flush()

                payment = ScheduledPayment(
                    vendor_id=vendor.id,
                    description=desc,
                    amount=amt,
                    scheduled_date=sched_d,
                    original_scheduled_date=sched_d,
                    status="SCHEDULED",
                    category=category,
                )
                db.add(payment)
                inserted += 1

        except Exception as e:
            errors.append(f"Error procesando item: {e}")

    if inserted > 0:
        audit = AuditLog(
            actor="ADMIN_INGESTION",
            action_type=f"INGEST_JSON_{doc_type}",
            details=f"Ingresados {inserted} registros de tipo {doc_type} mediante API/JSON.",
            meta={"errors": errors},
        )
        db.add(audit)
        db.commit()

    return {"success": True, "inserted_count": inserted, "errors": errors}
