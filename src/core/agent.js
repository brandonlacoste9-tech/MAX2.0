import OpenAI from 'openai';
import { getGreeting, detectLanguage } from '../languages/greetings.js';
import { getRole, detectRole } from './roles.js';
import { userMemory } from './memory.js';

/**
 * MAX AI Agent
 * The core AI assistant with personality, multi-language support, and adaptive help
 */

export class MaxAgent {
  constructor(apiKey) {
    this.openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY
    });
    
    this.personality = {
      traits: ['calm', 'patient', 'friendly', 'helpful', 'never-pushy'],
      tone: 'conversational and supportive',
      style: 'clear and accessible'
    };
  }

  /**
   * Process a message from a user
   */
  async processMessage(userId, message, options = {}) {
    try {
      // Get or create user context
      const user = userMemory.getUser(userId);
      
      // Detect and set language if first message or language changed
      const detectedLanguage = options.language || detectLanguage(message, user.language);
      if (detectedLanguage !== user.language) {
        userMemory.setLanguage(userId, detectedLanguage);
      }
      
      // Detect and set role if needed
      const detectedRole = options.role || detectRole(message);
      if (detectedRole !== user.role && !options.keepRole) {
        userMemory.setRole(userId, detectedRole);
      }
      
      // Add user message to history
      userMemory.addMessage(userId, {
        role: 'user',
        content: message
      });
      
      // Get greeting for this language
      const greeting = getGreeting(user.language);
      
      // Get role configuration
      const roleConfig = getRole(user.role);
      
      // Build conversation history for OpenAI
      const messages = this.buildMessages(userId, roleConfig, greeting);
      
      // Call OpenAI API
      const response = await this.openai.chat.completions.create({
        model: options.model || 'gpt-4',
        messages: messages,
        temperature: 0.7,
        max_tokens: options.maxTokens || 500
      });
      
      const assistantMessage = response.choices[0].message.content;
      
      // Add assistant response to history
      userMemory.addMessage(userId, {
        role: 'assistant',
        content: assistantMessage
      });
      
      return {
        message: assistantMessage,
        language: user.language,
        role: user.role,
        userId: userId
      };
    } catch (error) {
      console.error('Error processing message:', error);
      throw error;
    }
  }

  /**
   * Build messages array for OpenAI API
   */
  buildMessages(userId, roleConfig, greeting) {
    const user = userMemory.getUser(userId);
    const history = userMemory.getHistory(userId, 10);
    
    // System message with personality and role
    const systemMessage = {
      role: 'system',
      content: `${roleConfig.systemPrompt}

Your name is ${greeting.name}, and you are communicating in ${greeting.language}.

Key personality traits:
- Calm and patient - never rush or pressure users
- Friendly and approachable
- Helpful and knowledgeable
- Never pushy - respect boundaries
- Remember context from the conversation

${roleConfig.greeting}

Respond naturally in ${greeting.language} and maintain a ${this.personality.tone} tone.`
    };
    
    // Build messages array
    const messages = [systemMessage];
    
    // Add conversation history
    history.forEach(msg => {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    });
    
    return messages;
  }

  /**
   * Get a greeting message for a user
   */
  getGreetingMessage(userId, language = null) {
    const user = userMemory.getUser(userId);
    const lang = language || user.language;
    const greeting = getGreeting(lang);
    const roleConfig = getRole(user.role);
    
    return {
      message: `${greeting.welcome}\n\n${roleConfig.greeting}`,
      language: lang,
      role: user.role
    };
  }

  /**
   * Change user language
   */
  changeLanguage(userId, language) {
    userMemory.setLanguage(userId, language);
    return this.getGreetingMessage(userId, language);
  }

  /**
   * Change user role
   */
  changeRole(userId, role) {
    userMemory.setRole(userId, role);
    const user = userMemory.getUser(userId);
    return this.getGreetingMessage(userId, user.language);
  }

  /**
   * Clear user conversation history
   */
  clearHistory(userId) {
    userMemory.clearHistory(userId);
    return { success: true, message: 'Conversation history cleared' };
  }
}

// Export singleton instance
let maxInstance = null;

export function getMaxAgent(apiKey = null) {
  if (!maxInstance) {
    maxInstance = new MaxAgent(apiKey);
  }
  return maxInstance;
}
