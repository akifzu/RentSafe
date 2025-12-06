# Gemini AI Setup Guide

## Quick Start

### Step 1: Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key" or "Get API Key"
4. Copy your API key (it will look like: `AIzaSy...`)

### Step 2: Set Up Backend Server

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `server` directory:
```env
GEMINI_API_KEY=your_actual_api_key_here
PORT=3001
```

Replace `your_actual_api_key_here` with the API key you copied.

4. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

### Step 3: Configure Frontend

1. Create a `.env` file in the root directory (same level as `package.json`):
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

2. Start the frontend (in a new terminal):
```bash
npm run dev
```

### Step 4: Test

1. Open your browser to `http://localhost:3000`
2. Navigate to the Dashboard
3. Try asking a question in the AI Assistant box
4. You should get a real response from Gemini!

## File Structure

```
RentSafe/
├── server/              # Backend server
│   ├── server.js        # Main server file
│   ├── package.json     # Backend dependencies
│   ├── .env            # Backend environment variables (create this)
│   └── README.md       # Server documentation
├── src/                 # Frontend React app
│   └── services/
│       └── api.ts      # API client
├── .env                # Frontend environment variables (create this)
└── package.json        # Frontend dependencies
```

## Troubleshooting

### Backend Issues

- **"GEMINI_API_KEY not configured"**: 
  - Make sure you created `.env` file in the `server` directory
  - Check that the API key is correct (no extra spaces)

- **Port already in use**:
  - Change `PORT=3001` to a different port in `server/.env`
  - Update `VITE_API_BASE_URL` in root `.env` to match

- **Module not found errors**:
  - Run `npm install` in the `server` directory

### Frontend Issues

- **API connection failed**:
  - Make sure the backend server is running
  - Check that `VITE_API_BASE_URL` in root `.env` matches your backend URL
  - Restart the frontend dev server after creating/updating `.env`

- **CORS errors**:
  - The backend has CORS enabled by default
  - If you still see errors, check browser console for details

### Gemini API Issues

- **API key invalid**:
  - Verify your API key at [Google AI Studio](https://makersuite.google.com/app/apikey)
  - Make sure you copied the entire key

- **Rate limits**:
  - Free tier has rate limits
  - If you hit limits, wait a few minutes and try again

## Running Both Servers

You need to run both servers simultaneously:

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## Production Deployment

For production, you'll need to:
1. Set up environment variables on your hosting platform
2. Build the frontend: `npm run build`
3. Deploy the backend server
4. Update `VITE_API_BASE_URL` to your production API URL


