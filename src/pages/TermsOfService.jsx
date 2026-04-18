import { FileCheck, Users, AlertTriangle, Scale } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-600/25">
            <FileCheck className="text-white" size={32} />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Terms of Service</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Please read these terms carefully before using our services. By using our platform, you agree to be bound by these terms.
        </p>
        <p className="text-sm text-gray-500">Last updated: April 19, 2026</p>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {/* Section 1 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Users className="text-blue-600" size={24} />
            </div>
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">Acceptance of Terms</h2>
              <div className="text-gray-600 space-y-2">
                <p>By accessing and using MedStore's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
                <p>These Terms of Service apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Use License</h2>
            <div className="text-gray-600 space-y-2">
              <p>Permission is granted to temporarily download one copy of the materials on MedStore's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
              <p>This license shall automatically terminate if you violate any of these restrictions and may be terminated by MedStore at any time.</p>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Scale className="text-green-600" size={24} />
            </div>
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">User Responsibilities</h2>
              <div className="text-gray-600 space-y-2">
                <p>As a user of our services, you agree to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Provide accurate and complete information when creating an account</li>
                  <li>Maintain the security of your password and account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                  <li>Use the services only for lawful purposes</li>
                  <li>Not interfere with or disrupt the services or servers</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Service Availability</h2>
            <div className="text-gray-600 space-y-2">
              <p>We strive to provide continuous availability of our services, but we do not guarantee that:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>The services will be available at all times</li>
                <li>The services will be error-free or uninterrupted</li>
                <li>All features will function as expected</li>
                <li>The services will meet your specific requirements</li>
              </ul>
              <p>We reserve the right to modify, suspend, or discontinue the services at any time without notice.</p>
            </div>
          </div>
        </div>

        {/* Section 5 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="text-purple-600" size={24} />
            </div>
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">Limitation of Liability</h2>
              <div className="text-gray-600 space-y-2">
                <p>In no event shall MedStore or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website, even if MedStore or a MedStore authorized representative has been notified orally or in writing of the possibility of such damage.</p>
                <p>Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Intellectual Property</h2>
            <div className="text-gray-600 space-y-2">
              <p>The service and its original content, features, and functionality are and will remain the exclusive property of MedStore and its licensors. The service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.</p>
            </div>
          </div>
        </div>

        {/* Section 7 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Termination</h2>
            <div className="text-gray-600 space-y-2">
              <p>We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.</p>
              <p>If you wish to terminate your account, you may simply discontinue using the service.</p>
            </div>
          </div>
        </div>

        {/* Section 8 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Governing Law</h2>
            <div className="text-gray-600 space-y-2">
              <p>These Terms shall be interpreted and governed by the laws of the jurisdiction in which MedStore operates, without regard to its conflict of law provisions.</p>
              <p>Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.</p>
            </div>
          </div>
        </div>

        {/* Section 9 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Changes to Terms</h2>
            <div className="text-gray-600 space-y-2">
              <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.</p>
              <p>What constitutes a material change will be determined at our sole discretion.</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 border border-primary-200">
          <div className="text-center space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
            <p className="text-gray-600">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="text-primary-700 font-medium">
              <p>legal@medstore.com</p>
              <p>MedStore Legal Team</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}