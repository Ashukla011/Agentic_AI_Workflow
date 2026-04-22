import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

async function testConnection() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ Error: GEMINI_API_KEY is missing from .env file.');
    return;
  }

  console.log('🔗 Connecting to Google Generative AI...');
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Test with gemini-1.5-flash
  const modelId = 'gemini-1.5-flash';
  console.log(`🧪 Testing model: ${modelId}...`);
  
  try {
    const model = genAI.getGenerativeModel({ model: modelId });
    const result = await model.generateContent('Hello! This is a test from the Agentic Workflow platform. Please respond with "Connection Successful".');
    const response = await result.response;
    const text = response.text();
    
    console.log('\n✅ API Response:', text);
    console.log('\n✨ Gemini API is working correctly with the new model configuration!');
  } catch (error) {
    console.error('\n❌ API Error details:');
    console.error('Message:', error.message);
    if (error.status) console.error('Status:', error.status);
    
    console.log('\n💡 Troubleshooting Tip:');
    console.log('1. Ensure your API key is valid at https://aistudio.google.com/');
    console.log('2. Check if the model "gemini-1.5-flash" is available in your region.');
  }
}

testConnection();
