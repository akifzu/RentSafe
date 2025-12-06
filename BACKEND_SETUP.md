# 🔧 Backend Proxy Setup Guide

## Why Do You Need This?

Claude API blocks direct browser calls due to **CORS (Cross-Origin Resource Sharing)**. The backend proxy:
- ✅ Solves CORS error
- ✅ Keeps API key secure (server-side only)
- ✅ Enables real AI features (not mock data)

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Install Backend Dependencies

```bash
npm install express cors dotenv concurrently
```

### Step 2: Configure API Key

Open `.env` file and replace `your_claude_api_key_here` with your real key:

```bash
# Get your key from: https://console.anthropic.com/
CLAUDE_API_KEY=sk-ant-api03-YOUR-ACTUAL-KEY-HERE
```

### Step 3: Run Backend + Frontend Together

```bash
npm run dev:all
```

This starts:
- ✅ Frontend on `http://localhost:3000`
- ✅ Backend proxy on `http://localhost:3001`

---

## 📋 What Was Added

### Files Created:
- **`server.js`** - Backend proxy server
- **`BACKEND_SETUP.md`** - This guide

### Files Modified:
- **`package.json`** - Added backend dependencies & scripts
- **`.env`** - Added proxy configuration
- **`src/services/claudeAI.ts`** - Updated to use proxy

---

## 🎯 How It Works

```
┌─────────┐          ┌─────────┐          ┌─────────┐
│ Browser │  CORS OK │ Node.js │  CORS OK │ Claude  │
│ (React) │ ───────> │ Proxy   │ ───────> │   API   │
└─────────┘          └─────────┘          └─────────┘
   :3000                :3001            api.anthropic.com
```

**Before:** Browser → ❌ Claude API (CORS blocked)
**After:** Browser → ✅ Your Server → ✅ Claude API

---

## 🛠️ Commands Reference

| Command | What It Does |
|---------|--------------|
| `npm run dev` | Start frontend only (port 3000) |
| `npm run server` | Start backend only (port 3001) |
| `npm run dev:all` | Start both together ✨ |

---

## 🧪 Test Backend is Working

### Test 1: Health Check
```bash
curl http://localhost:3001/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "SewaSecure API Proxy is running",
  "claudeConfigured": true
}
```

### Test 2: Upload Photo
1. Open `http://localhost:3000`
2. Go to Move-In Report
3. Upload a photo
4. ✅ Should see AI analysis (not mock data!)

---

## ⚙️ Configuration Options

### `.env` Settings:

```bash
# Use proxy or direct API?
VITE_USE_PROXY=true    # Use proxy (recommended)
# VITE_USE_PROXY=false # Direct API (will fail due to CORS)

# Proxy URL (change if using different port)
VITE_PROXY_URL=http://localhost:3001/api/claude

# Backend port
PORT=3001
```

---

## 🚨 Troubleshooting

### "Cannot find module 'express'"
```bash
npm install express cors dotenv concurrently
```

### Backend says "Claude API key not configured"
- Open `.env`
- Make sure `CLAUDE_API_KEY=sk-ant-...` (no VITE_ prefix)
- Restart backend: `npm run server`

### Frontend still shows "AI analysis failed"
- Check backend is running (see output in terminal)
- Open browser console (F12)
- Look for error messages
- Verify `.env` has `VITE_USE_PROXY=true`
- Restart frontend: `npm run dev`

### "Port 3001 already in use"
- Stop other server: `Ctrl+C`
- Or change port in `.env`: `PORT=3002`
- Update proxy URL: `VITE_PROXY_URL=http://localhost:3002/api/claude`

---

## 📊 Verify Configuration

Run diagnostic in browser:
1. Open app
2. Look for "🔧 AI Diagnostic Tool" (bottom-right)
3. Click "Run Diagnostic"
4. Should show:
   - ✅ Environment Variable: Set
   - ✅ API Call Test: Success

---

## 🎉 Success Indicators

When everything is working:

```
Terminal 1 (Backend):
╔═══════════════════════════════════════════╗
║  SewaSecure Backend Proxy Server          ║
║  Status: RUNNING ✓                        ║
║  Port: 3001                               ║
║  Claude API: ✓ Configured                 ║
╚═══════════════════════════════════════════╝

Terminal 2 (Frontend):
VITE v6.4.1  ready in 947 ms
➜  Local:   http://localhost:3000/

Browser Console:
🔧 AI Service Config:
  - Use Proxy: YES ✓
  - Endpoint: http://localhost:3001/api/claude
  - API Key: Set ✓
```

---

## 🚀 Production Deployment

### Option 1: Same Server (Recommended for Small Apps)
Deploy both frontend + backend together:
```bash
npm run build        # Build frontend
node server.js       # Run backend (serves frontend too if configured)
```

### Option 2: Separate Deployment
- **Frontend:** Vercel/Netlify (static)
- **Backend:** Railway/Render/Heroku (Node.js)
- Update `.env`: `VITE_PROXY_URL=https://your-backend.com/api/claude`

### Option 3: Serverless (Vercel/Netlify Functions)
Instead of `server.js`, create serverless function:

**`api/claude.js`** (Vercel):
```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(req.body),
  });
  
  const data = await response.json();
  res.json(data);
}
```

---

## 📈 Performance Tips

1. **Enable Caching:** Cache common AI responses
2. **Rate Limiting:** Prevent abuse
3. **Image Compression:** Compress photos before sending
4. **Error Logging:** Track API failures

---

## 🔒 Security Checklist

- [ ] API key in `.env` (not committed to git)
- [ ] `.gitignore` includes `.env`
- [ ] Backend validates requests
- [ ] CORS configured for your domain only (production)
- [ ] Rate limiting enabled (production)

---

## 📞 Need Help?

### Common Issues:
1. **CORS still blocked** → Verify `VITE_USE_PROXY=true`
2. **401 Unauthorized** → Check API key is correct
3. **Connection refused** → Backend not running
4. **Mock data still showing** → Restart both servers

### Check Logs:
- **Backend logs:** Terminal running `npm run server`
- **Frontend logs:** Browser console (F12)
- **Network logs:** F12 → Network tab

---

**🎊 Once setup is complete, all AI features will use real Claude API!**

Test with: Upload a photo → See real AI damage analysis in ~5 seconds!

