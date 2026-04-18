# Vercel Deployment Guide

## Overview
This guide will help you deploy your MedStore admin portal to Vercel safely without exposing sensitive credentials.

## Prerequisites
- Git installed
- GitHub account (Vercel integrates with GitHub)
- Vercel account (free at https://vercel.com)
- Your Supabase project credentials

## Step 1: Create `.env.local` File (Local Development)

```bash
# Copy the example file
cp .env.example .env.local
```

Then edit `.env.local` and add your actual Supabase credentials:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**⚠️ IMPORTANT:** Never commit `.env.local` to git. It's already in `.gitignore`.

## Step 2: Initialize Git Repository

If not already initialized:
```bash
git init
git add .
git commit -m "Initial commit"
```

## Step 3: Push to GitHub

```bash
# Create a new repository on GitHub
# Then push your code:
git remote add origin https://github.com/yourusername/your-repo-name.git
git branch -M main
git push -u origin main
```

## Step 4: Deploy to Vercel

### Option A: Using Vercel CLI

```bash
npm i -g vercel
vercel
```

Follow the prompts and connect your GitHub account.

### Option B: Using Vercel Web Dashboard

1. Go to https://vercel.com/dashboard
2. Click "Add New..." then "Project"
3. Import your GitHub repository
4. Vercel will auto-detect it's a Vite project
5. Skip the Environment Variables step (we'll add them in the next step)
6. Click "Deploy"

## Step 5: Configure Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add these environment variables:
   - Key: `VITE_SUPABASE_URL`
     Value: `https://your-project.supabase.co`
   - Key: `VITE_SUPABASE_ANON_KEY`
     Value: `your_anon_key_here`
4. Select all environments (Production, Preview, Development)
5. Click "Save"

## Step 6: Redeploy

After adding environment variables, redeploy:
```bash
vercel --prod
```

Or through the Vercel dashboard: click "Deployments" and choose your latest deployment, then click "Redeploy".

## Security Checklist

✅ Credentials are NOT hardcoded in source files
✅ `.env.local` is in `.gitignore` and will not be committed
✅ Environment variables are securely stored in Vercel
✅ `vercel.json` specifies required environment variables
✅ Supabase uses anon key (safe for browser)

## Verify Deployment

After deployment:
1. Visit your Vercel URL
2. Test the CSV upload functionality
3. Verify that data is being stored in Supabase
4. Check Vercel's logs if anything fails

## Important Notes

- **Supabase Anon Key:** The key in your credentials (sb_publishable_) is a public/anon key meant to be exposed to browsers. This is safe.
- **Never use Service Role Key:** Never expose the service role key in frontend code
- **Environment Variables:** Always use environment variables for any sensitive configuration

## Troubleshooting

### Build fails with "Missing environment variables"
- Make sure you've added `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel Settings
- Redeploy after adding variables

### Blank page / CORS errors
- Check browser console for errors
- Verify Supabase URL is correct
- Ensure Supabase project is running

### Changes not reflected
- Vercel rebuilds and redeploys automatically on git push
- Use `vercel --prod` for manual redeployments

## Next Steps

1. Complete the setup steps above
2. Test your deployed app
3. Share your Vercel URL with team members
4. Set up custom domain in Vercel settings (optional)

Need help? Visit https://vercel.com/docs/frameworks/vite
