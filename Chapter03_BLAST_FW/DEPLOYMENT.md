# Phase 5: Trigger - Deployment & Next Steps

## Current Status
✅ **Phases 0-4 Complete**: Project fully designed and implemented according to BLAST framework
🔄 **Phase 5: Trigger**: Ready for deployment and automation setup

## Pre-Deployment Checklist

### 1. Verify Environment Setup
```bash
# Check Node.js version (should be 16+)
node --version
npm --version

# Install dependencies
npm install

# Verify no build errors
npm run build
```

### 2. Test with Real Credentials
Before deploying, test the app locally with actual Jira and GROQ credentials:

1. Create `.env` file:
   ```
   JIRA_URL=https://your-domain.atlassian.net
   JIRA_EMAIL=your-email@example.com
   JIRA_TOKEN=your-api-token
   GROQ_KEY=your-groq-api-key
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Test the workflow:
   - Go to Settings tab
   - Enter all credentials
   - Go to Generator tab
   - Enter a known Jira issue ID
   - Click "Fetch Issue" and verify data loads
   - Click "Generate Test Plan" and verify AI output
   - Download or copy the result

### 3. Verify API Connectivity
- ✅ Jira API responds to authentication
- ✅ GROQ API accepts requests and generates content
- ✅ No network errors or timeouts
- ✅ Rate limits are not exceeded

## Deployment Options

### Option 1: Vercel (Recommended)
1. Push code to GitHub
2. Visit https://vercel.com
3. Click "Import Project"
4. Select the repository
5. Set environment variables in Vercel settings
6. Deploy

### Option 2: Netlify
1. Push code to GitHub
2. Visit https://netlify.com
3. Click "New site from Git"
4. Select the repository
5. Set environment variables in build & deploy settings
6. Deploy

### Option 3: GitHub Pages
1. Update `vite.config.ts`:
   ```typescript
   export default defineConfig({
     base: '/AITesterProgram/Chapter03_BLAST_FW/',
     // ... rest of config
   })
   ```

2. Run:
   ```bash
   npm run build
   git add dist/
   git commit -m "Deploy to GitHub Pages"
   git push
   ```

### Option 4: Self-Hosted (Docker)
1. Create `Dockerfile`:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "run", "preview"]
   ```

2. Build and run:
   ```bash
   docker build -t jira-test-plan-generator .
   docker run -p 3000:3000 \
     -e JIRA_URL=... \
     -e JIRA_EMAIL=... \
     -e JIRA_TOKEN=... \
     -e GROQ_KEY=... \
     jira-test-plan-generator
   ```

## Environment Variables for Production

Set these in your deployment platform:

| Variable | Value | Type |
|----------|-------|------|
| JIRA_URL | https://your-domain.atlassian.net | String |
| JIRA_EMAIL | your-email@example.com | String |
| JIRA_TOKEN | Your Jira API token | Secret |
| GROQ_KEY | Your GROQ API key | Secret |

**Important**: Never commit `.env` file to Git. Use `.env.example` as reference.

## Post-Deployment

### 1. Verify Deployment
- Visit deployed URL
- Test all features (fetch, generate, download, copy)
- Verify no console errors
- Test on multiple browsers

### 2. Set Up Error Tracking (Optional)
Add error tracking for production:

```bash
npm install @sentry/react @sentry/tracing
```

In `src/main.tsx`:
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
});
```

### 3. Monitor API Usage
- Track GROQ API quota usage (https://console.groq.com)
- Monitor Jira API rate limits
- Set up alerts for high usage

### 4. Create CI/CD Pipeline

#### GitHub Actions Example
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Maintenance Log

### Template (Update in `gemini.md` after deployment)

```markdown
## Maintenance Log

### Deployment: [DATE]
- ✅ Deployed to [PLATFORM]
- ✅ All tests passed
- ✅ Error tracking set up
- Notes: [Any issues or learnings]

### Updates: [DATE]
- Fixed: [Issue]
- Added: [Feature]
- Changed: [Config]
- Notes: [Any issues or learnings]
```

## Troubleshooting Deployment

### Build Fails
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Environment Variables Not Loading
- Verify variables are set in deployment platform
- Check variable names match exactly
- Ensure secrets are marked as "Secret" not "Public"

### CORS Issues
If you see CORS errors:
1. Verify Jira URL allows cross-origin requests
2. Check GROQ API CORS headers
3. Consider using a backend proxy if needed

### Performance Issues
- Check bundle size: `npm run build` shows output size
- Use Lighthouse in Chrome DevTools
- Optimize images and assets
- Consider code splitting

## Version Control

### Git Setup
```bash
git init
git add .
git commit -m "Initial commit: BLAST Phase 0-4 complete"
git remote add origin https://github.com/your-org/repo
git push -u origin main
```

### Branching Strategy
- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: Feature branches
- `fix/*`: Bug fix branches

## Documentation Updates

After deployment, update:
1. ✅ `progress.md` - Add deployment info
2. ✅ `findings.md` - Add learnings
3. ✅ `gemini.md` - Add maintenance log
4. ✅ `README_APP.md` - Add deployed URL

## Next Steps & Enhancements

### Immediate (After Phase 5)
1. Monitor application in production
2. Collect user feedback
3. Fix any bugs discovered
4. Update documentation

### Short Term (1-2 weeks)
1. Add batch processing (multiple issues)
2. Add custom template selection
3. Add test plan versioning
4. Add PDF export

### Medium Term (1-2 months)
1. Jira comment posting (post test plan back)
2. Integration with other ALM tools
3. Custom LLM prompt builder
4. Test case database integration

### Long Term
1. Mobile app version
2. Browser extension
3. Slack integration
4. Enterprise features (SAML, audit logs)

## Rollback Plan

If deployment fails:

```bash
# Vercel
vercel rollback

# GitHub Pages
git revert HEAD
git push

# Netlify
# Use Netlify Dashboard > Deploys > Rollback
```

## Success Criteria for Phase 5
- ✅ Application deployed to production
- ✅ All features working end-to-end
- ✅ Error tracking enabled
- ✅ CI/CD pipeline operational
- ✅ Maintenance log documented
- ✅ Team trained on usage
- ✅ Backup and recovery procedures in place

## Support & Maintenance

### For Bugs
1. File issue in GitHub
2. Tag with `bug` label
3. Include error message and steps to reproduce
4. Assign to team member

### For Features
1. Discuss in team
2. Update task_plan.md
3. Create feature branch
4. Follow BLAST framework for changes

### For Maintenance
1. Keep dependencies updated (`npm update`)
2. Monitor API changes from Jira and GROQ
3. Review and update SOPs quarterly
4. Test with new Jira versions

## References
- BLAST Framework: See `B.L.A.S.T.md`
- Architecture: See `architecture/` folder
- Schema: See `gemini.md`
- Progress: See `progress.md`
- App Guide: See `README_APP.md`

## Sign-Off

**Phase 5 Complete When:**
- ✅ Application deployed and accessible
- ✅ All tests pass in production
- ✅ Documentation updated
- ✅ Team trained
- ✅ Maintenance procedures documented

---

**Date Started**: [DATE]
**Date Completed**: [DATE]
**Deployed URL**: [URL]
**Status**: 🟢 Ready for Production
