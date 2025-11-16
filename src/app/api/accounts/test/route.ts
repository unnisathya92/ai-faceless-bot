import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'
import { getPlatformService } from '@/services/platforms'

export async function POST(request: NextRequest) {
  try {
    const { accountId } = await request.json()

    const account = await prisma.account.findUnique({
      where: { id: accountId },
    })

    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      )
    }

    // Decrypt credentials
    const credentials = decrypt(account.credentials)

    // Test connection
    const platformService = getPlatformService(account.platform, credentials)
    const isValid = await platformService.testConnection()

    // Update account status
    await prisma.account.update({
      where: { id: accountId },
      data: {
        status: isValid ? 'ACTIVE' : 'CREDENTIALS_INVALID',
        errorMessage: isValid ? null : 'Connection test failed',
      },
    })

    return NextResponse.json({
      success: isValid,
      message: isValid ? 'Connection successful' : 'Connection failed',
    })
  } catch (error: any) {
    console.error('Test connection error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
