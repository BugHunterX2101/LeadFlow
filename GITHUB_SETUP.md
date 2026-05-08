# GitHub Setup Instructions

## Prerequisites
- GitHub account
- Git installed and configured

## Step 1: Create Repository on GitHub

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `LeadFlow`
3. Description: `A modern, full-stack CRM application for managing sales leads`
4. Choose **Public** (or Private if preferred)
5. **Do NOT** initialize with README, .gitignore, or license (we have them locally)
6. Click **Create repository**

## Step 2: Add Remote and Push

```bash
cd D:\LeadFlow

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/LeadFlow.git

# Rename branch to main (if needed)
git branch -M main

# Push the code
git push -u origin main
```

**Note**: Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 3: Verify Push

1. Go to your repository on GitHub: `https://github.com/YOUR_USERNAME/LeadFlow`
2. Verify all files are there, including:
   - ✅ README.md (with Mermaid diagrams)
   - ✅ .gitignore
   - ✅ LICENSE
   - ✅ backend/ folder
   - ✅ frontend/ folder
   - ✅ docker-compose.yml

## Step 4: Set Up Repository Settings (Optional)

### Enable Issues
1. Go to **Settings** → **Features**
2. Enable **Issues**

### Add Topics
1. Go to **Settings** → **General**
2. Under "Topics", add: `crm`, `react`, `nodejs`, `postgresql`, `docker`

### Add Branch Protection (Optional)
1. Go to **Settings** → **Branches**
2. Add rule for `main` branch
3. Require pull request reviews before merging

## Step 5: Clone and Test

After pushing, test cloning:

```bash
# In a new directory
git clone https://github.com/YOUR_USERNAME/LeadFlow.git
cd LeadFlow

# Verify the structure
dir
```

## Troubleshooting

### Authentication Issues
If you get authentication errors:

**Option 1: Use Personal Access Token (Recommended)**
```bash
# GitHub will prompt for password
# Paste your Personal Access Token instead
# Generate at: https://github.com/settings/tokens
```

**Option 2: Use SSH**
```bash
# Set up SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"

# Add to GitHub: https://github.com/settings/keys

# Change remote to SSH
git remote set-url origin git@github.com:YOUR_USERNAME/LeadFlow.git
```

### File Line Endings
Windows uses CRLF, Unix uses LF. This is already handled by `.gitignore`, but if you see issues:

```bash
# Configure git for your system
git config --global core.autocrlf true  # Windows
git config --global core.autocrlf input # Mac/Linux
```

### Push Rejected
If you get "rejected" errors:

```bash
# Force push (be careful!)
git push -u origin main --force
```

## Next Steps

1. Add collaborators (if needed): Settings → Collaborators
2. Create issues for TODO items
3. Set up CI/CD with GitHub Actions (optional)
4. Create release tags for versions

## Example GitHub Actions Workflow (Optional)

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: leadflow
          POSTGRES_DB: leadflow
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20

      - run: npm install
      - run: npm run test
      - run: npm run test --prefix frontend
```

---

For more info: https://docs.github.com/en/get-started/quickstart/create-a-repo
