# Vercel Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the AIJobs Intelligence Dashboard frontend to Vercel.

## Prerequisites

- GitHub repository: `https://github.com/mccaigs/jobs`
- Vercel account connected to GitHub
- Convex backend deployed at: `https://third-lark-419.convex.cloud`

## Deployment Configuration

### Project Settings

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `site` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |
| **Node Version** | 18.x or higher |

### Environment Variables

Add the following environment variable in Vercel Dashboard:

```
VITE_CONVEX_URL=https://third-lark-419.convex.cloud
```

**CRITICAL**: This is the ONLY Convex deployment URL that should be used. The application has built-in validation to prevent incorrect deployments.

## Step-by-Step Deployment

### Option 1: Deploy via Vercel Dashboard

1. **Import Project**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select "Import Git Repository"
   - Choose `mccaigs/jobs` from your GitHub repositories

2. **Configure Project**
   - **Root Directory**: Set to `site` (IMPORTANT!)
   - **Framework Preset**: Vite (should auto-detect)
   - **Build Command**: `npm run build` (should auto-fill)
   - **Output Directory**: `dist` (should auto-fill)

3. **Add Environment Variables**
   - Click "Environment Variables"
   - Add variable:
     - Name: `VITE_CONVEX_URL`
     - Value: `https://third-lark-419.convex.cloud`
     - Environments: Production, Preview, Development (all checked)

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~1-2 minutes)
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Navigate to the site directory
cd c:\dev\jobs\site

# Deploy to production
vercel --prod

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? (accept default or customize)
# - In which directory is your code located? ./
# - Want to override settings? Yes
#   - Build Command: npm run build
#   - Output Directory: dist
#   - Development Command: npm run dev

# Add environment variable
vercel env add VITE_CONVEX_URL production
# Enter value: https://third-lark-419.convex.cloud
```

## Post-Deployment Verification

### 1. Check Deployment Status
- Visit your Vercel deployment URL
- Verify the page loads without errors

### 2. Verify Convex Connection
- Open browser DevTools → Console
- Check for any Convex connection errors
- Should see successful connection to `third-lark-419.convex.cloud`

### 3. Test Functionality
- **Home Page**: Should load with reports list
- **Report Navigation**: Click on a report to view details
- **Direct Links**: Test deep links like `/report/{slug}`
- **Loading States**: Should show loading indicators while fetching data
- **Error Handling**: Should gracefully handle any errors

### 4. Verify Data Source
- Reports should be loaded from Convex (not mock data)
- Data should match what's in the Convex database
- Check that GitHub-ingested reports appear correctly

## Routing Configuration

The `vercel.json` file ensures client-side routing works correctly:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This configuration:
- Redirects all routes to `index.html`
- Allows React Router to handle navigation
- Enables direct navigation to `/report/{slug}` URLs

## Troubleshooting

### Build Fails

**Issue**: Build fails with TypeScript errors
```
Solution: Run `npm run build` locally to identify issues
```

**Issue**: Missing dependencies
```
Solution: Ensure package.json includes all required dependencies
Run: npm install
```

### Environment Variable Issues

**Issue**: "VITE_CONVEX_URL is not set" error
```
Solution: 
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add VITE_CONVEX_URL=https://third-lark-419.convex.cloud
3. Redeploy the project
```

**Issue**: "VITE_CONVEX_URL points to wrong deployment" error
```
Solution: 
The app has validation to ensure only third-lark-419 is used.
Check that VITE_CONVEX_URL is exactly: https://third-lark-419.convex.cloud
```

### Routing Issues

**Issue**: Direct navigation to `/report/{slug}` returns 404
```
Solution: 
Ensure vercel.json exists in the site directory with correct rewrites configuration
```

**Issue**: Page refreshes lose state
```
Solution: 
This is expected behavior for client-side routing
Data is refetched from Convex on page load
```

### Data Loading Issues

**Issue**: No reports appear
```
Solution:
1. Check Convex connection in browser console
2. Verify reports exist in Convex: npx convex data reports
3. Run ingestion if needed: node scripts/ingest-reports.mjs
```

**Issue**: Old/stale data appears
```
Solution:
1. Run fresh ingestion from GitHub: node scripts/ingest-reports.mjs
2. Clear browser cache and reload
```

## Continuous Deployment

Vercel automatically deploys on every push to the connected GitHub repository.

### Automatic Deployments

- **Production**: Deploys from `main` or `master` branch
- **Preview**: Deploys from pull requests and other branches

### Manual Redeployment

If you need to redeploy without code changes:

1. **Via Dashboard**:
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Select "Redeploy"

2. **Via CLI**:
   ```bash
   cd c:\dev\jobs\site
   vercel --prod
   ```

## Performance Optimization

### Current Build Size
- **HTML**: ~0.47 kB
- **CSS**: ~41.72 kB (7.78 kB gzipped)
- **JS**: ~507.70 kB (150.78 kB gzipped)

### Optimization Recommendations

1. **Code Splitting**: Consider lazy loading routes
2. **Image Optimization**: Use Vercel's image optimization
3. **Caching**: Static assets are cached for 1 year (configured in vercel.json)

## Security Considerations

### Environment Variables
- Never commit `.env` to Git (already in `.gitignore`)
- Use Vercel's environment variable management
- Rotate Convex deploy keys if compromised

### HTTPS
- Vercel provides automatic HTTPS
- All traffic is encrypted by default

### CORS
- Convex handles CORS automatically
- No additional configuration needed

## Monitoring

### Vercel Analytics
- Enable in Project Settings → Analytics
- Track page views, performance, and errors

### Convex Dashboard
- Monitor function calls and errors
- View logs at [dashboard.convex.dev](https://dashboard.convex.dev)

## Custom Domain (Optional)

To add a custom domain:

1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records as instructed
4. Wait for DNS propagation (~24-48 hours)

## Rollback

If a deployment causes issues:

1. Go to Deployments tab
2. Find a previous working deployment
3. Click "..." → "Promote to Production"

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Convex Docs**: [docs.convex.dev](https://docs.convex.dev)
- **GitHub Issues**: Report issues in the repository

## Deployment Checklist

Before deploying, ensure:

- [ ] Code builds successfully locally (`npm run build`)
- [ ] Environment variables are configured in Vercel
- [ ] `vercel.json` exists with routing configuration
- [ ] Convex backend is deployed and accessible
- [ ] GitHub repo has latest code
- [ ] No sensitive data in committed files
- [ ] All tests pass (if applicable)

## Success Criteria

Deployment is successful when:

✅ Build completes without errors  
✅ App loads at Vercel URL  
✅ Convex connection established (check console)  
✅ Reports load from Convex database  
✅ Navigation works (including deep links)  
✅ No console errors  
✅ Loading and error states work correctly  

---

**Last Updated**: April 2026  
**Convex Deployment**: `third-lark-419`  
**Repository**: `https://github.com/mccaigs/jobs`
