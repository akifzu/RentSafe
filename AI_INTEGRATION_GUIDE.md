# SewaSecure AI Integration Guide

## Overview

Your SewaSecure platform now has **3 AI-powered features** integrated using Claude Sonnet 4:

1. **📸 Image Analysis** - Automatically analyze property photos for damage
2. **💬 AI Chat Assistant** - Help users resolve disputes and understand tenancy law
3. **📄 Legal Document Generation** - Create dispute reports, demand letters, and Form 198

---

## 🎯 Where AI Features Are Located

### 1. Image Analysis (Move-In Reports)
**Location:** `MoveInReport` component
**When:** User uploads property photos during move-in inspection

**Features Added:**
- ✅ File upload with drag & drop
- ✅ Real-time AI analysis after photo upload
- ✅ Damage detection and classification (pre-existing vs tenant damage vs wear & tear)
- ✅ Confidence scoring and legal reasoning
- ✅ Auto-populate notes with AI findings
- ✅ Visual display of analysis results with color-coded classifications

**User Flow:**
1. Go to Dashboard → Click property with "Pending" status
2. Create Move-In Report
3. Upload photos for each room
4. AI automatically analyzes for damage
5. Review AI findings (shows classification, severity, liability)
6. Submit report with AI-enhanced documentation

---

### 2. AI Chat Assistant
**Location:** `AskAI` component (accessible from navigation menu)
**When:** User needs help with disputes or legal questions

**Features Added:**
- ✅ Real-time conversation with Claude AI
- ✅ Context-aware responses about Malaysian tenancy law
- ✅ Dispute information gathering
- ✅ Suggestions for next steps (reports, demand letters, Form 198)
- ✅ Empathetic and impartial guidance

**User Flow:**
1. Click "Ask AI" from navigation menu
2. Chat with AI about any tenancy issues
3. AI provides guidance on:
   - Deposit disputes
   - Damage liability
   - Legal options (Form 198, demand letters)
   - Malaysian tenant rights

**Example Questions:**
- "My landlord kept RM 500 from my deposit for a wall scratch"
- "How do I file Form 198?"
- "Can I be charged for normal wear and tear?"

---

### 3. Legal Document Generation
**Location:** `Reports` component → General Reports tab
**When:** User needs formal legal documents for dispute resolution

**Documents Available:**
- **Dispute Report** - Analysis and recommendations for negotiation
- **Demand Letter** - Formal request before legal action
- **Form 198 (Borang 198)** - Official tribunal filing document (in Bahasa Malaysia)

**Features Added:**
- ✅ One-click document generation
- ✅ AI analyzes evidence and applies Malaysian law
- ✅ Professional formatting with legal citations
- ✅ Download as TXT or copy to clipboard
- ✅ Includes disclaimers and legal warnings

**User Flow:**
1. Go to Reports → General Reports
2. Select a property
3. Scroll to "AI Legal Documents" section
4. Click desired document type
5. AI generates document with legal reasoning
6. Copy or download for use

---

## 🔧 Setup Instructions

### 1. Get Your Claude API Key

