# 🤖 SewaSecure AI Integration - Complete Setup Guide

## ✅ What Was Implemented

### 1. **Image Analysis** (`analyze_move_in_photo`)
- **Location:** Move-In Report page (`src/components/MoveInReport.tsx`)
- **Feature:** AI analyzes uploaded property photos
- **Output:** Damage classification, confidence scores, legal reasoning, liability assessment

### 2. **Form 198 Generation** (`generate_form_198`)
- **Location:** Reports page (`src/components/Reports.tsx`)
- **Feature:** Generates Borang 198 for Tribunal Tuntutan Pengguna Malaysia
- **Output:** Complete legal document in Bahasa Malaysia

### 3. **AI Chat Assistant** (`chat_with_user`)
- **Location:** Dashboard landing page (`src/components/Dashboard.tsx`)
- **Feature:** Conversational AI for tenancy questions
- **Output:** Real-time responses about rental processes, disputes, and legal guidance

---

## 📦 Files Created/Modified

### **New Files:**
1. `server.js` - Backend proxy server with Claude API integration
2. `src/services/claudeAI.ts` - AI service layer with all 3 prompts
3. `.env` - Environment variables (YOU MUST CREATE THIS MANUALLY)

### **Modified Files:**
1. `src/components/MoveInReport.tsx` - Added AI photo analysis
2. `src/components/Reports.tsx` - Added Form 198 generation
3. `src/components/Dashboard.tsx` - Connected real AI chat
4. `package.json` - Added server script
5. `.gitignore` - Protected .env file

---

## 🚀 Setup Instructions

### **Step 1: Install Dependencies**
Dependencies are already installed:
```bash
npm install
```

### **Step 2: Create .env File**
Create a file named `.env` in the project root:

```env
# Claude AI API Key
ANTHROPIC_API_KEY=your_actual_api_key_here

# Backend Server Port
PORT=3001

# Frontend Vite (for reference)
VITE_API_URL=http://localhost:3001
```

**⚠️ IMPORTANT:** Replace `your_actual_api_key_here` with your real Claude API key from:
https://console.anthropic.com/settings/keys

### **Step 3: Start Backend Server**
Open a **NEW terminal** and run:
```bash
npm run server
```

You should see:
```
╔══════════════════════════════════════════════════════════╗
║          🚀 SewaSecure AI Backend Server                ║
║          Server running on: http://localhost:3001       ║
║          Status: ✅ API Key Configured                   ║
╚══════════════════════════════════════════════════════════╝
```

### **Step 4: Start Frontend**
In your **ORIGINAL terminal**, run:
```bash
npm run dev
```

### **Step 5: Test AI Features**

#### **Test 1: AI Photo Analysis**
1. Go to Dashboard
2. Click "Rent a Property" (if you're a tenant)
3. Fill in property details and submit
4. Click "Move-In Report"
5. Upload a photo of a room
6. ✨ **AI will automatically analyze the photo!**

#### **Test 2: AI Chat**
1. On Dashboard landing page
2. Type a question in the "Ask AI" box
3. Click Send
4. ✨ **Real Claude AI will respond!**

#### **Test 3: Form 198 Generation**
1. Go to Reports page
2. Select a property
3. Scroll down to "AI Legal Documents"
4. Click "Generate Form 198"
5. ✨ **AI generates legal document in Bahasa Malaysia!**

---

## 🔧 Troubleshooting

### **Problem: "AI analysis failed"**
**Solution:**
1. Check backend server is running (`npm run server`)
2. Check `.env` file has correct API key
3. Check browser console for errors (F12)

### **Problem: "invalid x-api-key"**
**Solution:**
1. Your API key is wrong or expired
2. Get a new key from https://console.anthropic.com/settings/keys
3. Update `.env` file
4. Restart backend server

### **Problem: "CORS error"**
**Solution:**
- Backend server must be running on port 3001
- Frontend must be on port 5173 (Vite default)

### **Problem: Backend won't start**
**Solution:**
```bash
# Check if port 3001 is in use
netstat -ano | findstr :3001

# Kill the process if needed (replace PID)
taskkill /PID <PID> /F

# Restart server
npm run server
```

---

## 📊 API Usage & Costs

### **Model Used:**
- `claude-3-haiku-20240307` (Fast & cost-effective)

### **Estimated Costs:**
- Image Analysis: ~$0.01 per photo
- Form 198 Generation: ~$0.02 per document
- Chat: ~$0.001 per message

### **Token Limits:**
- Image Analysis: 2000 tokens
- Form 198: 3000 tokens
- Chat: 1000 tokens

---

## 🎯 How It Works

### **Architecture:**
```
Frontend (React)
    ↓
src/services/claudeAI.ts
    ↓
HTTP Request to localhost:3001/api/claude
    ↓
server.js (Backend Proxy)
    ↓
Anthropic API (Claude AI)
```

### **Why Backend Proxy?**
- Avoids CORS issues
- Keeps API key secure (not exposed in frontend)
- Allows request logging and error handling

---

## 🔐 Security Notes

1. **Never commit `.env` file** - Already in `.gitignore`
2. **API key is sensitive** - Treat like a password
3. **Backend runs locally** - Not exposed to internet
4. **Rate limiting** - Claude API has rate limits

---

## 📝 Example API Calls

### **Image Analysis:**
```typescript
const analysis = await analyzePropertyPhoto(base64Image, {
  propertyAddress: "123 Main St",
  roomType: "Living Room",
  moveInDate: "2025-01-01"
});
```

### **Form 198 Generation:**
```typescript
const form198 = await generateForm198({
  plaintiffName: "John Doe",
  plaintiffIC: "123456-78-9012",
  amount: 2000,
  reason: "Deposit withholding dispute",
  facts: [...],
  evidence: [...]
});
```

### **Chat:**
```typescript
const response = await chatWithUser([], "How do I track utilities?");
```

---

## 🎉 Success Checklist

- [ ] `.env` file created with valid API key
- [ ] Backend server running (`npm run server`)
- [ ] Frontend running (`npm run dev`)
- [ ] Photo analysis works in Move-In Report
- [ ] Form 198 generates in Reports page
- [ ] AI chat responds on Dashboard

---

## 📞 Need Help?

1. Check browser console (F12) for errors
2. Check backend terminal for logs
3. Verify API key is valid
4. Ensure both servers are running

---

**🚀 You're all set! Enjoy your AI-powered tenancy platform!**

