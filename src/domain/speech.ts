/**
 * Web Speech API wrappers for FairShift
 * Supports Text-to-Speech (reading payslips aloud in EN, TA, HI)
 * and Speech-to-Text (voice reporting of hazards).
 */

import { Language } from './types';

// Declare types for Webkit SpeechRecognition
interface SpeechRecognitionResultItem {
  transcript: string;
  confidence: number;
}
interface SpeechRecognitionResultList {
  length: number;
  [index: number]: {
    [index: number]: SpeechRecognitionResultItem;
    isFinal: boolean;
  };
}
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface ISpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => ISpeechRecognition;
    webkitSpeechRecognition?: new () => ISpeechRecognition;
  }
}

/**
 * Checks if browser supports Speech Synthesis
 */
export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/**
 * Checks if browser supports Speech Recognition
 */
export function isSpeechRecognitionSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  );
}

/**
 * Map FairShift language to BCP 47 language code for speech
 */
export function getBcp47Language(lang: Language): string {
  switch (lang) {
    case 'ta':
      return 'ta-IN';
    case 'hi':
      return 'hi-IN';
    case 'en':
    default:
      return 'en-IN';
  }
}

/**
 * Read text aloud using browser SpeechSynthesis
 */
export function speakText(
  text: string,
  lang: Language,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: Error) => void
): () => void {
  if (!isSpeechSynthesisSupported()) {
    onError?.(new Error('Speech synthesis is not supported on this device.'));
    return () => {};
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const targetBcp47 = getBcp47Language(lang);
  utterance.lang = targetBcp47;
  utterance.rate = 0.95; // slightly slower for maximum clarity
  utterance.pitch = 1.0;

  // Attempt to pick a native voice if available
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(
    (v) => v.lang.toLowerCase() === targetBcp47.toLowerCase() || v.lang.startsWith(lang)
  );
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  utterance.onstart = () => {
    onStart?.();
  };

  utterance.onend = () => {
    onEnd?.();
  };

  utterance.onerror = (e) => {
    // Treat 'canceled' or 'interrupted' as benign termination
    if (e.error !== 'canceled' && e.error !== 'interrupted') {
      onError?.(new Error(`Speech synthesis error: ${e.error}`));
    }
    onEnd?.();
  };

  window.speechSynthesis.speak(utterance);

  // Return cancel function
  return () => {
    window.speechSynthesis.cancel();
    onEnd?.();
  };
}

/**
 * Stop any active speech
 */
export function stopSpeech(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Create and start a voice speech recognition session for hazard reporting
 */
export function startVoiceRecognition(params: {
  lang: Language;
  onInterimResult?: (transcript: string) => void;
  onFinalResult: (transcript: string) => void;
  onError: (errorMessage: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}): () => void {
  const { lang, onInterimResult, onFinalResult, onError, onStart, onEnd } = params;

  if (!isSpeechRecognitionSupported()) {
    onError('Voice recognition is not supported in this browser. Please use text input.');
    return () => {};
  }

  const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognitionClass) {
    onError('Speech recognition not available.');
    return () => {};
  }

  try {
    const recognition = new SpeechRecognitionClass();
    recognition.lang = getBcp47Language(lang);
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      onStart?.();
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';

      for (let i = 0; i < event.results.length; i++) {
        const item = event.results[i][0];
        if (event.results[i].isFinal) {
          final += item.transcript + ' ';
        } else {
          interim += item.transcript;
        }
      }

      if (interim && onInterimResult) {
        onInterimResult(interim);
      }
      if (final) {
        onFinalResult(final.trim());
      }
    };

    recognition.onerror = (e: { error: string }) => {
      if (e.error === 'no-speech') {
        onError('No speech was detected. Please try tapping the microphone again.');
      } else if (e.error === 'not-allowed') {
        onError('Microphone permission was denied. Please allow microphone access or type.');
      } else {
        onError(`Voice recognition error: ${e.error}`);
      }
      onEnd?.();
    };

    recognition.onend = () => {
      onEnd?.();
    };

    recognition.start();

    // Return stop callback
    return () => {
      try {
        recognition.stop();
      } catch {
        // ignore if already stopped
      }
    };
  } catch (err: unknown) {
    onError(err instanceof Error ? err.message : 'Failed to initialize voice recognition.');
    return () => {};
  }
}
