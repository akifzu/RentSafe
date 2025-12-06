# ⚡ Quick Start - 3 Steps to Run AI Features

## 1️⃣ Create `.env` File
Create a file named `.env` in project root:
```env
ANTHROPIC_API_KEY=your_api_key_here
PORT=3001
VITE_API_URL=http://localhost:3001
```

Get your API key from: https://console.anthropic.com/settings/keys

---

## 2️⃣ Start Backend Server
Open **Terminal 1**:
```bash
npm run server
```

Wait for:
```
✅ API Key Configured
```

---

## 3️⃣ Start Frontend
Open **Terminal 2**:
```bash
npm run dev
```

---

## ✅ Test AI Features

### **Photo Analysis:**
1. Dashboard → Rent Property → Move-In Report
2. Upload photo → AI analyzes automatically

### **AI Chat:**
1. Dashboard landing page
2. Type question → Send

### **Form 198:**
1. Reports page → Select property
2. Click "Generate Form 198"

---

## 🔧 Troubleshooting

**AI not working?**
1. Check `.env` has correct API key
2. Restart backend: `npm run server`
3. Check browser console (F12)

**Backend won't start?**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
npm run server
```

---

**That's it! 🎉**

