import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-600/25">
            <Shield className="text-white" size={32} />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
        </p>
        <p className="text-sm text-gray-500">Last updated: April 18, 2026</p>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {/* Section 1 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Eye className="text-blue-600" size={24} />
            </div>
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">Information We Collect</h2>
              <div className="text-gray-600 space-y-2">
                <p>We collect information you provide directly to us, such as when you:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Create an account or use our services</li>
                  <li>Contact us for support</li>
                  <li>Participate in surveys or promotions</li>
                  <li>Use our website or mobile applications</li>
                </ul>
                <p>We also automatically collect certain information when you use our services, including:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Device information and browser type</li>
                  <li>IP address and location data</li>
                  <li>Usage patterns and preferences</li>
                  <li>Cookies and similar technologies</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Lock className="text-green-600" size={24} />
            </div>
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">How We Use Your Information</h2>
              <div className="text-gray-600 space-y-2">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices and support messages</li>
                  <li>Communicate with you about products, services, and promotions</li>
                  <li>Monitor and analyze usage patterns</li>
                  <li>Detect, prevent, and address technical issues</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText className="text-purple-600" size={24} />
            </div>
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">Information Sharing</h2>
              <div className="text-gray-600 space-y-2">
                <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>With service providers who assist us in operating our business</li>
                  <li>To comply with legal obligations or court orders</li>
                  <li>To protect our rights, property, or safety</li>
                  <li>In connection with a business transfer or acquisition</li>
                </ul>
                <p>All third parties are required to maintain the confidentiality of your information.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Data Security</h2>
            <div className="text-gray-600 space-y-2">
              <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication requirements</li>
                <li>Employee training on data protection</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 5 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Your Rights</h2>
            <div className="text-gray-600 space-y-2">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Access the personal information we hold about you</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your personal information</li>
                <li>Object to or restrict certain processing activities</li>
                <li>Data portability (receive your data in a structured format)</li>
                <li>Withdraw consent where applicable</li>
              </ul>
              <p>To exercise these rights, please contact us using the information provided below.</p>
            </div>
          </div>
        </div>

        {/* Section 6 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Cookies and Tracking</h2>
            <div className="text-gray-600 space-y-2">
              <p>We use cookies and similar technologies to enhance your experience on our website. You can control cookie settings through your browser preferences. Please note that disabling certain cookies may affect website functionality.</p>
            </div>
          </div>
        </div>

        {/* Section 7 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Changes to This Policy</h2>
            <div className="text-gray-600 space-y-2">
              <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 border border-primary-200">
          <div className="text-center space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="text-primary-700 font-medium">
              <p>privacy@Healthriver.com</p>
              <p>Healthriver Privacy Team</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}