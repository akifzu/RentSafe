# ⚠️ URGENT: Git History Rewrite Notice

## What Happened

The `main` branch history was rewritten on **December 6, 2025** to remove an accidentally committed API key for security reasons.

## Impact

If you have local commits on `main` branch, you will encounter merge conflicts or "unrelated histories" errors when trying to push.

---

## 🚨 ACTION REQUIRED BEFORE YOUR NEXT PULL/PUSH

### Step 1: Save Your Work
```bash
# Save any uncommitted changes
git stash save "My work before history sync"

# Create backup of your current branch
git branch backup-$(date +%Y%m%d)
```

### Step 2: Sync with New History
```bash
# Fetch the new history
git fetch origin

# If you're on main branch:
git checkout main
git reset --hard origin/main

# If you're on a feature branch:
git checkout your-feature-branch
git rebase origin/main
```

### Step 3: Restore Your Work
```bash
# Restore your uncommitted changes
git stash pop

# Or cherry-pick your commits from backup branch
git cherry-pick <commit-hash>
```

### Step 4: Push Normally
```bash
# Now you can push without issues
git push origin your-branch-name
```

---

## 📋 Affected Files

The following files were added in the rewritten history:
- Backend proxy server (`server.js`)
- AI integration files (`src/services/claudeAI.ts`, etc.)
- 86 files total with AI features

All previous work from other branches should still be intact.

---

## ❓ Questions?

If you encounter any issues or have questions:
1. **DO NOT force push** without discussing
2. **Backup your work first** (git stash or create branch)
3. Contact the team for help

---

## 🔒 Prevention Going Forward

To prevent this in the future:
1. **Never commit** `.env` files (now in `.gitignore`)
2. **Always work on feature branches**, not directly on `main`
3. **Use Pull Requests** for all merges to main
4. **Protected branch rules** should be enabled on GitHub

---

## Contact

If you need help syncing your local repository, reach out immediately before attempting any git commands.

**Date of Notice:** December 6, 2025
**Affected Branch:** `main`
**Reason:** Security - API key removal

