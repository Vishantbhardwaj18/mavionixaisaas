
import { Language } from '../types';

export const speakText = (text: string, language: Language) => {
  if (!window.speechSynthesis) return;
  
  // Cancel existing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language;
  
  // Attempt to find a matching voice
  const voices = window.speechSynthesis.getVoices();
  
  // 1. Exact match (e.g. bn-IN)
  let voice = voices.find(v => v.lang === language);
  
  // 2. Prefix match (e.g. bn)
  if (!voice) {
      voice = voices.find(v => v.lang.startsWith(language.split('-')[0]));
  }
  
  // 3. Fallback to Google specific voices if available (often higher quality)
  if (!voice) {
      const langCode = language.split('-')[0];
      voice = voices.find(v => v.name.includes('Google') && v.lang.startsWith(langCode));
  }

  if (voice) {
    utterance.voice = voice;
  }
  
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  
  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
};

export class SpeechRecognizer {
  recognition: any;
  isListening: boolean = false;

  constructor(language: Language, onResult: (text: string) => void, onEnd: () => void) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = language;

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onEnd();
      };

      this.recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        this.isListening = false;
        onEnd();
      };
    }
  }

  start() {
    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
        this.isListening = true;
      } catch(e) {
        console.error(e);
      }
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}
