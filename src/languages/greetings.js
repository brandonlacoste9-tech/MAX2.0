/**
 * Multi-language greetings for MAX
 * Supports English, Quebec French, Spanish, and Brazilian Portuguese
 */

export const greetings = {
  en: {
    welcome: "Hello! I'm MAX, your friendly AI assistant and guru on Floguru.com. How can I help you today?",
    name: "MAX",
    language: "English"
  },
  'fr-qc': {
    welcome: "Bonjour! Je suis MAX, votre assistant IA amical et gourou sur Floguru.com. Comment puis-je vous aider aujourd'hui?",
    name: "MAX",
    language: "Français Québécois"
  },
  es: {
    welcome: "¡Hola! Soy MAX, tu asistente de IA amigable y gurú en Floguru.com. ¿Cómo puedo ayudarte hoy?",
    name: "MAX",
    language: "Español"
  },
  'pt-br': {
    welcome: "Olá! Eu sou MAX, seu assistente de IA amigável e guru no Floguru.com. Como posso ajudá-lo hoje?",
    name: "MAX",
    language: "Português Brasileiro"
  }
};

/**
 * Detect language from text or use provided language code
 */
export function detectLanguage(text, providedLang = null) {
  if (providedLang && greetings[providedLang]) {
    return providedLang;
  }

  // Simple language detection based on common words
  const lowerText = text.toLowerCase();
  
  // Quebec French detection
  if (lowerText.match(/\b(bonjour|salut|allo|comment|puis-je|québec)\b/)) {
    return 'fr-qc';
  }
  
  // Spanish detection
  if (lowerText.match(/\b(hola|buenos|gracias|por favor|ayuda|puedo)\b/)) {
    return 'es';
  }
  
  // Brazilian Portuguese detection
  if (lowerText.match(/\b(olá|ola|obrigado|obrigada|por favor|ajuda|posso|você|voce)\b/)) {
    return 'pt-br';
  }
  
  // Default to English
  return 'en';
}

/**
 * Get greeting in specific language
 */
export function getGreeting(language = 'en') {
  return greetings[language] || greetings.en;
}

/**
 * Get all supported languages
 */
export function getSupportedLanguages() {
  return Object.keys(greetings);
}
