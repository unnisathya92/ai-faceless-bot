# Faceless Video Bot - Automated Content Generation System

A complete automated faceless video content generation and posting system powered by Kling AI and OpenAI GPT-4. Automatically generates viral video content and posts to multiple social media platforms every 6 hours.

## Features

- **Automated Video Generation**: Uses Kling AI to generate 45-60 second videos
- **AI-Powered Content Research**: OpenAI GPT-4 researches trending topics daily
- **Multi-Platform Posting**: Supports Twitter/X, Instagram, TikTok, YouTube, Facebook, and Snapchat
- **Beautiful Dashboard**: Modern Next.js 14 dashboard with real-time analytics
- **Configuration Management**: Easy platform account setup and management
- **Telegram Notifications**: Real-time updates on video generation and posting status
- **Analytics Tracking**: Comprehensive analytics across all platforms
- **Automated Scheduling**: Posts every 6 hours automatically via Vercel Cron Jobs
- **Production Ready**: Full error handling, retries, and monitoring

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM, PostgreSQL
- **AI Services**: Kling AI (video generation), OpenAI GPT-4 (content research)
- **Storage**: Vercel Blob Storage
- **Deployment**: Vercel (with Cron Jobs)
- **Notifications**: Telegram Bot API

## Prerequisites

1. **Node.js** 18+ and npm
2. **PostgreSQL** database (e.g., Vercel Postgres, Supabase, or local)
3. **Kling AI API Key** - [Sign up at Kling AI](https://klingai.com)
4. **OpenAI API Key** - [Get from OpenAI](https://platform.openai.com)
5. **Vercel Account** - For deployment and blob storage
6. **Social Media Platform API Credentials** (see setup guide below)

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd ai-faceless-bot
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/faceless_video_bot"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
ENCRYPTION_KEY="your-32-character-encryption-key"

# AI Services
OPENAI_API_KEY="sk-..."
KLING_AI_API_KEY="your-kling-ai-key"

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="vercel_blob_..."

# Telegram (optional but recommended)
TELEGRAM_BOT_TOKEN="your-bot-token"
TELEGRAM_CHAT_ID="your-chat-id"

# Cron Job Security
CRON_SECRET="random-secret-for-cron-jobs"
```

### 3. Set Up Database

```bash
# Push database schema
npm run db:push

# Or run migrations
npm run db:migrate
```

### 4. Create Admin User

Create a user directly in the database or use Prisma Studio:

```bash
npm run db:studio
```

Then create a user with:
- Username: `admin`
- Password: Use the hashed output from running `hashPassword("your-password")` in the encryption utility

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the dashboard.

## Platform Setup Guide

### Twitter/X

1. Go to [Twitter Developer Portal](https://developer.twitter.com)
2. Create a new app
3. Get your Bearer Token from "Keys and Tokens"
4. In the dashboard config page, add your Twitter account with the Bearer Token

### Instagram

1. Set up a Facebook Business account
2. Convert your Instagram to a Business account
3. Get an Access Token from [Meta for Developers](https://developers.facebook.com)
4. Get your Business Account ID from Instagram settings
5. Add credentials in the config page

### TikTok

1. Register at [TikTok for Developers](https://developers.tiktok.com)
2. Create an app and get credentials
3. Implement OAuth flow to get Access Token
4. Add credentials in the config page

### YouTube

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable YouTube Data API v3
3. Create OAuth 2.0 credentials
4. Get Client ID, Client Secret, and Refresh Token
5. Add credentials in the config page

### Facebook

1. Create a Facebook Page
2. Get Access Token from [Meta for Developers](https://developers.facebook.com)
3. Get your Page ID from Page settings
4. Add credentials in the config page

### Snapchat

1. Register at [Snap Kit Developer Portal](https://kit.snapchat.com)
2. Create an app
3. Get Access Token
4. Add credentials in the config page

## Deployment to Vercel

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Deploy

```bash
vercel
```

### 3. Set Up Environment Variables

In Vercel Dashboard:
1. Go to your project → Settings → Environment Variables
2. Add all variables from `.env.example`
3. Make sure to add `CRON_SECRET` for cron job authentication

### 4. Set Up Database

Use Vercel Postgres or connect to an external PostgreSQL database:

```bash
# After deployment, run migrations
vercel env pull
npm run db:push
```

### 5. Enable Cron Jobs

Vercel automatically enables cron jobs from `vercel.json`. The system will:
- Run every 6 hours (at 00:00, 06:00, 12:00, 18:00 UTC)
- Research trending topics
- Generate videos with Kling AI
- Post to all active platforms

## Dashboard Usage

### Main Dashboard
- View real-time statistics
- See platform performance
- Monitor system status
- Quick access to all features

### Configuration Page
- Add/edit platform accounts
- Toggle platforms on/off
- Test connections
- Manage credentials securely

### Analytics Page
- View detailed metrics per platform
- Track engagement rates
- Monitor viral content
- Export data

### Content Library
- Browse all generated videos
- See posting status per platform
- Download videos
- Manually repost content

## API Routes

### Authentication
- `POST /api/auth/login` - Admin login

### Accounts
- `GET /api/accounts` - List all accounts
- `POST /api/accounts` - Create account
- `PUT /api/accounts` - Update account
- `DELETE /api/accounts` - Delete account
- `POST /api/accounts/test` - Test connection

### Videos
- `POST /api/videos/generate` - Generate new video
- `GET /api/videos/status` - Check video status

### Posts
- `POST /api/posts/create` - Post video to platforms

### Analytics
- `GET /api/analytics` - Get analytics data

### Cron Jobs
- `GET /api/cron/generate-and-post` - Automated content generation (secured with CRON_SECRET)

## Telegram Bot Commands

Once configured, you can control the bot via Telegram:

- `/status` - Show all platform statuses
- `/stats` - Today's statistics
- `/pause` - Pause all posting
- `/resume` - Resume posting
- `/balance` - Check API credits
- `/help` - Show help message

## Customization

### Posting Frequency

Edit `vercel.json` to change the posting schedule:

```json
{
  "crons": [
    {
      "path": "/api/cron/generate-and-post",
      "schedule": "0 */6 * * *"  // Change this cron expression
    }
  ]
}
```

Common schedules:
- Every 6 hours: `0 */6 * * *`
- Every 4 hours: `0 */4 * * *`
- Twice daily: `0 9,21 * * *`

### Video Settings

Modify video generation in `src/services/kling-ai.ts`:
- Duration: 45-60 seconds
- Aspect ratio: 9:16 (default for mobile), 16:9, or 1:1
- Style: realistic, animated, etc.

### Content Niche

Edit trending topic research in `src/services/openai.ts`:
```typescript
await openAIService.researchTrendingTopics('your-niche')
```

## Monitoring

### Telegram Notifications

The system sends notifications for:
- Video generation complete/failed
- Post success/failure
- Daily performance summary
- Viral alerts (when views exceed threshold)
- Error alerts
- Credit warnings

### Vercel Logs

Monitor in real-time:
```bash
vercel logs --follow
```

### Database Monitoring

Use Prisma Studio:
```bash
npm run db:studio
```

## Troubleshooting

### Video Generation Fails

1. Check Kling AI API key and credits
2. Verify API endpoint is correct
3. Check Vercel Blob storage is configured
4. Review error logs

### Posting Fails

1. Test platform connection in config page
2. Verify credentials are correct and not expired
3. Check platform API rate limits
4. Ensure account has posting permissions

### Cron Job Not Running

1. Verify `CRON_SECRET` is set
2. Check Vercel cron job logs
3. Ensure deployment is successful
4. Verify `vercel.json` is correct

### Database Connection Issues

1. Verify `DATABASE_URL` is correct
2. Check database is accessible from Vercel
3. Run migrations: `npm run db:push`
4. Check connection pooling settings

## Cost Estimation

Estimated monthly costs for running this system (4 videos/day):

- **Kling AI**: ~$50-100 (120 videos/month)
- **OpenAI GPT-4**: ~$20-30 (API calls for prompts)
- **Vercel**: Free tier or ~$20/month (Pro plan)
- **Vercel Blob Storage**: ~$5-10 (video storage)
- **PostgreSQL**: Free (Vercel) or ~$5-20 (external)

**Total**: ~$100-180/month

## Security Best Practices

1. **Never commit `.env` file** - Added to `.gitignore`
2. **Rotate API keys regularly** - Especially platform tokens
3. **Use strong encryption key** - 32 characters minimum
4. **Enable 2FA** - On all platform accounts
5. **Monitor access logs** - Check for suspicious activity
6. **Keep dependencies updated** - Run `npm audit` regularly

## Contributing

This is a production-ready system. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use for commercial projects

## Support

For issues and questions:
1. Check this README
2. Review API documentation
3. Check Vercel logs
4. Open an issue on GitHub

## Roadmap

- [ ] Add Pinterest and LinkedIn support
- [ ] Implement A/B testing for prompts
- [ ] Add automated comment replies
- [ ] Revenue tracking per platform
- [ ] Content recycling system
- [ ] Advanced analytics dashboard
- [ ] Mobile app
- [ ] Multi-account support per platform

---

Built with ❤️ using Next.js 14, Kling AI, and OpenAI
