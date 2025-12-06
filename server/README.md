# RentSafe API Server

Backend API server for RentSafe with Google Gemini AI integration.

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 3. Configure Environment Variables

Create a `.env` file in the `server` directory:

```env
GEMINI_API_KEY=your_actual_api_key_here
PORT=3001
```

### 4. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### POST /api/ai/chat

Main endpoint for AI chat functionality.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body:
  - `message` (string, required): User's question
  - `files` (File[], optional): Attached files
  - `context` (string, optional): Additional context

**Response:**
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

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "RentSafe API Server",
  "geminiConfigured": true
}
```

## Features

- ✅ Google Gemini AI integration
- ✅ File upload support (images, PDFs)
- ✅ CORS enabled for frontend
- ✅ Error handling
- ✅ Health check endpoint

## Troubleshooting

- **"Gemini API key not configured"**: Make sure you've created a `.env` file with your `GEMINI_API_KEY`
- **CORS errors**: The server has CORS enabled by default. If you still see errors, check your frontend URL
- **File upload issues**: Maximum file size is 10MB. Supported formats: images (PNG, JPEG, WebP, GIF) and PDFs


