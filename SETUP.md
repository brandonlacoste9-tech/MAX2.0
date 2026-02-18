# MAX 2.0 Setup and Deployment Guide

This guide will help you set up and deploy the MAX AI Assistant.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Testing](#testing)
5. [Deployment](#deployment)
6. [Channel Setup](#channel-setup)

## Prerequisites

### Required
- Node.js 18.x or higher
- npm or yarn package manager
- OpenAI API key (for AI functionality)

### Optional (for additional features)
- ElevenLabs API key (for voice/TTS)
- WhatsApp Business API account
- Telegram Bot token
- Twilio account (for SMS)

## Installation

1. **Clone the repository:**
```bash
git clone https://github.com/brandonlacoste9-tech/MAX2.0.git
cd MAX2.0
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```env
# Required
OPENAI_API_KEY=sk-your-openai-api-key-here

# Optional
ELEVENLABS_API_KEY=your-elevenlabs-api-key-here
ELEVENLABS_VOICE_ID=your-voice-id-here
```

## Configuration

### OpenAI Setup
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add it to your `.env` file as `OPENAI_API_KEY`

### ElevenLabs Setup (Optional - for voice)
1. Go to https://elevenlabs.io/
2. Sign up for an account
3. Get your API key from Settings
4. Choose a voice and get its ID
5. Add both to your `.env` file

### Server Configuration
```env
PORT=3000              # Server port
NODE_ENV=development   # Environment: development or production
```

## Testing

### Run Core Tests
Test the core functionality without requiring API keys:
```bash
npm test
```

This will test:
- Multi-language support (EN, FR-QC, ES, PT-BR)
- Role detection and switching
- User memory system
- Conversation management

### Start the Server
```bash
npm start
```

The server will start on `http://localhost:3000`

### Test the Web Interface
1. Start the server: `npm start`
2. Open `examples/website/index.html` in your browser
3. Interact with MAX in different languages and roles

### Test API Endpoints

**Health Check:**
```bash
curl http://localhost:3000/health
```

**System Info:**
```bash
curl http://localhost:3000/api/info
```

**Chat:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test123",
    "message": "Hello MAX, I need help with fitness"
  }'
```

## Deployment

### Deploy to Production Server

1. **Set environment variables:**
```bash
export NODE_ENV=production
export OPENAI_API_KEY=your-key
export PORT=3000
```

2. **Install production dependencies:**
```bash
npm ci --production
```

3. **Start with PM2 (recommended):**
```bash
npm install -g pm2
pm2 start src/index.js --name max-ai
pm2 save
pm2 startup
```

### Deploy to Cloud Platforms

#### Heroku
```bash
# Login to Heroku
heroku login

# Create app
heroku create max-ai-assistant

# Set config vars
heroku config:set OPENAI_API_KEY=your-key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

#### AWS (EC2)
1. Launch an EC2 instance (Ubuntu 22.04 recommended)
2. SSH into the instance
3. Install Node.js and npm
4. Clone the repository
5. Set up environment variables
6. Install PM2 and start the application
7. Configure nginx as reverse proxy (optional)

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t max-ai .
docker run -p 3000:3000 --env-file .env max-ai
```

## Channel Setup

### Website Channel
The website channel is always active. No additional setup required.

Use the example HTML client in `examples/website/index.html` or integrate the API into your own website.

### WhatsApp Channel

1. **Set up WhatsApp Business API:**
   - Go to https://business.whatsapp.com/
   - Create a Business account
   - Get API credentials

2. **Configure webhooks:**
   ```env
   WHATSAPP_TOKEN=your-token
   WHATSAPP_VERIFY_TOKEN=your-verify-token
   ```

3. **Set webhook URL:**
   ```
   https://your-domain.com/webhooks/whatsapp
   ```

### Telegram Channel

1. **Create a Telegram Bot:**
   - Message @BotFather on Telegram
   - Use `/newbot` command
   - Get your bot token

2. **Configure:**
   ```env
   TELEGRAM_BOT_TOKEN=your-bot-token
   ```

3. **Set webhook:**
   ```bash
   curl -X POST https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook \
     -d "url=https://your-domain.com/webhooks/telegram"
   ```

### SMS Channel (Twilio)

1. **Set up Twilio account:**
   - Go to https://www.twilio.com/
   - Sign up and get credentials

2. **Configure:**
   ```env
   TWILIO_ACCOUNT_SID=your-account-sid
   TWILIO_AUTH_TOKEN=your-auth-token
   TWILIO_PHONE_NUMBER=your-twilio-number
   ```

3. **Set webhook URL in Twilio console:**
   ```
   https://your-domain.com/webhooks/sms
   ```

## Monitoring and Logs

### View Logs (PM2)
```bash
pm2 logs max-ai
```

### Monitor Performance
```bash
pm2 monit
```

### Health Checks
Set up a monitoring service to check:
```
GET https://your-domain.com/health
```

Expected response: `{"status":"healthy"}`

## Troubleshooting

### Server won't start
- Check if port 3000 is available
- Verify Node.js version (18+)
- Check environment variables

### OpenAI API errors
- Verify API key is correct
- Check API quota and billing
- Review OpenAI API status

### Channel not working
- Verify channel-specific credentials
- Check webhook URLs are accessible
- Review channel-specific logs

## Security Best Practices

1. **Never commit `.env` files**
2. **Use HTTPS in production**
3. **Rotate API keys regularly**
4. **Implement rate limiting**
5. **Monitor API usage**
6. **Use environment-specific configs**

## Scaling

### Horizontal Scaling
- Deploy multiple instances behind a load balancer
- Use Redis for shared session storage
- Implement message queue for high traffic

### Database Integration
For production, replace in-memory storage with:
- Redis for session/memory
- MongoDB for conversation history
- PostgreSQL for user data

## Support

For issues and questions:
- GitHub Issues: https://github.com/brandonlacoste9-tech/MAX2.0/issues
- Documentation: README.md

## License

MIT License - see LICENSE file for details
