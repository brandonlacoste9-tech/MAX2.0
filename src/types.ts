/**
 * Supported languages for MAX greetings
 */
export enum Language {
  ENGLISH = 'en',
  QUEBEC_FRENCH = 'fr-qc',
  SPANISH = 'es',
  BRAZILIAN_PORTUGUESE = 'pt-br'
}

/**
 * Available role specializations for MAX
 */
export enum Role {
  LAWYER = 'lawyer',
  PLUMBER = 'plumber',
  THERAPIST = 'therapist',
  DIET_FITNESS = 'diet_fitness',
  LIFE_COACH = 'life_coach',
  ADVERTISER = 'advertiser',
  GENERAL = 'general'
}

/**
 * Supported communication channels
 */
export enum Channel {
  WEBSITE = 'website',
  WHATSAPP = 'whatsapp',
  TELEGRAM = 'telegram',
  SMS = 'sms',
  VOICE = 'voice'
}

/**
 * User context and preferences
 */
export interface UserContext {
  userId: string;
  language: Language;
  preferredRole?: Role;
  conversationHistory: Message[];
  metadata: Record<string, any>;
}

/**
 * Message structure
 */
export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  channel?: Channel;
}

/**
 * MAX response structure
 */
export interface MAXResponse {
  message: string;
  language: Language;
  role: Role;
  voiceUrl?: string;
}
