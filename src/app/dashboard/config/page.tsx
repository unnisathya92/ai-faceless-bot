"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Twitter, Instagram, Music, Youtube, Facebook, Camera, ArrowLeft, Check, X } from 'lucide-react'
import Link from 'next/link'
import { Platform } from '@prisma/client'

interface Account {
  id: string
  platform: Platform
  username?: string
  isActive: boolean
  status: string
  credentials: any
  settings: any
}

const platformIcons: Record<string, any> = {
  TWITTER: Twitter,
  INSTAGRAM: Instagram,
  TIKTOK: Music,
  YOUTUBE: Youtube,
  FACEBOOK: Facebook,
  SNAPCHAT: Camera,
}

const platformColors: Record<string, string> = {
  TWITTER: 'bg-blue-500',
  INSTAGRAM: 'bg-gradient-to-r from-purple-500 to-pink-500',
  TIKTOK: 'bg-black',
  YOUTUBE: 'bg-red-500',
  FACEBOOK: 'bg-blue-600',
  SNAPCHAT: 'bg-yellow-400',
}

export default function ConfigPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [formData, setFormData] = useState<any>({})
  const [testing, setTesting] = useState(false)

  const platforms: Platform[] = [
    'TWITTER',
    'INSTAGRAM',
    'TIKTOK',
    'YOUTUBE',
    'FACEBOOK',
    'SNAPCHAT',
  ]

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/accounts')
      const data = await res.json()
      setAccounts(data)
    } catch (error) {
      console.error('Failed to fetch accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAccountForPlatform = (platform: Platform) => {
    return accounts.find(acc => acc.platform === platform)
  }

  const openAccountDialog = (platform: Platform) => {
    const account = getAccountForPlatform(platform)
    setSelectedPlatform(platform)
    setFormData(account || { platform })
    setShowDialog(true)
  }

  const handleSave = async () => {
    try {
      const account = getAccountForPlatform(selectedPlatform!)
      const url = account ? '/api/accounts' : '/api/accounts'
      const method = account ? 'PUT' : 'POST'

      const credentials: any = {}

      // Platform-specific credential fields
      if (selectedPlatform === 'TWITTER') {
        credentials.bearerToken = formData.bearerToken
      } else if (selectedPlatform === 'INSTAGRAM') {
        credentials.accessToken = formData.accessToken
        credentials.clientId = formData.businessAccountId
      } else if (selectedPlatform === 'TIKTOK') {
        credentials.accessToken = formData.accessToken
      } else if (selectedPlatform === 'YOUTUBE') {
        credentials.accessToken = formData.accessToken
        credentials.refreshToken = formData.refreshToken
        credentials.clientId = formData.clientId
        credentials.clientSecret = formData.clientSecret
      } else if (selectedPlatform === 'FACEBOOK') {
        credentials.accessToken = formData.accessToken
        credentials.clientId = formData.pageId
      } else if (selectedPlatform === 'SNAPCHAT') {
        credentials.accessToken = formData.accessToken
      }

      const payload = {
        id: account?.id,
        platform: selectedPlatform,
        username: formData.username,
        credentials,
        settings: formData.settings || {},
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        await fetchAccounts()
        setShowDialog(false)
        alert('Account saved successfully!')
      } else {
        alert('Failed to save account')
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save account')
    }
  }

  const handleTestConnection = async () => {
    const account = getAccountForPlatform(selectedPlatform!)
    if (!account) {
      alert('Please save the account first')
      return
    }

    setTesting(true)
    try {
      const res = await fetch('/api/accounts/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: account.id }),
      })

      const data = await res.json()
      if (data.success) {
        alert('Connection successful!')
        await fetchAccounts()
      } else {
        alert('Connection failed: ' + data.message)
      }
    } catch (error) {
      alert('Connection test failed')
    } finally {
      setTesting(false)
    }
  }

  const toggleAccount = async (accountId: string, isActive: boolean) => {
    try {
      await fetch('/api/accounts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: accountId, isActive: !isActive }),
      })
      await fetchAccounts()
    } catch (error) {
      console.error('Toggle error:', error)
    }
  }

  const renderCredentialFields = () => {
    if (!selectedPlatform) return null

    switch (selectedPlatform) {
      case 'TWITTER':
        return (
          <>
            <div className="space-y-2">
              <Label>Bearer Token</Label>
              <Input
                value={formData.bearerToken || ''}
                onChange={(e) => setFormData({ ...formData, bearerToken: e.target.value })}
                placeholder="AAAAAAAAAAAAAAAAAAAAAxxxxx..."
              />
              <p className="text-xs text-muted-foreground">
                Get from Twitter Developer Portal → Your App → Keys and tokens
              </p>
            </div>
          </>
        )

      case 'INSTAGRAM':
        return (
          <>
            <div className="space-y-2">
              <Label>Access Token</Label>
              <Input
                value={formData.accessToken || ''}
                onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
                placeholder="EAAxxxxxx..."
              />
            </div>
            <div className="space-y-2">
              <Label>Business Account ID</Label>
              <Input
                value={formData.businessAccountId || ''}
                onChange={(e) => setFormData({ ...formData, businessAccountId: e.target.value })}
                placeholder="17841xxxxxx"
              />
              <p className="text-xs text-muted-foreground">
                Get from Meta Business Suite → Instagram Settings
              </p>
            </div>
          </>
        )

      case 'TIKTOK':
        return (
          <>
            <div className="space-y-2">
              <Label>Access Token</Label>
              <Input
                value={formData.accessToken || ''}
                onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
                placeholder="act.xxxxxx..."
              />
              <p className="text-xs text-muted-foreground">
                Get from TikTok for Developers → Your App
              </p>
            </div>
          </>
        )

      case 'YOUTUBE':
        return (
          <>
            <div className="space-y-2">
              <Label>Client ID</Label>
              <Input
                value={formData.clientId || ''}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                placeholder="xxxx-xxxx.apps.googleusercontent.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Client Secret</Label>
              <Input
                value={formData.clientSecret || ''}
                onChange={(e) => setFormData({ ...formData, clientSecret: e.target.value })}
                placeholder="GOCSPX-xxxxx"
              />
            </div>
            <div className="space-y-2">
              <Label>Refresh Token</Label>
              <Input
                value={formData.refreshToken || ''}
                onChange={(e) => setFormData({ ...formData, refreshToken: e.target.value })}
                placeholder="1//xxxxx"
              />
              <p className="text-xs text-muted-foreground">
                Get from Google Cloud Console → OAuth 2.0
              </p>
            </div>
          </>
        )

      case 'FACEBOOK':
        return (
          <>
            <div className="space-y-2">
              <Label>Access Token</Label>
              <Input
                value={formData.accessToken || ''}
                onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
                placeholder="EAAxxxxxx..."
              />
            </div>
            <div className="space-y-2">
              <Label>Page ID</Label>
              <Input
                value={formData.pageId || ''}
                onChange={(e) => setFormData({ ...formData, pageId: e.target.value })}
                placeholder="1234567890"
              />
              <p className="text-xs text-muted-foreground">
                Get from Meta Business Suite → Page Settings
              </p>
            </div>
          </>
        )

      case 'SNAPCHAT':
        return (
          <>
            <div className="space-y-2">
              <Label>Access Token</Label>
              <Input
                value={formData.accessToken || ''}
                onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
                placeholder="xxxxx..."
              />
              <p className="text-xs text-muted-foreground">
                Get from Snap Kit Developer Portal
              </p>
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Configuration</h1>
              <p className="text-muted-foreground">Manage platform accounts and settings</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Platform Accounts</CardTitle>
            <CardDescription>
              Configure your social media accounts for automated posting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {platforms.map((platform) => {
                const account = getAccountForPlatform(platform)
                const Icon = platformIcons[platform]
                const color = platformColors[platform]

                return (
                  <Card key={platform} className="overflow-hidden">
                    <div className={`h-2 ${color}`}></div>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5" />
                          <CardTitle className="text-lg">{platform}</CardTitle>
                        </div>
                        {account && (
                          <Switch
                            checked={account.isActive}
                            onCheckedChange={() => toggleAccount(account.id, account.isActive)}
                          />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {account ? (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Status:</span>
                            <Badge
                              variant={account.status === 'ACTIVE' ? 'success' : 'destructive'}
                            >
                              {account.status}
                            </Badge>
                          </div>
                          {account.username && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Username:</span>
                              <span className="text-sm font-medium">@{account.username}</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">Not configured</p>
                      )}
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => openAccountDialog(platform)}
                      >
                        {account ? 'Edit Account' : 'Add Account'}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Account Configuration Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Configure {selectedPlatform} Account
            </DialogTitle>
            <DialogDescription>
              Enter your API credentials and account details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Username (optional)</Label>
              <Input
                value={formData.username || ''}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="your_username"
              />
            </div>

            {renderCredentialFields()}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            {getAccountForPlatform(selectedPlatform!) && (
              <Button variant="outline" onClick={handleTestConnection} disabled={testing}>
                {testing ? 'Testing...' : 'Test Connection'}
              </Button>
            )}
            <Button onClick={handleSave}>
              Save Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
