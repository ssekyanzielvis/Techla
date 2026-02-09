# 🚀 Vercel Deployment Guide - Techla Solutions

This guide will walk you through deploying your Techla document management system to Vercel.

## Prerequisites

Before deploying, ensure you have:
- ✅ A [Vercel account](https://vercel.com/signup) (free tier is sufficient)
- ✅ A [GitHub](https://github.com), [GitLab](https://gitlab.com), or [Bitbucket](https://bitbucket.org) account
- ✅ Your Supabase database setup and credentials ready

---

## Step 1: Prepare Your Code

### 1.1 Initialize Git Repository (if not already done)

```bash
git init
git add .
git commit -m "Initial commit - ready for deployment"
```

### 1.2 Create a GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository (e.g., `techla-documents`)
3. **Do NOT** initialize with README (you already have one)
4. Click "Create repository"

### 1.3 Push Your Code to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/techla-documents.git
git branch -M main
git push -u origin main
```

**Important:** Your `.gitignore` file already excludes `.env*` files, so your credentials are safe and won't be pushed to GitHub.

---

## Step 2: Deploy to Vercel

### 2.1 Import Your Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Select **"Import Git Repository"**
4. Authorize Vercel to access your GitHub account
5. Select your `techla-documents` repository
6. Click **"Import"**

### 2.2 Configure Project Settings

Vercel will auto-detect that it's a Next.js project. Review the settings:

- **Framework Preset:** Next.js (auto-detected)
- **Root Directory:** `./` (leave as default)
- **Build Command:** `next build` (auto-filled)
- **Output Directory:** `.next` (auto-filled)
- **Install Command:** `npm install` (auto-filled)

### 2.3 Add Environment Variables

**This is the most important step!**

In the "Environment Variables" section, add your Supabase credentials:

1. Click **"Add"** or expand the **"Environment Variables"** section

2. Add the first variable:
   - **Name:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** `https://chfaqwqovcpzkdymbxup.supabase.co`
   - **Environment:** Select all (Production, Preview, Development)

3. Add the second variable:
   - **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoZmFxd3FvdmNwemtkeW1ieHVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1ODk4MTIsImV4cCI6MjA4NjE2NTgxMn0.Rj4VNsBmqWTFOBF5CUmfPYLfnG8kqRVFwD1nT-JQIDw`
   - **Environment:** Select all (Production, Preview, Development)

### 2.4 Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 1-3 minutes)
3. Once complete, you'll see "Congratulations" with your live URL

---

## Step 3: Access Your Deployed Application

### Your Live URL

After deployment, Vercel will provide you with a URL like:
```
https://techla-documents-xxxxx.vercel.app
```

### Test Your Deployment

1. Visit your Vercel URL
2. You should be redirected to the login page
3. Login with:
   - **Username:** `techlaug`
   - **Password:** `techla123`
4. Test creating a document to ensure Supabase connection works

---

## Step 4: Configure Custom Domain (Optional)

### Add a Custom Domain

1. In your Vercel project dashboard, go to **"Settings"** → **"Domains"**
2. Click **"Add"**
3. Enter your domain name (e.g., `techla.com`)
4. Follow the DNS configuration instructions
5. Wait for DNS propagation (can take up to 48 hours, usually faster)

---

## Continuous Deployment

Once set up, Vercel automatically deploys your app whenever you push to GitHub:

### Deploy Updates

```bash
# Make changes to your code
git add .
git commit -m "Update: description of changes"
git push
```

**That's it!** Vercel will automatically:
- Detect the push
- Build your project
- Deploy the new version
- Keep your environment variables secure

---

## Troubleshooting

### Build Failed

**Issue:** Build fails during deployment

**Solutions:**
1. Check the build logs in Vercel dashboard
2. Ensure all dependencies in `package.json` are correct
3. Verify that local build works: `npm run build`
4. Check for TypeScript errors

### Database Connection Error

**Issue:** Can't connect to Supabase

**Solutions:**
1. Verify environment variables are set correctly in Vercel
2. Check that your Supabase URL doesn't have trailing slashes
3. Ensure your Supabase project is active
4. Test the credentials in your local `.env.local` file first

### Login Not Working

**Issue:** Can't login after deployment

**Possible causes:**
- Client-side only authentication (should work)
- Browser localStorage being blocked (check privacy settings)

### Page Not Found (404)

**Issue:** Routes not working

**Solutions:**
- Ensure your Next.js app router structure is correct
- Check that all pages are in the `app/` directory
- Verify `next.config.ts` doesn't have routing conflicts

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | `eyJhbGci...` |

**Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser, which is necessary for client-side Supabase operations.

---

## Vercel Project Settings

### Recommended Settings

- **Framework:** Next.js
- **Node.js Version:** 18.x (auto-selected)
- **Development Command:** `next dev`
- **Output Directory:** `.next`

### Performance Optimizations

Vercel automatically provides:
- ✅ Global CDN distribution
- ✅ Automatic HTTPS/SSL
- ✅ Image optimization
- ✅ Edge caching
- ✅ Automatic compression

---

## Post-Deployment Checklist

- [ ] Application loads correctly
- [ ] Login works with credentials
- [ ] Can create new documents
- [ ] Documents save to Supabase
- [ ] Can view saved documents
- [ ] Can delete documents
- [ ] PDF generation works
- [ ] Mobile responsive design works

---

## Support & Resources

- **Vercel Documentation:** [vercel.com/docs](https://vercel.com/docs)
- **Next.js Deployment:** [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)

---

## Security Notes

1. **Never commit `.env.local` to Git** - Your `.gitignore` already prevents this
2. **Keep your Supabase keys private** - The anon key is safe for client-side use
3. **Consider Row Level Security (RLS)** - Your database already has this enabled
4. **Use strong passwords** - Consider updating the hardcoded credentials for production

---

## Next Steps

1. ✅ Deploy to Vercel
2. Test all functionality
3. Share your live URL with team/clients
4. Monitor usage in Vercel Analytics
5. Consider upgrading to Vercel Pro for additional features (optional)

---

**Congratulations!** 🎉 Your Techla document management system is now live on Vercel!
