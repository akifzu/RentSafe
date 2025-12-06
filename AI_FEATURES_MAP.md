# 🗺️ AI Features Location Map

## Visual Guide: Where Each AI Feature Lives in Your UI

---

## 🏠 Navigation Menu
```
┌─────────────────────────────────────────┐
│  SewaSecure                      [User] │
├─────────────────────────────────────────┤
│  Dashboard                              │
│  Properties                             │
│  Reports                                │
│  Ask AI  ← ✨ AI CHAT FEATURE HERE     │
│  Settings                               │
└─────────────────────────────────────────┘
```

---

## 📸 Feature 1: Image Analysis (Move-In Report)

### Location Path:
```
Dashboard → Click Property (Pending status) → Move-In Report
```

### Screen Layout:
```
╔═══════════════════════════════════════════════════════════╗
║  Move-In Report                                           ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  Room 1                                           [X]     ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │ Room Name: [Living Room________________]           │ ║
║  │                                                     │ ║
║  │ Condition: [Excellent ▼]                           │ ║
║  │                                                     │ ║
║  │ Notes: [Auto-populated by AI___________]           │ ║
║  │        [_______________________________]           │ ║
║  │                                                     │ ║
║  │ Photos (AI Analysis Enabled ✨)                    │ ║
║  │ ┌───────────────────────────────────────────────┐ │ ║
║  │ │      📤 Click to upload room photos          │ │ ║
║  │ │   AI will analyze for damage automatically   │ │ ║
║  │ └───────────────────────────────────────────────┘ │ ║
║  │                                                     │ ║
║  │ [Photo 1]  [Photo 2]  ← Thumbnails after upload   │ ║
║  │                                                     │ ║
║  │ ╔═══════════════════════════════════════════════╗ │ ║
║  │ ║ ✨ AI Analysis Results                       ║ │ ║
║  │ ╠═══════════════════════════════════════════════╣ │ ║
║  │ ║  Wall: Small crack (3cm)                     ║ │ ║
║  │ ║  Classification: Pre-existing Damage         ║ │ ║
║  │ ║  Severity: Minor                             ║ │ ║
║  │ ║  Liability: NONE                             ║ │ ║
║  │ ║  Confidence: 87%                             ║ │ ║
║  │ ║                                               ║ │ ║
║  │ ║  Reasoning: Crack shows weathering and age,  ║ │ ║
║  │ ║  not consistent with recent damage...        ║ │ ║
║  │ ╚═══════════════════════════════════════════════╝ │ ║
║  └─────────────────────────────────────────────────────┘ ║
║                                                           ║
║  [+ Add Another Room]                                    ║
║                                                           ║
║  [Save Draft]              [Submit Report]               ║
╚═══════════════════════════════════════════════════════════╝
```

**What Happens:**
1. User uploads photo → File appears in thumbnail grid
2. ✨ AI analyzes automatically (5-10 sec)
3. Purple analysis card appears below with findings
4. Notes field auto-fills with damage descriptions
5. Color-coded badges show liability

---

## 💬 Feature 2: AI Chat Assistant

### Location Path:
```
Navigation Menu → Ask AI
```

### Screen Layout:
```
╔═══════════════════════════════════════════════════════════╗
║  ✨ Ask AI                                    [← Back]    ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  ╭─────────────────────────────────────────────────────╮ ║
║  │ 🤖 Hello! I'm your SewaSecure AI assistant. I can  │ ║
║  │    help you with dispute resolution, damage         │ ║
║  │    assessment, and Malaysian tenancy law...         │ ║
║  │                                   10:30 AM           │ ║
║  ╰─────────────────────────────────────────────────────╯ ║
║                                                           ║
║                    ╭──────────────────────────────────╮  ║
║                    │ My landlord kept RM 500 from    │  ║
║                    │ my deposit for a wall scratch   │  ║
║                    │                      10:31 AM   │  ║
║                    ╰──────────────────────────────────╯  ║
║                                                           ║
║  ╭─────────────────────────────────────────────────────╮ ║
║  │ 🤖 I understand that's frustrating. Based on       │ ║
║  │    Malaysian tenancy law, tenants are not liable   │ ║
║  │    for normal wear and tear. Can you tell me:      │ ║
║  │    1. Do you have move-in photos of the wall?      │ ║
║  │    2. How long was your tenancy?                   │ ║
║  │    3. What size is the scratch?                    │ ║
║  │                                   10:31 AM          │ ║
║  ╰─────────────────────────────────────────────────────╯ ║
║                                                           ║
║  Suggested questions:                                    ║
║  [My landlord withheld RM 500 from deposit]             ║
║  [How do I generate a dispute report?]                  ║
║  [What is Form 198 and when do I need it?]              ║
║  [Can I be charged for normal wear and tear?]           ║
║                                                           ║
║  ┌────────────────────────────────────────────────────┐ ║
║  │ [Ask a question about renting...___________] [Send]│ ║
║  └────────────────────────────────────────────────────┘ ║
║                                                           ║
║  This AI provides general information only. Consult a    ║
║  professional for legal or financial advice.             ║
╚═══════════════════════════════════════════════════════════╝
```

**What Happens:**
1. User types message about dispute
2. ✨ AI provides contextual Malaysian law advice
3. Conversation flows naturally
4. AI gathers details and recommends next steps
5. Can suggest generating reports/documents

---

## 📄 Feature 3: Legal Document Generation

### Location Path:
```
Navigation Menu → Reports → General Reports Tab
```

