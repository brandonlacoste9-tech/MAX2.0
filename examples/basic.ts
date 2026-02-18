import { MAX, Language, Channel } from '../src';

/**
 * Basic usage example of MAX
 */
async function basicExample() {
  console.log('=== Basic MAX Example ===\n');

  // Create MAX instance
  const max = new MAX();

  // Greet user in English
  console.log('1. English Greeting:');
  const englishGreeting = await max.greet('user1', Language.ENGLISH);
  console.log(englishGreeting.message);
  console.log();

  // Greet user in Spanish
  console.log('2. Spanish Greeting:');
  const spanishGreeting = await max.greet('user2', Language.SPANISH);
  console.log(spanishGreeting.message);
  console.log();

  // Process a legal question
  console.log('3. Legal Help:');
  const legalResponse = await max.processMessage('user1', 'I need help with a contract');
  console.log(`Role: ${legalResponse.role}`);
  console.log(`Response: ${legalResponse.message}`);
  console.log();

  // Process a plumbing question
  console.log('4. Plumbing Help:');
  const plumbingResponse = await max.processMessage('user1', 'My sink is leaking');
  console.log(`Role: ${plumbingResponse.role}`);
  console.log(`Response: ${plumbingResponse.message}`);
  console.log();

  // Check conversation history
  console.log('5. Conversation History:');
  const history = max.getConversationHistory('user1');
  console.log(`Total messages: ${history.length}`);
  console.log();

  // Check personality
  console.log('6. MAX Personality:');
  const personality = max.getPersonality();
  console.log(JSON.stringify(personality, null, 2));
}

// Run the example
basicExample().catch(console.error);
