# Deployment Guide

Quick reference for deploying the Faceless Video Bot to production.

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations completed
- [ ] Admin user created
- [ ] At least one platform account tested
- [ ] Telegram bot configured (optional)
- [ ] API keys verified

## Deploy to Vercel

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy

```bash
# First deployment
vercel

# Production deployment
vercel --prod
```

### 4. Set Environment Variables

```bash
# Set individual variables
vercel env add DATABASE_URL
vercel env add OPENAI_API_KEY
vercel env add KLING_AI_API_KEY
# ... add all other variables

# Or use the dashboard
# Vercel Dashboard → Project → Settings → Environment Variables
```

Required environment variables:
- `DATABASE_URL`
- `JWT_SECRET`
- `ENCRYPTION_KEY`
- `OPENAI_API_KEY`
- `KLING_AI_API_KEY`
- `BLOB_READ_WRITE_TOKEN`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `CRON_SECRET`

### 5. Set Up Vercel Blob Storage

```bash
# In Vercel Dashboard
# Storage → Create Database → Blob
# Copy the token and add to environment variables
```

### 6. Configure Database

```bash
# Pull environment variables
vercel env pull .env.production

# Run database migrations
DATABASE_URL="your-production-db-url" npm run db:push
```

### 7. Verify Deployment

Visit your deployment URL and:
1. Login with admin credentials
2. Configure at least one platform
3. Test video generation
4. Verify cron job is scheduled

## Post-Deployment

### Monitor Logs

```bash
# Real-time logs
vercel logs --follow

# Recent logs
vercel logs
```

### Test Cron Job

```bash
curl -X GET \
  https://your-app.vercel.app/api/cron/generate-and-post \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Set Up Monitoring

1. **Vercel Analytics**
   - Automatically enabled
   - View in Vercel Dashboard

2. **Error Tracking** (optional)
   - Integrate Sentry
   - Add `SENTRY_DSN` to environment variables

3. **Uptime Monitoring** (optional)
   - Use UptimeRobot or similar
   - Monitor main dashboard URL

## Update Deployment

```bash
# After making changes
git add .
git commit -m "Your changes"
git push origin main

# Vercel will auto-deploy

# Or manual deploy
vercel --prod
```

## Environment-Specific Settings

### Development
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production
```env
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## Troubleshooting

### Build Fails

Check:
- All dependencies in package.json
- TypeScript errors: `npm run build`
- Prisma schema: `npx prisma validate`

### Runtime Errors

Check:
- Environment variables set correctly
- Database connection string
- API keys valid
- Vercel logs: `vercel logs`

### Cron Job Not Running

Check:
- `vercel.json` committed to repository
- `CRON_SECRET` environment variable set
- Cron job visible in Vercel Dashboard → Cron Jobs

## Scaling Considerations

### Database

- Use connection pooling
- Consider Prisma Accelerate for serverless
- Monitor query performance

### API Rate Limits

- Implement request queuing
- Add rate limiting
- Cache responses where possible

### Cost Optimization

- Monitor Vercel usage
- Optimize bundle size
- Use Edge Functions where possible
- Implement caching strategy

## Backup Strategy

### Database Backups

```bash
# Automated backups (if using Vercel Postgres)
# Enabled by default

# Manual backup
pg_dump $DATABASE_URL > backup.sql
```

### Environment Variables

```bash
# Backup environment variables
vercel env pull .env.backup
```

### Code Repository

```bash
# Ensure GitHub repository is up to date
git push origin main
```

## Rollback Procedure

### Revert to Previous Deployment

```bash
# In Vercel Dashboard
# Deployments → Select previous deployment → Promote to Production

# Or via CLI
vercel rollback
```

### Database Rollback

```bash
# Restore from backup
psql $DATABASE_URL < backup.sql
```

## Security Checklist

- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Environment variables secured
- [ ] API keys rotated regularly
- [ ] Database access restricted
- [ ] CRON_SECRET set and secure
- [ ] Rate limiting implemented
- [ ] Input validation in place

## Performance Optimization

1. **Enable Caching**
   ```typescript
   // In API routes
   export const revalidate = 60 // Cache for 60 seconds
   ```

2. **Optimize Images**
   - Use Next.js Image component
   - Implement lazy loading

3. **Database Optimization**
   - Add indexes to frequently queried fields
   - Use connection pooling
   - Optimize queries

4. **Edge Functions**
   - Move non-database operations to edge
   - Reduce cold start times

## Monitoring Checklist

- [ ] Vercel Analytics enabled
- [ ] Error tracking configured
- [ ] Uptime monitoring active
- [ ] Telegram notifications working
- [ ] Database performance monitored
- [ ] API usage tracked
- [ ] Cost alerts set up

---

For more detailed information, see [SETUP_GUIDE.md](./SETUP_GUIDE.md) and [README.md](./README.md).
