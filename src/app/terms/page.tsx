export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>

        <p className="text-sm text-gray-600 mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700 mb-4">
            By accessing and using this Faceless Video Bot application ("Service"), you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
          <p className="text-gray-700 mb-4">
            Our Service provides automated video generation and social media posting capabilities. The Service uses AI to create content and distribute it across various social media platforms including TikTok, Instagram, YouTube, Twitter, Facebook, and Snapchat.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
          <p className="text-gray-700 mb-4">
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to:
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your password and account</li>
            <li>Notify us immediately of any unauthorized use</li>
            <li>Be responsible for all activities under your account</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Content and Platform Integration</h2>
          <p className="text-gray-700 mb-4">
            When you connect your social media accounts to our Service:
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>You grant us permission to post content on your behalf</li>
            <li>You remain responsible for all content posted through the Service</li>
            <li>You must comply with each platform's terms of service and community guidelines</li>
            <li>We store your platform credentials securely using encryption</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Prohibited Uses</h2>
          <p className="text-gray-700 mb-4">You agree not to use the Service to:</p>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>Post illegal, harmful, or offensive content</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe on intellectual property rights</li>
            <li>Engage in spam or malicious activities</li>
            <li>Attempt to gain unauthorized access to the Service</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">6. AI-Generated Content</h2>
          <p className="text-gray-700 mb-4">
            The Service uses artificial intelligence to generate video content. While we strive for quality and accuracy:
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>AI-generated content may contain errors or inaccuracies</li>
            <li>You are responsible for reviewing content before posting</li>
            <li>We do not guarantee the accuracy or appropriateness of AI-generated content</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Third-Party Services</h2>
          <p className="text-gray-700 mb-4">
            Our Service integrates with third-party platforms (TikTok, Instagram, YouTube, etc.). Your use of these platforms is subject to their respective terms of service. We are not responsible for:
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>Changes to third-party APIs or services</li>
            <li>Platform outages or service interruptions</li>
            <li>Platform policy violations or account suspensions</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Intellectual Property</h2>
          <p className="text-gray-700 mb-4">
            Content generated through the Service is owned by you. The Service software, design, and documentation remain our intellectual property.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
          <p className="text-gray-700 mb-4">
            The Service is provided "as is" without warranties of any kind. We shall not be liable for:
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>Indirect, incidental, or consequential damages</li>
            <li>Loss of data, profits, or business opportunities</li>
            <li>Service interruptions or errors</li>
            <li>Actions taken by third-party platforms</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Termination</h2>
          <p className="text-gray-700 mb-4">
            We reserve the right to suspend or terminate your access to the Service at any time for violations of these terms or for any other reason.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Changes to Terms</h2>
          <p className="text-gray-700 mb-4">
            We may modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the modified terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Contact</h2>
          <p className="text-gray-700">
            If you have questions about these Terms of Service, please contact us through the application dashboard or via Telegram notifications.
          </p>
        </section>

        <div className="mt-12 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            By using this Service, you acknowledge that you have read and understood these Terms of Service and agree to be bound by them.
          </p>
        </div>
      </div>
    </div>
  )
}
