import { MAX } from '../src';

/**
 * Memory system example showing how MAX remembers everything
 */
async function memoryExample() {
  console.log('=== Memory System Example ===\n');

  const max = new MAX();
  const userId = 'memory-test-user';

  // First conversation
  console.log('First Conversation:');
  await max.processMessage(userId, 'I need help with my diet');
  console.log('✓ User asked about diet\n');

  // Second conversation - MAX remembers
  console.log('Second Conversation:');
  const context = max.getUserContext(userId);
  console.log(`Preferred Role: ${context.preferredRole}`);
  console.log(`Language: ${context.language}`);
  console.log(`Conversation History Length: ${context.conversationHistory.length}\n`);

  // Third conversation - different topic
  console.log('Third Conversation:');
  await max.processMessage(userId, 'Now I need legal advice');
  console.log('✓ User switched to legal topic\n');

  // Check full history
  console.log('Full Conversation History:');
  const history = max.getConversationHistory(userId);
  history.forEach((msg, index) => {
    console.log(`${index + 1}. [${msg.role}]: ${msg.content.substring(0, 50)}...`);
  });
  console.log();

  // Store custom metadata
  console.log('Custom Metadata:');
  const memory = (max as any).memory;
  memory.setMetadata(userId, 'theme', 'dark');
  memory.setMetadata(userId, 'notifications', true);
  console.log(`Theme: ${memory.getMetadata(userId, 'theme')}`);
  console.log(`Notifications: ${memory.getMetadata(userId, 'notifications')}`);
  console.log();

  // Privacy - clear user data
  console.log('Clear User Data (GDPR compliance):');
  max.clearUserData(userId);
  const clearedHistory = max.getConversationHistory(userId);
  console.log(`History after clearing: ${clearedHistory.length} messages`);
  console.log();
}

// Run the example
memoryExample().catch(console.error);
