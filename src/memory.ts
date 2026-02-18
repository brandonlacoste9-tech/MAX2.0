import { UserContext, Message, Language } from './types';

/**
 * Memory system for MAX - remembers everything about each user
 */
export class MemoryManager {
  private userContexts: Map<string, UserContext>;

  constructor() {
    this.userContexts = new Map();
  }

  /**
   * Get user context or create a new one
   */
  getUserContext(userId: string, defaultLanguage: Language = Language.ENGLISH): UserContext {
    if (!this.userContexts.has(userId)) {
      this.userContexts.set(userId, {
        userId,
        language: defaultLanguage,
        conversationHistory: [],
        metadata: {}
      });
    }
    return this.userContexts.get(userId)!;
  }

  /**
   * Update user context
   */
  updateUserContext(userId: string, updates: Partial<UserContext>): void {
    const context = this.getUserContext(userId);
    Object.assign(context, updates);
  }

  /**
   * Add message to conversation history
   */
  addMessage(userId: string, message: Message): void {
    const context = this.getUserContext(userId);
    context.conversationHistory.push(message);
  }

  /**
   * Get conversation history for a user
   */
  getConversationHistory(userId: string): Message[] {
    return this.getUserContext(userId).conversationHistory;
  }

  /**
   * Store user metadata
   */
  setMetadata(userId: string, key: string, value: unknown): void {
    const context = this.getUserContext(userId);
    context.metadata[key] = value;
  }

  /**
   * Retrieve user metadata
   */
  getMetadata(userId: string, key: string): unknown {
    return this.getUserContext(userId).metadata[key];
  }

  /**
   * Clear user context (for testing or privacy)
   */
  clearUserContext(userId: string): void {
    this.userContexts.delete(userId);
  }

  /**
   * Get all user IDs
   */
  getAllUserIds(): string[] {
    return Array.from(this.userContexts.keys());
  }
}
