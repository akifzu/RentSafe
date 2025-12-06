# 🔧 AI Analysis Failed - Troubleshooting Guide

## ✅ What's Working

- ✅ Backend proxy running on port 3001
- ✅ Frontend running on port 3000  
- ✅ Real Claude API key is set
- ✅ Proxy configuration enabled (`VITE_USE_PROXY=true`)

## 🔍 Quick Test

### Step 1: Test Backend Directly

Open this URL in your browser:
```
http://localhost:3000/test-ai.html
```

Click the two buttons and see what happens:
1. **"Test Backend Health"** - Should show: `{"status":"ok","claudeConfigured":true}`
2. **"Test AI Call"** - Will show either success or the exact error

### Step 2: Check Browser Console

1. Open your app: `http://localhost:3000`
2. Press **F12** (Developer Tools)
3. Click **Console** tab
4. Look for this message:

```
🔧 AI Service Config:
  - Use Proxy: YES ✓  or  NO ✗
  - Endpoint: http://localhost:3001/api/claude
  - API Key: Set ✓
```

**If it says "Use Proxy: NO"** → Frontend didn't pick up the .env change!

### Step 3: Restart Frontend (If Needed)

If proxy shows as "NO", restart the frontend:

1. Go to terminal running `npm run dev`
2. Press `Ctrl+C`
3. Run `npm run dev` again
4. Refresh browser

---

## 🎯 Most Likely Issues

### Issue 1: Frontend Not Using Proxy

**Symptom:** Browser console shows `Use Proxy: NO`

**Fix:**
1. Stop frontend (`Ctrl+C` in terminal)
2. Verify `.env` has `VITE_USE_PROXY=true`
3. Restart: `npm run dev`
4. Hard refresh browser: `Ctrl+Shift+R`

### Issue 2: API Key Invalid

**Symptom:** Backend returns 401 error

**Fix:**
1. Go to https://console.anthropic.com/
2. Check your API key is valid
3. Verify you have credits
4. Replace key in `.env` if needed
5. Restart backend: `Ctrl+C` then `npm run server`

### Issue 3: Backend Not Receiving Requests

**Symptom:** Network tab shows no request to port 3001

**Fix:**
1. Check backend terminal - is it still running?
2. Test: `curl http://localhost:3001/api/health`
3. If not running, restart: `npm run server`

### Issue 4: CORS Still Blocking

**Symptom:** Error mentions "CORS" or "Access-Control-Allow-Origin"

**Fix:** This shouldn't happen with proxy, but if it does:
1. Verify backend has `cors` package installed
2. Check `server.js` has `app.use(cors())`
3. Restart backend

---

## 📊 Check Current Status

Run these commands in PowerShell:

```powershell
# Check if backend is running
curl http://localhost:3001/api/health

# Check .env configuration
Get-Content .env | Select-String 'VITE_USE_PROXY'
Get-Content .env | Select-String 'CLAUDE_API_KEY' | Select-Object -First 1

# Check if processes are running
Get-Process -Name node -ErrorAction SilentlyContinue
```

---

## 🚀 Nuclear Option: Restart Everything

If nothing works, do a full restart:

```bash
# Stop all terminals (Ctrl+C in each)

# Then run both together:
npm run dev:all
```

This starts both frontend + backend fresh.

---

## 📸 What to Share for Help

If still failing, share:

1. **Browser Console Output** (F12 → Console tab)
   - Look for red errors
   - Copy the "🔧 AI Service Config" message

2. **Network Tab** (F12 → Network tab)
   - Upload a photo
   - Look for failed requests (red)
   - Click on it and copy the error

3. **Backend Terminal Output**
   - Any errors in terminal 4?

---

## ✨ Expected Behavior When Working

### Browser Console Should Show:
```
🔧 AI Service Config:
  - Use Proxy: YES ✓
  - Endpoint: http://localhost:3001/api/claude
  - API Key: Set ✓
```

### When You Upload Photo:
1. Shows "AI Analyzing Photo..." (2-3 seconds)
2. Purple card appears with analysis
3. Network tab shows: POST to `http://localhost:3001/api/claude` with status 200

### Backend Terminal Shows:
```
╔═══════════════════════════════════════════╗
║  SewaSecure Backend Proxy Server          ║
║  Status: RUNNING ✓                        ║
║  Port: 3001                               ║
║  Claude API: ✓ Configured                 ║
╚═══════════════════════════════════════════╝
```

---

**Start with the test page: `http://localhost:3000/test-ai.html`**

This will show you exactly what's failing!

