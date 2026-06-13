from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://localhost/asha_ai"
    DATABASE_URL_SYNC: str = "postgresql://localhost/asha_ai"

    # Supabase (optional — set when using a hosted Supabase project)
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    SUPABASE_JWT_SECRET: str = ""
    
    # JWT Settings
    JWT_SECRET: str = "your-super-secret-key"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # OpenAI API (preferred for voice agent: chat, STT, TTS)
    OPENAI_API_KEY: str = ""
    OPENAI_CHAT_MODEL: str = "gpt-4o-mini"
    OPENAI_TTS_MODEL: str = "tts-1"
    OPENAI_TTS_VOICE: str = "nova"
    OPENAI_STT_MODEL: str = "whisper-1"

    # Gemini API (fallback when OpenAI is not configured)
    GEMINI_API_URL: str = "http://localhost:8001/generate"
    
    # Local Whisper STT Settings (fallback when OpenAI is not configured)
    WHISPER_MODEL: str = "base"  # Options: tiny, base, small, medium, large
    
    # App Settings
    DEBUG: bool = True
    SQL_ECHO: bool = False  # Set to True to see SQL queries
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173"
    
    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    @property
    def is_supabase_configured(self) -> bool:
        return bool(self.SUPABASE_URL.strip() and self.SUPABASE_ANON_KEY.strip())
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    """Cached settings instance for dependency injection"""
    return Settings()
