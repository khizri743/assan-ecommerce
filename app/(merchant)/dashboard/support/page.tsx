"use client";

import { Mail, Phone, HelpCircle } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-500 mt-2">
          We're here to help. Reach out to us anytime.
        </p>
      </div>

      {/* Contact Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Phone Support */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
          <div className="h-12 w-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
            <Phone className="h-6 w-6" />
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">Call Us</h3>

          <p className="text-gray-500 mb-4">
            Available Monday – Saturday, 9AM – 6PM (PKT)
          </p>

          <a
            href="tel:+923001234567"
            className="text-lg font-medium text-green-600 hover:underline"
          >
            +92 300 1234567
          </a>
        </div>

        {/* Email Support */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
          <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
            <Mail className="h-6 w-6" />
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Email Support
          </h3>

          <p className="text-gray-500 mb-4">
            We usually reply within 24 hours.
          </p>

          <a
            href="mailto:support@assan.pk"
            className="text-lg font-medium text-blue-600 hover:underline"
          >
            support@assan.pk
          </a>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="h-6 w-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-6 text-sm text-gray-700">
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              How do I upgrade my subscription?
            </h4>
            <p>
              Go to Dashboard → Settings → Subscription and choose your desired
              plan.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              How can I reset my password?
            </h4>
            <p>
              Click on "Forgot Password" on the login page and follow the
              instructions.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              How long does support take to respond?
            </h4>
            <p>
              Email queries are answered within 24 hours. Phone support is
              available during working hours.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              Do you offer custom plans?
            </h4>
            <p>
              Yes. Please contact us via email to discuss enterprise solutions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
