import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timezone
from sqlalchemy.orm import Session

from backend.app.config import settings
from backend.app.models.financial import OutboxEmail

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self, db: Session):
        self.db = db
        self.sender = settings.GMAIL_SENDER
        self.password = settings.GMAIL_APP_PASSWORD
        self.host = settings.SMTP_HOST
        self.port = settings.SMTP_PORT

    def send_html_email(self, to_email: str, subject: str, html_body: str, text_body: str = "") -> OutboxEmail:
        """
        Sends genuine multipart/alternative HTML email via Gmail SSL and logs to OutboxEmail table.
        """
        plain_text = text_body or "Por favor visualice este correo en un cliente compatible con HTML."
        
        email_record = OutboxEmail(
            to_email=to_email,
            subject=subject,
            body_html=html_body,
            body_text=plain_text,
            status="DISPATCHED",
            dispatched_at=datetime.now(timezone.utc),
        )
        self.db.add(email_record)
        self.db.flush()

        # Send real email via Gmail SMTP
        if self.sender and self.password:
            try:
                msg = MIMEMultipart("alternative")
                msg["Subject"] = subject
                msg["From"] = f"InnovaCloud Tesorería <{self.sender}>"
                msg["To"] = to_email

                part1 = MIMEText(plain_text, "plain")
                part2 = MIMEText(html_body, "html")
                msg.attach(part1)
                msg.attach(part2)

                server = smtplib.SMTP_SSL(self.host, self.port, timeout=10.0)
                server.login(self.sender, self.password)
                server.send_message(msg)
                server.quit()
                logger.info(f"Email sent successfully to {to_email}")
            except Exception as e:
                logger.warning(f"Failed to send email to {to_email}: {e}")
                # We do not crash transaction, record is logged
                email_record.status = "DISPATCHED_OFFLINE"

        return email_record
