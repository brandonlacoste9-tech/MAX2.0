import { MAX, Language } from '../src';

/**
 * Multi-language example showing all supported languages
 */
async function multiLanguageExample() {
  console.log('=== Multi-Language MAX Example ===\n');

  const max = new MAX();

  // English
  console.log('1. English:');
  const english = await max.processMessage('user-en', 'I need help with my fitness routine');
  console.log(`   Language: ${english.language}`);
  console.log(`   Role: ${english.role}`);
  console.log(`   Response: ${english.message}`);
  console.log();

  // Quebec French
  console.log('2. Quebec French:');
  const french = await max.processMessage('user-fr', "J'ai besoin d'aide avec ma santé");
  console.log(`   Language: ${french.language}`);
  console.log(`   Role: ${french.role}`);
  console.log(`   Response: ${french.message}`);
  console.log();

  // Spanish
  console.log('3. Spanish:');
  const spanish = await max.processMessage('user-es', 'Necesito ayuda con mi dieta');
  console.log(`   Language: ${spanish.language}`);
  console.log(`   Role: ${spanish.role}`);
  console.log(`   Response: ${spanish.message}`);
  console.log();

  // Brazilian Portuguese
  console.log('4. Brazilian Portuguese:');
  const portuguese = await max.processMessage('user-pt', 'Eu preciso de ajuda com exercícios');
  console.log(`   Language: ${portuguese.language}`);
  console.log(`   Role: ${portuguese.role}`);
  console.log(`   Response: ${portuguese.message}`);
  console.log();
}

// Run the example
multiLanguageExample().catch(console.error);
