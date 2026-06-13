"""
Seed 5 demo patients linked to ASHA worker Sunita Demo (asha.demo@asha.ai).

Run from backend/:
  ./venv/bin/python scripts/seed_sunita_patients.py
"""

from __future__ import annotations

import asyncio
import uuid
from datetime import date, datetime, timedelta

from sqlalchemy import select

from app.core.database import async_session_maker
from app.core.security import get_password_hash
# Load all ORM models
import app.apps.schemes.models  # noqa: F401
import app.apps.children.models  # noqa: F401
import app.apps.enrollments.models  # noqa: F401
import app.apps.daily_logs.models  # noqa: F401
import app.apps.visits.models  # noqa: F401
from app.apps.users.models import User
from app.apps.beneficiaries.models import BeneficiaryProfile
from app.apps.health_logs.models import HealthLog
from app.apps.alerts.models import Alert

ASHA_WORKER_ID = uuid.UUID("78b859a3-0946-4e8d-9186-8c9aade28ac7")
DEMO_PASSWORD = "Patient@2026"

PATIENTS = [
    {
        "email": "radha.patient@asha.ai",
        "name": "Radha Kumari",
        "age": 16,
        "height": 151.0,
        "weight": 43.0,
        "blood_group": "B+",
        "last_period_date": date(2025, 5, 6),
        "anemia_status": "mild",
        "risk_level": "low",
        "economic_status": "bpl",
        "address": "Village Bettiah, West Champaran, Bihar",
        "next_checkup_date": date(2025, 6, 24),
        "medical_history": "Mild anemia since age 14",
        "current_medications": "Weekly IFA tablets",
        "symptoms": ["fatigue"],
        "mood": "Neutral",
        "bp": (108, 68),
        "alert": None,
    },
    {
        "email": "muskan.patient@asha.ai",
        "name": "Muskan Devi",
        "age": 17,
        "height": 154.0,
        "weight": 46.0,
        "blood_group": "O+",
        "last_period_date": date(2025, 4, 12),
        "anemia_status": "moderate",
        "risk_level": "medium",
        "economic_status": "bpl",
        "address": "Village Motihari, East Champaran, Bihar",
        "next_checkup_date": date(2025, 6, 19),
        "medical_history": "Irregular periods for 3 months",
        "current_medications": "IFA + calcium",
        "symptoms": ["cramps", "weakness"],
        "mood": "Tired",
        "bp": (112, 72),
        "alert": ("health_risk", "medium", "Irregular cycle — 52 days since last period"),
    },
    {
        "email": "sakshi.patient@asha.ai",
        "name": "Sakshi Gupta",
        "age": 15,
        "height": 148.0,
        "weight": 40.0,
        "blood_group": "A+",
        "last_period_date": date(2025, 3, 20),
        "anemia_status": "severe",
        "risk_level": "high",
        "economic_status": "bpl",
        "address": "Village Samastipur, Bihar",
        "next_checkup_date": date(2025, 6, 14),
        "medical_history": "Severe anemia, low appetite",
        "current_medications": "Double-dose IFA under supervision",
        "symptoms": ["dizziness", "pallor", "weakness"],
        "mood": "Weak",
        "bp": (98, 62),
        "alert": ("health_risk", "high", "Severe anemia — missed IFA for 10 days"),
    },
    {
        "email": "komal.patient@asha.ai",
        "name": "Komal Singh",
        "age": 18,
        "height": 159.0,
        "weight": 51.0,
        "blood_group": "AB+",
        "last_period_date": date(2025, 5, 18),
        "anemia_status": "normal",
        "risk_level": "low",
        "economic_status": "apl",
        "address": "Village Bhagalpur, Bihar",
        "next_checkup_date": date(2025, 6, 28),
        "medical_history": "No chronic conditions",
        "current_medications": None,
        "symptoms": [],
        "mood": "Good",
        "bp": (114, 74),
        "alert": None,
    },
    {
        "email": "nidhi.patient@asha.ai",
        "name": "Nidhi Mishra",
        "age": 16,
        "height": 152.0,
        "weight": 44.0,
        "blood_group": "B-",
        "last_period_date": date(2025, 5, 3),
        "anemia_status": "mild",
        "risk_level": "medium",
        "economic_status": "bpl",
        "address": "Village Siwan, Bihar",
        "next_checkup_date": date(2025, 6, 21),
        "medical_history": "Heavy bleeding during periods",
        "current_medications": "IFA tablets",
        "symptoms": ["heavy bleeding", "fatigue"],
        "mood": "Anxious",
        "bp": (106, 70),
        "alert": ("sos", "medium", "Reported heavy bleeding and dizziness"),
    },
]


async def seed() -> None:
    async with async_session_maker() as db:
        asha = await db.get(User, ASHA_WORKER_ID)
        if not asha:
            raise SystemExit(f"ASHA worker {ASHA_WORKER_ID} not found. Register asha.demo@asha.ai first.")

        created = 0
        for patient in PATIENTS:
            result = await db.execute(select(User).where(User.email == patient["email"]))
            user = result.scalar_one_or_none()

            if not user:
                user = User(
                    email=patient["email"],
                    password_hash=get_password_hash(DEMO_PASSWORD),
                    full_name=patient["name"],
                    role="beneficiary",
                    language="hi",
                )
                db.add(user)
                await db.flush()

            result = await db.execute(
                select(BeneficiaryProfile).where(BeneficiaryProfile.user_id == user.id)
            )
            profile = result.scalar_one_or_none()

            if not profile:
                profile = BeneficiaryProfile(
                    user_id=user.id,
                    name=patient["name"],
                    user_type="girl",
                    age=patient["age"],
                    height=patient["height"],
                    weight=patient["weight"],
                    blood_group=patient["blood_group"],
                    last_period_date=patient["last_period_date"],
                    anemia_status=patient["anemia_status"],
                    risk_level=patient["risk_level"],
                    economic_status=patient["economic_status"],
                    address=patient["address"],
                    linked_asha_id=ASHA_WORKER_ID,
                    next_checkup_date=patient["next_checkup_date"],
                    medical_history=patient["medical_history"],
                    current_medications=patient["current_medications"],
                )
                db.add(profile)
                await db.flush()
                created += 1

                db.add(
                    HealthLog(
                        beneficiary_id=profile.id,
                        recorded_by=ASHA_WORKER_ID,
                        date=datetime.utcnow() - timedelta(days=1),
                        bp_systolic=patient["bp"][0],
                        bp_diastolic=patient["bp"][1],
                        symptoms=patient["symptoms"] or None,
                        mood=patient["mood"],
                        is_emergency=patient["risk_level"] == "high",
                        visit_type="home",
                    )
                )

                if patient["alert"]:
                    alert_type, severity, reason = patient["alert"]
                    db.add(
                        Alert(
                            beneficiary_id=profile.id,
                            type=alert_type,
                            severity=severity,
                            status="open",
                            reason=reason,
                            triggered_by=ASHA_WORKER_ID,
                        )
                    )
            else:
                profile.linked_asha_id = ASHA_WORKER_ID

        await db.commit()
        print(f"Seeded {created} new patient(s) under ASHA {asha.full_name} ({ASHA_WORKER_ID}).")


if __name__ == "__main__":
    asyncio.run(seed())
