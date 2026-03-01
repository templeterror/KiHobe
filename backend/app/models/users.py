from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class UserOut(BaseModel):
    id: str
    phone: str
    display_name: Optional[str]
    coin_balance: int
    referral_code: str
    is_admin: bool
    created_at: datetime


class UserUpdate(BaseModel):
    display_name: Optional[str] = None


class PushSubscription(BaseModel):
    subscription: dict


class AdminUserUpdate(BaseModel):
    coin_adjustment: Optional[int] = None
    is_banned: Optional[bool] = None
    is_admin: Optional[bool] = None
