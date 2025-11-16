import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { encrypt, decrypt } from '@/lib/encryption'
import { Platform } from '@prisma/client'

// GET all accounts
export async function GET() {
  try {
    const accounts = await prisma.account.findMany({
      orderBy: { createdAt: 'desc' },
    })

    // Decrypt credentials for frontend (be careful with this in production)
    const accountsWithDecrypted = accounts.map(account => ({
      ...account,
      credentials: decrypt(account.credentials),
    }))

    return NextResponse.json(accountsWithDecrypted)
  } catch (error: any) {
    console.error('Get accounts error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch accounts' },
      { status: 500 }
    )
  }
}

// POST create new account
export async function POST(request: NextRequest) {
  try {
    const { platform, username, credentials, settings } = await request.json()

    // Encrypt credentials
    const encryptedCredentials = encrypt(credentials)

    const account = await prisma.account.create({
      data: {
        platform: platform as Platform,
        username,
        credentials: encryptedCredentials,
        settings: settings || {},
        isActive: true,
      },
    })

    return NextResponse.json({
      success: true,
      account: {
        ...account,
        credentials: credentials, // Return unencrypted for immediate use
      },
    })
  } catch (error: any) {
    console.error('Create account error:', error)
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}

// PUT update account
export async function PUT(request: NextRequest) {
  try {
    const { id, username, credentials, settings, isActive } = await request.json()

    const updateData: any = {}

    if (username !== undefined) updateData.username = username
    if (credentials !== undefined) updateData.credentials = encrypt(credentials)
    if (settings !== undefined) updateData.settings = settings
    if (isActive !== undefined) updateData.isActive = isActive

    const account = await prisma.account.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      account: {
        ...account,
        credentials: credentials || decrypt(account.credentials),
      },
    })
  } catch (error: any) {
    console.error('Update account error:', error)
    return NextResponse.json(
      { error: 'Failed to update account' },
      { status: 500 }
    )
  }
}

// DELETE account
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Account ID required' },
        { status: 400 }
      )
    }

    await prisma.account.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete account error:', error)
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    )
  }
}
