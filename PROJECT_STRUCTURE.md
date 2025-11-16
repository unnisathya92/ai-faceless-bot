# Project Structure

This document explains the organization and architecture of the Faceless Video Bot project.

## Directory Structure

```
ai-faceless-bot/
├── prisma/
│   └── schema.prisma          # Database schema with all models
├── src/
│   ├── app/                   # Next.js 14 App Router
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── accounts/      # Account management
│   │   │   ├── videos/        # Video generation
│   │   │   ├── posts/         # Posting to platforms
│   │   │   ├── analytics/     # Analytics data
│   │   │   └── cron/          # Scheduled jobs
│   │   ├── dashboard/         # Dashboard pages
│   │   │   ├── page.tsx       # Main dashboard
│   │   │   ├── config/        # Configuration page
│   │   │   ├── analytics/     # Analytics page
│   │   │   └── library/       # Content library
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home (redirects to dashboard)
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── ui/                # Shadcn/ui components
│   │   └── theme-provider.tsx # Theme context
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client
│   │   ├── encryption.ts      # Encryption utilities
│   │   ├── jwt.ts             # JWT utilities
│   │   └── utils.ts           # Utility functions
│   ├── services/
│   │   ├── kling-ai.ts        # Kling AI integration
│   │   ├── openai.ts          # OpenAI integration
│   │   ├── telegram.ts        # Telegram bot
│   │   └── platforms/         # Platform integrations
│   │       ├── twitter.ts     # Twitter/X
│   │       ├── instagram.ts   # Instagram
│   │       ├── tiktok.ts      # TikTok
│   │       ├── youtube.ts     # YouTube
│   │       ├── facebook.ts    # Facebook
│   │       ├── snapchat.ts    # Snapchat
│   │       └── index.ts       # Platform service factory
│   └── types/
│       └── index.ts           # TypeScript type definitions
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── README.md                  # Main documentation
├── SETUP_GUIDE.md            # Detailed setup instructions
├── DEPLOYMENT.md             # Deployment guide
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── next.config.js            # Next.js configuration
└── vercel.json               # Vercel deployment config
```

## Key Components

### Database Layer (Prisma)

**Location**: `prisma/schema.prisma`

**Models**:
- `User` - Admin authentication
- `Account` - Platform account configurations
- `Video` - Generated video records
- `Post` - Social media posts
- `Analytics` - Performance metrics
- `TrendingTopic` - Trending topic research
- `SystemConfig` - System settings
- `JobQueue` - Background job queue
- `Notification` - Notification log
- `ApiUsage` - API usage tracking

### API Layer

**Location**: `src/app/api/`

**Key Routes**:
- `/api/auth/login` - Admin login
- `/api/accounts` - CRUD for platform accounts
- `/api/accounts/test` - Test platform connections
- `/api/videos/generate` - Generate new video
- `/api/videos/status` - Check video status
- `/api/posts/create` - Post to platforms
- `/api/analytics` - Fetch analytics
- `/api/cron/generate-and-post` - Automated cron job

### Service Layer

**Location**: `src/services/`

**Services**:
- **Kling AI** (`kling-ai.ts`)
  - Video generation
  - Status checking
  - Video download
  - Credits management

- **OpenAI** (`openai.ts`)
  - Trending topic research
  - Video prompt generation
  - Caption optimization
  - Hashtag generation

- **Telegram** (`telegram.ts`)
  - Notification sending
  - Bot command handling
  - Status updates

- **Platform Services** (`platforms/`)
  - Each platform has its own service
  - Standardized interface for posting
  - Metrics fetching
  - Connection testing

### UI Layer

**Location**: `src/app/dashboard/` and `src/components/`

**Pages**:
- **Dashboard** (`dashboard/page.tsx`)
  - Overview statistics
  - Platform performance
  - Quick actions
  - System status

- **Configuration** (`dashboard/config/page.tsx`)
  - Platform account management
  - Credential configuration
  - Connection testing
  - Toggle platforms on/off

- **Analytics** (`dashboard/analytics/page.tsx`)
  - Performance metrics
  - Platform breakdown
  - Recent posts
  - Time period filtering

- **Library** (`dashboard/library/page.tsx`)
  - Video browsing
  - Download videos
  - Repost functionality

**Components**:
- All UI components use Shadcn/ui
- Fully typed with TypeScript
- Dark/light mode support

## Data Flow

### Video Generation and Posting Flow

