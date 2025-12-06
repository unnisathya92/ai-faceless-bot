export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>

        <p className="text-sm text-gray-600 mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
          <p className="text-gray-700 mb-4">
            We collect information that you provide directly to us:
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li><strong>Account Information:</strong> Username, password, and email address</li>
            <li><strong>Platform Credentials:</strong> API keys, access tokens, and OAuth credentials for connected social media accounts</li>
            <li><strong>Content Data:</strong> Video metadata, captions, hashtags, and posting schedules</li>
            <li><strong>Usage Information:</strong> Analytics data, generation history, and platform performance metrics</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">We use the information we collect to:</p>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>Provide, maintain, and improve our Service</li>
            <li>Generate AI-powered video content based on your preferences</li>
            <li>Post content to your connected social media accounts</li>
            <li>Send notifications about video generation and posting status</li>
            <li>Monitor and analyze usage patterns to improve functionality</li>
            <li>Detect and prevent fraud or abuse</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Data Storage and Security</h2>
          <p className="text-gray-700 mb-4">
            We take data security seriously:
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li><strong>Encryption:</strong> All platform credentials are encrypted using AES-256 encryption before storage</li>
            <li><strong>Database Security:</strong> Your data is stored in secure PostgreSQL databases with access controls</li>
            <li><strong>File Storage:</strong> Generated videos are stored on Vercel Blob storage with secure access</li>
            <li><strong>Password Protection:</strong> User passwords are hashed using industry-standard algorithms</li>
            <li><strong>HTTPS:</strong> All data transmission is encrypted using SSL/TLS</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Third-Party Services</h2>
          <p className="text-gray-700 mb-4">
            Our Service integrates with the following third-party services:
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li><strong>OpenAI:</strong> For AI-powered content generation and topic research</li>
            <li><strong>Kling AI:</strong> For video generation from text prompts</li>
            <li><strong>Social Media Platforms:</strong> TikTok, Instagram, YouTube, Twitter, Facebook, Snapchat for content posting</li>
            <li><strong>Telegram:</strong> For sending notifications about service activity</li>
            <li><strong>Vercel:</strong> For hosting, storage, and deployment infrastructure</li>
          </ul>
          <p className="text-gray-700 mt-4">
            These services have their own privacy policies. We share only the minimum data necessary to provide functionality.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Data Sharing and Disclosure</h2>
          <p className="text-gray-700 mb-4">
            We do not sell your personal information. We may share your information only in these circumstances:
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li><strong>With Your Consent:</strong> When you authorize posting to social media platforms</li>
            <li><strong>Service Providers:</strong> With third-party services necessary to operate the Service</li>
            <li><strong>Legal Compliance:</strong> When required by law or to protect our rights</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">6. AI and Content Processing</h2>
          <p className="text-gray-700 mb-4">
            Our AI-powered features process content as follows:
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>Topic research queries are sent to OpenAI's API for trend analysis</li>
            <li>Video prompts are processed by Kling AI to generate video content</li>
            <li>Generated content is temporarily stored for posting to your platforms</li>
            <li>We do not use your data to train third-party AI models</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
          <p className="text-gray-700 mb-4">
            We retain your information for as long as your account is active or as needed to provide services. You can request deletion of your data at any time.
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li><strong>Account Data:</strong> Retained while your account is active</li>
            <li><strong>Generated Videos:</strong> Stored until you delete them or close your account</li>
            <li><strong>Analytics Data:</strong> Aggregated and anonymized data may be retained for service improvement</li>
            <li><strong>Platform Credentials:</strong> Deleted immediately when you disconnect a platform</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Your Rights and Choices</h2>
          <p className="text-gray-700 mb-4">You have the right to:</p>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Correction:</strong> Update or correct your information</li>
            <li><strong>Deletion:</strong> Request deletion of your account and data</li>
            <li><strong>Export:</strong> Download your generated content and analytics</li>
            <li><strong>Opt-Out:</strong> Disable Telegram notifications or disconnect platforms</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Cookies and Tracking</h2>
          <p className="text-gray-700 mb-4">
            We use minimal tracking technologies:
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li><strong>Session Cookies:</strong> To maintain your login session</li>
            <li><strong>Authentication Tokens:</strong> To keep you logged in securely</li>
            <li><strong>No Third-Party Tracking:</strong> We do not use analytics or advertising cookies</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">10. International Data Transfers</h2>
          <p className="text-gray-700 mb-4">
            Your data may be processed and stored in servers located in different countries. We ensure appropriate safeguards are in place for international data transfers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Children's Privacy</h2>
          <p className="text-gray-700 mb-4">
            Our Service is not intended for users under 18 years of age. We do not knowingly collect information from children.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Changes to This Privacy Policy</h2>
          <p className="text-gray-700 mb-4">
            We may update this Privacy Policy from time to time. We will notify you of any changes by updating the "Last updated" date and, for significant changes, through Telegram notifications.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">13. Data Breach Notification</h2>
          <p className="text-gray-700 mb-4">
            In the event of a data breach that affects your personal information, we will notify you via Telegram and email within 72 hours of discovering the breach.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">14. Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have questions or concerns about this Privacy Policy or our data practices, please contact us through:
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>The application dashboard settings</li>
            <li>Telegram notifications (if configured)</li>
          </ul>
        </section>

        <div className="mt-12 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            By using this Service, you acknowledge that you have read and understood this Privacy Policy and agree to the collection and use of your information as described.
          </p>
        </div>
      </div>
    </div>
  )
}
