# 🚀 Quick Setup Guide

## Step 1: Get Claude API Key

1. Go to [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in
3. Click "API Keys" in the sidebar
4. Click "Create Key"
5. Copy your new API key (starts with `sk-ant-...`)

## Step 2: Create `.env` File

Create a file named `.env` in your project root (same folder as `package.json`):

```bash
# .env
VITE_CLAUDE_API_KEY=sk-ant-api03-your-actual-key-here
```

**⚠️ Important Notes:**
- The variable name MUST be exactly `VITE_CLAUDE_API_KEY`
- Replace `sk-ant-api03-your-actual-key-here` with your actual key
- Don't commit this file to git (it's already in `.gitignore`)

## Step 3: Install Dependencies (if needed)

```bash
npm install
```

## Step 4: Start Development Server

```bash
npm run dev
```

## Step 5: Test AI Features

### Test 1: Image Analysis
1. Open the app → Sign in
2. Click any property with "Pending" status
3. Click "Create Move-In Report"
4. Upload a photo (any image of a room)
5. Wait 5-10 seconds
6. ✅ You should see AI analysis results below the photo!

### Test 2: Chat Assistant
1. Click "Ask AI" in the navigation menu
2. Type: "My landlord kept RM 500 from my deposit"
3. Press Send
4. ✅ You should see a contextual AI response about Malaysian tenancy law!

### Test 3: Document Generation
1. Go to "Reports" from navigation
2. Select "General Reports" tab
3. Choose a property from dropdown
4. Scroll down to "AI Legal Documents"
5. Click "Generate Dispute Report"
6. Wait 5-10 seconds
7. ✅ You should see a full legal document in a modal!

---

## 🐛 Troubleshooting

### "AI not configured" warning appears
- ✅ Check that `.env` file exists in project root
- ✅ Verify the variable name is `VITE_CLAUDE_API_KEY` (not `CLAUDE_API_KEY`)
- ✅ Restart your dev server (`npm run dev`)

### API returns 401 error
- ✅ Verify your API key is correct (copy again from Anthropic console)
- ✅ Check that your Anthropic account has credits
- ✅ Ensure the key hasn't been revoked

### Photo upload doesn't analyze
- ✅ Check browser console for errors (F12 → Console tab)
- ✅ Verify image is < 10MB
- ✅ Try a different image format (JPG, PNG)

### Documents not generating
- ✅ Make sure a property is selected first
- ✅ Check browser console for API errors
- ✅ Verify your API key has sufficient quota

---

## 💰 Pricing Info

Claude Sonnet 4 costs approximately:
- **$0.02-0.05** per photo analysis
- **$0.01-0.02** per chat message
- **$0.05-0.10** per legal document

Average user: **~$1-2 per month**

Monitor your usage at: [https://console.anthropic.com/](https://console.anthropic.com/)

---

## 🔒 Security Note

⚠️ **This is a frontend-only setup for development/demo purposes.**

For production, you should:
1. Move the API key to a backend server
2. Create a proxy endpoint that calls Claude API
3. Add authentication and rate limiting
4. Never expose API keys in frontend code

See `AI_INTEGRATION_GUIDE.md` for production deployment tips.

---

## 📚 Additional Resources

- **Full Documentation:** See `AI_INTEGRATION_GUIDE.md`
- **What Changed:** See `WHAT_WAS_ADDED.md`
- **Anthropic Docs:** [https://docs.anthropic.com/](https://docs.anthropic.com/)

---

**All set! Your AI features should now be working! 🎉**

If you see the ✨ sparkle icons and no warning banners, you're good to go!

