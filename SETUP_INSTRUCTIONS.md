# Complete Gemini AI Setup Instructions

## ✅ What's Been Set Up

I've created a complete backend server with Gemini AI integration. Here's what you need to do:

## Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key" or "Get API Key"
4. Copy your API key (starts with `AIzaSy...`)

## Step 2: Install Backend Dependencies

Open a terminal/command prompt and run:

```bash
cd server
npm install
```

**If you get PowerShell execution policy errors**, try:
- Open Command Prompt (cmd) instead of PowerShell
- Or run PowerShell as Administrator and execute: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

## Step 3: Create Backend Environment File

Create a file named `.env` in the `server` directory with:

```env
GEMINI_API_KEY=your_actual_api_key_here
PORT=3001
```

Replace `your_actual_api_key_here` with the API key you got from Step 1.

## Step 4: Create Frontend Environment File

Create a file named `.env` in the root directory (same level as `package.json`) with:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

## Step 5: Start the Backend Server

In the `server` directory, run:

```bash
npm run dev
```

You should see:
```
🚀 RentSafe API Server running on http://localhost:3001
✅ Gemini API key configured
```

## Step 6: Start the Frontend

Open a NEW terminal, go to the root directory, and run:

```bash
npm run dev
```

## Step 7: Test It!

1. Open your browser to `http://localhost:3000`
2. Sign in to the app
3. On the Dashboard, find the "AI Assistant" box
4. Type a question like: "How do I track utilities?"
5. Click Send
6. You should get a real response from Gemini AI! 🎉

## File Structure Created

```
RentSafe/
├── server/
│   ├── server.js          ✅ Backend server with Gemini
│   ├── package.json       ✅ Backend dependencies
│   ├── .env              ⚠️  CREATE THIS (see Step 3)
│   ├── .gitignore        ✅ Git ignore file
│   └── README.md         ✅ Server docs
├── src/
│   └── services/
│       └── api.ts        ✅ Already configured
├── .env                  ⚠️  CREATE THIS (see Step 4)
├── GEMINI_SETUP.md       ✅ Detailed setup guide
└── SETUP_INSTRUCTIONS.md ✅ This file
```

## Troubleshooting

### Backend won't start
- Make sure you ran `npm install` in the `server` directory
- Check that `.env` file exists in `server/` with your API key
- Verify the API key is correct (no extra spaces)

### Frontend can't connect
- Make sure backend is running on port 3001
- Check that `.env` in root has `VITE_API_BASE_URL=http://localhost:3001/api`
- Restart frontend after creating/updating `.env`

### "Gemini API key not configured"
- Make sure `.env` file is in the `server` directory (not root)
- Check the API key is correct
- Restart the backend server after creating `.env`

## Quick Commands Reference

**Start Backend:**
```bash
cd server
npm run dev
```

**Start Frontend:**
```bash
npm run dev
```

**Check Backend Health:**
Visit: http://localhost:3001/api/health

## Need Help?

- Check `GEMINI_SETUP.md` for detailed troubleshooting
- Check `server/README.md` for backend API documentation
- Check browser console (F12) for frontend errors
- Check backend terminal for server errors


