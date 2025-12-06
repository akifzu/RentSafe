# ⚡ DEPLOY IN 5 MINUTES

## 🚀 Step 1: Deploy Backend (2 minutes)

### Railway:
1. **Go to:** https://railway.app
2. **Sign in** with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select: **`akifzu/RentSafe`**
5. Click **"Add variables"**:
   ```
   ANTHROPIC_API_KEY = your-claude-api-key-here
   PORT = 3001
   NODE_ENV = production
   ```
   **(Use your Claude API key from .env file)**
6. Go to **Settings** → **Networking** → **Generate Domain**
7. **COPY THE URL** (e.g., `https://rentsafe-backend.railway.app`)

✅ **Backend deployed!**

---

## 🎨 Step 2: Deploy Frontend (3 minutes)

### Vercel:
1. **Go to:** https://vercel.com
2. **Sign in** with GitHub
3. Click **"Add New Project"** → Import **`akifzu/RentSafe`**
4. **Framework Preset:** Vite ✅ (auto-detected)
5. Click **"Environment Variables"** and add:
   ```
   VITE_SUPABASE_URL = your-supabase-url-here
   VITE_SUPABASE_ANON_KEY = your-supabase-key-here
   VITE_USE_PROXY = true
   VITE_PROXY_URL = https://rentsafe-backend.railway.app/api/claude
   ```
   **(Use the Railway URL from Step 1.7)**

6. Click **"Deploy"**
7. Wait 2 minutes ⏳
8. **COPY YOUR URL** (e.g., `https://rent-safe.vercel.app`)

✅ **Frontend deployed!**

---

## 🔧 Step 3: Update CORS (1 minute)

### Update server.js:
1. Open `server.js` locally
2. Find the CORS section (line ~20)
3. Add your Vercel URL:
   ```javascript
   app.use(cors({
     origin: [
       'http://localhost:5173',
       'http://localhost:3000',
       'https://rent-safe.vercel.app' // ← ADD YOUR VERCEL URL
     ],
     credentials: true
   }));
   ```
4. Commit and push:
   ```bash
   git add server.js
   git commit -m "Update CORS for production"
   git push origin main
   ```
5. Railway will auto-redeploy ✅

---

## ✅ DONE! Test Your App

Visit your Vercel URL: `https://rent-safe.vercel.app`

### Test Checklist:
- [ ] Sign up works
- [ ] Sign in works
- [ ] Create property works
- [ ] AI chat responds
- [ ] Image analysis works

---

## 🐛 If Something Breaks

### Frontend not loading?
- Check Vercel **Deployments** → **Build Logs**
- Verify environment variables are set

### Backend not responding?
- Check Railway **Deployments** → **Logs**
- Verify `ANTHROPIC_API_KEY` is set

### "Failed to fetch"?
- Check CORS is updated with your Vercel URL
- Wait 2 minutes for Railway to redeploy

---

## 🎉 Your App is LIVE!

**Frontend:** https://your-app.vercel.app  
**Backend:** https://your-backend.railway.app  
**Database:** Supabase (already configured)

**Share your app with the world! 🌍**

