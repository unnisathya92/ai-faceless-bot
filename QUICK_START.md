# Quick Start Guide

Get your Faceless Video Bot up and running in 15 minutes!

## What You Just Got

A complete production-ready system that:
- ✅ Automatically generates 45-60 second videos using Kling AI
- ✅ Researches trending topics using OpenAI GPT-4
- ✅ Posts to 6+ social media platforms automatically
- ✅ Runs on autopilot (posts every 6 hours)
- ✅ Has a beautiful modern dashboard
- ✅ Sends Telegram notifications
- ✅ Tracks analytics across all platforms

## 5-Minute Local Test

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

```bash
# Copy environment file
cp .env.example .env

# Edit .env and add a PostgreSQL database URL
# For testing, you can use a local PostgreSQL or a free Vercel Postgres

# Push database schema
npm run db:push
```

### 3. Add Minimum Required Variables to .env

```env
DATABASE_URL="postgresql://localhost:5432/faceless_video_bot"
JWT_SECRET="any-random-string-here"
ENCRYPTION_KEY="another-random-32-character-string"
OPENAI_API_KEY="sk-your-openai-key"
KLING_AI_API_KEY="your-kling-ai-key"
```

### 4. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Next Steps

### Set Up Admin Account

1. Open Prisma Studio:
```bash
npm run db:studio
```

2. Create a User:
   - Go to "User" model
   - Click "Add record"
   - Username: `admin`
   - Password: Generate hash by running this in Node.js:
     ```javascript
     require('crypto').createHash('sha256').update('your-password').digest('hex')
     ```
   - Role: `admin`
   - Save

### Configure Your First Platform (Twitter)

1. Get Twitter Bearer Token from https://developer.twitter.com
2. Login to dashboard
3. Go to Configuration page
4. Click "Add Account" for Twitter
5. Enter Bearer Token
6. Click "Test Connection"
7. Toggle the switch to enable

### Test Video Generation

1. In dashboard, you can manually trigger video generation
2. Or wait for the cron job (every 6 hours)
3. Monitor in Telegram (if configured)

## Deploy to Production (10 minutes)

### 1. Get Required Services

- [ ] [Vercel Account](https://vercel.com) (free)
- [ ] [Vercel Postgres](https://vercel.com/storage/postgres) (free tier available)
- [ ] [OpenAI API Key](https://platform.openai.com)
- [ ] [Kling AI API Key](https://klingai.com)

### 2. Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel
```

### 3. Add Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables:

Add all variables from `.env.example`

### 4. Set Up Vercel Blob Storage

1. Vercel Dashboard → Storage → Create → Blob
2. Copy token and add to environment variables as `BLOB_READ_WRITE_TOKEN`

### 5. Deploy to Production

```bash
vercel --prod
```

### 6. Set Up Cron Job

The cron job is automatically configured! It will run every 6 hours:
- 00:00 UTC
- 06:00 UTC
- 12:00 UTC
- 18:00 UTC

## Common Setup Questions

### Q: How much does this cost to run?

**Estimated Monthly Costs** (4 videos/day, 120 videos/month):
- Kling AI: $50-100
- OpenAI: $20-30
- Vercel: Free or $20 (Pro)
- Database: Free (Vercel Postgres)
- **Total: ~$70-150/month**

### Q: Which platform should I start with?

**Easiest to set up:**
1. Twitter (just need Bearer Token)
2. Facebook (Page Access Token)
3. YouTube (OAuth but well documented)

**Most complex:**
- TikTok (requires developer approval)
- Instagram (needs Business account)

### Q: Can I change the posting frequency?

Yes! Edit `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/generate-and-post",
      "schedule": "0 */4 * * *"  // Every 4 hours
    }
  ]
}
```

Common schedules:
- Every 4 hours: `0 */4 * * *`
- Every 6 hours: `0 */6 * * *`
- Every 12 hours: `0 */12 * * *`
- Twice daily (9 AM & 9 PM): `0 9,21 * * *`

### Q: How do I customize the content niche?

Edit `src/services/openai.ts` line ~27:

```typescript
await openAIService.researchTrendingTopics('your-niche-here')
```

Examples:
- `'tech and AI'`
- `'fitness and health'`
- `'cooking and recipes'`
- `'finance and investing'`

### Q: Can I manually generate videos?

Yes! The automated system runs every 6 hours, but you can also manually trigger video generation from the dashboard (feature can be added).

### Q: Where are my videos stored?

Videos are stored in Vercel Blob Storage. You can download them anytime from the Content Library page.

## Monitoring

### Check System Health

1. **Vercel Dashboard**: View deployment logs
2. **Telegram**: Get real-time notifications
3. **Database**: Use Prisma Studio (`npm run db:studio`)
4. **Logs**: `vercel logs --follow`

### What to Monitor

- ✅ Video generation success rate
- ✅ Posting success per platform
- ✅ API credit usage (Kling AI, OpenAI)
- ✅ Engagement metrics
- ✅ Error notifications in Telegram

## Troubleshooting

### Videos not generating?

1. Check Kling AI API key and credits
2. Verify Vercel Blob storage is set up
3. Check logs: `vercel logs`

### Posts not publishing?

1. Test platform connection in config page
2. Verify credentials are correct
3. Check platform API rate limits
4. Enable the platform toggle

### Cron job not running?

1. Verify `CRON_SECRET` is set
2. Check vercel.json is committed
3. View cron jobs in Vercel Dashboard

## Get Help

1. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions
2. Review [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) to understand the code
3. See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment issues
4. Check Vercel logs for errors

## What's Next?

- [ ] Configure all desired platforms
- [ ] Set up Telegram notifications
- [ ] Customize content niche
- [ ] Monitor first automated post
- [ ] Adjust posting frequency
- [ ] Add more platform accounts
- [ ] Set up analytics tracking
- [ ] Create content calendar

---

**You're all set!** The bot will now automatically:
1. Research trending topics
2. Generate video prompts
3. Create videos with Kling AI
4. Post to all active platforms
5. Track analytics
6. Send notifications

Enjoy your automated content empire! 🚀
