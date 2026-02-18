import { MAX, Channel } from '../src';

/**
 * Multi-channel example showing different communication channels
 */
async function multiChannelExample() {
  console.log('=== Multi-Channel Example ===\n');

  const max = new MAX();

  // Website interaction
  console.log('1. Website Channel:');
  const websiteResponse = await max.processMessage(
    'user-web',
    'Hello, I need help with my advertising',
    Channel.WEBSITE
  );
  console.log(`   Response: ${websiteResponse.message}`);
  console.log();

  // WhatsApp interaction
  console.log('2. WhatsApp Channel:');
  const whatsappResponse = await max.processMessage(
    'user-whatsapp',
    'My sink is leaking',
    Channel.WHATSAPP
  );
  console.log(`   Response: ${whatsappResponse.message}`);
  console.log();

  // Telegram interaction
  console.log('3. Telegram Channel:');
  const telegramResponse = await max.processMessage(
    'user-telegram',
    'I need legal advice',
    Channel.TELEGRAM
  );
  console.log(`   Response: ${telegramResponse.message}`);
  console.log();

  // SMS interaction
  console.log('4. SMS Channel:');
  const smsResponse = await max.processMessage(
    'user-sms',
    'I need fitness help',
    Channel.SMS
  );
  console.log(`   Response: ${smsResponse.message}`);
  console.log();

  // Voice interaction
  console.log('5. Voice Channel:');
  const voiceResponse = await max.processMessage(
    'user-voice',
    'I feel stressed',
    Channel.VOICE
  );
  console.log(`   Response: ${voiceResponse.message}`);
  console.log(`   Voice Available: ${max.isVoiceAvailable()}`);
  console.log();
}

// Run the example
multiChannelExample().catch(console.error);
