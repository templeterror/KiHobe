import secrets
from fastapi import APIRouter, HTTPException, Response, Request, status
from app.models.auth import OTPRequest, OTPVerify, TokenResponse, RefreshRequest
from app.services import otp as otp_service
from app.services.jwt import create_access_token, create_refresh_token, decode_token, revoke_refresh_token, is_revoked
from app.services.coins import grant_coins
from app.db import get_db
from jose import JWTError

router = APIRouter(prefix="/auth", tags=["auth"])


def _generate_referral_code() -> str:
    return secrets.token_urlsafe(6)[:8].upper()


@router.post("/request-otp", status_code=200)
async def request_otp(body: OTPRequest):
    result = await otp_service.request_otp(body.phone)
    if "error" in result:
        raise HTTPException(status_code=result.get("code", 400), detail=result["error"])
    return {"message": "OTP sent"}


@router.post("/verify-otp", response_model=TokenResponse)
async def verify_otp(body: OTPVerify, response: Response):
    result = await otp_service.verify_otp(body.phone, body.code)
    if "error" in result:
        raise HTTPException(status_code=result.get("code", 400), detail=result["error"])

    phone = result["phone"]
    db = get_db()

    # Find or create user
    existing = db.table("users").select("*").eq("phone", phone).execute()
    is_new_user = not existing.data

    if is_new_user:
        referral_code = _generate_referral_code()
        new_user = db.table("users").insert({
            "phone": phone,
            "referral_code": referral_code,
            "coin_balance": 10,  # welcome bonus
        }).execute()
        user = new_user.data[0]
        # Log welcome coins
        db.table("coin_transactions").insert({
            "user_id": user["id"],
            "amount": 10,
            "reason": "admin_adjust",
        }).execute()
    else:
        user = existing.data[0]

    access_token = create_access_token(user["id"])
    refresh_token = create_refresh_token(user["id"])

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=30 * 24 * 3600,
    )

    return TokenResponse(access_token=access_token)


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(request: Request):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No refresh token")
    if is_revoked(token):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token revoked")

    try:
        payload = decode_token(token)
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
        user_id = payload["sub"]
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    return TokenResponse(access_token=create_access_token(user_id))


@router.post("/logout", status_code=200)
async def logout(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if token:
        revoke_refresh_token(token)
    response.delete_cookie("refresh_token")
    return {"message": "Logged out"}
