from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    supabase_url: str
    supabase_service_role_key: str

    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_access_expire_hours: int = 24
    jwt_refresh_expire_days: int = 30

    sms_provider: str = "sms.bd"
    sms_api_key: str = ""
    sms_api_url: str = ""

    cors_origins: str = "http://localhost:3000"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",")]


settings = Settings()
