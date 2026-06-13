/** Hindi / English helpers for voice agent */

const DEVANAGARI_RE = /[\u0900-\u097F]/g;
const LATIN_RE = /[A-Za-z]/g;

export type VoiceLanguage = 'hi' | 'en';

export function normalizeLanguage(language?: string, fallback: VoiceLanguage = 'hi'): VoiceLanguage | 'auto' {
  if (!language) return fallback;
  const code = language.toLowerCase().trim().replace('_', '-');
  if (code === 'auto') return 'auto';
  if (code === 'hindi' || code === 'hi' || code === 'hi-in') return 'hi';
  if (code === 'english' || code === 'en' || code === 'en-us' || code === 'en-in') return 'en';
  return fallback;
}

export function detectLanguageFromText(text: string, fallback: VoiceLanguage = 'hi'): VoiceLanguage {
  if (!text?.trim()) return fallback;

  const devanagariCount = (text.match(DEVANAGARI_RE) || []).length;
  const latinCount = (text.match(LATIN_RE) || []).length;

  if (devanagariCount >= 2 && devanagariCount >= latinCount) return 'hi';
  if (latinCount >= 4 && latinCount > devanagariCount) return 'en';
  return fallback;
}

/** Match chat/TTS language to what the user said, else UI preference. */
export function resolveResponseLanguage(userMessage: string, preferred: string = 'hi'): VoiceLanguage {
  const preferredNorm = normalizeLanguage(preferred) as VoiceLanguage;
  const devanagariCount = (userMessage.match(DEVANAGARI_RE) || []).length;
  const latinCount = (userMessage.match(LATIN_RE) || []).length;

  if (devanagariCount >= 2 && devanagariCount >= latinCount) return 'hi';
  if (latinCount >= 4 && latinCount > devanagariCount) return 'en';
  return preferredNorm;
}

export function ttsLocale(language: VoiceLanguage): string {
  return language === 'hi' ? 'hi-IN' : 'en-US';
}
