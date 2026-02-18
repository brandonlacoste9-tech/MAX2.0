import { MAX } from '../max';
import { Language, Role, Channel } from '../types';

describe('MAX', () => {
  let max: MAX;

  beforeEach(() => {
    max = new MAX();
  });

  describe('greet', () => {
    it('should greet user in English by default', async () => {
      const response = await max.greet('user1');
      expect(response.language).toBe(Language.ENGLISH);
      expect(response.message).toContain('MAX');
    });

    it('should greet user in specified language', async () => {
      const response = await max.greet('user1', Language.SPANISH);
      expect(response.language).toBe(Language.SPANISH);
      expect(response.message).toContain('MAX');
    });

    it('should store greeting in conversation history', async () => {
      await max.greet('user1');
      const history = max.getConversationHistory('user1');
      expect(history).toHaveLength(1);
      expect(history[0].role).toBe('assistant');
    });

    it('should remember user language preference', async () => {
      await max.greet('user1', Language.QUEBEC_FRENCH);
      const context = max.getUserContext('user1');
      expect(context.language).toBe(Language.QUEBEC_FRENCH);
    });
  });

  describe('processMessage', () => {
    it('should process user message and generate response', async () => {
      const response = await max.processMessage('user1', 'I need legal help');
      expect(response.message).toBeTruthy();
      expect(response.role).toBe(Role.LAWYER);
    });

    it('should detect language from message', async () => {
      const response = await max.processMessage('user1', 'Hola, necesito ayuda');
      expect(response.language).toBe(Language.SPANISH);
    });

    it('should detect appropriate role', async () => {
      const response = await max.processMessage('user1', 'My sink is leaking');
      expect(response.role).toBe(Role.PLUMBER);
    });

    it('should store messages in history', async () => {
      await max.processMessage('user1', 'Hello');
      const history = max.getConversationHistory('user1');
      
      // Should have user message and assistant response
      expect(history.length).toBeGreaterThanOrEqual(2);
      expect(history[history.length - 2].role).toBe('user');
      expect(history[history.length - 1].role).toBe('assistant');
    });

    it('should remember preferred role', async () => {
      await max.processMessage('user1', 'I need help with my diet');
      const context = max.getUserContext('user1');
      expect(context.preferredRole).toBe(Role.DIET_FITNESS);
    });

    it('should handle different channels', async () => {
      const response = await max.processMessage('user1', 'Hello', Channel.WHATSAPP);
      expect(response).toBeTruthy();
    });
  });

  describe('getPersonality', () => {
    it('should return personality traits', () => {
      const personality = max.getPersonality();
      expect(personality.tone).toBe('calm and patient');
      expect(personality.style).toBe('friendly and approachable');
      expect(personality.approach).toBe('never pushy, always supportive');
    });
  });

  describe('clearUserData', () => {
    it('should clear user conversation history', async () => {
      await max.processMessage('user1', 'Hello');
      max.clearUserData('user1');
      
      const history = max.getConversationHistory('user1');
      expect(history).toEqual([]);
    });
  });

  describe('isVoiceAvailable', () => {
    it('should return false when TTS not configured', () => {
      expect(max.isVoiceAvailable()).toBe(false);
    });
  });

  describe('multi-language support', () => {
    it('should handle Quebec French', async () => {
      const response = await max.processMessage('user1', 'Bonjour, je besoin aide');
      expect(response.language).toBe(Language.QUEBEC_FRENCH);
    });

    it('should handle Brazilian Portuguese', async () => {
      const response = await max.processMessage('user1', 'Olá, eu preciso de ajuda');
      expect(response.language).toBe(Language.BRAZILIAN_PORTUGUESE);
    });
  });

  describe('role adaptation', () => {
    it('should adapt to therapist role', async () => {
      const response = await max.processMessage('user1', 'I feel stressed and anxious');
      expect(response.role).toBe(Role.THERAPIST);
    });

    it('should adapt to life coach role', async () => {
      const response = await max.processMessage('user1', 'I need help with my goals');
      expect(response.role).toBe(Role.LIFE_COACH);
    });

    it('should adapt to advertiser role', async () => {
      const response = await max.processMessage('user1', 'I need help with my marketing campaign');
      expect(response.role).toBe(Role.ADVERTISER);
    });
  });
});
