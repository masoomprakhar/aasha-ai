'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import apiClient from '../lib/api'
import { detectLanguageFromText, normalizeLanguage } from '../utils/language'

interface TextToSpeechState {
    isSpeaking: boolean
    isPaused: boolean
    isSupported: boolean
    voices: SpeechSynthesisVoice[]
    currentVoice: SpeechSynthesisVoice | null
    provider: 'openai' | 'browser' | null
}

interface UseTextToSpeechReturn {
    state: TextToSpeechState
    speak: (text: string, languageOverride?: string) => void
    pause: () => void
    resume: () => void
    stop: () => void
    setVoice: (voice: SpeechSynthesisVoice) => void
    setRate: (rate: number) => void
    setPitch: (pitch: number) => void
}

export function useTextToSpeech(language: string = 'hi-IN'): UseTextToSpeechReturn {
    const [state, setState] = useState<TextToSpeechState>({
        isSpeaking: false,
        isPaused: false,
        isSupported: false,
        voices: [],
        currentVoice: null,
        provider: null,
    })

    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const audioUrlRef = useRef<string | null>(null)
    const rateRef = useRef<number>(1.0)
    const pitchRef = useRef<number>(1.0)

    const cleanupAudio = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.onended = null
            audioRef.current.onerror = null
            audioRef.current = null
        }
        if (audioUrlRef.current) {
            URL.revokeObjectURL(audioUrlRef.current)
            audioUrlRef.current = null
        }
    }, [])

    // Load browser voices as fallback
    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            setState(prev => ({ ...prev, isSupported: true }))

            const selectBestVoice = (voices: SpeechSynthesisVoice[], langCode: string): SpeechSynthesisVoice | null => {
                const langPrefix = langCode.split('-')[0]
                const langVoices = voices.filter(v =>
                    v.lang.startsWith(langPrefix) || v.lang.toLowerCase().includes(langPrefix)
                )

                const googleVoice = langVoices.find(v => v.name.toLowerCase().includes('google'))
                if (googleVoice) return googleVoice

                const microsoftVoice = langVoices.find(v =>
                    v.name.toLowerCase().includes('microsoft') || v.name.toLowerCase().includes('azure')
                )
                if (microsoftVoice) return microsoftVoice

                const femaleVoice = langVoices.find(v =>
                    v.name.toLowerCase().includes('female') ||
                    v.name.toLowerCase().includes('lekha') ||
                    v.name.toLowerCase().includes('aditi') ||
                    v.name.toLowerCase().includes('raveena') ||
                    v.name.toLowerCase().includes('swara')
                )
                if (femaleVoice) return femaleVoice

                if (langVoices.length > 0) return langVoices[0]

                const englishVoice = voices.find(v => v.lang.startsWith('en'))
                if (englishVoice) return englishVoice

                return voices[0] || null
            }

            const loadVoices = () => {
                const availableVoices = window.speechSynthesis.getVoices()
                const preferredVoice = selectBestVoice(availableVoices, language)

                setState(prev => ({
                    ...prev,
                    voices: availableVoices,
                    currentVoice: preferredVoice,
                }))
            }

            loadVoices()
            window.speechSynthesis.onvoiceschanged = loadVoices
        }
    }, [language])

    useEffect(() => {
        if (state.voices.length > 0) {
            const langPrefix = language.split('-')[0]
            const googleVoice = state.voices.find(v =>
                v.lang.startsWith(langPrefix) && v.name.toLowerCase().includes('google')
            )
            const matchingVoice = googleVoice || state.voices.find(v => v.lang.startsWith(langPrefix))

            if (matchingVoice) {
                setState(prev => ({ ...prev, currentVoice: matchingVoice }))
            }
        }
    }, [language, state.voices])

    const cleanTextForSpeech = (text: string): string => {
        return text
            .replace(/\*\*/g, '')
            .replace(/\*/g, '')
            .replace(/__/g, '')
            .replace(/_/g, ' ')
            .replace(/#{1,6}\s*/g, '')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2300}-\u{23FF}]|[\u{2B50}]|[\u{1FA00}-\u{1FAFF}]|[\u{FE00}-\u{FE0F}]|[\u{200D}]/gu, '')
            .replace(/^[\s]*[-•]\s*/gm, '')
            .replace(/\s+/g, ' ')
            .trim()
    }

    const speakWithBrowser = useCallback((cleanedText: string) => {
        if (!state.isSupported || typeof window === 'undefined' || !('speechSynthesis' in window)) {
            return
        }

        window.speechSynthesis.cancel()

        const utterance = new SpeechSynthesisUtterance(cleanedText)
        utterance.rate = rateRef.current
        utterance.pitch = pitchRef.current

        if (state.currentVoice) {
            utterance.voice = state.currentVoice
            utterance.lang = state.currentVoice.lang
        }

        utterance.onstart = () => {
            setState(prev => ({ ...prev, isSpeaking: true, isPaused: false, provider: 'browser' }))
        }

        utterance.onend = () => {
            setState(prev => ({ ...prev, isSpeaking: false, isPaused: false, provider: null }))
        }

        utterance.onerror = () => {
            setState(prev => ({ ...prev, isSpeaking: false, isPaused: false, provider: null }))
        }

        utterance.onpause = () => {
            setState(prev => ({ ...prev, isPaused: true }))
        }

        utterance.onresume = () => {
            setState(prev => ({ ...prev, isPaused: false }))
        }

        utteranceRef.current = utterance
        window.speechSynthesis.speak(utterance)
    }, [state.isSupported, state.currentVoice])

    const stop = useCallback(() => {
        cleanupAudio()

        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel()
        }

        setState(prev => ({ ...prev, isSpeaking: false, isPaused: false, provider: null }))
    }, [cleanupAudio])

    const speakWithOpenAI = useCallback(async (cleanedText: string, langOverride?: string) => {
        const preferred = normalizeLanguage(langOverride || language, 'hi');
        const langCode = langOverride
            ? preferred
            : detectLanguageFromText(cleanedText, preferred as 'hi' | 'en');

        try {
            const response = await apiClient.post(
                '/voice/tts',
                { text: cleanedText, language: langCode },
                { responseType: 'arraybuffer', timeout: 60000 }
            )

            cleanupAudio()

            const blob = new Blob([response.data], { type: 'audio/mpeg' })
            const url = URL.createObjectURL(blob)
            audioUrlRef.current = url

            const audio = new Audio(url)
            audioRef.current = audio

            audio.onplay = () => {
                setState(prev => ({ ...prev, isSpeaking: true, isPaused: false, provider: 'openai' }))
            }

            audio.onended = () => {
                cleanupAudio()
                setState(prev => ({ ...prev, isSpeaking: false, isPaused: false, provider: null }))
            }

            audio.onerror = () => {
                cleanupAudio()
                setState(prev => ({ ...prev, isSpeaking: false, isPaused: false, provider: null }))
                speakWithBrowser(cleanedText)
            }

            await audio.play()
        } catch (error) {
            console.warn('[TTS] OpenAI TTS failed, falling back to browser:', error)
            speakWithBrowser(cleanedText)
        }
    }, [language, cleanupAudio, speakWithBrowser])

    const speak = useCallback((text: string, languageOverride?: string) => {
        if (!text) return

        stop()

        const cleanedText = cleanTextForSpeech(text)
        if (!cleanedText) return

        console.log('[TTS] Speaking via OpenAI backend:', cleanedText.substring(0, 100) + '...')
        void speakWithOpenAI(cleanedText, languageOverride)
    }, [speakWithOpenAI, stop])

    const pause = useCallback(() => {
        if (audioRef.current && state.provider === 'openai') {
            audioRef.current.pause()
            setState(prev => ({ ...prev, isPaused: true }))
            return
        }

        if (state.isSupported && state.isSpeaking) {
            window.speechSynthesis.pause()
        }
    }, [state.isSupported, state.isSpeaking, state.provider])

    const resume = useCallback(() => {
        if (audioRef.current && state.provider === 'openai') {
            void audioRef.current.play()
            setState(prev => ({ ...prev, isPaused: false }))
            return
        }

        if (state.isSupported && state.isPaused) {
            window.speechSynthesis.resume()
        }
    }, [state.isSupported, state.isPaused, state.provider])

    const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
        setState(prev => ({ ...prev, currentVoice: voice }))
    }, [])

    const setRate = useCallback((rate: number) => {
        rateRef.current = Math.max(0.5, Math.min(2, rate))
    }, [])

    const setPitch = useCallback((pitch: number) => {
        pitchRef.current = Math.max(0.5, Math.min(2, pitch))
    }, [])

    useEffect(() => {
        return () => {
            cleanupAudio()
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel()
            }
        }
    }, [cleanupAudio])

    return {
        state,
        speak,
        pause,
        resume,
        stop,
        setVoice,
        setRate,
        setPitch,
    }
}

export default useTextToSpeech
