#!/usr/bin/env node

/**
 * Simple demo script to show MAX in action
 * Run with: npm run dev or ts-node examples/demo.ts
 */

import { MAX, Language, Channel } from '../src';

async function demo() {
  console.log('='.repeat(60));
  console.log('MAX 2.0 - AI Assistant Demo');
  console.log('='.repeat(60));
  console.log();

  const max = new MAX();

  // 1. Multi-language greetings
  console.log('🌍 MULTI-LANGUAGE GREETINGS');
  console.log('-'.repeat(60));
  
  const languages = [
    { code: Language.ENGLISH, name: 'English' },
    { code: Language.QUEBEC_FRENCH, name: 'Quebec French' },
    { code: Language.SPANISH, name: 'Spanish' },
    { code: Language.BRAZILIAN_PORTUGUESE, name: 'Brazilian Portuguese' }
  ];

  for (const lang of languages) {
    const greeting = await max.greet(`demo-user-${lang.code}`, lang.code);
    console.log(`${lang.name}:`);
    console.log(`  ${greeting.message}`);
    console.log();
  }

  // 2. Role adaptation
  console.log('🎭 ADAPTIVE ROLE SYSTEM');
  console.log('-'.repeat(60));
  
  const scenarios = [
    { query: 'I need legal advice', role: 'Lawyer' },
    { query: 'My sink is leaking', role: 'Plumber' },
    { query: 'I feel stressed', role: 'Therapist' },
    { query: 'Help me lose weight', role: 'Diet/Fitness' },
    { query: 'I need to set goals', role: 'Life Coach' },
    { query: 'How can I advertise better?', role: 'Advertiser' }
  ];

  for (const scenario of scenarios) {
    const response = await max.processMessage('demo-user', scenario.query);
    console.log(`Query: "${scenario.query}"`);
    console.log(`Role: ${response.role.toUpperCase()}`);
    console.log(`Response: ${response.message.substring(0, 80)}...`);
    console.log();
  }

  // 3. Memory demonstration
  console.log('🧠 MEMORY SYSTEM');
  console.log('-'.repeat(60));
  
  const userId = 'memory-demo-user';
  await max.processMessage(userId, 'I need help with my diet');
  await max.processMessage(userId, 'Also, what exercises should I do?');
  await max.processMessage(userId, 'Thanks for the advice');
  
  const history = max.getConversationHistory(userId);
  console.log(`Conversation with user '${userId}':`);
  console.log(`Total messages: ${history.length}`);
  console.log();
  history.forEach((msg, idx) => {
    const preview = msg.content.substring(0, 60);
    console.log(`  ${idx + 1}. [${msg.role.toUpperCase()}]: ${preview}${msg.content.length > 60 ? '...' : ''}`);
  });
  console.log();

  // 4. Personality
  console.log('😊 PERSONALITY TRAITS');
  console.log('-'.repeat(60));
  const personality = max.getPersonality();
  console.log(`Tone: ${personality.tone}`);
  console.log(`Style: ${personality.style}`);
  console.log(`Approach: ${personality.approach}`);
  console.log();

  // 5. Multi-channel support
  console.log('📱 MULTI-CHANNEL SUPPORT');
  console.log('-'.repeat(60));
  console.log('Supported channels:');
  console.log('  ✓ Website');
  console.log('  ✓ WhatsApp');
  console.log('  ✓ Telegram');
  console.log('  ✓ SMS');
  console.log('  ✓ Voice');
  console.log();
  console.log(`Voice TTS Available: ${max.isVoiceAvailable() ? 'Yes (configure ElevenLabs API key)' : 'No (configure ElevenLabs API key)'}`);
  console.log();

  console.log('='.repeat(60));
  console.log('Demo Complete!');
  console.log('='.repeat(60));
}

// Run demo
demo().catch(console.error);
