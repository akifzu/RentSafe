# 🚀 Quick Start - Gemini AI Integration

## 3-Minute Setup

### 1️⃣ Get API Key
Visit: https://makersuite.google.com/app/apikey
Copy your API key

### 2️⃣ Backend Setup
```bash
cd server
npm install
```

Create `server/.env`:
```
GEMINI_API_KEY=paste_your_key_here
PORT=3001
```

Start backend:
```bash
npm run dev
```

### 3️⃣ Frontend Setup
Create `.env` in root:
```
VITE_API_BASE_URL=http://localhost:3001/api
```

Start frontend (new terminal):
```bash
npm run dev
```

### 4️⃣ Test
1. Open http://localhost:3000
2. Go to Dashboard
3. Ask AI Assistant a question
4. Enjoy! 🎉

## That's it! 

For detailed instructions, see `SETUP_INSTRUCTIONS.md`


