import { Language } from './types';

/**
 * Multi-language greeting templates
 */
export const GREETINGS: Record<Language, string[]> = {
  [Language.ENGLISH]: [
    "Hello! I'm MAX, your friendly AI assistant. How can I help you today?",
    "Welcome! I'm MAX, here to assist you with whatever you need.",
    "Hi there! I'm MAX. What can I do for you today?"
  ],
  [Language.QUEBEC_FRENCH]: [
    "Bonjour! Je suis MAX, votre assistant IA amical. Comment puis-je vous aider aujourd'hui?",
    "Bienvenue! Je suis MAX, ici pour vous assister avec tout ce dont vous avez besoin.",
    "Salut! Je suis MAX. Qu'est-ce que je peux faire pour vous aujourd'hui?"
  ],
  [Language.SPANISH]: [
    "¡Hola! Soy MAX, tu asistente de IA amigable. ¿Cómo puedo ayudarte hoy?",
    "¡Bienvenido! Soy MAX, aquí para ayudarte con lo que necesites.",
    "¡Hola! Soy MAX. ¿Qué puedo hacer por ti hoy?"
  ],
  [Language.BRAZILIAN_PORTUGUESE]: [
    "Olá! Sou MAX, seu assistente de IA amigável. Como posso ajudá-lo hoje?",
    "Bem-vindo! Sou MAX, aqui para ajudá-lo com o que você precisar.",
    "Oi! Sou MAX. O que posso fazer por você hoje?"
  ]
};

/**
 * Personality traits for MAX (calm, patient, friendly)
 */
export const PERSONALITY_TRAITS = {
  tone: 'calm and patient',
  style: 'friendly and approachable',
  approach: 'never pushy, always supportive'
};
