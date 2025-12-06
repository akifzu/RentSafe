# 🚀 SewaSecure Deployment Guide

## 📋 Overview

Your SewaSecure system has **3 components** to deploy:

1. **Frontend** (React + Vite) → Static hosting
2. **Backend** (Node.js + Express) → Server hosting  
3. **Database** (Supabase) → Already cloud-hosted ✅

---

## 🎯 Recommended Stack

| Component | Platform | Cost | Why |
|-----------|----------|------|-----|
| **Frontend** | Vercel | Free | Auto-deploy from GitHub, fast CDN |
| **Backend** | Railway | Free tier | Easy Node.js hosting, automatic HTTPS |
| **Database** | Supabase | Free tier | Already set up ✅ |

**Total Cost:** $0/month for starter tier (enough for 1000s of users)

---

## 📦 Option 1: Full Deployment (Recommended)

### **Step 1: Deploy Backend to Railway**

#### **1.1 Create Railway Account**
1. Go to [https://railway.app](https://railway.app)
2. Sign up with GitHub
3. Authorize Railway

#### **1.2 Deploy Backend**
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository: `akifzu/RentSafe`
4. Railway will detect Node.js automatically

#### **1.3 Configure Backend**
1. Go to project settings
2. Add **Environment Variables**:
   ```env
   ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
   PORT=3001
   NODE_ENV=production
   ```

3. Set **Start Command**:
   - Settings → Deploy → Start Command: `node server.js`

4. **Generate Domain**:
   - Settings → Networking → Generate Domain
   - Copy the URL (e.g., `your-app.railway.app`)

#### **1.4 Update CORS in server.js**

You'll need to update `server.js` to allow your production frontend URL:

```javascript
// In server.js, update CORS configuration:
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://your-frontend.vercel.app', // Add your Vercel URL
    'https://rentsafe.com' // Add custom domain if you have one
  ],
  credentials: true
}));
```

---

### **Step 2: Deploy Frontend to Vercel**

#### **2.1 Create Vercel Account**
1. Go to [https://vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Authorize Vercel

#### **2.2 Deploy Frontend**
1. Click "Add New Project"
2. Import `akifzu/RentSafe` from GitHub
3. Vercel auto-detects Vite ✅

#### **2.3 Configure Environment Variables**

In Vercel project settings, add:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Backend API URL (Railway URL from Step 1.4)
VITE_API_URL=https://your-backend.railway.app

# Claude AI Proxy
VITE_USE_PROXY=true
VITE_PROXY_URL=https://your-backend.railway.app/api/claude
```

#### **2.4 Deploy**
1. Click "Deploy"
2. Wait 2-3 minutes
3. Your site will be live at `https://your-app.vercel.app`

---

### **Step 3: Update Frontend API URL**

Update `src/services/claudeAI.ts`:

```typescript
// Change from:
const API_URL = 'http://localhost:3001/api/claude';

// To:
const API_URL = import.meta.env.VITE_PROXY_URL || 'http://localhost:3001/api/claude';
```

---

### **Step 4: Test Production**

1. Visit your Vercel URL
2. Try signing up
3. Create a property
4. Test AI features

---

## 📦 Option 2: Alternative Platforms

### **Frontend Alternatives:**

#### **Netlify** (Similar to Vercel)
```bash
# Build command
npm run build

# Publish directory
dist

# Environment variables (same as Vercel)
```

#### **GitHub Pages** (Free, no custom backend)
```bash
# Add to package.json
"homepage": "https://akifzu.github.io/RentSafe"

# Deploy
npm run build
npm run deploy
```

---

### **Backend Alternatives:**

#### **Render** (Similar to Railway)
1. Go to [https://render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo
4. Set build command: `npm install`
5. Set start command: `node server.js`
6. Add environment variables

#### **Heroku** (Requires credit card)
```bash
# Install Heroku CLI
npm install -g heroku

# Login and deploy
heroku login
heroku create rentsafe-backend
git push heroku main
heroku config:set ANTHROPIC_API_KEY=your-key
```

---

## 🔐 Production Environment Variables

### **Frontend (.env for Vercel/Netlify)**
```env
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...

# Backend API
VITE_API_URL=https://your-backend.railway.app
VITE_PROXY_URL=https://your-backend.railway.app/api/claude
VITE_USE_PROXY=true
```

### **Backend (.env for Railway/Render)**
```env
# Claude AI
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here

# Server
PORT=3001
NODE_ENV=production

# Optional: Allowed origins (if not using wildcard CORS)
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://rentsafe.com
```

---

## 📱 Custom Domain Setup

### **1. Buy Domain** (Optional)
- Namecheap: ~$10/year
- GoDaddy: ~$12/year
- Google Domains: ~$12/year

### **2. Configure DNS**

**For Frontend (Vercel):**
1. Vercel Dashboard → Domains
2. Add your domain
3. Copy DNS records to your domain provider

**For Backend (Railway):**
1. Railway Dashboard → Settings → Networking
2. Add custom domain
3. Add CNAME record to your DNS

**Example Setup:**
```
rentsafe.com → Frontend (Vercel)
api.rentsafe.com → Backend (Railway)
```

---

## 🔄 CI/CD Pipeline (Auto-Deploy)

### **Vercel (Frontend)**
✅ **Auto-deploys on every push to main**
- Push to GitHub → Auto-deploy
- Preview deployments for PRs
- Rollback with one click

### **Railway (Backend)**
✅ **Auto-deploys on every push to main**
- Push to GitHub → Auto-build → Auto-deploy
- Environment variables persist
- Zero-downtime deployments

### **GitHub Actions** (Optional Advanced)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID}}
          vercel-project-id: ${{ secrets.PROJECT_ID}}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          curl -X POST ${{ secrets.RAILWAY_WEBHOOK }}
```

---

## 🔍 Pre-Deployment Checklist

### **✅ Frontend**
- [ ] Build succeeds locally (`npm run build`)
- [ ] No TypeScript errors
- [ ] Environment variables configured
- [ ] API URLs point to production backend

### **✅ Backend**
- [ ] Server starts successfully
- [ ] API key is valid
- [ ] CORS allows production frontend
- [ ] Health endpoint responds (`/api/health`)

### **✅ Database**
- [ ] Supabase migration run
- [ ] Tables created
- [ ] Storage buckets configured
- [ ] RLS policies active

---

## 🐛 Troubleshooting Production Issues

### **"Failed to fetch" errors**
**Problem:** Frontend can't reach backend

**Solutions:**
1. Check backend URL in environment variables
2. Verify CORS allows your frontend domain
3. Check Railway logs for errors

### **"Invalid API key"**
**Problem:** Claude AI not working

**Solution:**
- Add `ANTHROPIC_API_KEY` to Railway environment variables
- Restart the backend service

### **"Supabase connection failed"**
**Problem:** Database not connecting

**Solutions:**
1. Verify Supabase URL and anon key
2. Check Supabase project is not paused
3. Ensure RLS policies are correct

### **Images not loading**
**Problem:** Uploaded photos don't display

**Solution:**
- Make storage buckets public in Supabase
- Check bucket policies allow public access

---

## 📊 Production Monitoring

### **Frontend (Vercel)**
- **Analytics:** Built-in (free)
- **Logs:** Vercel Dashboard → Logs
- **Performance:** Vercel Speed Insights

### **Backend (Railway)**
- **Logs:** Railway Dashboard → Deployments → Logs
- **Metrics:** CPU, Memory, Network usage
- **Alerts:** Set up via Railway

### **Database (Supabase)**
- **Logs:** Supabase Dashboard → Logs
- **API Usage:** Settings → API
- **Database Stats:** Settings → Database

---

## 💰 Cost Estimation

### **Free Tier (Good for MVP):**
- **Vercel:** 100GB bandwidth/month
- **Railway:** $5 credit/month (enough for small apps)
- **Supabase:** 500MB database, 1GB storage
- **Total:** ~$0-5/month

### **Paid Tier (For Production):**
- **Vercel Pro:** $20/month (unlimited bandwidth)
- **Railway Pro:** $20/month (8GB RAM, 100GB storage)
- **Supabase Pro:** $25/month (8GB database, 100GB storage)
- **Total:** ~$65/month

---

## 🚀 Quick Deploy Commands

### **Deploy Everything in 10 Minutes:**

```bash
# 1. Push to GitHub
git push origin main

# 2. Deploy Frontend (Vercel)
# - Go to vercel.com
# - Import repo
# - Add env vars
# - Deploy ✅

# 3. Deploy Backend (Railway)
# - Go to railway.app
# - New project from GitHub
# - Add env vars
# - Deploy ✅

# 4. Test
# - Visit Vercel URL
# - Sign up
# - Create property
# - Done! ✅
```

---

## 📚 Deployment Resources

### **Documentation:**
- [Vercel Deployment Docs](https://vercel.com/docs)
- [Railway Deployment Docs](https://docs.railway.app)
- [Supabase Production Guide](https://supabase.com/docs/guides/platform/going-into-prod)

### **Video Tutorials:**
- YouTube: "Deploy Vite React to Vercel"
- YouTube: "Deploy Node.js to Railway"
- YouTube: "Supabase Production Setup"

---

## 🎉 Success Checklist

After deployment, verify:

- [ ] Frontend loads at production URL
- [ ] Sign up/sign in works
- [ ] Properties can be created
- [ ] AI chat responds
- [ ] Image analysis works
- [ ] Form 198 generates
- [ ] Data persists after refresh
- [ ] Mobile responsive

---

## 🔒 Security Best Practices

### **Production Security:**
1. ✅ Use HTTPS only (Vercel/Railway provide free SSL)
2. ✅ Never commit `.env` files
3. ✅ Rotate API keys every 90 days
4. ✅ Enable Supabase RLS policies
5. ✅ Set up rate limiting (Vercel built-in)
6. ✅ Monitor error logs regularly
7. ✅ Use strong passwords for admin accounts
8. ✅ Enable 2FA on all platforms

---

## 📞 Support

**Platform Issues:**
- Vercel: [vercel.com/support](https://vercel.com/support)
- Railway: [railway.app/help](https://railway.app/help)
- Supabase: [supabase.com/support](https://supabase.com/support)

**SewaSecure App Issues:**
- Check `TROUBLESHOOTING.md`
- GitHub Issues: `github.com/akifzu/RentSafe/issues`

---

**🎊 Your SewaSecure app is ready for production deployment!**

**Recommended: Start with Vercel (frontend) + Railway (backend) for easiest setup.**

