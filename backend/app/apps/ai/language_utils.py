"""Hindi / English language helpers for voice agent."""

from __future__ import annotations

import re

DEVANAGARI_RE = re.compile(r"[\u0900-\u097F]")
LATIN_RE = re.compile(r"[A-Za-z]")


def normalize_language(language: str | None, default: str = "hi") -> str:
    if not language:
        return default
    code = language.lower().strip().replace("_", "-")
    if code in {"hindi", "hi", "hi-in"}:
        return "hi"
    if code in {"english", "en", "en-us", "en-in", "en-gb"}:
        return "en"
    if code == "auto":
        return "auto"
    return default


def detect_language_from_text(text: str, default: str = "hi") -> str:
    """Detect Hindi vs English from script in the message."""
    if not text or not text.strip():
        return default

    devanagari_count = len(DEVANAGARI_RE.findall(text))
    latin_count = len(LATIN_RE.findall(text))

    if devanagari_count >= 2 and devanagari_count >= latin_count:
        return "hi"
    if latin_count >= 3 and latin_count > devanagari_count:
        return "en"
    return default


def resolve_response_language(user_message: str, preferred: str = "hi") -> str:
    """
    Pick chat/TTS language: match what the user spoke/wrote when clear,
    otherwise use UI preference (hi/en).
    """
    preferred_norm = normalize_language(preferred)
    detected = detect_language_from_text(user_message, preferred_norm)

    devanagari_count = len(DEVANAGARI_RE.findall(user_message))
    latin_count = len(LATIN_RE.findall(user_message))

    if devanagari_count >= 2 and devanagari_count >= latin_count:
        return "hi"
    if latin_count >= 4 and latin_count > devanagari_count:
        return "en"
    return preferred_norm
