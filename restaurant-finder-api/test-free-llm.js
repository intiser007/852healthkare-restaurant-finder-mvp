// Test script for free LLM API
const FREE_LLM_API_URL = 'https://mlvoca.com/api/generate';
const FREE_LLM_MODEL = 'deepseek-r1:1.5b';

async function testFreeLLMAPI() {
  console.log('Testing free LLM API...');
  console.log('URL:', FREE_LLM_API_URL);
  console.log('Model:', FREE_LLM_MODEL);
  
  try {
    const requestBody = {
      model: FREE_LLM_MODEL,
      prompt: "Hello, can you respond with just 'API working'?",
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.8,
        top_k: 40
      }
    };
    
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(FREE_LLM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HTTP Error Response:', errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Full API response:', JSON.stringify(data, null, 2));
    
    if (data.response) {
      console.log('✅ API is working! Response:', data.response);
    } else {
      console.log('❌ No response field in API response');
    }
    
  } catch (error) {
    console.error('❌ Error testing free LLM API:');
    console.error('- Error message:', error.message);
    console.error('- Error stack:', error.stack);
    console.error('- Error name:', error.name);
    console.error('- Error cause:', error.cause);
  }
}

testFreeLLMAPI();
