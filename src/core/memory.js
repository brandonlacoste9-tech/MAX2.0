/**
 * User Memory System
 * Stores conversation history and user preferences per user
 */

class UserMemory {
  constructor() {
    // In-memory storage (in production, use a database like Redis, MongoDB, etc.)
    this.users = new Map();
  }

  /**
   * Get or create user context
   */
  getUser(userId) {
    if (!this.users.has(userId)) {
      this.users.set(userId, {
        id: userId,
        language: 'en',
        role: 'general',
        conversationHistory: [],
        preferences: {},
        createdAt: new Date(),
        lastInteraction: new Date()
      });
    }
    
    const user = this.users.get(userId);
    user.lastInteraction = new Date();
    return user;
  }

  /**
   * Update user language preference
   */
  setLanguage(userId, language) {
    const user = this.getUser(userId);
    user.language = language;
    return user;
  }

  /**
   * Update user role preference
   */
  setRole(userId, role) {
    const user = this.getUser(userId);
    user.role = role;
    return user;
  }

  /**
   * Add message to conversation history
   */
  addMessage(userId, message) {
    const user = this.getUser(userId);
    user.conversationHistory.push({
      ...message,
      timestamp: new Date()
    });
    
    // Keep only last 50 messages to prevent memory issues
    if (user.conversationHistory.length > 50) {
      user.conversationHistory = user.conversationHistory.slice(-50);
    }
    
    return user;
  }

  /**
   * Get conversation history
   */
  getHistory(userId, limit = 10) {
    const user = this.getUser(userId);
    return user.conversationHistory.slice(-limit);
  }

  /**
   * Set user preference
   */
  setPreference(userId, key, value) {
    const user = this.getUser(userId);
    user.preferences[key] = value;
    return user;
  }

  /**
   * Get user preference
   */
  getPreference(userId, key) {
    const user = this.getUser(userId);
    return user.preferences[key];
  }

  /**
   * Clear user history
   */
  clearHistory(userId) {
    const user = this.getUser(userId);
    user.conversationHistory = [];
    return user;
  }

  /**
   * Get all users (for admin/debugging)
   */
  getAllUsers() {
    return Array.from(this.users.values());
  }

  /**
   * Delete user data
   */
  deleteUser(userId) {
    return this.users.delete(userId);
  }
}

// Singleton instance
export const userMemory = new UserMemory();
