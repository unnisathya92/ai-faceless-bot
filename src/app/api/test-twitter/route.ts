import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'
import { telegramService } from '@/services/telegram'

export async function GET(request: NextRequest) {
  try {
    // Get Twitter account
    const account = await prisma.account.findFirst({
      where: {
        platform: 'TWITTER',
        isActive: true,
      },
    })

    if (!account) {
      return NextResponse.json({ error: 'No active Twitter account found' }, { status: 404 })
    }

    // Test message
    const testMessage = `🤖 Test post from Faceless Video Bot!\n\nGenerated at: ${new Date().toLocaleString()}\n\n#AI #Automation #Test`

    // Send Telegram notification
    await telegramService.sendNotification(
      'POST_SUCCESS',
      'Twitter Test Post',
      `Testing Twitter integration...\n\nMessage: ${testMessage}`
    )

    return NextResponse.json({
      success: true,
      message: 'Twitter account found and ready',
      account: {
        platform: account.platform,
        username: account.username,
        status: account.status,
      },
      testMessage,
      note: 'This is a dry-run. To actually post, implement the Twitter posting logic.',
    })
  } catch (error: any) {
    console.error('Twitter test error:', error)
    await telegramService.notifyError(error.message, 'Twitter Test')

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
