import secrets
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from app.config import settings

_revoked_refresh_tokens: set[str] = set()  # In-memory for MVP; swap for Redis/DB in prod


def create_access_token(user_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=settings.jwt_access_expire_hours)
    return jwt.encode(
        {"sub": user_id, "exp": expire, "type": "access"},
        settings.jwt_secret,
        algorithm=settings.jwt_algorithm,
    )


def create_refresh_token(user_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(days=settings.jwt_refresh_expire_days)
    token = jwt.encode(
        {"sub": user_id, "exp": expire, "type": "refresh", "jti": secrets.token_hex(16)},
        settings.jwt_secret,
        algorithm=settings.jwt_algorithm,
    )
    return token


def decode_token(token: str) -> dict:
    return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])


def revoke_refresh_token(token: str) -> None:
    _revoked_refresh_tokens.add(token)


def is_revoked(token: str) -> bool:
    return token in _revoked_refresh_tokens
