import { Trash2, UserX, Mail, Phone, Clock, Shield } from 'lucide-react';

export default function UserDataDeletion() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/25">
            <UserX className="text-white" size={32} />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Data Deletion Instructions</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Learn how to request deletion of your personal data from our systems. We respect your right to privacy and data control.
        </p>
        <p className="text-sm text-gray-500">Last updated: April 19, 2026</p>
      </div>

      {/* Important Notice */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield className="text-red-600" size={24} />
          </div>
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-red-900">Important Notice</h2>
            <div className="text-red-800 space-y-2">
              <p>Data deletion is permanent and cannot be undone. Once your data is deleted:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>You will lose access to your account and all associated data</li>
                <li>Historical records may be retained for legal compliance</li>
                <li>Some anonymized data may be kept for analytics purposes</li>
                <li>Backup systems may retain data for up to 30 days</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {/* Section 1 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Mail className="text-blue-600" size={24} />
            </div>
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">How to Request Data Deletion</h2>
              <div className="text-gray-600 space-y-2">
                <p>You can request deletion of your personal data through the following methods:</p>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Method 1: Email Request</h3>
                    <p className="text-sm text-gray-600 mb-2">Send an email to our Data Protection Officer:</p>
                    <div className="bg-white rounded border p-3 font-mono text-sm">
                      privacy@medstore.com
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Include "Data Deletion Request" in the subject line.</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Method 2: In-App Request</h3>
                    <p className="text-sm text-gray-600">If you have access to your account:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-4 text-sm text-gray-600">
                      <li>Go to Settings → Privacy → Delete Account</li>
                      <li>Follow the confirmation prompts</li>
                      <li>Provide a reason for deletion (optional)</li>
                    </ol>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Method 3: Phone Support</h3>
                    <p className="text-sm text-gray-600">Call our support team:</p>
                    <div className="bg-white rounded border p-3 font-mono text-sm">
                      +1 (555) 123-4567
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Available Monday-Friday, 9 AM - 6 PM EST</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock className="text-green-600" size={24} />
            </div>
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">Processing Timeline</h2>
              <div className="text-gray-600 space-y-2">
                <p>We process data deletion requests within the following timeframes:</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-700 font-semibold text-sm">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Request Acknowledgment</p>
                      <p className="text-sm text-gray-600">Within 24 hours of receiving your request</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-700 font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Verification Process</p>
                      <p className="text-sm text-gray-600">1-3 business days to verify your identity</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-700 font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Data Deletion</p>
                      <p className="text-sm text-gray-600">Within 30 days of verification</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-700 font-semibold text-sm">4</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Confirmation</p>
                      <p className="text-sm text-gray-600">Email confirmation once deletion is complete</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">What Data Will Be Deleted</h2>
            <div className="text-gray-600 space-y-2">
              <p>Upon request, we will delete the following types of personal data:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Account Data</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Profile information</li>
                    <li>Login credentials</li>
                    <li>Account preferences</li>
                    <li>Communication history</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Usage Data</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Activity logs</li>
                    <li>Session data</li>
                    <li>User-generated content</li>
                    <li>Interaction records</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Medical Data</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Health records</li>
                    <li>Medication history</li>
                    <li>Appointment data</li>
                    <li>Medical preferences</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Communication Data</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Email communications</li>
                    <li>Chat messages</li>
                    <li>Support tickets</li>
                    <li>Feedback submissions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Trash2 className="text-yellow-600" size={24} />
            </div>
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">Data Retention Exceptions</h2>
              <div className="text-gray-600 space-y-2">
                <p>In certain circumstances, we may retain some data even after deletion request:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Legal Obligations:</strong> Data required by law or regulatory requirements</li>
                  <li><strong>Legal Claims:</strong> Data necessary for defending legal claims or investigations</li>
                  <li><strong>Business Records:</strong> Anonymized data for business analytics and improvement</li>
                  <li><strong>Backup Systems:</strong> Data in backup systems (automatically deleted within 30 days)</li>
                  <li><strong>Financial Records:</strong> Transaction records for tax and accounting purposes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Verification Requirements</h2>
            <div className="text-gray-600 space-y-2">
              <p>To protect your privacy and security, we require verification before processing deletion requests:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Valid email address associated with the account</li>
                <li>Full name and account details</li>
                <li>Two-factor authentication (if enabled)</li>
                <li>Additional verification questions for high-risk accounts</li>
                <li>Phone verification for sensitive medical data</li>
              </ul>
              <p className="mt-3 p-3 bg-blue-50 rounded-lg text-blue-800">
                <strong>Note:</strong> We cannot process deletion requests from third parties without proper legal authorization.
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 border border-primary-200">
          <div className="text-center space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Need Help?</h2>
            <p className="text-gray-600">
              If you have questions about data deletion or need assistance with your request:
            </p>
            <div className="text-primary-700 font-medium space-y-1">
              <p>📧 privacy@medstore.com</p>
              <p>📞 +1 (555) 123-4567</p>
              <p>🕒 Mon-Fri, 9 AM - 6 PM EST</p>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Response time: Within 24 hours for urgent requests
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}