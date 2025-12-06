// Quick test script to verify backend API call
const fetch = require('node-fetch');

async function testBackend() {
  console.log('🧪 Testing backend Claude API call...\n');

  try {
    const response = await fetch('http://localhost:3001/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 50,
        messages: [{
          role: 'user',
          content: 'Say hello in one word'
        }]
      })
    });

    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    const data = await response.json();
    console.log('\nResponse:');
    console.log(JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ SUCCESS! Backend can call Claude API!');
    } else {
      console.log('\n❌ FAILED! Error from backend:');
    }
  } catch (error) {
    console.log('\n❌ ERROR:', error.message);
  }
}

testBackend();

