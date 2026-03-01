from pydantic import BaseModel


class OTPRequest(BaseModel):
    phone: str  # e.g. "+8801712345678"


class OTPVerify(BaseModel):
    phone: str
    code: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str
