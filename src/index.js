import express from 'express';
import dotenv from 'dotenv';
import { getMaxAgent } from './core/agent.js';
import { getChannelManager } from './channels/manager.js';
import { getElevenLabsService } from './services/elevenlabs.js';
import { userMemory } from './core/memory.js';
import { getSupportedLanguages } from './languages/greetings.js';
import { getAllRoles } from './core/roles.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Initialize MAX agent and channels
const maxAgent = getMaxAgent();
const channelManager = getChannelManager();

// Set up message handler for all channels
channelManager.setMessageHandler(async (senderId, message, metadata, channelName) => {
  try {
    const response = await maxAgent.processMessage(senderId, message, metadata);
    await channelManager.sendMessage(channelName, senderId, response.message);
    return response;
  } catch (error) {
    console.error('Error handling message:', error);
    throw error;
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'MAX AI Assistant',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// Get system info
app.get('/api/info', (req, res) => {
  res.json({
    name: 'MAX',
    version: '2.0.0',
    description: 'AI Assistant and Guru for Floguru.com',
    features: {
      multiLanguage: true,
      adaptiveHelp: true,
      userMemory: true,
      multiChannel: true,
      voice: getElevenLabsService().isConfigured()
    },
    supportedLanguages: getSupportedLanguages(),
    availableRoles: getAllRoles(),
    activeChannels: channelManager.getActiveChannels()
  });
});

// Chat endpoint - main interaction point
app.post('/api/chat', async (req, res) => {
  try {
    const { userId, message, language, role, channel = 'website' } = req.body;

    if (!userId || !message) {
      return res.status(400).json({
        error: 'userId and message are required'
      });
    }

    const response = await maxAgent.processMessage(userId, message, {
      language,
      role,
      keepRole: !!role
    });

    res.json({
      success: true,
      ...response,
      channel
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get greeting
app.post('/api/greeting', async (req, res) => {
  try {
    const { userId, language } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: 'userId is required'
      });
    }

    const greeting = maxAgent.getGreetingMessage(userId, language);

    res.json({
      success: true,
      ...greeting
    });
  } catch (error) {
    console.error('Greeting error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Change language
app.post('/api/language', async (req, res) => {
  try {
    const { userId, language } = req.body;

    if (!userId || !language) {
      return res.status(400).json({
        error: 'userId and language are required'
      });
    }

    const response = maxAgent.changeLanguage(userId, language);

    res.json({
      success: true,
      ...response
    });
  } catch (error) {
    console.error('Language change error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Change role
app.post('/api/role', async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({
        error: 'userId and role are required'
      });
    }

    const response = maxAgent.changeRole(userId, role);

    res.json({
      success: true,
      ...response
    });
  } catch (error) {
    console.error('Role change error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get conversation history
app.get('/api/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10 } = req.query;

    const history = userMemory.getHistory(userId, parseInt(limit));
    const user = userMemory.getUser(userId);

    res.json({
      success: true,
      userId,
      history,
      language: user.language,
      role: user.role
    });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Clear conversation history
app.delete('/api/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const result = maxAgent.clearHistory(userId);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Clear history error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Text-to-speech endpoint
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voiceOptions } = req.body;

    if (!text) {
      return res.status(400).json({
        error: 'text is required'
      });
    }

    const ttsService = getElevenLabsService();
    
    if (!ttsService.isConfigured()) {
      return res.status(503).json({
        error: 'Text-to-speech service not configured'
      });
    }

    const audioBuffer = await ttsService.textToSpeech(text, voiceOptions);

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length
    });
    res.send(audioBuffer);
  } catch (error) {
    console.error('TTS error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// WhatsApp webhook verification
app.get('/webhooks/whatsapp', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const whatsappChannel = channelManager.getChannel('whatsapp');
  
  if (whatsappChannel) {
    const verifyResult = whatsappChannel.verifyWebhook(mode, token, challenge);
    if (verifyResult) {
      return res.status(200).send(verifyResult);
    }
  }

  res.status(403).send('Forbidden');
});

// WhatsApp webhook for incoming messages
app.post('/webhooks/whatsapp', async (req, res) => {
  try {
    // Handle WhatsApp webhook payload
    // Implementation depends on WhatsApp Business API structure
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Telegram webhook
app.post('/webhooks/telegram', async (req, res) => {
  try {
    // Handle Telegram webhook payload
    // Implementation depends on Telegram Bot API structure
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// SMS webhook (Twilio)
app.post('/webhooks/sms', async (req, res) => {
  try {
    // Handle Twilio SMS webhook payload
    // Implementation depends on Twilio API structure
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('SMS webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested endpoint does not exist'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('MAX AI Assistant v2.0');
  console.log('='.repeat(50));
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API Info: http://localhost:${PORT}/api/info`);
  console.log('');
  console.log('Features:');
  console.log('✓ Multi-language support (EN, FR-QC, ES, PT-BR)');
  console.log('✓ Adaptive help (6+ roles)');
  console.log('✓ User memory and context');
  console.log(`✓ Active channels: ${channelManager.getActiveChannels().join(', ')}`);
  console.log(`✓ Voice support: ${getElevenLabsService().isConfigured() ? 'Enabled' : 'Disabled (configure ElevenLabs)'}`);
  console.log('='.repeat(50));
});

export default app;
