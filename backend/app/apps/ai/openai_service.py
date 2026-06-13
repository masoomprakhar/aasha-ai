"""
OpenAI API integration for chat, speech-to-text, and text-to-speech.
"""

from __future__ import annotations

import io
from typing import Any, Dict, List, Optional

from openai import AsyncOpenAI

from app.core.config import get_settings
from app.apps.ai.schemas import AIResponse
from app.apps.ai.language_utils import detect_language_from_text, normalize_language

settings = get_settings()

# Voice mapping for TTS — warm female voices for Asha Didi persona
TTS_VOICE_BY_LANGUAGE = {
    "hi": "nova",
    "en": "shimmer",
}


class OpenAIService:
    """Service for OpenAI chat, Whisper STT, and TTS APIs."""

    def __init__(self) -> None:
        self._client: Optional[AsyncOpenAI] = None

    @property
    def is_configured(self) -> bool:
        return bool(settings.OPENAI_API_KEY.strip())

    def _get_client(self) -> AsyncOpenAI:
        if not self.is_configured:
            raise RuntimeError("OPENAI_API_KEY is not configured")
        if self._client is None:
            self._client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        return self._client

    async def generate(self, prompt: str) -> AIResponse:
        """Single-turn text generation via chat completions."""
        try:
            client = self._get_client()
            response = await client.chat.completions.create(
                model=settings.OPENAI_CHAT_MODEL,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=1024,
            )
            text = response.choices[0].message.content or ""
            return AIResponse(response=text.strip(), success=True)
        except Exception as e:
            print(f"[OpenAI] Generate error: {e}")
            return AIResponse(response="", success=False, error=str(e))

    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> str:
        """Multi-turn chat completion."""
        client = self._get_client()
        response = await client.chat.completions.create(
            model=settings.OPENAI_CHAT_MODEL,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
        )
        return (response.choices[0].message.content or "").strip()

    async def transcribe(
        self,
        audio_data: bytes,
        filename: str = "audio.webm",
        language: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Transcribe audio using OpenAI whisper-1."""
        client = self._get_client()
        audio_file = io.BytesIO(audio_data)
        audio_file.name = filename

        kwargs: Dict[str, Any] = {
            "model": settings.OPENAI_STT_MODEL,
            "file": audio_file,
            "response_format": "verbose_json",
        }

        if language:
            lang_code = normalize_language(language, default="auto")
            if lang_code in ("hi", "en"):
                kwargs["language"] = lang_code

        response = await client.audio.transcriptions.create(**kwargs)

        transcript = (response.text or "").strip()
        detected_language = getattr(response, "language", None) or language or "unknown"
        duration = getattr(response, "duration", 0.0) or 0.0

        return {
            "transcript": transcript,
            "language": detected_language,
            "duration": duration,
        }

    async def synthesize_speech(
        self,
        text: str,
        language: str = "hi",
        voice: Optional[str] = None,
    ) -> bytes:
        """Generate speech audio using OpenAI TTS (Hindi + English)."""
        client = self._get_client()
        lang_code = normalize_language(language, default="auto")
        if lang_code == "auto":
            lang_code = detect_language_from_text(text, default="hi")
        selected_voice = voice or TTS_VOICE_BY_LANGUAGE.get(lang_code, settings.OPENAI_TTS_VOICE)

        response = await client.audio.speech.create(
            model=settings.OPENAI_TTS_MODEL,
            voice=selected_voice,
            input=text,
            response_format="mp3",
        )
        return response.content


openai_service = OpenAIService()
