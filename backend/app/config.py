import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql://taskuser:taskpass@db:5432/taskdb",
    )
    secret_key: str = os.getenv("SECRET_KEY", "change-this-secret-key-in-production")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 24 hours

    class Config:
        env_file = ".env"


settings = Settings()
