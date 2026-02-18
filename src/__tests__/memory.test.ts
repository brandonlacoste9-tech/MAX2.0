import { MemoryManager } from '../memory';
import { Language, Message } from '../types';

describe('MemoryManager', () => {
  let memory: MemoryManager;

  beforeEach(() => {
    memory = new MemoryManager();
  });

  describe('getUserContext', () => {
    it('should create new context for new user', () => {
      const context = memory.getUserContext('user1');
      expect(context.userId).toBe('user1');
      expect(context.conversationHistory).toEqual([]);
      expect(context.metadata).toEqual({});
    });

    it('should return existing context for existing user', () => {
      const context1 = memory.getUserContext('user1');
      const context2 = memory.getUserContext('user1');
      expect(context1).toBe(context2);
    });

    it('should use default language', () => {
      const context = memory.getUserContext('user1', Language.SPANISH);
      expect(context.language).toBe(Language.SPANISH);
    });
  });

  describe('updateUserContext', () => {
    it('should update user context', () => {
      memory.getUserContext('user1');
      memory.updateUserContext('user1', { language: Language.QUEBEC_FRENCH });
      
      const context = memory.getUserContext('user1');
      expect(context.language).toBe(Language.QUEBEC_FRENCH);
    });
  });

  describe('addMessage', () => {
    it('should add message to conversation history', () => {
      const message: Message = {
        role: 'user',
        content: 'Hello',
        timestamp: new Date()
      };

      memory.addMessage('user1', message);
      const history = memory.getConversationHistory('user1');
      
      expect(history).toHaveLength(1);
      expect(history[0]).toEqual(message);
    });

    it('should maintain message order', () => {
      const msg1: Message = { role: 'user', content: 'First', timestamp: new Date() };
      const msg2: Message = { role: 'assistant', content: 'Second', timestamp: new Date() };
      
      memory.addMessage('user1', msg1);
      memory.addMessage('user1', msg2);
      
      const history = memory.getConversationHistory('user1');
      expect(history[0]).toEqual(msg1);
      expect(history[1]).toEqual(msg2);
    });
  });

  describe('metadata', () => {
    it('should store and retrieve metadata', () => {
      memory.setMetadata('user1', 'preference', 'dark_mode');
      expect(memory.getMetadata('user1', 'preference')).toBe('dark_mode');
    });

    it('should return undefined for non-existent metadata', () => {
      expect(memory.getMetadata('user1', 'nonexistent')).toBeUndefined();
    });
  });

  describe('clearUserContext', () => {
    it('should remove user context', () => {
      memory.getUserContext('user1');
      memory.addMessage('user1', { role: 'user', content: 'Test', timestamp: new Date() });
      
      memory.clearUserContext('user1');
      
      const newContext = memory.getUserContext('user1');
      expect(newContext.conversationHistory).toEqual([]);
    });
  });

  describe('getAllUserIds', () => {
    it('should return all user IDs', () => {
      memory.getUserContext('user1');
      memory.getUserContext('user2');
      memory.getUserContext('user3');
      
      const userIds = memory.getAllUserIds();
      expect(userIds).toContain('user1');
      expect(userIds).toContain('user2');
      expect(userIds).toContain('user3');
      expect(userIds).toHaveLength(3);
    });
  });
});
