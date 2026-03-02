'use client'

import React from 'react'
import Link from 'next/link'
import { FaArrowLeft, FaGavel } from 'react-icons/fa'

export default function TermsPage() {
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
              <FaGavel className="text-green-600" size={32} />
              <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
            </div>
            <p className="text-gray-600">Last updated: March 2026</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using the GiveHope platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use License</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Permission is granted to temporarily download one copy of the materials (information or software) on GiveHope for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Under this license you may not:
              </p>
              <ul className="space-y-2 list-disc list-inside text-gray-700 mt-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software</li>
                <li>Remove any copyright or proprietary notations</li>
                <li>Transfer the materials to another person or server on the Internet</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Donation Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                When you make a donation through our platform:
              </p>
              <ul className="space-y-2 list-disc list-inside text-gray-700 mt-4">
                <li>Your transaction is permanent and recorded on the blockchain</li>
                <li>All donations are final and non-refundable</li>
                <li>You have responsibility to ensure sufficient balance before transaction</li>
                <li>Transaction fees are your responsibility</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Responsibilities</h2>
              <p className="text-gray-700 leading-relaxed">
                You are responsible for:
              </p>
              <ul className="space-y-2 list-disc list-inside text-gray-700 mt-4">
                <li>Maintaining the security of your wallet and private keys</li>
                <li>All activity that occurs under your wallet address</li>
                <li>Verifying NGO information before donating</li>
                <li>Understanding blockchain technology and associated risks</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Disclaimer of Warranties</h2>
              <p className="text-gray-700 leading-relaxed">
                The materials on GiveHope are provided with no warranties, express or implied. GiveHope disclaims all warranties including but not limited to warranties of fitness for a particular purpose.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                In no event shall GiveHope or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on GiveHope.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction where GiveHope is based, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us through our official support channels.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}