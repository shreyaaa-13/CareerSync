# 🚀 GitHub Setup Guide - AI-Based Career Guidance System

## 📋 Prerequisites

Before uploading to GitHub, ensure you have:
- ✅ Git installed on your system
- ✅ GitHub account created
- ✅ Project files ready

---

## 🔧 Step 1: Install Git (If Not Already Installed)

### **Windows:**
1. Download Git from: https://git-scm.com/download/win
2. Run the installer
3. Use default settings
4. Verify installation:
```bash
git --version
```

### **Verify Git is Installed:**
```bash
# Open Command Prompt or PowerShell
git --version
# Should show: git version 2.x.x
```

---

## 🌐 Step 2: Create a GitHub Repository

### **Option A: Via GitHub Website (Recommended)**

1. **Go to GitHub:** https://github.com
2. **Sign in** to your account
3. **Click** the "+" icon (top-right) → "New repository"
4. **Fill in details:**
   - **Repository name:** `AI-Career-Guidance-System`
   - **Description:** `AI-powered career guidance platform with personalized recommendations, resume analysis, and interactive chatbot`
   - **Visibility:** Choose "Public" or "Private"
   - **DO NOT** initialize with README (we already have one)
   - **DO NOT** add .gitignore (we already have one)
   - **DO NOT** choose a license yet
5. **Click** "Create repository"

### **Option B: Via GitHub CLI**
```bash
# Install GitHub CLI first: https://cli.github.com/
gh repo create AI-Career-Guidance-System --public --source=. --remote=origin
```

---

## 💻 Step 3: Initialize Git in Your Project

Open **Command Prompt** or **PowerShell** and navigate to your project:

```bash
# Navigate to your project directory
cd "C:\xampp\htdocs\AI Based Career guidance System"

# Initialize Git repository
git init

# Check status
git status
```

**Expected Output:**
```
Initialized empty Git repository in C:/xampp/htdocs/AI Based Career guidance System/.git/
```

---

## 📝 Step 4: Configure Git (First Time Only)

Set your name and email (this will appear in commits):

```bash
# Set your name
git config --global user.name "Your Name"

# Set your email (use your GitHub email)
git config --global user.email "your.email@example.com"

# Verify configuration
git config --list
```

---

## 📦 Step 5: Add Files to Git

```bash
# Check what files will be added (should exclude .gitignore items)
git status

# Add all files to staging area
git add .

# Or add specific files/folders
git add README.md
git add backend/
git add frontend/

# Check staged files
git status
```

**You should see:**
```
On branch main
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        new file:   README.md
        new file:   backend/app.py
        new file:   frontend/package.json
        ...
```

---

## 💾 Step 6: Create Your First Commit

```bash
# Commit with a descriptive message
git commit -m "Initial commit: AI-Based Career Guidance System"

# Or with more details
git commit -m "Initial commit: Complete AI Career Guidance System

- React.js frontend with Tailwind CSS
- Flask backend with RESTful APIs
- MySQL database integration
- AI-powered quiz and recommendations
- Resume analysis feature
- Interactive chatbot
- Admin dashboard
- User authentication with JWT"
```

**Expected Output:**
```
[main (root-commit) abc1234] Initial commit: AI-Based Career Guidance System
 150 files changed, 25000 insertions(+)
 create mode 100644 README.md
 ...
```

---

## 🔗 Step 7: Connect to GitHub Repository

After creating the repository on GitHub, you'll see instructions. Use these commands:

```bash
# Add GitHub repository as remote origin
git remote add origin https://github.com/YOUR_USERNAME/AI-Career-Guidance-System.git

# Verify remote was added
git remote -v
```

**Expected Output:**
```
origin  https://github.com/YOUR_USERNAME/AI-Career-Guidance-System.git (fetch)
origin  https://github.com/YOUR_USERNAME/AI-Career-Guidance-System.git (push)
```

### **Alternative: Using SSH (More Secure)**

If you prefer SSH:

```bash
# Add SSH remote
git remote add origin git@github.com:YOUR_USERNAME/AI-Career-Guidance-System.git
```

---

## 🚀 Step 8: Push to GitHub

```bash
# Rename branch to 'main' (if needed)
git branch -M main

# Push code to GitHub
git push -u origin main
```

**You may be prompted to authenticate:**
- Enter your GitHub username
- Enter your GitHub password (or Personal Access Token)

**Expected Output:**
```
Enumerating objects: 150, done.
Counting objects: 100% (150/150), done.
Delta compression using up to 8 threads
Compressing objects: 100% (120/120), done.
Writing objects: 100% (150/150), 2.5 MiB | 1.2 MiB/s, done.
Total 150 (delta 30), reused 0 (delta 0)
To https://github.com/YOUR_USERNAME/AI-Career-Guidance-System.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## 🎉 Step 9: Verify Upload

1. **Go to your GitHub repository:**
   ```
   https://github.com/YOUR_USERNAME/AI-Career-Guidance-System
   ```

2. **You should see:**
   - All your project files
   - README.md displayed on the main page
   - Commit history
   - File structure

---

## 🔐 Authentication Options

### **Option 1: Personal Access Token (Recommended)**

GitHub no longer accepts passwords for Git operations. Use a Personal Access Token:

1. **Go to:** GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. **Click:** "Generate new token (classic)"
3. **Set:**
   - Note: "AI Career Guidance System"
   - Expiration: 90 days (or custom)
   - Scopes: Check "repo" (full control)
4. **Click:** "Generate token"
5. **Copy** the token (you won't see it again!)
6. **Use** this token as your password when pushing

### **Option 2: SSH Key (More Secure)**

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub:
# GitHub → Settings → SSH and GPG keys → New SSH key
# Paste the key and save
```

