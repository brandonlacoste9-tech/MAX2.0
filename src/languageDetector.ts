import { Language } from './types';

/**
 * Language detection utility
 */
export class LanguageDetector {
  /**
   * Detect language from text input
   */
  detectLanguage(text: string): Language {
    const lowerText = text.toLowerCase();

    // Quebec French specific patterns (check first)
    if (this.isQuebecFrench(lowerText)) {
      return Language.QUEBEC_FRENCH;
    }

    // Spanish patterns (check before Portuguese since they can overlap)
    if (this.isSpanish(lowerText)) {
      return Language.SPANISH;
    }

    // Brazilian Portuguese specific patterns
    if (this.isBrazilianPortuguese(lowerText)) {
      return Language.BRAZILIAN_PORTUGUESE;
    }

    // Default to English
    return Language.ENGLISH;
  }

  private isQuebecFrench(text: string): boolean {
    const frenchPatterns = [
      /\b(bonjour|salut|merci|oui|non|comment|pourquoi|qu[eo]i|ça va)\b/i,
      /\b(je suis|tu es|il est|nous sommes|vous êtes)\b/i,
      /\b(aide|aider|besoin|veux|voudrais)\b/i
    ];
    return frenchPatterns.some(pattern => pattern.test(text));
  }

  private isSpanish(text: string): boolean {
    const spanishPatterns = [
      /\b(hola|gracias|sí|buenos días|buenas|qué tal)\b/i,
      /¿|¡/, // Spanish-specific punctuation
      /\b(estás|están|cómo|dónde|cuándo)\b/i, // Spanish accents
      /\b(necesito|quiero|quisiera|puedo)\b/i,
      /\b(yo soy|tú eres|él es|nosotros somos)\b/i
    ];
    return spanishPatterns.some(pattern => pattern.test(text));
  }

  private isBrazilianPortuguese(text: string): boolean {
    const portuguesePatterns = [
      /\b(olá|oi|obrigad[oa]|sim|não|como|por que|o que)\b/i,
      /\b(você|vocês|eu sou|nós somos)\b/i, // Portuguese-specific
      /\b(preciso|quero|gostaria|posso)\b/i,
      /\b(estou|está|estão|tenho|tem)\b/i
    ];
    return portuguesePatterns.some(pattern => pattern.test(text));
  }

  /**
   * Get greeting in detected language
   */
  getGreetingForLanguage(language: Language, greetings: Record<Language, string[]>): string {
    const languageGreetings = greetings[language];
    return languageGreetings[Math.floor(Math.random() * languageGreetings.length)];
  }
}
