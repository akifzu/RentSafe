// =======================================================================
// SEWASECURE BACKEND PROXY SERVER
// Handles Claude API calls to avoid CORS issues
// =======================================================================

const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Support both Vite ports
  credentials: true
}));
app.use(express.json({ limit: '50mb' })); // Support large base64 images

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'SewaSecure AI Backend is running',
    hasApiKey: !!process.env.ANTHROPIC_API_KEY
  });
});

// Claude API proxy endpoint
app.post('/api/claude', async (req, res) => {
  try {
    const { model, max_tokens, system, messages } = req.body;

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ 
        error: 'API key not configured',
        message: 'Please set ANTHROPIC_API_KEY in .env file'
      });
    }

    console.log('📤 Sending request to Claude API...');
    console.log('Model:', model);
    console.log('Messages:', messages.length);

    const response = await anthropic.messages.create({
      model: model || 'claude-3-haiku-20240307',
      max_tokens: max_tokens || 2000,
      system: system || '',
      messages: messages
    });

    console.log('✅ Received response from Claude API');
    res.json(response);

  } catch (error) {
    console.error('❌ Claude API Error:', error);
    res.status(500).json({ 
      error: error.message,
      type: error.type || 'unknown_error'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║          🚀 SewaSecure AI Backend Server                ║
║                                                          ║
║          Server running on: http://localhost:${PORT}     ║
║          API Endpoint: /api/claude                       ║
║          Health Check: /api/health                       ║
║                                                          ║
║          Status: ${process.env.ANTHROPIC_API_KEY ? '✅ API Key Configured' : '⚠️  API Key Missing'}      ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
  `);
});

origin: [
    'http://localhost:5173',
    'https://your-app.vercel.app' // Add this
  ]
