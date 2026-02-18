# Quick Start Guide

Get MAX up and running in minutes!

## Installation

```bash
# Clone the repository
git clone https://github.com/brandonlacoste9-tech/MAX2.0.git
cd MAX2.0

# Install dependencies
npm install

# Build the project
npm run build
```

## Basic Usage

```typescript
import { MAX, Language } from './src';

// Create MAX instance
const max = new MAX();

// Greet a user
const greeting = await max.greet('user123', Language.ENGLISH);
console.log(greeting.message);
// Output: "Hello! I'm MAX, your friendly AI assistant. How can I help you today?"

// Process a message
const response = await max.processMessage('user123', 'I need help with my diet');
console.log(response.message);
// MAX automatically detects this is about diet/fitness and responds as a health guide
```

## Running Examples

```bash
# Run the interactive demo
npm run dev

# Or run specific examples with ts-node
npx ts-node examples/demo.ts
npx ts-node examples/basic.ts
npx ts-node examples/multi-language.ts
npx ts-node examples/role-adaptation.ts
npx ts-node examples/multi-channel.ts
npx ts-node examples/memory.ts
```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Configuration

### Optional: Enable Voice with ElevenLabs

1. Get an API key from [ElevenLabs](https://elevenlabs.io)
2. Create a `.env` file (see `.env.example`)
3. Add your API key:
   ```
   ELEVENLABS_API_KEY=your_api_key_here
   ```
4. Initialize MAX with voice support:
   ```typescript
   const max = new MAX({
     elevenlabs: {
       apiKey: process.env.ELEVENLABS_API_KEY,
       voiceId: 'optional-voice-id'
     }
   });
   ```

## Features Overview

### ✨ What MAX Can Do

1. **Multi-language Support** - Automatically detects and responds in English, Quebec French, Spanish, or Brazilian Portuguese
2. **Smart Role Detection** - Adapts to provide specialized help (legal, plumbing, therapy, fitness, life coaching, advertising)
3. **Never Forgets** - Remembers all conversations and user preferences
4. **Multi-channel** - Works across website, WhatsApp, Telegram, SMS, and voice
5. **Friendly Personality** - Always calm, patient, and supportive

### 🎯 Use Cases

- **Customer Support** - Answer questions across multiple languages
- **Personal Assistant** - Help with various life aspects
- **Educational Tool** - Provide guidance and support
- **Business Tool** - Marketing and advertising assistance
- **Health Coach** - Diet and fitness guidance
- **Mental Health** - Emotional support and therapy assistance

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore the [examples/](examples/) directory for more use cases
- Check the [src/](src/) directory to understand the codebase
- Run `npm test` to see all tests in action

## Need Help?

MAX is designed to be intuitive and easy to use. If you have questions:

1. Check the examples in the `examples/` directory
2. Read the API documentation in the README
3. Look at the test files in `src/__tests__/` for usage patterns
4. Review the TypeScript interfaces in `src/types.ts`

Happy coding! 🚀
