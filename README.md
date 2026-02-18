# MAX 2.0 - AI Assistant & Guru for Floguru.com

MAX is an intelligent, multilingual AI assistant that provides adaptive help across multiple channels. MAX greets visitors in their language and assists with whatever they need, from legal advice to fitness coaching.

## 🌟 Features

### Multi-language Greeting
- **English** - Full support
- **Quebec French** - Bonjour! Support québécois complet
- **Spanish** - ¡Soporte completo en español!
- **Brazilian Portuguese** - Suporte completo em português brasileiro

### Adaptive Help
MAX automatically adapts to provide expert assistance in multiple domains:
- **Lawyer** - Legal advice and guidance
- **Plumber** - Plumbing repairs and maintenance
- **Therapist** - Emotional support and wellness
- **Diet/Fitness Coach** - Health and fitness guidance
- **Life Coach** - Personal development and goals
- **Advertiser** - Marketing and advertising strategy

### Never Pushy
MAX is designed to be:
- Calm and patient
- Friendly and approachable
- Helpful without being pushy
- Respectful of boundaries

### Never Forget
- Remembers conversation history
- Maintains user context
- Learns preferences over time
- Provides personalized interactions

### Multi-channel Support
MAX can communicate through:
- **Website** - Web chat interface
- **WhatsApp** - WhatsApp Business API
- **Telegram** - Telegram Bot
- **SMS** - Text messages via Twilio
- **Voice** - Voice calls with text-to-speech

### Voice Capabilities
- Powered by ElevenLabs TTS
- Natural-sounding voice responses
- Multi-language voice support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- OpenAI API key
- (Optional) ElevenLabs API key for voice
- (Optional) Channel-specific credentials (WhatsApp, Telegram, Twilio)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/brandonlacoste9-tech/MAX2.0.git
cd MAX2.0
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys
```

4. Start the server:
```bash
npm start
```

The server will start on `http://localhost:3000`

## 📖 API Documentation

### Health Check
```bash
GET /health
```

### Get System Info
```bash
GET /api/info
```

Returns information about MAX capabilities, supported languages, and active channels.

### Chat with MAX
```bash
POST /api/chat
Content-Type: application/json

{
  "userId": "user123",
  "message": "Hello, I need help with a legal question",
  "language": "en",  // optional: en, fr-qc, es, pt-br
  "role": "lawyer",  // optional: lawyer, plumber, therapist, fitness, coach, advertiser
  "channel": "website"
}
```

### Get Greeting
```bash
POST /api/greeting
Content-Type: application/json

{
  "userId": "user123",
  "language": "es"  // optional
}
```

### Change Language
```bash
POST /api/language
Content-Type: application/json

{
  "userId": "user123",
  "language": "fr-qc"
}
```

### Change Role
```bash
POST /api/role
Content-Type: application/json

{
  "userId": "user123",
  "role": "fitness"
}
```

### Get Conversation History
```bash
GET /api/history/:userId?limit=10
```

### Clear Conversation History
```bash
DELETE /api/history/:userId
```

### Text-to-Speech
```bash
POST /api/tts
Content-Type: application/json

{
  "text": "Hello, I am MAX, your AI assistant",
  "voiceOptions": {
    "stability": 0.5,
    "similarityBoost": 0.75
  }
}
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Required
OPENAI_API_KEY=your_openai_api_key_here

# Optional - Voice Support
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_VOICE_ID=your_voice_id_here

# Optional - WhatsApp
WHATSAPP_TOKEN=your_whatsapp_token_here
WHATSAPP_VERIFY_TOKEN=your_verify_token_here

# Optional - Telegram
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# Optional - SMS (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here

# Server
PORT=3000
NODE_ENV=development
```

## 🏗️ Architecture

```
src/
├── core/
│   ├── agent.js       # MAX AI agent with OpenAI integration
│   ├── memory.js      # User memory and conversation history
│   └── roles.js       # Adaptive help roles (lawyer, plumber, etc.)
├── languages/
│   └── greetings.js   # Multi-language support
├── channels/
│   ├── base.js        # Base channel classes
│   └── manager.js     # Channel management
├── services/
│   └── elevenlabs.js  # Text-to-speech service
└── index.js           # Express server and API endpoints
```

## 🤝 Usage Examples

### Example 1: Basic Chat (English)
```javascript
const response = await fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user123',
    message: 'I need help with my leaking faucet'
  })
});

const data = await response.json();
console.log(data.message); // MAX responds as plumber
```

### Example 2: Spanish Greeting
```javascript
const response = await fetch('http://localhost:3000/api/greeting', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user456',
    language: 'es'
  })
});

const data = await response.json();
console.log(data.message); // "¡Hola! Soy MAX..."
```

### Example 3: Life Coaching Session
```javascript
const response = await fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user789',
    message: 'I want to achieve my career goals',
    role: 'coach'
  })
});

const data = await response.json();
console.log(data.message); // MAX responds as life coach
```

## 🌐 Supported Languages

| Language | Code | Example Greeting |
|----------|------|------------------|
| English | `en` | "Hello! I'm MAX..." |
| Quebec French | `fr-qc` | "Bonjour! Je suis MAX..." |
| Spanish | `es` | "¡Hola! Soy MAX..." |
| Brazilian Portuguese | `pt-br` | "Olá! Eu sou MAX..." |

## 🎭 Available Roles

| Role | Key | Expertise |
|------|-----|-----------|
| General Assistant | `general` | General help across topics |
| Legal Advisor | `lawyer` | Legal advice and guidance |
| Plumbing Expert | `plumber` | Plumbing repairs and maintenance |
| Wellness Therapist | `therapist` | Emotional support and wellness |
| Diet & Fitness Coach | `fitness` | Health, nutrition, and exercise |
| Life Coach | `coach` | Personal development and goals |
| Marketing Expert | `advertiser` | Marketing and advertising |

## 📱 Channel Support

| Channel | Status | Configuration Required |
|---------|--------|------------------------|
| Website | ✅ Always Active | None |
| WhatsApp | ⚙️ Configurable | WhatsApp Business API |
| Telegram | ⚙️ Configurable | Telegram Bot Token |
| SMS | ⚙️ Configurable | Twilio Account |
| Voice | ⚙️ Configurable | ElevenLabs API |

## 🧪 Testing

Run the test suite:
```bash
npm test
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT models
- ElevenLabs for text-to-speech
- The Floguru.com team

## 📞 Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/brandonlacoste9-tech/MAX2.0). 
