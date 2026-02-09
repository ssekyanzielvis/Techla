# Quick Deployment Commands

## For GitHub (if not already set up):
```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Vercel deployment"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/techla-documents.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## For Future Updates:
```bash
git add .
git commit -m "Update: your changes description"
git push
```

## Environment Variables for Vercel:

Copy these into Vercel's Environment Variables section:

**Variable 1:**
- Name: `NEXT_PUBLIC_SUPABASE_URL`
- Value: `https://chfaqwqovcpzkdymbxup.supabase.co`

**Variable 2:**
- Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoZmFxd3FvdmNwemtkeW1ieHVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1ODk4MTIsImV4cCI6MjA4NjE2NTgxMn0.Rj4VNsBmqWTFOBF5CUmfPYLfnG8kqRVFwD1nT-JQIDw`

## Deployment Steps:
1. Push code to GitHub (see commands above)
2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Add the two environment variables above
5. Click "Deploy"
6. Wait 1-3 minutes
7. Access your live app!

See VERCEL_DEPLOYMENT.md for detailed instructions.