1. Go to [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new key
5. Copy your API key

### 2. Configure Environment Variable

Create a `.env` file in your project root:

```bash
VITE_CLAUDE_API_KEY=your_actual_api_key_here
```

**Important:** The key MUST start with `VITE_` because Vite only exposes variables with this prefix to the browser.

### 3. Restart Development Server

```bash
npm run dev
```

The AI features will now be active!

---

## 💰 Cost Estimates (Claude Sonnet 4)

Based on Anthropic pricing:
- **Input:** $3 per million tokens (~$0.003 per 1K tokens)
- **Output:** $15 per million tokens (~$0.015 per 1K tokens)

### Typical Costs Per Action:

| Action | Tokens Used | Estimated Cost |
|--------|-------------|----------------|
| Analyze 1 photo | ~1,500 tokens | $0.02 - $0.05 |
| Chat message | ~800 tokens | $0.01 - $0.02 |
| Generate dispute report | ~3,500 tokens | $0.05 - $0.08 |
| Generate Form 198 | ~4,000 tokens | $0.06 - $0.10 |

**Monthly Estimate for Average User:**
- 10 photo analyses: ~$0.50
- 20 chat messages: ~$0.40
- 2 legal documents: ~$0.20
- **Total: ~$1.10/month per active user**

---

## 🎨 UI Components Added

### Visual Indicators

1. **✨ Purple Sparkle Icon** - Indicates AI-powered features
2. **⚠️ Warning Banners** - Show when AI is not configured
3. **Loading States** - Animate while AI is processing
4. **Color-Coded Classifications:**
   - 🟢 Green = Normal wear & tear (tenant not liable)
   - 🟡 Yellow = Pre-existing damage (documented)
   - 🔴 Red = Tenant damage (potentially liable)
   - ⚪ Gray = Unclear (needs more evidence)

### Buttons Added

#### MoveInReport.tsx
- File upload input (replaces placeholder)
- AI analysis progress indicator
- Photo preview grid with delete option

#### AskAI.tsx
- Real-time chat with loading spinner
- Suggested questions (dispute-focused)
- API status warning banner

#### Reports.tsx
- "Generate Dispute Report" (purple)
- "Generate Demand Letter" (orange)
- "Generate Form 198" (red)
- Document preview modal with copy/download

---

## 🔒 Fallback Behavior (No API Key)

If `VITE_CLAUDE_API_KEY` is not set, the app gracefully degrades:

1. **Image Analysis:** Photos upload normally, but no AI analysis
   - Shows warning: "AI Analysis Unavailable - Configure API key"

2. **Chat Assistant:** Basic fallback responses
   - Shows warning: "AI not configured"

3. **Legal Documents:** Buttons are disabled
   - Shows warning: "Configure API key to enable"

**The core app functionality (reports, utilities, move-in tracking) works perfectly without AI.**

---

## 🧪 Testing the Integration

### Test Image Analysis
1. Go to any property with "Pending" status
2. Create move-in report
3. Upload a test image (any room photo)
4. Watch AI analyze in real-time
5. Check the AI analysis results below the photo

### Test Chat Assistant
1. Click "Ask AI" from menu
2. Try: "My landlord kept RM 500 from deposit"
3. Observe AI's contextual response about Malaysian law
4. Ask follow-up questions

### Test Document Generation
1. Go to Reports → General Reports
2. Select a property
3. Click "Generate Dispute Report"
4. Wait 5-10 seconds for generation
5. Review the AI-generated document

---

## 📁 Files Modified

### New Files Created:
- ✅ `src/services/claudeAI.ts` - API integration service
- ✅ `.env.example` - Environment template
- ✅ `AI_INTEGRATION_GUIDE.md` - This guide

### Modified Components:
- ✅ `src/components/MoveInReport.tsx` - Added photo upload + AI analysis
- ✅ `src/components/AskAI.tsx` - Integrated real Claude API
- ✅ `src/components/Reports.tsx` - Added legal document generation

---

## 🔍 Code Architecture

### Service Layer (`src/services/claudeAI.ts`)

```typescript
// Main functions exported:
analyzePropertyPhoto(imageBase64, context) → JSON analysis
generateLegalDocument(action, disputeData) → Document text
chatWithAI(history, message) → Response text
isClaudeConfigured() → boolean
```

### System Prompts (Embedded in Service)
1. `IMAGE_ANALYSIS_PROMPT` - ~500 tokens
2. `LEGAL_DOCUMENT_PROMPT` - ~600 tokens  
3. `CONVERSATIONAL_PROMPT` - ~700 tokens

These prompts are **highly optimized** for:
- Malaysian tenancy law compliance
- Evidence Act 1950 requirements
- Bilingual support (English/Bahasa Malaysia)
- Impartial dispute resolution

---

## 🚀 Production Deployment

### Environment Variables on Hosting Platform

**Vercel:**
```bash
vercel env add VITE_CLAUDE_API_KEY
```

**Netlify:**
Add to `netlify.toml`:
```toml
[build.environment]
  VITE_CLAUDE_API_KEY = "your_key_here"
```

**General (CI/CD):**
Set `VITE_CLAUDE_API_KEY` in your deployment platform's environment settings.

### Security Best Practices

⚠️ **IMPORTANT:** The API key is exposed to the browser because it's a frontend-only app.

**For production, consider:**
1. Create a backend API proxy that:
   - Stores Claude API key securely on server
   - Validates requests from authenticated users
   - Adds rate limiting
   - Logs usage for billing

2. Or use Anthropic's client-side SDK with:
   - Usage quotas per user
   - API key rotation
   - Request monitoring

---

## 📊 Monitoring & Analytics

Track AI usage with these metrics:

```typescript
// Add to your analytics
trackEvent('ai_photo_analysis', {
  property_id: propertyId,
  room_name: roomName,
  items_detected: analysis.items_detected.length
});

trackEvent('ai_chat_message', {
  user_id: userId,
  message_length: message.length
});

trackEvent('ai_document_generated', {
  document_type: 'dispute_report' | 'form_198' | 'demand_letter',
  property_id: propertyId
});
```

---

## 🆘 Troubleshooting

### "AI not configured" warning
- ✅ Check `.env` file exists in project root
- ✅ Verify variable name is `VITE_CLAUDE_API_KEY` (not `CLAUDE_API_KEY`)
- ✅ Restart dev server after adding .env

### API errors (401 Unauthorized)
- ✅ Verify API key is correct
- ✅ Check Anthropic account has credits
- ✅ Ensure API key has proper permissions

### Image analysis fails
- ✅ Check image is <10MB
- ✅ Verify image format (JPG, PNG, WebP)
- ✅ Check browser console for errors

### Documents not generating
- ✅ Property must be selected
- ✅ Check network tab for API errors
- ✅ Verify Claude API key is valid

---

## 📞 Support

For issues with:
- **Claude API:** [Anthropic Support](https://support.anthropic.com/)
- **Malaysian Law Context:** Consult legal professionals
- **App Integration:** Check browser console for errors

---

## 🎉 What's Next?

Consider adding:
1. **Photo comparison** - Side-by-side move-in vs move-out
2. **Multi-language UI** - Full Bahasa Malaysia support
3. **PDF generation** - Convert AI documents to formatted PDFs
4. **Evidence hashing** - SHA-256 for legal admissibility
5. **Email integration** - Send documents directly to landlords/tribunal

---

**Congratulations! Your tenancy platform is now AI-powered! 🚀**

