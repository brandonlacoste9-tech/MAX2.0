# MAX 2.0 - The AI Assistant and Guru

MAX is the intelligent AI assistant and guru on Floguru.com. MAX greets visitors in their language and helps them with whatever they need.

## ✨ Features

### 🌍 Multi-language Greeting
- **English** - Native English support
- **Quebec French** - Localized French for Quebec
- **Spanish** - Full Spanish language support
- **Brazilian Portuguese** - Localized Portuguese for Brazil

### 🎭 Adaptive Help
MAX automatically adapts to provide specialized assistance:
- 👔 **Lawyer** - Legal guidance and advice
- 🔧 **Plumber** - Plumbing help and troubleshooting
- 💭 **Therapist** - Emotional support and guidance
- 🏋️ **Diet/Fitness** - Health and wellness coaching
- 🎯 **Life Coach** - Personal development and goal setting
- 📢 **Advertiser** - Marketing and advertising expertise
- 🤝 **General** - Friendly assistance for anything else

### 😊 Never Pushy
MAX embodies a calm, patient, and friendly personality:
- Always supportive and understanding
- Never forceful or aggressive
- Respects user pace and preferences

### 🧠 Never Forget
Advanced memory system that remembers:
- Complete conversation history
- User preferences and language
- Role specialization preferences
- Custom metadata

### 📱 Multi-channel Support
MAX works across multiple platforms:
- 🌐 **Website** - Direct web integration
- 💬 **WhatsApp** - WhatsApp Business API
- 📲 **Telegram** - Telegram Bot integration
- 📱 **SMS** - Text message support
- 🎤 **Voice** - Voice interaction capability

### 🔊 Voice Support
Powered by **ElevenLabs TTS** for natural voice output

## 🚀 Installation

```bash
npm install
```

## 📖 Usage

### Basic Example

```typescript
import { MAX, Language } from 'max-ai-assistant';

// Create MAX instance
const max = new MAX();

// Greet user
const greeting = await max.greet('user123', Language.ENGLISH);
console.log(greeting.message);

// Process a message
const response = await max.processMessage('user123', 'I need help with my diet');
console.log(response.message);
```

### With ElevenLabs Voice

```typescript
import { MAX } from 'max-ai-assistant';

const max = new MAX({
  elevenlabs: {
    apiKey: 'your-api-key',
    voiceId: 'voice-id'
  }
});

const response = await max.processMessage('user123', 'Hello MAX');
if (response.voiceUrl) {
  // Play the voice response
  console.log('Voice URL:', response.voiceUrl);
}
```

### Multi-channel Support

```typescript
import { MAX, Channel } from 'max-ai-assistant';

const max = new MAX();

// Website
await max.processMessage('user1', 'Hello', Channel.WEBSITE);

// WhatsApp
await max.processMessage('user2', 'Hola', Channel.WHATSAPP);

// Telegram
await max.processMessage('user3', 'Bonjour', Channel.TELEGRAM);
```

## 🧪 Testing

```bash
npm test
```

## 🏗️ Building

```bash
npm run build
```

## 🔧 Development

```bash
npm run dev
```

## 📚 Examples

Check the `examples/` directory for more usage examples:
- `basic.ts` - Basic usage
- `multi-language.ts` - Language detection and greetings
- `role-adaptation.ts` - Role-based assistance
- `multi-channel.ts` - Channel integration
- `memory.ts` - Memory system demonstration

## 🤝 API Reference

### MAX Class

#### Constructor
```typescript
new MAX(config?: MAXConfig)
```

#### Methods

**`greet(userId: string, language?: Language): Promise<MAXResponse>`**
Greet a user in their preferred language.

**`processMessage(userId: string, message: string, channel?: Channel): Promise<MAXResponse>`**
Process a user message and generate an appropriate response.

**`getConversationHistory(userId: string): Message[]`**
Get the complete conversation history for a user.

**`getUserContext(userId: string): UserContext`**
Get the stored context for a user.

**`clearUserData(userId: string): void`**
Clear all stored data for a user (GDPR compliance).

**`getPersonality()`**
Get MAX's personality traits.

**`isVoiceAvailable(): boolean`**
Check if voice output is available.

## 🔒 Privacy & GDPR

MAX includes built-in privacy features:
- User data can be cleared on demand
- Conversation history is stored in memory (can be persisted to secure database)
- Supports right to be forgotten

## 📄 License

MIT

## 🙏 Acknowledgments

- ElevenLabs for TTS support
- All contributors and users of MAX 
