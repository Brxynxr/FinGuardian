import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

from backend.app.config import settings

logger = logging.getLogger(__name__)

class SnowflakeService:
    def __init__(self):
        self.account = settings.SNOWFLAKE_ACCOUNT
        self.user = settings.SNOWFLAKE_USER
        self.password = settings.SNOWFLAKE_PASSWORD
        self.role = settings.SNOWFLAKE_ROLE
        self.warehouse = settings.SNOWFLAKE_WAREHOUSE
        self.database = settings.SNOWFLAKE_DATABASE
        self.schema = settings.SNOWFLAKE_SCHEMA
        self._connected = False

    def get_connection(self):
        import snowflake.connector
        return snowflake.connector.connect(
            user=self.user,
            password=self.password,
            account=self.account,
            role=self.role,
        )

    def provision_infrastructure(self) -> Dict[str, Any]:
        """
        Executes DDL on Snowflake Cloud to create:
        - Virtual Warehouse (XSMALL, auto-suspend 60s)
        - Database & Schema
        - Analytics Tables & Initial Intelligence Seed
        """
        results = []
        try:
            conn = self.get_connection()
            cur = conn.cursor()

            # 1. Virtual Warehouse
            cur.execute(f"""
                CREATE WAREHOUSE IF NOT EXISTS {self.warehouse}
                WITH WAREHOUSE_SIZE = 'XSMALL'
                AUTO_SUSPEND = 60
                AUTO_RESUME = TRUE
                INITIALLY_SUSPENDED = TRUE;
            """)
            results.append(f"Warehouse '{self.warehouse}' provisioned successfully.")

            # 2. Database & Schema
            cur.execute(f"CREATE DATABASE IF NOT EXISTS {self.database};")
            cur.execute(f"CREATE SCHEMA IF NOT EXISTS {self.database}.{self.schema};")
            results.append(f"Database '{self.database}.{self.schema}' ready.")

            # Use new context
            cur.execute(f"USE WAREHOUSE {self.warehouse};")
            cur.execute(f"USE DATABASE {self.database};")
            cur.execute(f"USE SCHEMA {self.schema};")

            # 3. Analytics Tables
            cur.execute("""
                CREATE TABLE IF NOT EXISTS DIM_VENDORS_RISK (
                    vendor_name VARCHAR(100),
                    category VARCHAR(50),
                    grace_period_days INT,
                    tolerance_score FLOAT,
                    created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
                );
            """)

            cur.execute("""
                CREATE TABLE IF NOT EXISTS DIM_CUSTOMERS_BEHAVIOR (
                    customer_name VARCHAR(100),
                    liquidity_rating VARCHAR(20),
                    early_discount_acceptance_rate FLOAT,
                    avg_payment_delay_days INT,
                    created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
                );
            """)

            cur.execute("""
                CREATE TABLE IF NOT EXISTS FACT_FINANCIAL_DECISIONS (
                    decision_id VARCHAR(50),
                    decision_timestamp TIMESTAMP_NTZ,
                    actor VARCHAR(50),
                    action_summary TEXT,
                    projected_deficit FLOAT,
                    protected_balance FLOAT,
                    approved_channel VARCHAR(30)
                );
            """)
            results.append("Analytics tables DIM_VENDORS_RISK, DIM_CUSTOMERS_BEHAVIOR, and FACT_FINANCIAL_DECISIONS ready.")

            # 4. Seed Historical Intelligence if empty
            cur.execute("SELECT COUNT(*) FROM DIM_CUSTOMERS_BEHAVIOR;")
            count = cur.fetchone()[0]
            if count == 0:
                cur.execute("""
                    INSERT INTO DIM_CUSTOMERS_BEHAVIOR (customer_name, liquidity_rating, early_discount_acceptance_rate, avg_payment_delay_days)
                    VALUES 
                    ('Banco Digital Latam', 'HIGH', 0.88, 2),
                    ('Retail Express', 'MEDIUM', 0.65, 8),
                    ('Fintech Horizons', 'HIGH', 0.92, 1);
                """)
                cur.execute("""
                    INSERT INTO DIM_VENDORS_RISK (vendor_name, category, grace_period_days, tolerance_score)
                    VALUES 
                    ('AWS Cloud Infrastructure', 'CLOUD_INFRASTRUCTURE', 20, 0.95),
                    ('GrowthMedia Retainer', 'MARKETING', 15, 0.90),
                    ('Coworking WeWork Spaces', 'FACILITIES', 5, 0.40);
                """)
                results.append("Historical analytics data loaded to Snowflake.")

            cur.close()
            conn.close()
            self._connected = True
            return {"success": True, "messages": results}

        except Exception as e:
            logger.warning(f"Snowflake Cloud provisioning error: {e}")
            return {
                "success": False,
                "error": str(e),
                "fallback_mode": "Local mock analytics adapter active."
            }

    def sync_decision(
        self,
        decision_id: str,
        actor: str,
        summary: str,
        deficit: float,
        protected_balance: float,
        channel: str
    ) -> bool:
        """
        Inserts immutable audit decision record to Snowflake FACT_FINANCIAL_DECISIONS.
        """
        try:
            conn = self.get_connection()
            cur = conn.cursor()
            cur.execute(f"USE WAREHOUSE {self.warehouse};")
            cur.execute(f"USE DATABASE {self.database};")
            cur.execute(f"USE SCHEMA {self.schema};")

            query = """
                INSERT INTO FACT_FINANCIAL_DECISIONS 
                (decision_id, decision_timestamp, actor, action_summary, projected_deficit, protected_balance, approved_channel)
                VALUES (%s, CURRENT_TIMESTAMP(), %s, %s, %s, %s, %s);
            """
            cur.execute(query, (decision_id, actor, summary, deficit, protected_balance, channel))
            conn.commit()
            cur.close()
            conn.close()
            return True
        except Exception as e:
            logger.warning(f"Could not sync to Snowflake (offline fallback): {e}")
            return False

snowflake_service = SnowflakeService()
