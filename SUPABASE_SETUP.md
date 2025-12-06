# 🗄️ Supabase Integration Setup Guide

## 🎉 What's New

Your SewaSecure system now has **full database integration** with Supabase!

### ✨ Features Added:
- 🔐 **User Authentication** - Sign up, sign in, sign out
- 💾 **Database Storage** - All data persists in the cloud
- 📸 **File Storage** - Photos, receipts, and documents
- 🔄 **Real-time Updates** - Live data synchronization
- 🛡️ **Row Level Security** - Data privacy and protection

---

## 🚀 Quick Setup (5 Steps)

### **Step 1: Create Supabase Project**

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Choose organization and project name: **SewaSecure**
4. Set a strong database password
5. Select region closest to Malaysia (Singapore recommended)
6. Click "Create new project"
7. Wait 2-3 minutes for project setup

---

### **Step 2: Run Database Migration**

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `supabase-migration.sql`
4. Paste into the SQL editor
5. Click "Run" (bottom right)
6. ✅ You should see: "Database schema created successfully!"

**What this does:**
- Creates tables: `profiles`, `properties`, `move_in_reports`, `utility_readings`
- Sets up Row Level Security (RLS) policies
- Creates storage buckets for files
- Adds indexes for performance
- Sets up automatic triggers

---

### **Step 3: Get API Keys**

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy two values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: Long string starting with `eyJhb...`

---

### **Step 4: Update .env File**

Open your `.env` file and add:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Keep your existing Claude API keys
ANTHROPIC_API_KEY=sk-ant-api03-...
```

**⚠️ Important:**
- Replace `your-project` with your actual Supabase project URL
- Replace the anon key with your actual key
- Keep your existing Claude API keys

---

### **Step 5: Enable Storage Buckets**

1. In Supabase dashboard, go to **Storage**
2. You should see 3 buckets created:
   - `property-photos` (for room photos)
   - `receipts` (for utility receipts)
   - `agreements` (for tenancy agreements)
3. Make sure they're all set to **Public** (they should be by default)

---

## 🎮 How to Use

### **For Development (Same as Before):**

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

---

## 🔄 What Changed in Your Code

### **Authentication Flow:**

**Old (Mock):**
```typescript
// Accepted any email/password
onSignIn({ name, email, type: userType });
```

**New (Real):**
```typescript
// Creates real user account in Supabase
await auth.signUp(email, password, name, userType);
await auth.signIn(email, password);
```

### **Data Storage:**

**Old (Local State):**
```typescript
// Data lost on refresh
const [properties, setProperties] = useState([]);
```

**New (Supabase):**
```typescript
// Data persists in cloud database
const properties = await properties.getAll(userId);
await properties.create(newProperty);
```

### **File Uploads:**

**Old (Base64 in State):**
```typescript
// Stored in memory only
const base64 = await fileToBase64(file);
```

**New (Supabase Storage):**
```typescript
// Stored in cloud, returns URL
const url = await storage.uploadPropertyPhoto(userId, propertyId, file);
```

---

## 📚 Database Schema

### **Tables:**

| Table | Description | Key Fields |
|-------|-------------|-----------|
| `profiles` | User accounts | id, email, name, user_type |
| `properties` | Rental properties | property_address, status, move_in_date |
| `move_in_reports` | Property condition reports | rooms (JSON), photos |
| `utility_readings` | Monthly payments | water, electricity, rent, date |

### **Storage Buckets:**

| Bucket | Purpose | Public |
|--------|---------|--------|
| `property-photos` | Room condition photos | ✅ Yes |
| `receipts` | Payment receipts | ✅ Yes |
| `agreements` | Tenancy agreements | ✅ Yes |

---

## 🔐 Security Features

### **Row Level Security (RLS):**
- ✅ Users can only see their own data
- ✅ Users can only modify their own records
- ✅ Database-level security (not just frontend)

### **Storage Security:**
- ✅ Files organized by user ID
- ✅ Users can only upload to their own folders
- ✅ Public URLs for easy sharing

---

## 🧪 Testing Your Setup

### **1. Test Authentication:**
```typescript
// Try signing up
import { auth } from './src/services/database';
await auth.signUp('test@example.com', 'password123', 'Test User', 'tenant');
```

### **2. Test Database:**
```typescript
// Try creating a property
import { properties } from './src/services/database';
const property = await properties.create({
  user_id: 'user-uuid-here',
  property_address: '123 Test St',
  renter_name: 'John Doe',
  renter_email: 'john@example.com',
  move_in_date: '2025-01-01',
  owner_email: 'owner@example.com'
});
```

### **3. Check Supabase Dashboard:**
1. Go to **Table Editor** in Supabase
2. Click on `profiles` table
3. You should see your test user!

---

## 🐛 Troubleshooting

### **"Missing Supabase environment variables"**
**Fix:** Make sure `.env` has both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### **"Failed to fetch"**
**Fix:** Check your Supabase project URL is correct and project is not paused

### **"Row Level Security policy violation"**
**Fix:** Run the migration SQL again to set up RLS policies

### **"Storage bucket not found"**
**Fix:** 
1. Go to Storage in Supabase
2. Manually create buckets: `property-photos`, `receipts`, `agreements`
3. Set them to Public

---

## 📊 Database Structure Visual

```
┌─────────────┐
│   profiles  │ ← User accounts
└──────┬──────┘
       │ (owns)
       ↓
┌─────────────┐
│ properties  │ ← Rental properties
└──────┬──────┘
       │ (has)
       ├─────────────┐
       ↓             ↓
┌──────────────┐  ┌─────────────────┐
│move_in_reports│  │utility_readings │
└──────────────┘  └─────────────────┘
```

---

## 🎯 Next Steps

1. ✅ Run migration SQL in Supabase
2. ✅ Add API keys to `.env`
3. ✅ Restart your dev servers
4. ✅ Test sign up/sign in
5. ✅ Try creating a property

---

## 💡 Pro Tips

### **Use Supabase Studio:**
- View real-time data in Table Editor
- Debug with SQL Editor
- Monitor API usage in Logs

### **Backup Your Data:**
```bash
# Supabase automatically backs up every day
# But you can export manually:
# Settings → Database → Backups
```

### **Monitor Performance:**
```bash
# Check API calls:
# Settings → API → API Logs
```

---

## 🆘 Need Help?

1. **Supabase Docs:** https://supabase.com/docs
2. **SQL Migration File:** `supabase-migration.sql` (has all the setup)
3. **Database Service:** `src/services/database.ts` (has all the functions)

---

**🎉 Your SewaSecure system now has enterprise-grade database backing!**

