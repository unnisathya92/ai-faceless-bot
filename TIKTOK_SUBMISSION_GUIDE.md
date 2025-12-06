# TikTok App Submission Guide

This guide will help you submit your Faceless Video Bot app to TikTok for Content Posting API approval.

## Prerequisites

Before submitting to TikTok, ensure:
- ✅ Your app is deployed and live on Vercel
- ✅ Terms of Service page is accessible
- ✅ Privacy Policy page is accessible
- ✅ The app is working with at least one other platform (Twitter/Instagram)
- ✅ You can demonstrate the complete video generation and posting flow

## Your TikTok Credentials

```
Client Key: aw1ulrebd2s2ns43
Client Secret: sZZ1yAlcSJFzpahM2eeFyFKCEGacCmJh
```

## Submission Checklist

### 1. App Icon (Required)

Create a 1024x1024px PNG icon for your app.

**Suggested Tools:**
- [Canva](https://canva.com) - Free design tool
- [Logo Maker](https://logomaker.com)
- Use AI: "Create a simple, professional logo for an AI video content automation tool"

**Icon Requirements:**
- Size: 1024px × 1024px
- Format: PNG, JPEG, or JPG
- Max file size: 5MB
- Should represent video/content creation

### 2. Basic Information

Fill in the TikTok Developer Portal:

**App Name:**
```
Faceless Video Bot
```
(19/50 characters - Simple and clear)

**Category:**
```
Social Media Management
```

**Description:**
```
Automates AI-generated video content creation and publishing to social media platforms for content creators.
```
(108/120 characters)

**Terms of Service URL:**
```
https://your-app.vercel.app/terms
```
(Replace `your-app` with your actual Vercel deployment URL)

**Privacy Policy URL:**
```
https://your-app.vercel.app/privacy
```
(Replace `your-app` with your actual Vercel deployment URL)

**Platforms:**
Select: ☑️ Web

### 3. App Review Information

**Explanation (1000 characters max):**

```
Faceless Video Bot is an AI-powered content automation platform that helps content creators generate and publish video content to multiple social media platforms.

How TikTok Integration Works:

1. User Authentication: Users connect their TikTok account via OAuth 2.0 using your Login Kit. The app requests the following scopes:
   - user.info.basic: To verify account identity
   - video.upload: To upload generated video files
   - video.publish: To post videos to the user's TikTok account

2. Content Generation: The app uses AI (OpenAI for scripts, Kling AI for video generation) to create short-form vertical video content based on trending topics in the user's chosen niche.

3. Content Posting: Using the Content Posting API, the app:
   - Uploads the generated MP4 video file
   - Adds the AI-generated caption and hashtags
   - Posts to the user's TikTok account automatically or on a schedule

4. Analytics Tracking: The app tracks post performance and provides analytics within the dashboard.

The integration allows content creators to maintain consistent posting schedules without manual video creation and uploading.
```

### 4. Demo Video Requirements

You need to record a video showing the complete TikTok integration flow.

**What to Show in the Demo Video:**

1. **Login Flow (30 seconds)**
   - Show your app's login page
   - Click "Connect TikTok Account"
   - Show TikTok OAuth authorization screen
   - Show successful connection

2. **Video Generation (1 minute)**
   - Navigate to dashboard
   - Click "Generate Video" button
   - Show the generation process
   - Display the generated video preview

3. **Posting to TikTok (45 seconds)**
   - Select TikTok as posting platform
   - Review caption and hashtags
   - Click "Post to TikTok"
   - Show success confirmation
   - Open TikTok app/website to verify the post is live

4. **Analytics View (30 seconds)**
   - Show the analytics dashboard
   - Display TikTok post performance metrics

**Recording Tips:**
- Use screen recording software (QuickTime on Mac, OBS, or Loom)
- Show the full browser window with URL visible
- Speak clearly explaining each step OR add text overlays
- Keep video under 3 minutes total
- Format: MP4 or MOV
- Max file size: 50MB
- Show REAL functionality - use TikTok's sandbox if app not yet approved

**Tools for Recording:**
- Mac: QuickTime Player (File → New Screen Recording)
- Windows: Xbox Game Bar (Win + G)
- Cross-platform: [Loom](https://loom.com), [OBS Studio](https://obsproject.com)

### 5. Products and Scopes

**Add these products:**
1. Click "Add products"
2. Select: **Login Kit**
3. Select: **Content Posting API**

**Add these scopes:**
1. Click "Add scopes"
2. Select the following:
   - ✅ `user.info.basic` - Get basic user information
   - ✅ `video.upload` - Upload video files
   - ✅ `video.publish` - Publish videos to user's account

### 6. Before Submitting

Double-check:
- [ ] App is live and accessible at the URL you provided
- [ ] Terms of Service page loads correctly
- [ ] Privacy Policy page loads correctly
- [ ] Demo video clearly shows all steps
- [ ] All required scopes are selected
- [ ] Video is under 50MB and in MP4/MOV format

## Submission Process

1. Fill in all fields on the TikTok Developer Portal
2. Upload your app icon
3. Upload demo video(s)
4. Add Login Kit and Content Posting API products
5. Add the three required scopes
6. Click "Submit for Review"

## After Submission

**Review Timeline:**
- Initial review: 3-7 business days
- If rejected: Address feedback and resubmit
- If approved: You'll receive email confirmation

**What Happens Next:**
1. TikTok reviews your submission
2. They may ask for clarifications or changes
3. Once approved, your app can use the Content Posting API
4. Users will see your app name when authorizing

## Testing While Waiting for Approval

You can test with TikTok's sandbox environment:
1. Use test accounts provided by TikTok
2. Generate sample videos
3. Test the posting flow in sandbox mode
4. Once approved, switch to production

## Common Rejection Reasons

Avoid these mistakes:
- ❌ Demo video doesn't show complete flow
- ❌ Terms/Privacy pages return 404 errors
- ❌ App URL doesn't match demo video
- ❌ Missing or incorrect scopes
- ❌ Poor quality or unclear demo video
- ❌ Not explaining how scopes are used

## URLs You'll Need

Once deployed to Vercel, your URLs will be:

- **App URL:** `https://your-app-name.vercel.app`
- **Terms of Service:** `https://your-app-name.vercel.app/terms`
- **Privacy Policy:** `https://your-app-name.vercel.app/privacy`
- **OAuth Redirect:** `https://your-app-name.vercel.app/auth/tiktok/callback`

(Add the OAuth Redirect URI in TikTok Developer Portal settings)

## Sample App Icon Prompt for AI

If using AI to generate an icon:

```
Create a modern, minimalist app icon for a video automation platform.
1024x1024px. Dark blue and purple gradient background.
White play button symbol combined with sparkles/stars representing AI.
Professional, clean design suitable for a social media tool.
```

## Need Help?

- TikTok Developer Documentation: https://developers.tiktok.com/doc/content-posting-api-get-started
- TikTok Developer Support: https://developers.tiktok.com/support

---

## Quick Reference

**Your TikTok App Settings:**
- Client Key: `aw1ulrebd2s2ns43`
- Client Secret: `sZZ1yAlcSJFzpahM2eeFyFKCEGacCmJh`
- Redirect URI: `https://your-app.vercel.app/auth/tiktok/callback`

**Required Scopes:**
- `user.info.basic`
- `video.upload`
- `video.publish`

**Required Files:**
- App Icon: 1024x1024px PNG
- Demo Video: MP4/MOV, under 50MB, showing complete flow

Good luck with your submission! 🚀
