/**
 * Node.js API Examples for MAX AI Assistant
 * 
 * These examples demonstrate how to interact with MAX programmatically
 */

// Example 1: Basic Chat Interaction
async function basicChatExample() {
    const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId: 'user123',
            message: 'Hello, I need help with my leaking faucet'
        })
    });

    const data = await response.json();
    console.log('MAX Response:', data.message);
    console.log('Detected Role:', data.role); // Should be 'plumber'
    console.log('Language:', data.language);
}

// Example 2: Multi-language Interaction
async function multiLanguageExample() {
    // Spanish greeting
    const greeting = await fetch('http://localhost:3000/api/greeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId: 'user456',
            language: 'es'
        })
    });

    const greetingData = await greeting.json();
    console.log('Spanish Greeting:', greetingData.message);

    // Chat in Spanish
    const chat = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId: 'user456',
            message: '¿Puedes ayudarme con mi entrenamiento?',
            language: 'es'
        })
    });

    const chatData = await chat.json();
    console.log('MAX Response (Spanish):', chatData.message);
    console.log('Detected Role:', chatData.role); // Should be 'fitness'
}

// Example 3: Specific Role Interaction
async function specificRoleExample() {
    const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId: 'user789',
            message: 'I want to set better career goals',
            role: 'coach' // Explicitly set to life coach
        })
    });

    const data = await response.json();
    console.log('Life Coach Response:', data.message);
}

// Example 4: Conversation History
async function conversationHistoryExample() {
    const userId = 'user999';

    // Have a conversation
    await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId,
            message: 'I have been feeling stressed lately'
        })
    });

    await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId,
            message: 'What can I do about it?'
        })
    });

    // Get conversation history
    const history = await fetch(`http://localhost:3000/api/history/${userId}?limit=10`);
    const historyData = await history.json();
    
    console.log('Conversation History:');
    historyData.history.forEach((msg, i) => {
        console.log(`${i + 1}. [${msg.role}]: ${msg.content}`);
    });
}

// Example 5: Clear History
async function clearHistoryExample() {
    const userId = 'user888';

    // Clear history
    const response = await fetch(`http://localhost:3000/api/history/${userId}`, {
        method: 'DELETE'
    });

    const data = await response.json();
    console.log('Clear History Result:', data.message);
}

// Example 6: System Information
async function systemInfoExample() {
    const response = await fetch('http://localhost:3000/api/info');
    const data = await response.json();
    
    console.log('MAX System Info:');
    console.log('Name:', data.name);
    console.log('Version:', data.version);
    console.log('Supported Languages:', data.supportedLanguages);
    console.log('Available Roles:', data.availableRoles);
    console.log('Active Channels:', data.activeChannels);
    console.log('Features:', data.features);
}

// Example 7: Text-to-Speech (if ElevenLabs is configured)
async function textToSpeechExample() {
    const response = await fetch('http://localhost:3000/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            text: 'Hello, I am MAX, your friendly AI assistant.',
            voiceOptions: {
                stability: 0.5,
                similarityBoost: 0.75
            }
        })
    });

    if (response.ok) {
        const audioBuffer = await response.arrayBuffer();
        console.log('Audio generated, size:', audioBuffer.byteLength, 'bytes');
        // In Node.js, you could save this to a file
        // const fs = require('fs');
        // fs.writeFileSync('output.mp3', Buffer.from(audioBuffer));
    } else {
        const error = await response.json();
        console.log('TTS Error:', error.error);
    }
}

// Example 8: Quebec French Example
async function quebecFrenchExample() {
    const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId: 'user_qc',
            message: 'Bonjour, comment puis-je améliorer ma forme physique?',
            language: 'fr-qc'
        })
    });

    const data = await response.json();
    console.log('Quebec French Response:', data.message);
}

// Example 9: Brazilian Portuguese Example
async function brazilianPortugueseExample() {
    const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId: 'user_br',
            message: 'Olá, preciso de ajuda com questões legais',
            language: 'pt-br'
        })
    });

    const data = await response.json();
    console.log('Brazilian Portuguese Response:', data.message);
}

// Example 10: Change Language and Role Mid-Conversation
async function changeLanguageAndRoleExample() {
    const userId = 'user_dynamic';

    // Start in English
    await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId,
            message: 'Hello MAX!',
            language: 'en'
        })
    });

    // Change to Spanish
    const langChange = await fetch('http://localhost:3000/api/language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId,
            language: 'es'
        })
    });

    const langData = await langChange.json();
    console.log('Language Changed:', langData.message);

    // Change role to fitness coach
    const roleChange = await fetch('http://localhost:3000/api/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId,
            role: 'fitness'
        })
    });

    const roleData = await roleChange.json();
    console.log('Role Changed:', roleData.message);
}

// Run examples (uncomment to test)
// Note: Make sure the MAX server is running on http://localhost:3000

export {
    basicChatExample,
    multiLanguageExample,
    specificRoleExample,
    conversationHistoryExample,
    clearHistoryExample,
    systemInfoExample,
    textToSpeechExample,
    quebecFrenchExample,
    brazilianPortugueseExample,
    changeLanguageAndRoleExample
};

// For testing in Node.js:
// import fetch from 'node-fetch';
// global.fetch = fetch;
// 
// console.log('Running MAX API Examples...\n');
// 
// systemInfoExample()
//     .then(() => basicChatExample())
//     .then(() => console.log('\nAll examples completed!'))
//     .catch(error => console.error('Error:', error));
