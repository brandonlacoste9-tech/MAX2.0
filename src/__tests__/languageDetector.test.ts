import { LanguageDetector } from '../languageDetector';
import { Language } from '../types';
import { GREETINGS } from '../constants';

describe('LanguageDetector', () => {
  let detector: LanguageDetector;

  beforeEach(() => {
    detector = new LanguageDetector();
  });

  describe('detectLanguage', () => {
    it('should detect English', () => {
      expect(detector.detectLanguage('Hello, how are you?')).toBe(Language.ENGLISH);
      expect(detector.detectLanguage('I need help with something')).toBe(Language.ENGLISH);
    });

    it('should detect Quebec French', () => {
      expect(detector.detectLanguage('Bonjour, comment allez-vous?')).toBe(Language.QUEBEC_FRENCH);
      expect(detector.detectLanguage('Je suis content')).toBe(Language.QUEBEC_FRENCH);
      expect(detector.detectLanguage("J'ai besoin d'aide")).toBe(Language.QUEBEC_FRENCH);
    });

    it('should detect Spanish', () => {
      expect(detector.detectLanguage('Hola, ¿cómo estás?')).toBe(Language.SPANISH);
      expect(detector.detectLanguage('Necesito ayuda')).toBe(Language.SPANISH);
      expect(detector.detectLanguage('¿Qué tal?')).toBe(Language.SPANISH);
    });

    it('should detect Brazilian Portuguese', () => {
      expect(detector.detectLanguage('Olá, como você está?')).toBe(Language.BRAZILIAN_PORTUGUESE);
      expect(detector.detectLanguage('Eu preciso de ajuda')).toBe(Language.BRAZILIAN_PORTUGUESE);
      expect(detector.detectLanguage('O que você acha?')).toBe(Language.BRAZILIAN_PORTUGUESE);
    });

    it('should default to English for unknown text', () => {
      expect(detector.detectLanguage('xyz123')).toBe(Language.ENGLISH);
    });
  });

  describe('getGreetingForLanguage', () => {
    it('should return greeting for each language', () => {
      const englishGreeting = detector.getGreetingForLanguage(Language.ENGLISH, GREETINGS);
      expect(GREETINGS[Language.ENGLISH]).toContain(englishGreeting);

      const frenchGreeting = detector.getGreetingForLanguage(Language.QUEBEC_FRENCH, GREETINGS);
      expect(GREETINGS[Language.QUEBEC_FRENCH]).toContain(frenchGreeting);

      const spanishGreeting = detector.getGreetingForLanguage(Language.SPANISH, GREETINGS);
      expect(GREETINGS[Language.SPANISH]).toContain(spanishGreeting);

      const portugueseGreeting = detector.getGreetingForLanguage(Language.BRAZILIAN_PORTUGUESE, GREETINGS);
      expect(GREETINGS[Language.BRAZILIAN_PORTUGUESE]).toContain(portugueseGreeting);
    });
  });
});
