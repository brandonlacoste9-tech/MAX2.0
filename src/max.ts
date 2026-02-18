import { Language, Role, Channel, MAXResponse, Message } from './types';
import { GREETINGS, PERSONALITY_TRAITS } from './constants';
import { MemoryManager } from './memory';
import { LanguageDetector } from './languageDetector';
import { RoleAdapter } from './roleAdapter';
import { ChannelManager } from './channels';
import { ElevenLabsTTS, ElevenLabsConfig } from './tts';

/**
 * MAX configuration options
 */
export interface MAXConfig {
  elevenlabs?: ElevenLabsConfig;
  defaultLanguage?: Language;
}

/**
 * MAX - The AI Assistant and Guru on Floguru.com
 * 
 * Features:
 * - Multi-language greeting (English, Quebec French, Spanish, Brazilian Portuguese)
 * - Adaptive help (Lawyer, Plumber, Therapist, Diet/Fitness, Life Coach, Advertiser)
 * - Never pushy (Calm, patient, friendly personality)
 * - Never forget (Remembers everything about each user)
 * - Multi-channel (WhatsApp, Telegram, Website, SMS, Voice)
 * - Voice support with ElevenLabs TTS
 */
export class MAX {
  private memory: MemoryManager;
  private languageDetector: LanguageDetector;
  private roleAdapter: RoleAdapter;
  private channelManager: ChannelManager;
  private tts: ElevenLabsTTS | null;
  private defaultLanguage: Language;

  constructor(config: MAXConfig = {}) {
    this.memory = new MemoryManager();
    this.languageDetector = new LanguageDetector();
    this.roleAdapter = new RoleAdapter();
    this.channelManager = new ChannelManager();
    this.defaultLanguage = config.defaultLanguage || Language.ENGLISH;
    
    // Initialize TTS if configured
    if (config.elevenlabs) {
      this.tts = new ElevenLabsTTS(config.elevenlabs);
    } else {
      this.tts = null;
    }
  }

  /**
   * Greet a new or returning user in their language
   */
  async greet(userId: string, language?: Language): Promise<MAXResponse> {
    const userContext = this.memory.getUserContext(userId, language || this.defaultLanguage);
    
    // Use provided language or user's preferred language
    const greetingLanguage = language || userContext.language;
    
    // Update user context with language
    this.memory.updateUserContext(userId, { language: greetingLanguage });
    
    // Get greeting message
    const greeting = this.languageDetector.getGreetingForLanguage(greetingLanguage, GREETINGS);
    
    // Add to conversation history
    const message: Message = {
      role: 'assistant',
      content: greeting,
      timestamp: new Date(),
      channel: Channel.WEBSITE
    };
    this.memory.addMessage(userId, message);
    
    // Generate voice if TTS is available
    let voiceUrl: string | undefined;
    if (this.tts && this.tts.isConfigured()) {
      const audioBuffer = await this.tts.textToSpeech(greeting);
      if (audioBuffer) {
        voiceUrl = 'data:audio/mpeg;base64,' + audioBuffer.toString('base64');
      }
    }
    
    return {
      message: greeting,
      language: greetingLanguage,
      role: Role.GENERAL,
      voiceUrl
    };
  }

  /**
   * Process a user message and generate a response
   */
  async processMessage(
    userId: string,
    userMessage: string,
    channel: Channel = Channel.WEBSITE
  ): Promise<MAXResponse> {
    // Detect language from message
    const detectedLanguage = this.languageDetector.detectLanguage(userMessage);
    
    // Get or update user context
    const userContext = this.memory.getUserContext(userId, detectedLanguage);
    this.memory.updateUserContext(userId, { language: detectedLanguage });
    
    // Add user message to history
    const userMsg: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
      channel
    };
    this.memory.addMessage(userId, userMsg);
    
    // Detect appropriate role based on message content
    const detectedRole = this.roleAdapter.detectRole(userMessage);
    
    // Update user's preferred role if changed
    if (detectedRole !== Role.GENERAL) {
      this.memory.updateUserContext(userId, { preferredRole: detectedRole });
    }
    
    // Use detected role or user's preferred role
    const activeRole = userContext.preferredRole || detectedRole;
    
    // Generate response based on role and personality
    const responseMessage = this.generateResponse(
      userMessage,
      activeRole,
      detectedLanguage,
      userContext.conversationHistory
    );
    
    // Add response to history
    const assistantMsg: Message = {
      role: 'assistant',
      content: responseMessage,
      timestamp: new Date(),
      channel
    };
    this.memory.addMessage(userId, assistantMsg);
    
    // Send through appropriate channel
    await this.channelManager.send(channel, userId, responseMessage);
    
    // Generate voice if TTS is available
    let voiceUrl: string | undefined;
    if (this.tts && this.tts.isConfigured()) {
      const audioBuffer = await this.tts.textToSpeech(responseMessage);
      if (audioBuffer) {
        voiceUrl = 'data:audio/mpeg;base64,' + audioBuffer.toString('base64');
      }
    }
    
    return {
      message: responseMessage,
      language: detectedLanguage,
      role: activeRole,
      voiceUrl
    };
  }

  /**
   * Generate a response based on role, language, and context
   */
  private generateResponse(
    userMessage: string,
    role: Role,
    language: Language,
    history: Message[]
  ): string {
    // This is a simplified response generator
    // In a real implementation, this would integrate with an LLM API
    
    const roleGreeting = this.roleAdapter.getRoleGreeting(role, language);
    
    // Build context-aware response
    const recentHistory = history.slice(-5); // Last 5 messages for context
    
    // Return a contextual response based on personality traits
    const responses: Record<Language, string> = {
      [Language.ENGLISH]: `I understand you're asking about "${userMessage}". ${roleGreeting} Let me help you with that in a calm and patient way.`,
      [Language.QUEBEC_FRENCH]: `Je comprends que vous posez des questions sur "${userMessage}". ${roleGreeting} Permettez-moi de vous aider de manière calme et patiente.`,
      [Language.SPANISH]: `Entiendo que estás preguntando sobre "${userMessage}". ${roleGreeting} Déjame ayudarte de manera tranquila y paciente.`,
      [Language.BRAZILIAN_PORTUGUESE]: `Entendo que você está perguntando sobre "${userMessage}". ${roleGreeting} Deixe-me ajudá-lo de forma calma e paciente.`
    };
    
    return responses[language];
  }

  /**
   * Get user's conversation history
   */
  getConversationHistory(userId: string): Message[] {
    return this.memory.getConversationHistory(userId);
  }

  /**
   * Get user context
   */
  getUserContext(userId: string) {
    return this.memory.getUserContext(userId);
  }

  /**
   * Clear user data (for privacy/GDPR compliance)
   */
  clearUserData(userId: string): void {
    this.memory.clearUserContext(userId);
  }

  /**
   * Get personality information
   */
  getPersonality() {
    return PERSONALITY_TRAITS;
  }

  /**
   * Check if voice is available
   */
  isVoiceAvailable(): boolean {
    return this.tts !== null && this.tts.isConfigured();
  }
}