```
1. Cron Job Triggers (every 6 hours)
   ↓
2. OpenAI Research Trending Topics
   ↓
3. OpenAI Generate Video Prompt
   ↓
4. Kling AI Generate Video
   ↓
5. Poll Kling AI Status (wait for completion)
   ↓
6. Download Video
   ↓
7. Upload to Vercel Blob
   ↓
8. For Each Active Platform:
   - Get Platform Credentials (decrypt)
   - Create Platform Service
   - Post Video
   - Create Post Record
   - Create Analytics Record
   - Send Telegram Notification
   ↓
9. Update Trending Topic as Used
```

### Manual Video Generation Flow

```
1. User clicks "Generate Video"
   ↓
2. POST /api/videos/generate
   ↓
3. Create Video Record (status: PENDING)
   ↓
4. Call Kling AI
   ↓
5. Update Video Record (status: GENERATING, add jobId)
   ↓
6. Frontend polls /api/videos/status
   ↓
7. When complete:
   - Download video
   - Upload to Vercel Blob
   - Update status: COMPLETED
```

### Posting Flow

```
1. User selects video and platforms
   ↓
2. POST /api/posts/create
   ↓
3. For each platform:
   - Get Account
   - Decrypt Credentials
   - Create Platform Service
   - Download video if needed (Twitter, YouTube)
   - Post to platform
   - Create Post record
   - Update Account stats
   - Send notification
```

## Security Architecture

### Credential Storage

1. **Encryption**: All platform credentials are encrypted using AES-256
2. **Storage**: Encrypted credentials stored in `Account.credentials` field
3. **Decryption**: Only decrypted when needed for API calls
4. **Key Management**: Encryption key stored in environment variables

### Authentication

1. **JWT Tokens**: Used for admin authentication
2. **Password Hashing**: SHA-256 for admin passwords
3. **API Protection**: All routes require authentication
4. **Cron Job Security**: Protected with CRON_SECRET header

## Error Handling

### Retry Logic

- Exponential backoff for API calls
- Configurable max attempts
- Graceful degradation

### Monitoring

- All errors logged to console
- Telegram notifications for critical errors
- Vercel logs for debugging
- Database error tracking

## Extensibility

### Adding New Platforms

1. Create new service in `src/services/platforms/`
2. Implement standard interface:
   ```typescript
   - postVideo()
   - getMetrics()
   - testConnection()
   ```
3. Add to `getPlatformService()` factory
4. Add enum to Prisma schema
5. Update UI configuration page

### Adding New Features

1. **New API Endpoint**:
   - Create route in `src/app/api/`
   - Add types to `src/types/`
   - Update UI components

2. **New Database Model**:
   - Update `prisma/schema.prisma`
   - Run `npm run db:push`
   - Update types

3. **New Scheduled Job**:
   - Create route in `src/app/api/cron/`
   - Add to `vercel.json` crons
   - Protect with CRON_SECRET

## Performance Considerations

### Database

- Indexes on frequently queried fields
- Connection pooling for serverless
- Efficient queries with Prisma

### API Routes

- Minimal data transfer
- Pagination for large datasets
- Caching where appropriate

### Video Processing

- Async video generation
- Status polling instead of webhooks
- Efficient storage with Vercel Blob

## Environment Variables

### Required

- `DATABASE_URL` - PostgreSQL connection
- `JWT_SECRET` - JWT signing
- `ENCRYPTION_KEY` - Credential encryption
- `OPENAI_API_KEY` - OpenAI access
- `KLING_AI_API_KEY` - Kling AI access

### Optional

- `TELEGRAM_BOT_TOKEN` - Notifications
- `TELEGRAM_CHAT_ID` - Notification target
- `CRON_SECRET` - Cron job security
- Platform-specific credentials (set in UI)

## Development Workflow

### Local Development

```bash
npm run dev          # Start dev server
npm run db:studio    # Open Prisma Studio
npm run db:push      # Push schema changes
```

### Testing

```bash
npm run lint         # Lint code
npm run build        # Test build
```

### Deployment

```bash
vercel               # Deploy to preview
vercel --prod        # Deploy to production
```

## Best Practices

### Code Organization

- One service per file
- Shared utilities in `lib/`
- Types in `types/`
- UI components in `components/`

### Error Handling

- Try-catch blocks for all async operations
- Meaningful error messages
- Error logging
- User-friendly error display

### Security

- Never log credentials
- Encrypt sensitive data
- Validate all inputs
- Use environment variables

### Performance

- Lazy load components
- Optimize images
- Minimize bundle size
- Use server components where possible

---

For more information, see:
- [README.md](./README.md) - Overview and features
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Setup instructions
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