### Screen Layout:
```
╔═══════════════════════════════════════════════════════════╗
║  📊 Report Generator                          [← Back]    ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  [General Reports] [Monthly Reports]                     ║
║                                                           ║
║  ┌──────────────┐  ┌────────────────────────────────────┐║
║  │ Configuration│  │ Report Preview                     │║
║  ├──────────────┤  │                                    │║
║  │              │  │  [Property info displays here]     │║
║  │ Select       │  │                                    │║
║  │ Property:    │  │  [Report content displays here]    │║
║  │ [Apt 123 ▼] │  │                                    │║
║  │              │  │                                    │║
║  │ Report Type: │  │                                    │║
║  │ ○ Summary    │  └────────────────────────────────────┘║
║  │ ○ Utilities  │                                        ║
║  │ ○ Complete   │                                        ║
║  │              │                                        ║
║  │ [Generate    │                                        ║
║  │   Report]    │                                        ║
║  │──────────────│                                        ║
║  │  ✨ AI Legal │                                        ║
║  │  Documents   │                                        ║
║  │              │                                        ║
║  │ [Generate    │  ← ✨ DISPUTE REPORT (Purple)         ║
║  │  Dispute     │                                        ║
║  │  Report]     │                                        ║
║  │              │                                        ║
║  │ [Generate    │  ← ✨ DEMAND LETTER (Orange)          ║
║  │  Demand      │                                        ║
║  │  Letter]     │                                        ║
║  │              │                                        ║
║  │ [Generate    │  ← ✨ FORM 198 (Red)                  ║
║  │  Form 198]   │                                        ║
║  │              │                                        ║
║  └──────────────┘                                        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

**When User Clicks a Button:**
```
╔═══════════════════════════════════════════════════════════╗
║  ✨ AI-Generated Legal Document              [X Close]   ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  ⚠️  Legal Disclaimer                                     ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │ This is an AI-generated document for informational  │ ║
║  │ purposes only. Consult a lawyer for complex cases.  │ ║
║  └─────────────────────────────────────────────────────┘ ║
║                                                           ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │                                                     │ ║
║  │ DISPUTE RESOLUTION REPORT                           │ ║
║  │ Property: 123 Main Street, Unit 5A                  │ ║
║  │ Date: 06/12/2025                                    │ ║
║  │                                                     │ ║
║  │ PARTIES INVOLVED:                                   │ ║
║  │ Tenant: John Doe                                    │ ║
║  │ Landlord: Property Management Ltd                   │ ║
║  │                                                     │ ║
║  │ DISPUTED AMOUNT: RM 1,500.00                        │ ║
║  │                                                     │ ║
║  │ FACTS OF THE CASE:                                  │ ║
║  │ 1. Tenancy commenced on 15/01/2024...               │ ║
║  │ 2. Security deposit of RM 1,500 paid...             │ ║
║  │ 3. Tenant documented property condition...          │ ║
║  │                                                     │ ║
║  │ LEGAL ANALYSIS:                                     │ ║
║  │ Under Malaysian common law, tenants are not         │ ║
║  │ liable for normal wear and tear...                  │ ║
║  │                                                     │ ║
║  │ [Full document continues...]                        │ ║
║  │                                                     │ ║
║  └─────────────────────────────────────────────────────┘ ║
║                                                           ║
║  [Copy to Clipboard]              [Download as TXT]      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

**What Happens:**
1. User selects property and clicks button
2. ✨ AI generates document (5-10 seconds)
3. Full-screen modal shows formatted document
4. User can copy to clipboard or download
5. Document includes legal citations and reasoning

---

## 🎯 Quick Access Summary

| Feature | Location | Button Color | Icon |
|---------|----------|--------------|------|
| **Image Analysis** | Move-In Report → Photo Upload | N/A (auto) | 📤 ✨ |
| **AI Chat** | Navigation → Ask AI | Purple | 💬 🤖 |
| **Dispute Report** | Reports → General → AI Docs | Purple | 📄 |
| **Demand Letter** | Reports → General → AI Docs | Orange | 📝 |
| **Form 198** | Reports → General → AI Docs | Red | ⚖️ |

---

## 🔍 Visual Indicators That AI is Working

### When AI is Available (API key configured):
```
✨ Sparkle icon appears next to features
"AI Analysis Enabled" badge on upload
"AI Legal Documents" section visible
No warning banners
```

### When AI is NOT Available (no API key):
```
⚠️ Yellow warning banner appears
"AI not configured" message
"Configure VITE_CLAUDE_API_KEY" instructions
Features still work but AI disabled
```

### When AI is Processing:
```
✨ Sparkle icon animates (pulse effect)
"AI Analyzing Photo..." message
"Thinking..." on send button
Purple loading spinner
Button disabled during generation
```

---

## 🎨 Color Legend

- **Purple** = AI features (Sparkles, AI buttons)
- **Green** = Success / No liability
- **Yellow** = Warning / Pre-existing damage
- **Red** = Error / Tenant liability
- **Orange** = Demand letter (middle escalation)
- **Gray** = Unclear / Needs review

---

## 📱 Mobile Responsive?

✅ Yes! All AI features are responsive:
- Image upload works on mobile
- Chat interface adapts to screen size
- Document modal scrolls on small screens
- Buttons stack vertically on mobile

---

## 🚀 Getting Started Path

```
1. Add API key to .env
   └─→ VITE_CLAUDE_API_KEY=sk-ant-...

2. Restart dev server
   └─→ npm run dev

3. Test Image Analysis
   └─→ Dashboard → Property → Move-In Report → Upload Photo

4. Test Chat
   └─→ Navigation → Ask AI → Send message

5. Test Documents
   └─→ Navigation → Reports → General → Click AI button

✅ All features working!
```

---

**Use this map to navigate and test all AI features! 🗺️✨**

See `SETUP.md` for detailed setup instructions.
See `WHAT_WAS_ADDED.md` for technical details.

