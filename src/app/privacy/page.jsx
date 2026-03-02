'use client'

import React from 'react'
import Link from 'next/link'
import { FaArrowLeft, FaShieldAlt } from 'react-icons/fa'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <Link href="/" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-8 font-semibold">
              <FaArrowLeft size={16} />
              Back to Home
            </Link>

            <div className="flex items-center gap-3 mb-6">
              <FaShieldAlt className="text-green-600" size={32} />
              <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
            </div>
            <p className="text-gray-600">Last updated: March 2026</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                At GiveHope, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
              <ul className="space-y-3">
                <li className="text-gray-700">
                  <strong>Wallet Information:</strong> Your blockchain wallet address is visible on the platform for transparency purposes.
                </li>
                <li className="text-gray-700">
                  <strong>Transaction Data:</strong> All donations and transactions are recorded on the blockchain and are publicly visible.
                </li>
                <li className="text-gray-700">
                  <strong>Usage Data:</strong> We may collect information about how you interact with our platform.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the collected information to:
              </p>
              <ul className="space-y-2 list-disc list-inside text-gray-700">
                <li>Process your donations and transactions</li>
                <li>Provide transparency reports and impact metrics</li>
                <li>Improve our platform and services</li>
                <li>Comply with legal and regulatory requirements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Blockchain & Public Nature</h2>
              <p className="text-gray-700 leading-relaxed">
                Please note that all transactions on our platform are recorded on the blockchain and are permanently public. This ensures transparency and accountability. Any information you provide through blockchain transactions cannot be modified or deleted.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your information. However, no security system is impenetrable, and we cannot guarantee absolute security of your data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have questions about this Privacy Policy, please contact us through our official channels.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}