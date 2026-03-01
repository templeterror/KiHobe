import secrets
import httpx
from datetime import datetime, timedelta, timezone
from app.db import get_db
from app.config import settings

OTP_EXPIRE_MINUTES = 5
OTP_MAX_REQUESTS_PER_10MIN = 3
OTP_MAX_FAILED_ATTEMPTS_PER_HOUR = 5


def _bd_phone(phone: str) -> str:
    """Normalize to +880 format."""
    phone = phone.strip().replace(" ", "").replace("-", "")
    if phone.startswith("01") and len(phone) == 11:
        return "+880" + phone[1:]
    if phone.startswith("880") and not phone.startswith("+"):
        return "+" + phone
    return phone


def generate_otp() -> str:
    return str(secrets.randbelow(900000) + 100000)  # 100000–999999


async def request_otp(phone: str) -> dict:
    phone = _bd_phone(phone)
    db = get_db()
    now = datetime.now(timezone.utc)

    # Rate limit: max 3 OTP requests per phone per 10 minutes
    window = now - timedelta(minutes=10)
    recent = (
        db.table("otp_codes")
        .select("id")
        .eq("phone", phone)
        .gte("created_at", window.isoformat())
        .execute()
    )
    if len(recent.data) >= OTP_MAX_REQUESTS_PER_10MIN:
        return {"error": "Too many OTP requests. Please wait 10 minutes.", "code": 429}

    code = generate_otp()
    expires_at = now + timedelta(minutes=OTP_EXPIRE_MINUTES)

    db.table("otp_codes").insert({
        "phone": phone,
        "code": code,
        "expires_at": expires_at.isoformat(),
    }).execute()

    # Send SMS
    await _send_sms(phone, f"Your KiHobe verification code is: {code}. Valid for 5 minutes.")

    return {"success": True}


async def verify_otp(phone: str, code: str) -> dict:
    phone = _bd_phone(phone)
    db = get_db()
    now = datetime.now(timezone.utc)

    # Find valid, unverified OTP
    result = (
        db.table("otp_codes")
        .select("*")
        .eq("phone", phone)
        .eq("verified", False)
        .gt("expires_at", now.isoformat())
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )

    if not result.data:
        return {"error": "No valid OTP found. Please request a new one.", "code": 400}

    otp_row = result.data[0]

    # Check failed attempt rate limit
    hour_ago = now - timedelta(hours=1)
    failed = (
        db.table("otp_codes")
        .select("id")
        .eq("phone", phone)
        .gte("created_at", hour_ago.isoformat())
        .gte("attempts", 1)
        .execute()
    )
    if len(failed.data) >= OTP_MAX_FAILED_ATTEMPTS_PER_HOUR:
        return {"error": "Too many failed attempts. Try again later.", "code": 429}

    if otp_row["code"] != code:
        db.table("otp_codes").update({"attempts": otp_row["attempts"] + 1}).eq("id", otp_row["id"]).execute()
        return {"error": "Invalid code.", "code": 400}

    # Mark verified
    db.table("otp_codes").update({"verified": True}).eq("id", otp_row["id"]).execute()
    return {"success": True, "phone": phone}


async def _send_sms(phone: str, message: str) -> None:
    if not settings.sms_api_key or not settings.sms_api_url:
        # Dev mode: print OTP to console instead
        print(f"[DEV SMS] To {phone}: {message}")
        return

    async with httpx.AsyncClient() as client:
        await client.post(
            settings.sms_api_url,
            json={"api_key": settings.sms_api_key, "to": phone, "message": message},
            timeout=10,
        )
