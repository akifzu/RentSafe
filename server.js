// ==============================================================================
// SEWASECURE BACKEND PROXY SERVER
// Solves CORS issue by proxying Claude API calls through backend
// ==============================================================================

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Anthropic = require('@anthropic-ai/sdk');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Anthropic client with SDK
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY,
});

// Middleware
app.use(cors()); // Allow requests from frontend
app.use(express.json({ limit: '50mb' })); // Parse JSON, allow large images

// Health check endpoint
app.get('/api/health', (req, res) => {
  const apiKey = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;
  res.json({
    status: 'ok',
    message: 'SewaSecure API Proxy is running',
    claudeConfigured: !!apiKey,
    usingSDK: true
  });
});

// Claude API proxy endpoint
app.post('/api/claude', async (req, res) => {
  try {
    // Check if API key is configured
    const apiKey = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'Claude API key not configured on server',
        message: 'Set CLAUDE_API_KEY or ANTHROPIC_API_KEY in .env file'
      });
    }

    // Use Anthropic SDK instead of raw fetch
    // This handles authentication and formatting correctly
    const message = await anthropic.messages.create({
      model: req.body.model || 'claude-3-haiku-20240307',
      max_tokens: req.body.max_tokens || 1024,
      system: req.body.system,
      messages: req.body.messages,
    });

    // Return the response in the same format as the API
    res.json(message);

  } catch (error) {
    console.error('Proxy error:', error);
    
    // Handle Anthropic SDK errors properly
    if (error.status) {
      return res.status(error.status).json({
        error: 'Claude API error',
        details: {
          type: error.type,
          message: error.message
        }
      });
    }
    
    res.status(500).json({
      error: 'Proxy server error',
      message: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  const apiKey = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║  SewaSecure Backend Proxy Server                          ║
╠═══════════════════════════════════════════════════════════╣
║  Status: RUNNING ✓                                        ║
║  Port: ${PORT}                                               ║
║  Claude API: ${apiKey ? '✓ Configured' : '✗ Not Configured'}                              ║
║  Using: Official Anthropic SDK                            ║
╚═══════════════════════════════════════════════════════════╝

API Endpoints:
  - GET  http://localhost:${PORT}/api/health
  - POST http://localhost:${PORT}/api/claude

Frontend should use: http://localhost:${PORT}/api/claude
  `);
});

