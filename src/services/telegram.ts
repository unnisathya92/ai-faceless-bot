import { Telegraf } from 'telegraf'
import { NotificationType } from '@prisma/client'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHAT_ID = process.env.TELEGRAM_CHAT_ID

class TelegramService {
  private bot: Telegraf | null = null
  private chatId: string

  constructor() {
    if (BOT_TOKEN && CHAT_ID) {
      this.bot = new Telegraf(BOT_TOKEN)
      this.chatId = CHAT_ID
      this.setupCommands()
    } else {
      console.warn('Telegram bot not configured')
    }
  }

  private setupCommands() {
    if (!this.bot) return

    this.bot.command('status', async (ctx) => {
      await ctx.reply('📊 Fetching system status...')
      // Status will be fetched from API
    })

    this.bot.command('stats', async (ctx) => {
      await ctx.reply('📈 Fetching today\'s statistics...')
    })

    this.bot.command('pause', async (ctx) => {
      await ctx.reply('⏸️ Pausing all posting...')
    })

    this.bot.command('resume', async (ctx) => {
      await ctx.reply('▶️ Resuming posting...')
    })

    this.bot.command('balance', async (ctx) => {
      await ctx.reply('💳 Checking API credits...')
    })

    this.bot.command('help', async (ctx) => {
      const helpMessage = `
🤖 *Faceless Video Bot Commands*

/status - Show all platform statuses
/stats - Today's statistics
/pause - Pause all posting
/resume - Resume posting
/balance - Check API credits
/help - Show this help message
      `
      await ctx.reply(helpMessage, { parse_mode: 'Markdown' })
    })
  }

  /**
   * Send a notification message
   */
  async sendNotification(
    type: NotificationType,
    title: string,
    message: string,
    metadata?: any
  ): Promise<boolean> {
    if (!this.bot || !this.chatId) {
      console.log('Telegram notification (not sent):', title, message)
      return false
    }

    try {
      const emoji = this.getEmojiForType(type)
      const formattedMessage = `${emoji} *${title}*\n\n${message}`

      await this.bot.telegram.sendMessage(this.chatId, formattedMessage, {
        parse_mode: 'Markdown',
      })

      return true
    } catch (error: any) {
      console.error('Telegram send error:', error.message)
      return false
    }
  }

  /**
   * Send video generation complete notification
   */
  async notifyVideoGenerated(videoId: string, prompt: string): Promise<void> {
    await this.sendNotification(
      'VIDEO_GENERATED',
      'Video Generated Successfully',
      `New video created!\n\nPrompt: ${prompt.substring(0, 100)}...\nID: ${videoId}`
    )
  }

  /**
   * Send post success notification
   */
  async notifyPostSuccess(platform: string, postUrl: string): Promise<void> {
    await this.sendNotification(
      'POST_SUCCESS',
      'Post Published',
      `Successfully posted to ${platform}\n\n${postUrl}`
    )
  }

  /**
   * Send post failure notification
   */
  async notifyPostFailed(platform: string, error: string): Promise<void> {
    await this.sendNotification(
      'POST_FAILED',
      'Post Failed',
      `Failed to post to ${platform}\n\nError: ${error}`
    )
  }

  /**
   * Send viral alert notification
   */
  async notifyViralAlert(platform: string, views: number, postUrl: string): Promise<void> {
    await this.sendNotification(
      'VIRAL_ALERT',
      '🔥 Video Going Viral!',
      `Your video on ${platform} has ${views.toLocaleString()} views!\n\n${postUrl}`
    )
  }

  /**
   * Send daily summary
   */
  async sendDailySummary(stats: {
    videosGenerated: number
    postsPublished: number
    totalViews: number
    totalEngagement: number
    topPlatform: string
  }): Promise<void> {
    const message = `
📊 *Daily Summary*

Videos Generated: ${stats.videosGenerated}
Posts Published: ${stats.postsPublished}
Total Views: ${stats.totalViews.toLocaleString()}
Engagement Rate: ${stats.totalEngagement.toFixed(2)}%
Top Platform: ${stats.topPlatform}
    `

    await this.sendNotification('DAILY_SUMMARY', 'Daily Summary', message)
  }

  /**
   * Send error alert
   */
  async notifyError(error: string, context?: string): Promise<void> {
    await this.sendNotification(
      'ERROR_ALERT',
      'System Error',
      `${context ? `Context: ${context}\n\n` : ''}Error: ${error}`
    )
  }

  /**
   * Send credit warning
   */
  async notifyCreditWarning(service: string, remaining: number): Promise<void> {
    await this.sendNotification(
      'CREDIT_WARNING',
      'Low Credits Warning',
      `${service} credits running low!\n\nRemaining: ${remaining}`
    )
  }

  /**
   * Start the bot (for webhook or polling)
   */
  async start(): Promise<void> {
    if (!this.bot) return

    try {
      // In production, you might want to use webhooks instead
      // For now, we'll just set up the commands
      await this.bot.telegram.setMyCommands([
        { command: 'status', description: 'Show system status' },
        { command: 'stats', description: 'View statistics' },
        { command: 'pause', description: 'Pause posting' },
        { command: 'resume', description: 'Resume posting' },
        { command: 'balance', description: 'Check credits' },
        { command: 'help', description: 'Show help' },
      ])

      console.log('Telegram bot commands configured')
    } catch (error: any) {
      console.error('Telegram bot setup error:', error.message)
    }
  }

  private getEmojiForType(type: NotificationType): string {
    const emojiMap: Record<NotificationType, string> = {
      VIDEO_GENERATED: '🎬',
      POST_SUCCESS: '✅',
      POST_FAILED: '❌',
      VIRAL_ALERT: '🔥',
      ERROR_ALERT: '⚠️',
      DAILY_SUMMARY: '📊',
      CREDIT_WARNING: '💳',
    }
    return emojiMap[type] || '📢'
  }
}

export const telegramService = new TelegramService()
