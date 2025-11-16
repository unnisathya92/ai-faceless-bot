# Complete Setup Guide - Faceless Video Bot

This guide will walk you through setting up the Faceless Video Bot from scratch.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Platform API Setup](#platform-api-setup)
4. [Deployment](#deployment)
5. [Testing](#testing)
6. [Going Live](#going-live)

## Prerequisites

### Required Accounts

- [ ] GitHub account
- [ ] Vercel account
- [ ] OpenAI account
- [ ] Kling AI account
- [ ] PostgreSQL database (Vercel Postgres recommended)
- [ ] Telegram account (for notifications)

### Social Media Accounts

Choose which platforms you want to use:
- [ ] Twitter/X Developer Account
- [ ] Instagram Business Account
- [ ] TikTok Developer Account
- [ ] YouTube Channel
- [ ] Facebook Page
- [ ] Snapchat Developer Account

## Initial Setup

### Step 1: Clone Repository

```bash
git clone <your-repo-url>
cd ai-faceless-bot
npm install
```

### Step 2: Database Setup

#### Option A: Vercel Postgres (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Storage" → "Create Database"
3. Select "Postgres"
4. Copy the connection string
5. Add to `.env`:
```env
DATABASE_URL="postgres://default:xxx@xxx-xxx.postgres.vercel-storage.com:5432/verceldb"
```

#### Option B: Supabase

1. Go to [Supabase](https://supabase.com)
2. Create new project
3. Get connection string from Settings → Database
4. Add to `.env`

#### Option C: Local PostgreSQL

1. Install PostgreSQL locally
2. Create database:
```sql
CREATE DATABASE faceless_video_bot;
```
3. Add to `.env`:
```env
DATABASE_URL="postgresql://localhost:5432/faceless_video_bot"
```

### Step 3: Environment Variables

Create `.env` file:

```bash
cp .env.example .env
```

Fill in the following (we'll get the API keys in next steps):

```env
DATABASE_URL="your-database-url"
JWT_SECRET="generate-random-32-char-string"
ENCRYPTION_KEY="generate-random-32-char-string"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Generate random secrets:
```bash
# On Mac/Linux
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Step 4: Initialize Database

```bash
npm run db:push
```

This creates all tables in your database.

### Step 5: Create Admin User

Open Prisma Studio:
```bash
npm run db:studio
```

1. Go to the `User` model
2. Click "Add record"
3. Fill in:
   - `username`: admin
   - `password`: Run this in Node.js console to get hash:
     ```javascript
     const crypto = require('crypto')
     console.log(crypto.createHash('sha256').update('your-password').digest('hex'))
     ```
   - `role`: admin
4. Save

## Platform API Setup

### OpenAI Setup

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Navigate to API Keys
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. Add to `.env`:
```env
OPENAI_API_KEY="sk-..."
```

### Kling AI Setup

1. Visit [Kling AI](https://klingai.com)
2. Sign up and verify email
3. Go to API section
4. Generate API key
5. Add to `.env`:
```env
KLING_AI_API_KEY="your-kling-key"
KLING_AI_API_URL="https://api.kling.ai/v1"
```

### Telegram Bot Setup (Optional but Recommended)

1. Open Telegram and search for `@BotFather`
2. Send `/newbot`
3. Follow prompts to create bot
4. Copy the token
5. Send a message to your bot
6. Get your chat ID:
   - Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Find `"chat":{"id":123456789}` in the response
7. Add to `.env`:
```env
TELEGRAM_BOT_TOKEN="123456:ABC..."
TELEGRAM_CHAT_ID="123456789"
```

### Twitter/X API Setup

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Sign up for Developer account (may take 1-2 days for approval)
3. Create a new App
4. Go to "Keys and Tokens"
5. Generate Bearer Token
6. **Save this token** - you'll need it for the dashboard

### Instagram API Setup

1. Convert your Instagram account to Business:
   - Instagram app → Settings → Account → Switch to Professional Account
2. Connect to a Facebook Page
3. Go to [Meta for Developers](https://developers.facebook.com)
4. Create an App → "Business" type
5. Add Instagram Basic Display and Instagram Graph API
6. Get Long-Lived Access Token:
   - Use [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
   - Select your app
   - Generate token with permissions: `instagram_basic`, `instagram_content_publish`
7. Get Instagram Business Account ID:
   - Use Graph API: `GET /<your_fb_page_id>?fields=instagram_business_account`
8. **Save both** - you'll add them in the dashboard

### TikTok API Setup

1. Go to [TikTok for Developers](https://developers.tiktok.com)
2. Register as a developer
3. Create new app
4. Request "Content Posting API" access
5. After approval, implement OAuth flow:
   ```
   https://www.tiktok.com/auth/authorize/
     ?client_key=YOUR_CLIENT_KEY
     &response_type=code
     &scope=user.info.basic,video.upload,video.publish
     &redirect_uri=YOUR_REDIRECT_URI
   ```
6. Exchange code for access token
7. **Save access token** for dashboard

### YouTube API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project
3. Enable YouTube Data API v3
4. Create OAuth 2.0 Credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/auth/youtube/callback`
5. Download credentials JSON
6. Use OAuth Playground to get refresh token:
   - Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
   - Click settings (gear icon) → Use your own OAuth credentials
   - Enter your Client ID and Secret
   - Authorize APIs → YouTube Data API v3
   - Select scope: `https://www.googleapis.com/auth/youtube.upload`
   - Exchange authorization code for tokens
7. **Save Client ID, Client Secret, and Refresh Token**

### Facebook API Setup

1. Create a Facebook Page (if you don't have one)
2. Go to [Meta for Developers](https://developers.facebook.com)
3. Create Business App
4. Add "Facebook Login" product
5. Generate Page Access Token:
   - Graph API Explorer → Select your app
   - Get Token → Select your page
   - Generate with permissions: `pages_manage_posts`, `pages_read_engagement`
6. Get Page ID:
   - Go to your Facebook Page
   - Settings → Page Info
7. **Save Access Token and Page ID**

### Snapchat API Setup

1. Go to [Snap Kit](https://kit.snapchat.com)
2. Create developer account
3. Create app
4. Request Creative Kit access
5. Follow OAuth flow to get access token
6. **Save access token**

## Deployment

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo>
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
5. Click "Deploy"

### Step 3: Add Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables:

Add all variables from your `.env` file:

```env
DATABASE_URL
JWT_SECRET
ENCRYPTION_KEY
OPENAI_API_KEY
KLING_AI_API_KEY
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
CRON_SECRET
```

Generate a random CRON_SECRET:
```bash
openssl rand -hex 32
```

### Step 4: Set Up Vercel Blob Storage

1. Vercel Dashboard → Your Project → Storage
2. Create → Blob
3. Copy the token
4. Add to environment variables:
```env
BLOB_READ_WRITE_TOKEN="vercel_blob_..."
```

### Step 5: Redeploy

After adding environment variables:
```bash
vercel --prod
```

Or trigger redeploy from Vercel Dashboard.

### Step 6: Run Database Migrations

```bash
# Install Vercel CLI if not already
npm i -g vercel

# Pull environment variables
vercel env pull .env.local

# Run migrations
npm run db:push
```

## Testing

### Test Locally

1. Start dev server:
```bash
npm run dev
```

2. Visit `http://localhost:3000`

3. Login with admin credentials

4. Go to Configuration page

5. Add one platform (Twitter is easiest):
   - Click "Add Account"
   - Enter Bearer Token
   - Save
   - Click "Test Connection"

6. Generate a test video:
   - Use the Generate Video button
   - Monitor in dashboard
   - Check Telegram for notifications

### Test on Vercel

1. Visit your Vercel deployment URL
2. Login
3. Configure platforms
4. Test video generation
5. Monitor Vercel logs:
```bash
vercel logs --follow
```

## Going Live

### Checklist Before Going Live

- [ ] All platform accounts configured and tested
- [ ] Telegram notifications working
- [ ] Test video generated successfully
- [ ] Test post to at least one platform successful
- [ ] Database backups configured
- [ ] Environment variables secured
- [ ] Cron job tested manually
- [ ] Error monitoring set up

### Enable Automated Posting

The cron job is automatically configured in `vercel.json` to run every 6 hours:

```json
{
  "crons": [
    {
      "path": "/api/cron/generate-and-post",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

To test the cron job manually:

```bash
curl -X GET \
  https://your-app.vercel.app/api/cron/generate-and-post \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Monitor First 24 Hours

1. Check Telegram for notifications
2. Monitor Vercel logs
3. Verify posts appear on platforms
4. Check analytics are being tracked
5. Monitor API credit usage

### Scaling Tips

1. **Increase Posting Frequency**:
   - Edit `vercel.json` cron schedule
   - Ensure sufficient API credits

2. **Add More Platforms**:
   - Configure additional accounts in dashboard
   - Test each before enabling

3. **Optimize Costs**:
   - Monitor Kling AI usage
   - Cache trending topics
   - Reuse top-performing content

4. **Improve Performance**:
   - Use Vercel Edge Functions
   - Implement caching
   - Optimize database queries

## Troubleshooting

### Common Issues

**"Connection refused" errors**:
- Check DATABASE_URL is correct
- Verify database is accessible
- Check Vercel environment variables

**"Unauthorized" API errors**:
- Verify API keys are correct
- Check tokens haven't expired
- Test connection in config page

**Videos not generating**:
- Check Kling AI credits
- Verify API key is valid
- Check Vercel Blob storage is configured

**Posts not publishing**:
- Test platform connection
- Check account permissions
- Verify OAuth tokens are valid

**Cron job not running**:
- Check CRON_SECRET is set
- Verify vercel.json is committed
- Check Vercel cron logs

## Next Steps

1. Configure all desired platforms
2. Monitor first few automated posts
3. Adjust posting schedule if needed
4. Customize content niche
5. Set up analytics monitoring
6. Create backup strategy

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Review database in Prisma Studio
3. Test API endpoints individually
4. Check Telegram for error notifications
5. Refer to README.md for API documentation

---

You're all set! The bot will now automatically generate and post videos every 6 hours. Monitor the dashboard and Telegram for updates.
