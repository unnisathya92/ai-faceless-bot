import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    telegram: {
      configured: !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
      botToken: !!process.env.TELEGRAM_BOT_TOKEN,
      chatId: !!process.env.TELEGRAM_CHAT_ID,
    },
    openai: {
      configured: !!process.env.OPENAI_API_KEY,
    },
    klingAI: {
      configured: !!(process.env.KLING_AI_ACCESS_KEY && process.env.KLING_AI_SECRET_KEY),
    },
    blob: {
      configured: !!process.env.BLOB_READ_WRITE_TOKEN,
    },
    twitter: {
      configured: !!(process.env.TWITTER_API_KEY && process.env.TWITTER_API_SECRET),
    },
  })
}
