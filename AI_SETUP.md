# AI Assistant Setup Guide

## Overview
The AI Assistant is now configured to make real API calls. By default, it will use a fallback response if the API is unavailable.

## Setup Steps

### 1. Create Environment File
Create a `.env` file in the root directory of your project:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

Replace `http://localhost:3001/api` with your actual API endpoint.

### 2. Backend API Requirements

Your backend API should accept POST requests at `/api/ai/chat` with the following:

**Request Format (FormData):**
- `message` (string) - The user's question
- `files` (File[]) - Optional array of attached files
- `context` (string) - Optional context string

**Response Format (JSON):**
```json
{
  "response": "AI response text here"
}
```

**Error Response:**
```json
{
  "error": "Error message here"
}
```

### 3. Example Backend Implementation

#### Node.js/Express Example:
```javascript
const express = require('express');
const multer = require('multer');
const upload = multer();

const app = express();

app.post('/api/ai/chat', upload.array('files'), async (req, res) => {
  try {
    const { message, context } = req.body;
    const files = req.files || [];
    
    // Process files if needed
    // files.forEach(file => { ... });
    
    // Call your AI service (OpenAI, Anthropic, etc.)
    const aiResponse = await callYourAIService(message, context, files);
    
    res.json({ response: aiResponse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 4. Using OpenAI API

If you want to use OpenAI, here's an example:

```javascript
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/ai/chat', upload.array('files'), async (req, res) => {
  try {
    const { message, context } = req.body;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant for rental property management. ${context || ''}`
        },
        {
          role: "user",
          content: message
        }
      ],
    });
    
    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 5. Testing

1. Start your backend server
2. Make sure `.env` file has the correct API URL
3. Restart your Vite dev server: `npm run dev`
4. Try asking a question in the AI Assistant on the Dashboard

### 6. Fallback Behavior

If the API is unavailable or returns an error, the AI Assistant will:
- Show a fallback response indicating the API is unavailable
- Still allow users to interact with the UI
- Log errors to the browser console for debugging

## Troubleshooting

- **API not connecting**: Check that your backend server is running and the URL in `.env` is correct
- **CORS errors**: Make sure your backend allows requests from your frontend origin
- **File upload issues**: Verify your backend can handle multipart/form-data
- **Check browser console**: Look for error messages in the browser's developer console

## Alternative: Use JSON Instead of FormData

If your backend prefers JSON, you can modify `Dashboard.tsx` to use `callAIServiceJSON` instead:

```typescript
import { callAIServiceJSON } from '../services/api';
// Then use: callAIServiceJSON({ ... })
```

This will send files as base64-encoded strings in the JSON payload.

