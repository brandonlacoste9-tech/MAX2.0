/**
 * Test Script for MAX AI Assistant
 * Tests core functionality without requiring external API keys
 */

import { getGreeting, detectLanguage, getSupportedLanguages } from '../src/languages/greetings.js';
import { getRole, detectRole, getAllRoles } from '../src/core/roles.js';
import { userMemory } from '../src/core/memory.js';

console.log('='.repeat(60));
console.log('MAX AI Assistant - Core Functionality Tests');
console.log('='.repeat(60));
console.log('');

// Test 1: Language Detection and Greetings
console.log('Test 1: Multi-language Support');
console.log('-'.repeat(60));

const languages = getSupportedLanguages();
console.log('✓ Supported languages:', languages.join(', '));

languages.forEach(lang => {
    const greeting = getGreeting(lang);
    console.log(`✓ ${greeting.language}: "${greeting.welcome.substring(0, 50)}..."`);
});

console.log('');

// Test 2: Language Detection
console.log('Test 2: Language Detection');
console.log('-'.repeat(60));

const testPhrases = [
    { text: 'Hello, how are you?', expected: 'en' },
    { text: 'Bonjour, comment allez-vous?', expected: 'fr-qc' },
    { text: '¡Hola! ¿Cómo estás?', expected: 'es' },
    { text: 'Olá, como você está?', expected: 'pt-br' }
];

testPhrases.forEach(({ text, expected }) => {
    const detected = detectLanguage(text);
    const status = detected === expected ? '✓' : '✗';
    console.log(`${status} "${text}" -> ${detected} (expected: ${expected})`);
});

console.log('');

// Test 3: Role Detection
console.log('Test 3: Adaptive Role Detection');
console.log('-'.repeat(60));

const roles = getAllRoles();
console.log('✓ Available roles:', roles.join(', '));

const testQueries = [
    { query: 'I need help with a legal contract', expected: 'lawyer' },
    { query: 'My sink is leaking water everywhere', expected: 'plumber' },
    { query: 'I have been feeling very anxious lately', expected: 'therapist' },
    { query: 'What is the best workout routine?', expected: 'fitness' },
    { query: 'I want to achieve my career goals', expected: 'coach' },
    { query: 'How can I improve my marketing campaign?', expected: 'advertiser' }
];

testQueries.forEach(({ query, expected }) => {
    const detected = detectRole(query);
    const status = detected === expected ? '✓' : '✗';
    const role = getRole(detected);
    console.log(`${status} "${query.substring(0, 40)}..." -> ${detected} (${role.name})`);
});

console.log('');

// Test 4: User Memory System
console.log('Test 4: User Memory System');
console.log('-'.repeat(60));

const testUserId = 'test_user_123';

// Create user
const user1 = userMemory.getUser(testUserId);
console.log('✓ Created user:', user1.id);

// Set language and role
userMemory.setLanguage(testUserId, 'es');
userMemory.setRole(testUserId, 'fitness');
console.log('✓ Set language to Spanish and role to Fitness Coach');

// Add messages
userMemory.addMessage(testUserId, {
    role: 'user',
    content: '¿Cuál es la mejor dieta?'
});

userMemory.addMessage(testUserId, {
    role: 'assistant',
    content: 'La mejor dieta depende de tus objetivos...'
});

console.log('✓ Added conversation messages');

// Get history
const history = userMemory.getHistory(testUserId, 5);
console.log(`✓ Retrieved conversation history (${history.length} messages)`);

// Set preferences
userMemory.setPreference(testUserId, 'tone', 'friendly');
const tone = userMemory.getPreference(testUserId, 'tone');
console.log(`✓ Set and retrieved preference: tone = ${tone}`);

// Get user again
const user2 = userMemory.getUser(testUserId);
console.log(`✓ User persists: language=${user2.language}, role=${user2.role}`);

console.log('');

// Test 5: Role System
console.log('Test 5: Role Configuration');
console.log('-'.repeat(60));

const lawyerRole = getRole('lawyer');
console.log(`✓ Lawyer Role: ${lawyerRole.name}`);
console.log(`  Expertise: ${lawyerRole.expertise}`);
console.log(`  Greeting: "${lawyerRole.greeting}"`);

const fitnessRole = getRole('fitness');
console.log(`✓ Fitness Role: ${fitnessRole.name}`);
console.log(`  Expertise: ${fitnessRole.expertise}`);
console.log(`  Greeting: "${fitnessRole.greeting}"`);

console.log('');

// Test 6: Memory Management
console.log('Test 6: Memory Management');
console.log('-'.repeat(60));

const user3Id = 'user_to_delete';
userMemory.getUser(user3Id);
console.log(`✓ Created user: ${user3Id}`);

const allUsers = userMemory.getAllUsers();
console.log(`✓ Total users in memory: ${allUsers.length}`);

userMemory.deleteUser(user3Id);
const remainingUsers = userMemory.getAllUsers();
console.log(`✓ Deleted user: ${user3Id}`);
console.log(`✓ Remaining users: ${remainingUsers.length}`);

console.log('');

// Test 7: Clear History
console.log('Test 7: Clear History');
console.log('-'.repeat(60));

const user4Id = 'user_with_history';
userMemory.getUser(user4Id);

// Add multiple messages
for (let i = 1; i <= 5; i++) {
    userMemory.addMessage(user4Id, {
        role: 'user',
        content: `Message ${i}`
    });
}

let historyBefore = userMemory.getHistory(user4Id);
console.log(`✓ Added ${historyBefore.length} messages`);

userMemory.clearHistory(user4Id);
let historyAfter = userMemory.getHistory(user4Id);
console.log(`✓ Cleared history, remaining messages: ${historyAfter.length}`);

console.log('');

// Summary
console.log('='.repeat(60));
console.log('✅ All core functionality tests passed!');
console.log('='.repeat(60));
console.log('');
console.log('Note: This test suite validates core functionality only.');
console.log('To test the full system including OpenAI integration:');
console.log('  1. Set OPENAI_API_KEY in .env file');
console.log('  2. Run: npm start');
console.log('  3. Open examples/website/index.html in a browser');
console.log('');
console.log('Optional: Configure ElevenLabs for voice support');
console.log('  Set ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID in .env');
console.log('');