---

## 📝 Common Git Commands for Future Updates

### **Making Changes:**

```bash
# Check status
git status

# Add specific file
git add filename.py

# Add all changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push origin main
```

### **Updating from GitHub:**

```bash
# Pull latest changes
git pull origin main
```

### **Viewing History:**

```bash
# View commit history
git log

# View simplified history
git log --oneline

# View changes
git diff
```

### **Branching:**

```bash
# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main

# Merge branch
git merge feature-name

# Delete branch
git branch -d feature-name
```

---

## 🎯 Complete Command Sequence (Quick Reference)

```bash
# 1. Navigate to project
cd "C:\xampp\htdocs\AI Based Career guidance System"

# 2. Initialize Git
git init

# 3. Configure (first time only)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 4. Add files
git add .

# 5. Commit
git commit -m "Initial commit: AI-Based Career Guidance System"

# 6. Add remote
git remote add origin https://github.com/YOUR_USERNAME/AI-Career-Guidance-System.git

# 7. Push
git branch -M main
git push -u origin main
```

---

## 📊 Repository Structure on GitHub

After upload, your repository will look like:

```
AI-Career-Guidance-System/
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── models.py
│   ├── routes/
│   ├── services/
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── tailwind.config.js
├── .gitignore
├── .env.example
├── README.md
├── SETUP_GUIDE.md
├── QUICK_START.md
├── PROJECT_SUMMARY.md
├── DEMO_SCRIPT.md
└── install.bat
```

---

## 🏷️ Adding Tags/Releases

Create a release for your project:

```bash
# Create a tag
git tag -a v1.0.0 -m "Version 1.0.0 - Initial Release"

# Push tag to GitHub
git push origin v1.0.0

# Or push all tags
git push --tags
```

**On GitHub:**
1. Go to "Releases"
2. Click "Create a new release"
3. Select your tag
4. Add release notes
5. Publish release

---

## 📄 Add a License (Optional but Recommended)

1. **On GitHub:** Go to your repository
2. **Click:** "Add file" → "Create new file"
3. **Name it:** `LICENSE`
4. **Click:** "Choose a license template"
5. **Select:** MIT License (most common for open source)
6. **Commit** the file

---

## 🎨 Enhance Your Repository

### **Add Topics:**
1. Go to repository settings
2. Add topics: `ai`, `career-guidance`, `react`, `flask`, `machine-learning`, `python`, `javascript`

### **Add Repository Description:**
- Click "⚙️" next to "About"
- Add: "AI-powered career guidance platform with personalized recommendations, resume analysis, and interactive chatbot"
- Add website URL (if deployed)

### **Add a Banner Image:**
Create a banner and add to README:
```markdown
![AI Career Guidance System](banner.png)
```

---

## ⚠️ Important Notes

### **Before Pushing:**
- ✅ Ensure `.env` is in `.gitignore` (contains secrets)
- ✅ Remove any hardcoded API keys or passwords
- ✅ Check that `node_modules/` is ignored
- ✅ Verify database files are not included
- ✅ Remove any sensitive user data

### **Security Checklist:**
```bash
# Check for secrets in code
git grep -i "password"
git grep -i "api_key"
git grep -i "secret"

# If found, remove them and use environment variables
```

---

## 🔄 Updating Your Repository

When you make changes:

```bash
# 1. Check what changed
git status

# 2. Add changes
git add .

# 3. Commit with message
git commit -m "Add new feature: XYZ"

# 4. Push to GitHub
git push origin main
```

---

## 🆘 Troubleshooting

### **Problem: "fatal: not a git repository"**
```bash
# Solution: Initialize Git
git init
```

### **Problem: "remote origin already exists"**
```bash
# Solution: Remove and re-add
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
```

### **Problem: "failed to push some refs"**
```bash
# Solution: Pull first, then push
git pull origin main --allow-unrelated-histories
git push origin main
```

### **Problem: Authentication failed**
```bash
# Solution: Use Personal Access Token instead of password
# Generate token at: GitHub → Settings → Developer settings → Personal access tokens
```

### **Problem: Large files rejected**
```bash
# GitHub has 100MB file limit
# Solution: Add large files to .gitignore or use Git LFS
```

---

## 📱 GitHub Mobile App

Download the GitHub mobile app to manage your repository on the go:
- **iOS:** https://apps.apple.com/app/github/id1477376905
- **Android:** https://play.google.com/store/apps/details?id=com.github.android

---

## 🎓 Additional Resources

- **Git Documentation:** https://git-scm.com/doc
- **GitHub Guides:** https://guides.github.com/
- **Git Cheat Sheet:** https://education.github.com/git-cheat-sheet-education.pdf
- **Interactive Git Tutorial:** https://learngitbranching.js.org/

---

## ✅ Success Checklist

After completing all steps, verify:

- [ ] Repository created on GitHub
- [ ] All files uploaded (check on GitHub)
- [ ] README.md displays correctly
- [ ] .gitignore working (node_modules, .env not uploaded)
- [ ] Repository description added
- [ ] Topics/tags added
- [ ] License added (optional)
- [ ] Repository is public/private as intended

---

## 🎉 Congratulations!

Your AI-Based Career Guidance System is now on GitHub! 🚀

**Share your repository:**
```
https://github.com/YOUR_USERNAME/AI-Career-Guidance-System
```

**Clone URL for others:**
```bash
git clone https://github.com/YOUR_USERNAME/AI-Career-Guidance-System.git
```

---

**Need help?** Open an issue on GitHub or contact the maintainer.

**Happy Coding!** 💻✨
