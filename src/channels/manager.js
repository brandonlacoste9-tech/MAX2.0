import { WebsiteChannel, WhatsAppChannel, TelegramChannel, SMSChannel, VoiceChannel } from './base.js';
import { getElevenLabsService } from '../services/elevenlabs.js';

/**
 * Channel Manager
 * Manages all communication channels for MAX
 */

export class ChannelManager {
  constructor(config = {}) {
    this.channels = new Map();
    this.messageHandler = null;
    
    // Initialize channels
    this.initializeChannels(config);
  }

  /**
   * Initialize all channels
   */
  async initializeChannels(config) {
    // Website channel (always available)
    const websiteChannel = new WebsiteChannel(config.website);
    await websiteChannel.initialize();
    this.channels.set('website', websiteChannel);

    // WhatsApp channel (if configured)
    const whatsappChannel = new WhatsAppChannel(config.whatsapp);
    if (await whatsappChannel.initialize()) {
      this.channels.set('whatsapp', whatsappChannel);
    }

    // Telegram channel (if configured)
    const telegramChannel = new TelegramChannel(config.telegram);
    if (await telegramChannel.initialize()) {
      this.channels.set('telegram', telegramChannel);
    }

    // SMS channel (if configured)
    const smsChannel = new SMSChannel(config.sms);
    if (await smsChannel.initialize()) {
      this.channels.set('sms', smsChannel);
    }

    // Voice channel (if configured)
    const ttsService = getElevenLabsService();
    const voiceChannel = new VoiceChannel({ ...config.voice, ttsService });
    if (await voiceChannel.initialize()) {
      this.channels.set('voice', voiceChannel);
    }

    console.log(`Initialized ${this.channels.size} channels:`, Array.from(this.channels.keys()));
  }

  /**
   * Set message handler for all channels
   */
  setMessageHandler(handler) {
    this.messageHandler = handler;
    
    // Register handler with all channels
    this.channels.forEach(channel => {
      channel.onMessage(handler);
    });
  }

  /**
   * Get a specific channel
   */
  getChannel(channelName) {
    return this.channels.get(channelName);
  }

  /**
   * Send message through specific channel
   */
  async sendMessage(channelName, recipient, message, options = {}) {
    const channel = this.channels.get(channelName);
    if (!channel) {
      throw new Error(`Channel '${channelName}' not found or not configured`);
    }

    return await channel.sendMessage(recipient, message, options);
  }

  /**
   * Get all active channels
   */
  getActiveChannels() {
    return Array.from(this.channels.keys());
  }

  /**
   * Check if a channel is active
   */
  isChannelActive(channelName) {
    return this.channels.has(channelName);
  }
}

// Export singleton instance
let channelManagerInstance = null;

export function getChannelManager(config = {}) {
  if (!channelManagerInstance) {
    channelManagerInstance = new ChannelManager(config);
  }
  return channelManagerInstance;
}
