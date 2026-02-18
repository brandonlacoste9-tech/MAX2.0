import { MAX, Role } from '../src';

/**
 * Role adaptation example showing all available roles
 */
async function roleAdaptationExample() {
  console.log('=== Role Adaptation Example ===\n');

  const max = new MAX();
  const userId = 'demo-user';

  const scenarios = [
    { query: 'I need legal advice about a contract', expectedRole: Role.LAWYER },
    { query: 'My toilet is clogged, what should I do?', expectedRole: Role.PLUMBER },
    { query: 'I feel stressed and anxious lately', expectedRole: Role.THERAPIST },
    { query: 'What diet should I follow to lose weight?', expectedRole: Role.DIET_FITNESS },
    { query: 'I need help setting career goals', expectedRole: Role.LIFE_COACH },
    { query: 'How can I improve my marketing campaign?', expectedRole: Role.ADVERTISER }
  ];

  for (const scenario of scenarios) {
    console.log(`Query: "${scenario.query}"`);
    const response = await max.processMessage(userId, scenario.query);
    console.log(`Detected Role: ${response.role}`);
    console.log(`Expected Role: ${scenario.expectedRole}`);
    console.log(`Match: ${response.role === scenario.expectedRole ? '✓' : '✗'}`);
    console.log(`Response: ${response.message}`);
    console.log();
  }
}

// Run the example
roleAdaptationExample().catch(console.error);
