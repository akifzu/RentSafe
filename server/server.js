import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// System prompt for rental property management context
const SYSTEM_PROMPT = `You are a helpful AI assistant for a rental property management platform called SewaSecure. 
Your role is to assist users with questions about:
- Rental processes and procedures
- Utilities tracking (water, electricity, rent payments)
- Move-in reports and property condition documentation
- Lease agreements and tenant rights
- Property management best practices
- General rental-related questions

Provide clear, helpful, and professional responses. If asked about legal matters, always recommend consulting with a professional.
Keep responses concise but informative.`;

/**
 * Convert file buffer to base64 for Gemini API
 */
function fileToBase64(file) {
  return file.buffer.toString('base64');
}

/**
 * Process files and prepare them for Gemini API
 */
async function processFiles(files) {
  if (!files || files.length === 0) return [];

  const processedFiles = [];
  for (const file of files) {
    // Gemini supports images (PNG, JPEG, WebP, GIF) and PDFs
    const mimeType = file.mimetype;
    const base64Data = fileToBase64(file);

    processedFiles.push({
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    });
  }
  return processedFiles;
}

/**
 * Generate AI response using Gemini
 */
async function generateResponse(message, files = [], context = '') {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Build the prompt
    let prompt = SYSTEM_PROMPT;
    if (context) {
      prompt += `\n\nContext: ${context}`;
    }
    prompt += `\n\nUser Question: ${message}`;

    // If there are files, use gemini-pro-vision or handle accordingly
    if (files.length > 0) {
      // For files, we'll use gemini-pro-vision for images
      // For other file types, we'll include them in the prompt
      const visionModel = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
      
      // Separate image files from other files
      const imageFiles = files.filter(f => f.mimeType.startsWith('image/'));
      const otherFiles = files.filter(f => !f.mimeType.startsWith('image/'));

      if (imageFiles.length > 0) {
        // Use vision model for images
        const parts = [
          { text: prompt },
          ...imageFiles,
        ];
        
        const result = await visionModel.generateContent(parts);
        const response = await result.response;
        return response.text();
      } else {
        // For non-image files, mention them in the prompt
        prompt += `\n\nUser has attached ${files.length} file(s). Please acknowledge this in your response.`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      }
    } else {
      // No files, just text
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error(`AI service error: ${error.message}`);
  }
}

/**
 * POST /api/ai/chat - Main AI chat endpoint
 */
app.post('/api/ai/chat', upload.array('files'), async (req, res) => {
  try {
    const { message, context } = req.body;
    const files = req.files || [];

    // Validate input
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'Gemini API key not configured. Please set GEMINI_API_KEY in your .env file.' 
      });
    }

    // Process files if any
    const processedFiles = await processFiles(files);

    // Generate AI response
    const aiResponse = await generateResponse(message.trim(), processedFiles, context);

    // Return response
    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error processing AI request:', error);
    res.status(500).json({ 
      error: error.message || 'An error occurred while processing your request' 
    });
  }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'RentSafe API Server',
    geminiConfigured: !!process.env.GEMINI_API_KEY 
  });
});

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`🚀 RentSafe API Server running on http://localhost:${PORT}`);
  console.log(`📡 AI Chat endpoint: http://localhost:${PORT}/api/ai/chat`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
  
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  WARNING: GEMINI_API_KEY not set in .env file');
  } else {
    console.log('✅ Gemini API key configured');
  }
});


